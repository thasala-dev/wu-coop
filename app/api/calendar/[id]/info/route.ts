import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const intern = await sql(
      `SELECT  intern.id, intern.company_id, student.student_id, student.fullname,student.major, student.gpa, company.name as company_name, intern.register_date
      FROM regist_intern intern
      INNER JOIN user_student student ON intern.student_id = student.id
      LEFT JOIN user_company company ON intern.company_id = company.id
      WHERE intern.calendar_id = $1`,
      [id]
    );

    const company = await sql(
      `SELECT reg.id, reg.company_id, com.name, reg.total
      FROM regist_company reg
      INNER JOIN user_company com ON reg.company_id = com.id
      WHERE reg.calendar_id = $1`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      intern: intern,
      company: company,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
