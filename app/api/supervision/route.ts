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
             com.name AS company_name, com.location AS company_location,
             adv.fullname AS advisor_name
      FROM supervisions sup
      JOIN user_company com ON sup.regist_intern_id = com.id
      JOIN user_advisor adv ON sup.advisor_id = adv.id
    `;

    const whereConditions = [];
    const params = [];
    let paramCount = 1;

    // เพิ่มเงื่อนไขการค้นหา
    if (calendarId) {
      whereConditions.push(`sup.calendar_id = $${paramCount++}`);
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

    const data = await sql.query(query, params);


    const visitData = await Promise.all(data.map(async (visit: any) => ({
      ...visit,
      student: await getStudent({ calendarId: visit.calendar_id, companyId: visit.regist_intern_id }),
    })));


    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: visitData,
    });
  } catch (error) {
    console.error("Error fetching supervisions:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

const getStudent = async ({ calendarId, companyId }: any) => {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `SELECT s.id, s.fullname, s.student_id, s.major, s.mobile, s.image
      FROM regist_intern ri
      JOIN user_student s ON ri.student_id = s.id
      WHERE ri.calendar_id = $1 AND ri.company_id = $2`,
      [calendarId, companyId]
    );

    return data;
  } catch (error) {
    console.error("Error in getStudent:", error);
    return [];
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
    // const checkExisting = await sql.query(
    //   `SELECT * FROM supervisions 
    //    WHERE regist_intern_id = $1 AND advisor_id = $2 AND scheduled_date = $3`,
    //   [body.regist_intern_id, body.advisor_id, body.scheduled_date]
    // );

    // if (checkExisting.length > 0) {
    //   return NextResponse.json(
    //     { success: false, message: "มีการนัดนิเทศในวันเดียวกันนี้แล้ว" },
    //     { status: 400 }
    //   );
    // }
    // สร้างข้อมูลการนิเทศใหม่
    const data = await sql.query(
      `INSERT INTO supervisions 
       (regist_intern_id, advisor_id, scheduled_date, start_time, end_time, status, visit_type, comments, type, calendar_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10) 
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
        body.calendar_id || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "บันทึกข้อมูลการนิเทศสำเร็จ",
      // data: data[0],
    });
  } catch (error) {
    console.error("Error creating supervision:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}
