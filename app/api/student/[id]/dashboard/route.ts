import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const calendar = await sql(
      `SELECT reg.id, cal.name,  cal.start_date, cal.end_date, cal.active_id, cal.year, cal.semester,
      reg.company_id, uc.name AS company_name, uc.image AS company_image, uc.location AS company_location, 
      uc.contact_name AS company_contact_name, uc.contact_email AS company_contact_email,
      uc.contact_phone AS company_contact_phone, uc.contact_position AS company_contact_position
      FROM calendar cal
      INNER JOIN regist_intern reg ON cal.id = reg.calendar_id and reg.student_id = $1
      INNER JOIN user_company uc ON reg.company_id = uc.id
      order BY cal.start_date DESC`,
      [id]
    );

    for (const item of calendar) {
      const supervision = await sql(
        `select vis.scheduled_date,
        vis.start_time, vis.end_time,
        vis.visit_type,
        vis.advisor_id, ua.fullname as advisor_name, ua.image as advisor_image,
        ua.mobile as advisor_mobile, ua.email as advisor_email
        from supervisions vis
        inner join user_advisor ua on vis.advisor_id = ua.id
        where vis.regist_intern_id = $1`,
        [item.id]
      );
      item.supervision = supervision;
    }

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      calendar: calendar,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
