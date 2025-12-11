import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `SELECT id, title, description, event_date, location, calendar_id, type_id, status_id, created_at
      FROM events ORDER BY event_date DESC`
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
    const data = await sql.query(
      `INSERT INTO events 
      (title, description, event_date, location, calendar_id, type_id, status_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        body.title,
        body.description,
        body.eventDate,
        body.location,
        body.calendarId,
        body.typeId || 1,
        body.statusId || 1,
      ]
    );
    return NextResponse.json({
      success: true,
      message: "เพิ่มกิจกรรมสำเร็จ",
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
