import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id, type, subtype } = await params;

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `SELECT std.fullname, std.student_id, com.name AS company_name,cal.name AS calendar_name, cal.semester, cal.year, cal.start_date, cal.end_date
      FROM regist_intern intern
      join user_student std ON intern.student_id = std.id
      join user_company com ON intern.company_id = com.id
      join calendar cal ON intern.calendar_id = cal.id
      WHERE intern.id = $1 LIMIT 1`,
      [id]
    );

    const formType = await sql.query(
      `SELECT * FROM evaluations_form WHERE id = $1 LIMIT 1`,
      [subtype]
    );

    const form = await sql.query(
      `SELECT * FROM evaluations_result WHERE intern_id = $1 AND type_id = $2 AND form_id = $3 LIMIT 1`,
      [id, type, subtype]
    );

    if (form.length > 0) {
      form[0].evaluation_date = form[0].evaluation_date
        .toISOString()
        .split("T")[0];
    }

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data.length > 0 ? data[0] : null,
      type: formType.length > 0 ? formType[0] : null,
      form: form.length > 0 ? form[0] : null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: any) {
  try {
    const { id, type, subtype } = await params;
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { result_id, evaluator, evaluation_date, result } = body;

    // Update evaluations_type

    if (result_id && result_id !== "0" && result_id !== "undefined") {
      console.log("do this 2", result_id);
      await sql.query(
        `UPDATE evaluations_result SET evaluator = $2, evaluation_date = $3, result = $4 WHERE id = $1 RETURNING *`,
        [result_id, evaluator, evaluation_date, result]
      );
    } else {
      console.log("do this 1");
      await sql.query(
        `INSERT INTO evaluations_result (intern_id, type_id, form_id, evaluator, evaluation_date, result) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [id, type, subtype, evaluator, evaluation_date, result]
      );
    }

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
