import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    let calendarId = request.nextUrl.searchParams.get("calendarId");
    const sql = neon(`${process.env.DATABASE_URL}`);
    const calendar = await sql(
      `SELECT cal.* ,reg.total,
      (select count(*) from regist_intern where calendar_id = cal.id and company_id = reg.company_id) as total_intern
      FROM calendar cal
      INNER JOIN regist_company reg ON cal.id = reg.calendar_id and reg.company_id = $1
      order BY cal.start_date DESC`,
      [id]
    );

    if (!calendarId) {
      calendarId =
        calendar.find((cal: any) => cal.active_id === 1)?.id || calendar[0]?.id;
    }
    if (!calendarId) {
      return NextResponse.json(
        { success: false, message: "ไม่พบปฏิทินที่ใช้งานอยู่" },
        { status: 404 }
      );
    }

    const student = await sql(
      `SELECT 
        intern.id, 
        std.fullname,
        std.student_id,
        std.image,
        intern.evaluation_type,
        ARRAY_AGG(et.name) AS evaluation_names
        FROM regist_intern intern
        INNER JOIN user_student std 
          ON intern.student_id = std.id
        LEFT JOIN LATERAL unnest(intern.evaluation_type) AS eval_id ON true
        LEFT JOIN evaluations_type et 
          ON et.id = eval_id
        WHERE intern.calendar_id = $1 AND intern.company_id = $2
        GROUP BY intern.id, std.fullname, std.student_id, std.image, intern.evaluation_type`,
      [calendarId, id]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      calendar: calendar,
      student: student,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
