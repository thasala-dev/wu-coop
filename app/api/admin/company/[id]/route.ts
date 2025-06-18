import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql("SELECT * FROM user_company WHERE id = $1", [id]);

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    } else {
      const calendar = await sql(
        "SELECT * FROM calendar ORDER BY start_date DESC"
      );
      const regist = await sql(
        `SELECT reg.id,reg.calendar_id,cal.name,cal.semester,cal.year,reg.total
        FROM regist_company reg
        INNER JOIN calendar cal ON reg.calendar_id = cal.id
        WHERE reg.company_id = $1
        ORDER BY cal.start_date DESC`,
        [id]
      );

      const intern = await sql(
        `SELECT intern.*
        FROM regist_intern intern
        INNER JOIN calendar cal ON intern.calendar_id = cal.id AND cal.active_id = 1
        WHERE intern.company_id = $1`,
        [id]
      );

      return NextResponse.json({
        success: true,
        message: "ดำเนินการสำเร็จ",
        data: data[0],
        calendar: calendar,
        regist: regist,
        intern: intern,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
