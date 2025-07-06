import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    let calendarId = request.nextUrl.searchParams.get("calendarId");
    const sql = neon(`${process.env.DATABASE_URL}`);
    const calendar = await sql(
      `SELECT cal.* 
      FROM calendar cal
      INNER JOIN regist_intern reg ON cal.id = reg.calendar_id and reg.student_id = $1
      order BY cal.start_date DESC`,
      [id]
    );

    if (!calendarId) {
      calendarId =
        calendar.find((cal: any) => cal.active_id === 1)?.id || calendar[0]?.id;
    }

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      calendar: calendar,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
