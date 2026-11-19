import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-this-in-production",
    });
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "ไม่มีสิทธิ์ดำเนินการ" },
        { status: 403 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const calendars = await sql.query(
      `SELECT id, name, semester, year, active_id, start_date
       FROM calendar ORDER BY start_date DESC`,
      [],
    );
    const requestedCalendar = request.nextUrl.searchParams.get("calendarId");
    const calendarId = calendars.find((cal) => String(cal.id) === requestedCalendar)?.id
      ?? calendars.find((cal) => cal.active_id === 1)?.id
      ?? calendars[0]?.id;

    const types = calendarId == null ? [] : await sql.query(
      `SELECT et.id, et.name FROM evaluations_type et
       WHERE EXISTS (
         SELECT 1 FROM regist_intern intern
         WHERE intern.calendar_id = $1 AND et.id = ANY(intern.evaluation_type)
       ) ORDER BY et.name, et.id`,
      [calendarId],
    );
    const requestedType = request.nextUrl.searchParams.get("typeId");
    const typeId = types.find((type) => String(type.id) === requestedType)?.id ?? "all";
    const selectedTypes = typeId === "all" ? types : types.filter((type) => type.id === typeId);
    const typeIds = selectedTypes.map((type) => type.id);

    const [forms, students, results] = typeIds.length === 0 ? [[], [], []] : await Promise.all([
      sql.query(
        `SELECT et.id AS type_id, f.id, f.name, f.short_name, f.seq
         FROM evaluations_type et
         INNER JOIN evaluations_form f ON f.id = ANY(et.form)
         WHERE et.id = ANY($1::int[]) ORDER BY f.seq, f.id`,
        [typeIds],
      ),
      sql.query(
        `SELECT et.id AS type_id, intern.id, std.fullname, std.student_id, com.name AS company_name
         FROM regist_intern intern
         INNER JOIN evaluations_type et ON et.id = ANY(intern.evaluation_type)
         INNER JOIN user_student std ON std.id = intern.student_id
         LEFT JOIN user_company com ON com.id = intern.company_id
         WHERE intern.calendar_id = $1 AND et.id = ANY($2::int[])
         ORDER BY std.student_id, intern.id`,
        [calendarId, typeIds],
      ),
      sql.query(
        `SELECT res.intern_id, res.form_id, res.type_id, res.result,
                res.evaluator, res.evaluation_date
         FROM evaluations_result res
         INNER JOIN regist_intern intern ON intern.id = res.intern_id
         WHERE intern.calendar_id = $1 AND res.type_id = ANY(intern.evaluation_type)
           AND res.type_id = ANY($2::int[])
         ORDER BY res.evaluation_date DESC NULLS LAST, res.id DESC`,
        [calendarId, typeIds],
      ),
    ]);
    const groups = selectedTypes.map((type) => ({
      type,
      forms: forms.filter((form) => form.type_id === type.id),
      students: students.filter((student) => student.type_id === type.id),
    }));

    return NextResponse.json({
      success: true, calendars, types, groups, results,
      calendarId: calendarId ?? null, typeId,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด ไม่สามารถโหลดข้อมูลได้" },
      { status: 500 },
    );
  }
}
