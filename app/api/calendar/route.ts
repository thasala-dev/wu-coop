import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `SELECT id,name,semester,year,start_date,end_date,status_id,active_id,
      (select count(*) from regist_company where calendar_id = calendar.id) as total_regist,
      (select count(*) from regist_intern where calendar_id = calendar.id) as total_intern
      FROM calendar 
      order BY start_date DESC`
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `INSERT INTO calendar 
      (name, semester, year, start_date, end_date, status_id) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        body.name,
        body.semester,
        body.year,
        body.startDate,
        body.endDate,
        body.statusId || 0,
      ]
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
