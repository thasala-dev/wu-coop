import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql("SELECT * FROM user_student");
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

    const check = await sql("SELECT * FROM user_student WHERE username = $1", [
      body.username,
    ]);
    if (check.length > 0) {
      return NextResponse.json(
        { success: false, message: "รหัสนักศึกษานี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    const data = await sql(
      "INSERT INTO user_student (username, password_hash, fullname, student_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [body.username, body.password, body.fullname, body.studentId]
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
