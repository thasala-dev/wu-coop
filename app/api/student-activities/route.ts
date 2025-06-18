import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    // Get search and filter parameters from URL
    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");

    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Build the query with filters
    let query = `
      SELECT 
        sa.id, 
        sa.student_id, 
        sa.title, 
        sa.activity_date, 
        sa.description, 
        sa.learning, 
        sa.problems, 
        sa.solutions, 
        sa.tags, 
        sa.created_at, 
        sa.updated_at,
        ac.id as category_id, 
        ac.name as category_name, 
        ac.name_en as category_name_en,
        ac.color as category_color
      FROM student_activities sa
      JOIN activity_categories ac ON sa.category_id = ac.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCounter = 1;

    if (studentId) {
      query += ` AND sa.student_id = $${paramCounter}`;
      params.push(studentId);
      paramCounter++;
    }

    if (category) {
      query += ` AND ac.name_en = $${paramCounter}`;
      params.push(category);
      paramCounter++;
    }

    if (search) {
      query += ` AND (
        sa.title ILIKE $${paramCounter}
        OR sa.description ILIKE $${paramCounter}
        OR sa.tags ILIKE $${paramCounter}
      )`;
      params.push(`%${search}%`);
      paramCounter++;
    }

    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM sa.activity_date) = $${paramCounter} 
                 AND EXTRACT(YEAR FROM sa.activity_date) = $${paramCounter+1}`;
      params.push(parseInt(month), parseInt(year));
      paramCounter += 2;
    }

    // Add order by date, newest first
    query += ` ORDER BY sa.activity_date DESC, sa.created_at DESC`;

    const data = await sql(query, params);
    
    // Format data for response
    const formattedData = data.map((item: any) => ({
      id: item.id,
      studentId: item.student_id,
      title: item.title,
      activityDate: item.activity_date,
      category: {
        id: item.category_id,
        name: item.category_name,
        nameEn: item.category_name_en,
        color: item.category_color
      },
      description: item.description,
      learning: item.learning,
      problems: item.problems,
      solutions: item.solutions,
      tags: item.tags ? item.tags.split(',').map((tag: string) => tag.trim()) : [],
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Validate required fields
    if (!body.studentId || !body.title || !body.activityDate || !body.categoryId || !body.description) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }
    
    // Prepare tags if provided
    const tags = body.tags && Array.isArray(body.tags) 
      ? body.tags.join(',') 
      : (typeof body.tags === 'string' ? body.tags : '');
    
    // Insert activity
    const data = await sql(
      `INSERT INTO student_activities 
       (student_id, title, activity_date, category_id, description, learning, problems, solutions, tags) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        body.studentId,
        body.title,
        body.activityDate,
        body.categoryId,
        body.description,
        body.learning || null,
        body.problems || null,
        body.solutions || null,
        tags || null
      ]
    );
    
    return NextResponse.json({
      success: true,
      message: "บันทึกกิจกรรมสำเร็จ",
      data: { id: data[0].id },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
