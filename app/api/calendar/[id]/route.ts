import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query("SELECT * FROM calendar WHERE id = $1", [id]);

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    } else {
      data[0].start_date = data[0].start_date.toISOString().split("T")[0];
      data[0].end_date = data[0].end_date.toISOString().split("T")[0];
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
    const data = await sql.query(
      "UPDATE calendar SET name = $2, semester = $3, year = $4, start_date = $5, end_date = $6, status_id = $7 WHERE id = $1 RETURNING *",
      [
        id,
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
