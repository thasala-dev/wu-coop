import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, user_id, user_role } = body;
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql(
      "INSERT INTO log (title, user_id, user_role) VALUES ($1, $2, $3)",
      [title, user_id, user_role]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการออกจากระบบ" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Build query with date filters
    let query = `SELECT log.id, log.user_id, log.user_role, log.title, log.created_at,
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
      WHERE 1=1`;

    // Add date range conditions if provided
    const params: any[] = [];

    if (start) {
      query += ` AND DATE(log.created_at) >= $1`;
      params.push(start);
    }

    if (end) {
      query += ` AND DATE(log.created_at) <= $${params.length + 1}`;
      params.push(end);
    }

    query += ` ORDER BY log.created_at DESC`;

    const data = await sql(query, params);

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
