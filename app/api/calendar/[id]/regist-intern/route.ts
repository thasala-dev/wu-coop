import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body && body.student_ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่มีข้อมูลที่ต้องการบันทึก" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    for (const studentId of body.student_ids) {
      await sql.query(
        `INSERT INTO regist_intern (calendar_id,student_id) VALUES ($1, $2) RETURNING *`,
        [id, studentId]
      );
    }

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      "SELECT * FROM regist_intern WHERE calendar_id = $1",
      [id]
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
