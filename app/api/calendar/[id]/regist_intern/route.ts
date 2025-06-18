import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { params } = await Promise.resolve(context);
    const id = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
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
