import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);

    const supervision = await sql(
      `SELECT sup.scheduled_date,sup.start_time,sup.end_time,
      advisor.fullname AS advisor_name,
      advisor.mobile AS advisor_mobile,
      com.name AS company_name,
      calendar.name AS calendar_name, 
      calendar.start_date, 
      calendar.end_date,
      calendar.year,
      calendar.semester
      FROM supervisions sup
      JOIN user_company com ON sup.regist_intern_id = com.id
      JOIN calendar ON sup.calendar_id = calendar.id
      JOIN user_advisor advisor ON sup.advisor_id = advisor.id
      WHERE sup.regist_intern_id = $1`,
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
