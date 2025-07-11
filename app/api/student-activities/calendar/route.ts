import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    // Get search and filter parameters from URL
    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");
    const sql = neon(`${process.env.DATABASE_URL}`);
    const calendar = await sql(
      `SELECT cal.* 
      FROM calendar cal
      INNER JOIN regist_intern reg ON cal.id = reg.calendar_id and reg.student_id = $1
      order BY cal.start_date DESC`,
      [studentId]
    );
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      calendar: calendar,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
