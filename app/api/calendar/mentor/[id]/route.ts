import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);

    const supervision = await sql(
      `SELECT supervisions.scheduled_date,supervisions.start_time,supervisions.end_time,
      student.fullname AS student_name,
      advisor.fullname AS advisor_name,
      company.name AS company_name,
      calendar.name AS calendar_name, 
      calendar.start_date, 
      calendar.end_date,
      calendar.year,
      calendar.semester
      FROM supervisions
      JOIN regist_intern ON regist_intern.id = supervisions.regist_intern_id
      JOIN user_student student ON regist_intern.student_id = student.id
      JOIN user_advisor advisor ON supervisions.advisor_id = advisor.id
      JOIN user_company company ON regist_intern.company_id = company.id
      JOIN calendar ON regist_intern.calendar_id = calendar.id
      WHERE regist_intern.company_id = $1`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      event: [],
      supervision: supervision,
    });
  } catch (error) {
    console.error("Error fetching student calendar data:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด", error: String(error) },
      { status: 500 }
    );
  }
}
