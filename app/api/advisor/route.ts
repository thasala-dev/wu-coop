import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT * FROM user_advisor where flag_del = 0 ORDER BY id DESC`
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
    const check = await sql("SELECT * FROM user_advisor WHERE username = $1", [
      body.username,
    ]);
    if (check.length > 0) {
      return NextResponse.json(
        { success: false, message: "Username นี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    const data = await sql(
      `INSERT INTO user_advisor 
      (username, password_hash, fullname, email, mobile, image) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [body.username, body.password, body.fullname, body.email || null, body.mobile || null, body.image || null]
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
