import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `SELECT 
        id, 
        name, 
        name_en, 
        color, 
        created_at
      FROM activity_categories
      ORDER BY id ASC`
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
