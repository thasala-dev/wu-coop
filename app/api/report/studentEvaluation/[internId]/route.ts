import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getToken } from "next-auth/jwt";

// ข้อมูลนักศึกษา 1 คน พร้อมแบบประเมินทุกฉบับและผลการประเมินที่บันทึกไว้
export async function GET(request: NextRequest, { params }: any) {
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

    const { internId } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);

    const student = await sql.query(
      `SELECT
        intern.id,
        std.fullname,
        std.student_id,
        com.name AS company_name,
        cal.name AS calendar_name,
        cal.semester,
        cal.year,
        cal.start_date,
        cal.end_date,
        adv.fullname AS advisor_name
      FROM regist_intern intern
      INNER JOIN user_student std ON intern.student_id = std.id
      INNER JOIN user_company com ON intern.company_id = com.id
      INNER JOIN calendar cal ON intern.calendar_id = cal.id
      LEFT JOIN user_advisor adv ON std.advisor_id = adv.id
      WHERE intern.id = $1
      LIMIT 1`,
      [internId],
    );

    if (student.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลนักศึกษา" },
        { status: 404 },
      );
    }

    const forms = await sql.query(
      `SELECT
        et.id AS type_id,
        et.name AS type_name,
        form.id AS form_id,
        form.name,
        form.short_name,
        form."group",
        res.id AS result_id,
        res.evaluator,
        res.evaluation_date,
        res.result
      FROM regist_intern intern
      INNER JOIN evaluations_type et ON et.id = ANY(intern.evaluation_type)
      INNER JOIN evaluations_form form ON form.id = ANY(et.form)
      LEFT JOIN evaluations_result res
        ON res.intern_id = intern.id
        AND res.type_id = et.id
        AND res.form_id = form.id
      WHERE intern.id = $1
      ORDER BY et.id ASC, form.seq ASC`,
      [internId],
    );

    for (const form of forms) {
      if (form.evaluation_date) {
        form.evaluation_date = new Date(form.evaluation_date)
          .toISOString()
          .split("T")[0];
      }
    }

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: student[0],
      forms: forms,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 },
    );
  }
}
