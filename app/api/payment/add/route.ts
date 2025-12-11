import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const companies = await sql.query(
      `SELECT id,name,location from user_company where flag_del = 0`
    );
    const calendars = await sql.query(
      `SELECT id,name,year,semester from calendar order by start_date DESC`
    );
    return NextResponse.json(
      {
        success: true,
        companies,
        calendars,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน",
      },
      { status: 500 }
    );
  }
}
