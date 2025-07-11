import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const student = await sql(
      `SELECT count(*) from user_student WHERE flag_del = 0`
    );
    const company = await sql(
      `SELECT count(*) from user_company WHERE flag_del = 0`
    );
    const advisor = await sql(
      `SELECT count(*) from user_advisor WHERE flag_del = 0`
    );
    const admin = await sql(
      `SELECT count(*) from user_admin WHERE flag_del = 0`
    );
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      student: student[0].count,
      company: company[0].count,
      advisor: advisor[0].count,
      admin: admin[0].count,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
