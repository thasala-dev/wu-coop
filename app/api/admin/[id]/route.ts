import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql("SELECT * FROM user_admin WHERE id = $1", [id]);

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    } else {
      return NextResponse.json({
        success: true,
        message: "ดำเนินการสำเร็จ",
        data: data[0],
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `UPDATE user_admin SET
      fullname = $2,
      image = $3,
      username = $4
      WHERE id = $1
      RETURNING *`,
      [id, body.fullname, body.image || null, body.username || null]
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
