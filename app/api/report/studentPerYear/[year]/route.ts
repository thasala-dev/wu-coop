import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { year } = await params;
    if (!year || isNaN(year)) {
      return NextResponse.json(
        { success: false, message: "ปีการศึกษาไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const calendar = await sql(
      `SELECT cal.id,cal.name,cal.start_date,cal.end_date FROM calendar cal WHERE cal.year = $1 order BY cal.start_date ASC`,
      [year]
    );

    const data = await sql(
      `SELECT 
       std.student_id, 
       std.fullname, 
       array_agg(reg.calendar_id) AS calendar_ids,
       array_agg(com.name) AS calendar_names
       FROM user_student std
       INNER JOIN regist_intern reg ON std.id = reg.student_id
       INNER join user_company com ON reg.company_id = com.id
       WHERE std.flag_del = 0
       GROUP BY std.student_id, std.fullname
       ORDER BY std.fullname DESC`
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
      calendar: calendar,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
