import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data =
      await sql(`SELECT log.id, log.user_id, log.user_role, log.title, log.created_at,
      case
        when log.user_role = 'admin' then user_admin.fullname
        when log.user_role = 'advisor' then user_advisor.fullname
        when log.user_role = 'student' then user_student.fullname
        when log.user_role = 'mentor' then user_company.name
        else 'unknown'
      end as fullname,
      case
        when log.user_role = 'admin' then user_admin.image
        when log.user_role = 'advisor' then user_advisor.image
        when log.user_role = 'student' then user_student.image
        when log.user_role = 'mentor' then user_company.image
        else null
      end as image,
      case
        when log.user_role = 'admin' then user_admin.username
        when log.user_role = 'advisor' then user_advisor.username
        when log.user_role = 'student' then user_student.username
        when log.user_role = 'mentor' then user_company.username
        else null
      end as username
      FROM log
      LEFT JOIN user_admin ON log.user_id = user_admin.id
      LEFT JOIN user_advisor ON log.user_id = user_advisor.id
      LEFT JOIN user_student ON log.user_id = user_student.id
      LEFT JOIN user_company ON log.user_id = user_company.id
      ORDER BY log.created_at DESC`);
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
