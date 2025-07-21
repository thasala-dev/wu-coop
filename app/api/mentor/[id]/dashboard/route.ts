import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    let calendarId = request.nextUrl.searchParams.get("calendarId");
    const sql = neon(`${process.env.DATABASE_URL}`);
    const calendar = await sql(
      `SELECT cal.* ,reg.total,
      (select count(*) from regist_intern where calendar_id = cal.id and company_id = reg.company_id) as total_intern
      FROM calendar cal
      INNER JOIN regist_company reg ON cal.id = reg.calendar_id and reg.company_id = $1
      order BY cal.start_date DESC`,
      [id]
    );

    if (!calendarId) {
      calendarId =
        calendar.find((cal: any) => cal.active_id === 1)?.id || calendar[0]?.id;
    }
    if (!calendarId) {
      return NextResponse.json({
        success: true,
        message: "ดำเนินการสำเร็จ",
        calendar: [],
        student: [],
      });
    }

    const student = await sql(
      `SELECT * FROM regist_intern where calendar_id = $1 AND company_id = $2`,
      [calendarId, id]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      calendar: calendar,
      student: student,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
