import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT std.*, advisor.fullname AS advisor_name, advisor.email AS advisor_email, advisor.mobile AS advisor_mobile
       FROM user_student std
       LEFT JOIN user_advisor advisor ON std.advisor_id = advisor.id
       WHERE std.id = $1`,
      [id]
    );

    const intern = await sql(
      `SELECT reg.position, reg.job_description, 
      cal.name AS calendar_name, cal.start_date, cal.end_date, cal.year, cal.semester,
      com.name AS company_name, com.location AS company_location,
      com.contact_name, com.contact_email, com.contact_phone
      FROM regist_intern reg
      inner join calendar cal on reg.calendar_id = cal.id
      inner join user_company com on reg.company_id = com.id
      WHERE reg.student_id = $1
      ORDER BY cal.start_date DESC`,
      [id]
    );

    const supervision = await sql(
      `SELECT sup.scheduled_date, sup.start_time,sup.end_time, sup.status, sup.visit_type,
      advisor.fullname AS advisor_name, advisor.email AS advisor_email, advisor.mobile AS advisor_mobile
      FROM supervisions sup
      inner join regist_intern reg on sup.regist_intern_id = reg.id
      inner join user_advisor advisor on sup.advisor_id = advisor.id
      WHERE reg.student_id = $1
      ORDER BY sup.scheduled_date DESC`,
      [id]
    );

    if (data.length === 0) {
      console.log("No student found for ID:", id);
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลผู้ใช้งาน" },
        { status: 404 }
      );
    } else {
      console.log("Student found:", data[0]);
      return NextResponse.json({
        success: true,
        message: "ดำเนินการสำเร็จ",
        data: data[0],
        intern: intern,
        supervision: supervision,
      });
    }
  } catch (error) {
    console.error("Error in GET /api/student/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
