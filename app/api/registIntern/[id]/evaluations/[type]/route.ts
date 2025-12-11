import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const calendar = await sql.query(`SELECT * FROM regist_intern  WHERE id = $1`, [
      id,
    ]);

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      calendar: calendar,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
