import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    let calendarId = request.nextUrl.searchParams.get("calendarId");
    const sql = neon(`${process.env.DATABASE_URL}`);
    const calendar = await sql.query(
      `SELECT cal.* 

      FROM calendar cal
      order BY cal.start_date DESC`
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

    const student = await sql.query(
      `SELECT 
        intern.id, 
        std.fullname,
        std.student_id,
        std.image,
        std.mobile,
        std.email,
        com.name AS company_name,
        com.location AS company_location,
        adv.fullname AS advisor_name,
        adv.mobile AS advisor_mobile,
        adv.image AS advisor_image,
        adv.username AS advisor_username,
        intern.evaluation_type,
        ARRAY_AGG(DISTINCT et.name) AS evaluation_names,
        ARRAY_AGG(f ORDER BY f) AS evaluation_forms,
        COUNT(f) AS total_forms,
        (select count(*) from evaluations_result where intern_id = intern.id) as total_result
      FROM regist_intern intern
      INNER JOIN user_student std 
        ON intern.student_id = std.id
      INNER JOIN user_company com
        ON intern.company_id = com.id
      LEFT JOIN user_advisor adv 
        ON adv.id = std.advisor_id
      LEFT JOIN LATERAL unnest(intern.evaluation_type) AS eval_id ON true
      LEFT JOIN evaluations_type et 
        ON et.id = eval_id
      LEFT JOIN LATERAL unnest(et.form) AS f ON true
      WHERE intern.calendar_id = $1 
      GROUP BY intern.id, std.fullname, 
              std.student_id, std.email, std.image, 
              adv.fullname, adv.mobile, 
              adv.image, adv.username,      com.name,com.location,
              std.mobile, intern.evaluation_type`,
      [calendarId]
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
