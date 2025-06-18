import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const getCurrentCalendar = async () => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const data = await sql(
    `SELECT id,name,semester,year,start_date,end_date,status_id,active_id,
      (select count(*) from regist_company where calendar_id = calendar.id) as total_regist,
      (select count(*) from regist_intern where calendar_id = calendar.id) as total_intern
     FROM calendar WHERE active_id = 1`
  );
  return data[0];
};

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT id,name,semester,year,start_date,end_date,status_id,active_id,
      (select count(*) from regist_company where calendar_id = calendar.id) as total_regist,
      (select count(*) from regist_intern where calendar_id = calendar.id) as total_intern
      FROM calendar order BY start_date DESC`
    );
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
      currentCalendar: await getCurrentCalendar(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
