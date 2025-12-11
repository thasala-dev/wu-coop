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
          er.evaluator, 
          er.evaluation_date, 
          er.result,
          comp.name as company_name,
          type.name as evaluation_name
      from regist_intern intern
      inner join user_student std 
          on intern.student_id = std.id
      inner join user_company comp 
          on intern.company_id = comp.id
      inner join evaluations_type type 
          on type.id = ANY(intern.evaluation_type)
      inner join evaluations_form form 
          on form.id = ANY(type.form)
          and form.id = $2
      left join evaluations_result er 
          on intern.id = er.intern_id 
        and er.form_id = $2
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
