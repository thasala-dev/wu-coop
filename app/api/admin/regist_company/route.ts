import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query("SELECT * FROM regist_company");
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    const check = await sql.query(
      "SELECT * FROM regist_company WHERE calendar_id = $1 AND company_id = $2",
      [body.calendarId, body.companyId]
    );
    if (check.length > 0) {
      return NextResponse.json(
        { success: false, message: "ข้อมูลนี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    const data = await sql.query(
      `INSERT INTO regist_company 
        (calendar_id,company_id,total)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [body.calendarId, body.companyId, body.total]
    );
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
