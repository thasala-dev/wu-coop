import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { use } from "react";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Get activity with category information
    const activityData = await sql.query(
      `SELECT 
        sa.id, 
        sa.student_id, 
        sa.calendar_id,
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
      WHERE sa.id = $1`,
      [id]
    );

    if (!activityData || activityData.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลกิจกรรม" },
        { status: 404 }
      );
    }

    // Get files for this activity
    const filesData = await sql.query(
      `SELECT id, filename, original_filename, file_size, file_type, created_at
       FROM activity_files
       WHERE activity_id = $1
       ORDER BY created_at`,
      [id]
    );

    // Format the response
    const activity = activityData[0];
    const formattedData = {
      id: activity.id,
      studentId: activity.student_id,
      calendarId: activity.calendar_id,
      title: activity.title,
      activityDate: activity.activity_date,
      category: {
        id: activity.category_id,
        name: activity.category_name,
        nameEn: activity.category_name_en,
        color: activity.category_color,
      },
      description: activity.description,
      learning: activity.learning,
      problems: activity.problems,
      solutions: activity.solutions,
      tags: activity.tags
        ? activity.tags.split(",").map((tag: string) => tag.trim())
        : [],
      files: filesData.map((file: any) => ({
        id: file.id,
        filename: file.filename,
        originalFilename: file.original_filename,
        fileSize: file.file_size,
        fileType: file.file_type,
        createdAt: file.created_at,
      })),
      createdAt: activity.created_at,
      updatedAt: activity.updated_at,
    };

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Validate required fields
    if (
      !body.title ||
      !body.activityDate ||
      !body.categoryId ||
      !body.description
    ) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Prepare tags if provided
    const tags =
      body.tags && Array.isArray(body.tags)
        ? body.tags.join(",")
        : typeof body.tags === "string"
          ? body.tags
          : "";

    // Update activity
    const updateResult = await sql.query(
      `UPDATE student_activities SET 
        title = $1, 
        activity_date = $2, 
        category_id = $3, 
        description = $4, 
        learning = $5, 
        problems = $6, 
        solutions = $7, 
        tags = $8,
        updated_at = CURRENT_TIMESTAMP,
        calendar_id = $9
      WHERE id = $10
      RETURNING id`,
      [
        body.title,
        body.activityDate,
        body.categoryId,
        body.description,
        body.learning || null,
        body.problems || null,
        body.solutions || null,
        tags || null,
        body.calendarId || null,
        id,
      ]
    );

    if (!updateResult || updateResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลกิจกรรมที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "แก้ไขกิจกรรมสำเร็จ",
      data: { id },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);

    // First, delete any associated files
    await sql.query(`DELETE FROM activity_files WHERE activity_id = $1`, [id]);

    // Then delete the activity
    const deleteResult = await sql.query(
      `DELETE FROM student_activities WHERE id = $1 RETURNING id`,
      [id]
    );

    if (!deleteResult || deleteResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลกิจกรรมที่ต้องการลบ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ลบกิจกรรมสำเร็จ",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
