import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { calendarId, formId } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);

    const data = await sql.query(
      `SELECT std.fullname, 
          std.student_id,
             com.name as company_name,
          	 sup.scheduled_date,
             adv.fullname AS advisor_name,
             sup.result
      FROM supervisions sup
      JOIN user_company com ON sup.regist_intern_id = com.id
      JOIN user_advisor adv ON sup.advisor_id = adv.id
      JOIN regist_intern intern on intern.calendar_id = sup.calendar_id 
      	and intern.company_id = com.id
      join user_student std on intern.student_id = std.id
      where sup.calendar_id = $1 and sup.type::int = $2
      ORDER BY sup.scheduled_date ASC`,
      [calendarId, formId]
    );

    // const data = await sql.query(
    //   `select evaluator,evaluation_date,result
    //   from evaluations_result
    //   where form_id = $1
    //   order by evaluation_date desc`,
    //   [formId]
    // );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
