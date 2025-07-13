import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT std.id, std.fullname, std.student_id, std.major, std.std_year, std.image,
       cal.id AS calendar_id, cal.name AS calendar_name, cal.start_date, cal.end_date, cal.semester, cal.year,
       com.name AS company_name, com.location AS company_location,
       com.contact_name, com.contact_email, com.contact_phone
       FROM user_student std
       LEFT JOIN (
          SELECT DISTINCT ON (student_id) *
          FROM regist_intern
          LEFT JOIN calendar ON regist_intern.calendar_id = calendar.id
          ORDER BY student_id, calendar.start_date DESC
       ) reg ON std.id = reg.student_id
       LEFT JOIN user_company com ON reg.company_id = com.id
       LEFT JOIN calendar cal ON reg.calendar_id = cal.id
       WHERE std.advisor_id = $1`,
      [id]
    );

    console.log("Student found:", data[0]);
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
    });
  } catch (error) {
    console.error("Error in GET /api/student/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
