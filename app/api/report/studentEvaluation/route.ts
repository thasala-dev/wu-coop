import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getToken } from "next-auth/jwt";

// รายชื่อนักศึกษาในผลัดการฝึก พร้อมจำนวนแบบประเมินที่ต้องประเมินและที่ประเมินแล้ว
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET ||
        "your-secret-key-change-this-in-production",
    });
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "ไม่มีสิทธิ์ดำเนินการ" },
        { status: 403 },
      );
    }

    const calendarId = request.nextUrl.searchParams.get("calendarId");
    if (!calendarId) {
      return NextResponse.json(
        { success: false, message: "กรุณาเลือกผลัดการฝึก" },
        { status: 400 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `SELECT
        intern.id,
        std.fullname,
        std.student_id,
        com.name AS company_name,
        COUNT(f.form_id) AS total_forms,
        COUNT(res.id) AS total_submitted,
        MAX(res.evaluation_date) AS last_evaluation_date
      FROM regist_intern intern
      INNER JOIN user_student std ON intern.student_id = std.id
      INNER JOIN user_company com ON intern.company_id = com.id
      LEFT JOIN LATERAL (
        SELECT et.id AS type_id, unnest(et.form) AS form_id
        FROM evaluations_type et
        WHERE et.id = ANY(intern.evaluation_type)
      ) f ON true
      LEFT JOIN evaluations_result res
        ON res.intern_id = intern.id
        AND res.type_id = f.type_id
        AND res.form_id = f.form_id
      WHERE intern.calendar_id = $1
      GROUP BY intern.id, std.fullname, std.student_id, com.name
      ORDER BY std.student_id ASC`,
      [calendarId],
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 },
    );
  }
}
