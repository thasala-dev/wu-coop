import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { calendarId, formId } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);

    const data = await sql.query(
      `select 
          std.fullname, 
          std.student_id,
          comp.name as company_name,
          sup.scheduled_date,
          adv.fullname as advisor_name,
          sup.result
      from regist_intern intern
      inner join user_student std 
          on intern.student_id = std.id
      inner join user_company comp 
          on intern.company_id = comp.id
      inner join supervisions sup
          on sup.regist_intern_id = intern.id
          and sup.type = $2
      inner join user_advisor adv
          on adv.id = sup.advisor_id
      where intern.calendar_id = $1
      order by std.student_id ASC`,
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
