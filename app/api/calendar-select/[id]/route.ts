import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);

    const reset = await sql.query(
      "UPDATE calendar SET active_id = 0 WHERE id <> $1 RETURNING *",
      [id]
    );

    const data = await sql.query(
      "UPDATE calendar SET active_id = 1 WHERE id = $1 RETURNING *",
      [id]
    );
    return NextResponse.json({
      success: true,
      message: "บันทึกสำเร็จ",
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
