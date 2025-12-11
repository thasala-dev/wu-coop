import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const getCurrentCalendar = async () => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const data = await sql.query(
    `SELECT id,name,semester,year,start_date,end_date,status_id,active_id,
      (select count(*) from regist_company where calendar_id = calendar.id) as total_regist,
      (select count(*) from regist_intern where calendar_id = calendar.id) as total_intern
     FROM calendar WHERE active_id = 1`
  );
  return data[0];
};

const getStudentCount = async (calendar_id: number) => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const data = await sql.query(
    `SELECT 
        CASE WHEN company_id IS NULL THEN 1 ELSE 2 END AS group_type,
        COUNT(*) as count
     FROM regist_intern
     WHERE calendar_id = $1
     GROUP BY group_type`,
    [calendar_id]
  );
  return data;
};

const getCompanyCount = async (calendar_id: number) => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const data = await sql.query(
    `SELECT company.id, company.name,reg.total,company.image,
     (select count(stu.*) from regist_intern stu where stu.calendar_id = reg.calendar_id AND stu.company_id = company.id) as total_intern
     FROM regist_company reg
     JOIN user_company company ON reg.company_id = company.id
     WHERE reg.calendar_id = $1`,
    [calendar_id]
  );
  return data;
};

const getEventCount = async (calendar_id: number) => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const data = await sql.query(
    `SELECT * 
     FROM events
     WHERE calendar_id = $1`,
    [calendar_id]
  );
  return data;
};

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `SELECT id,name,semester,year,start_date,end_date,status_id,active_id,
      (select count(*) from regist_company where calendar_id = calendar.id) as total_regist,
      (select count(*) from regist_intern where calendar_id = calendar.id) as total_intern
      FROM calendar order BY start_date DESC`
    );

    const currentCalendar = await getCurrentCalendar();
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
      currentCalendar: currentCalendar,
      student: await getStudentCount(currentCalendar.id),
      company: await getCompanyCount(currentCalendar.id),
      event: await getEventCount(currentCalendar.id),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
