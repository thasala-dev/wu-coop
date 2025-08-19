import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let calendarId = searchParams.get("calendarId");
    let advisorId = searchParams.get("advisorId");

    const sql = neon(`${process.env.DATABASE_URL}`);

    // สร้าง query พื้นฐาน
    let query = `
      SELECT sup.*, 
             ri.student_id, ri.calendar_id, ri.company_id,
             std.fullname AS student_name, std.student_id AS student_code,std.image AS student_image,
             adv.fullname AS advisor_name,

             com.name AS company_name
      FROM supervisions sup
      JOIN regist_intern ri ON sup.regist_intern_id = ri.id
      JOIN user_student std ON ri.student_id = std.id
      JOIN user_advisor adv ON sup.advisor_id = adv.id
      LEFT JOIN user_company com ON ri.company_id = com.id
    `;

    const whereConditions = [];
    const params = [];
    let paramCount = 1;

    // เพิ่มเงื่อนไขการค้นหา
    if (calendarId) {
      whereConditions.push(`ri.calendar_id = $${paramCount++}`);
      params.push(calendarId);
    }

    if (advisorId) {
      whereConditions.push(`sup.advisor_id = $${paramCount++}`);
      params.push(advisorId);
    }

    // เพิ่มเงื่อนไขการค้นหา (ถ้ามี)
    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    // เรียงลำดับตามวันที่นิเทศ
    query += " ORDER BY sup.scheduled_date ASC";

    const data = await sql(query, params);

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching supervisions:", error);
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

    // ตรวจสอบว่ามีข้อมูลจำเป็นครบหรือไม่
    if (!body.regist_intern_id || !body.advisor_id || !body.scheduled_date) {
      return NextResponse.json(
        {
          success: false,
          message:
            "กรุณาระบุข้อมูลให้ครบถ้วน (regist_intern_id, advisor_id, scheduled_date)",
        },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามีการนิเทศซ้ำในวันเดียวกันหรือไม่
    const checkExisting = await sql(
      `SELECT * FROM supervisions 
       WHERE regist_intern_id = $1 AND advisor_id = $2 AND scheduled_date = $3`,
      [body.regist_intern_id, body.advisor_id, body.scheduled_date]
    );

    if (checkExisting.length > 0) {
      return NextResponse.json(
        { success: false, message: "มีการนัดนิเทศในวันเดียวกันนี้แล้ว" },
        { status: 400 }
      );
    }
    // สร้างข้อมูลการนิเทศใหม่
    const data = await sql(
      `INSERT INTO supervisions 
       (regist_intern_id, advisor_id, scheduled_date, start_time, end_time, status, visit_type, comments, type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        body.regist_intern_id,
        body.advisor_id,
        body.scheduled_date,
        body.start_time || null,
        body.end_time || null,
        body.status || 0,
        body.visit_type || null,
        body.comments || null,
        body.type || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "บันทึกข้อมูลการนิเทศสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error creating supervision:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}
