import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(`SELECT * FROM evaluations_type WHERE id = $1`, [
      id,
    ]);

    const form = await sql(
      `SELECT * FROM evaluations_form ORDER BY "group" ASC,"type" ASC`
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data[0] || {},
      form: form || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
