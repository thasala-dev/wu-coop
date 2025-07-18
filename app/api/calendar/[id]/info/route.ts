import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const intern = await sql(
      `SELECT intern.id, intern.company_id, student.student_id, student.fullname, student.major, student.gpa, company.name as company_name, intern.register_date, company.evaluation_type,
      et.name as evaluation_name,
      (SELECT count(*) FROM evaluations_result WHERE intern_id = intern.id) as total
      FROM regist_intern intern
      INNER JOIN user_student student ON intern.student_id = student.id
      LEFT JOIN user_company company ON intern.company_id = company.id
      LEFT JOIN LATERAL (
      SELECT string_agg(et.name, ', ') as name
      FROM evaluations_type et
      WHERE et.id = ANY(intern.evaluation_type)
      ) et ON true
      WHERE intern.calendar_id = $1`,
      [id]
    );

    const company = await sql(
      `SELECT reg.id, reg.company_id, com.name, reg.total, com.evaluation_type
      FROM regist_company reg
      INNER JOIN user_company com ON reg.company_id = com.id
      WHERE reg.calendar_id = $1 and com.flag_del = 0`,
      [id]
    ); // Get students not already in the regist_intern table for this calendar
    const student = await sql(
      `SELECT us.* 
       FROM user_student us
       LEFT JOIN regist_intern ri ON us.id = ri.student_id AND ri.calendar_id = $1
       WHERE ri.id IS NULL and us.flag_del = 0`,
      [id]
    );

    // Get companies not already in the regist_company table for this calendar
    const companyList = await sql(
      `SELECT uc.* 
       FROM user_company uc
       LEFT JOIN regist_company rc ON uc.id = rc.company_id AND rc.calendar_id = $1
       WHERE rc.id IS NULL and uc.flag_del = 0`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      intern: intern,
      company: company,
      student: student,
      companyList: companyList,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
