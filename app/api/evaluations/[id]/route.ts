import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT std.id,
      std.fullname,
      std.nickname,
      std.nationality,
      std.religion,
      std.skills,
      std.medical_condition,
      std.student_id,
      std.image,
      std.major, 
      std.address, 
      std.mobile, 
      std.email, 
      std.emergency_contact_name, 
      std.emergency_contact_phone,
      std.emergency_contact_relation,
      cal.id AS calendar_id,
      cal.name AS calendar_name, 
      cal.semester, 
      cal.year, 
      cal.start_date, 
      cal.end_date,
      intern.position,
      comp.name AS company_name,
      comp.image AS company_image,
      comp.location AS company_location,
      intern.job_description,
      adv.fullname AS advisor_name,
      adv.mobile AS advisor_mobile, 
      adv.email AS advisor_email,
      intern.evaluation_type,
      COALESCE(json_agg(json_build_object('id', et.id, 'name', et.name, 'form', et.form)) 
        FILTER (WHERE et.id IS NOT NULL), '[]') AS evaluations
      FROM regist_intern intern
      JOIN user_student std ON intern.student_id = std.id
      JOIN user_company comp ON intern.company_id = comp.id
      JOIN calendar cal ON intern.calendar_id = cal.id
      LEFT JOIN LATERAL unnest(intern.evaluation_type) AS eval_id ON true
      LEFT JOIN evaluations_type et ON et.id = eval_id
      LEFT JOIN user_advisor adv ON std.advisor_id = adv.id
      WHERE intern.id = $1
      GROUP BY 
      std.id, std.fullname, std.nickname, std.nationality, std.religion, std.skills, std.medical_condition,
      std.student_id, std.image, std.major, std.address, std.mobile, std.email, 
      std.emergency_contact_name, std.emergency_contact_phone, std.emergency_contact_relation, cal.id,
      cal.name, cal.semester, cal.year, cal.start_date, cal.end_date,  intern.position,
      intern.job_description,company_name,company_image,company_location,
      adv.fullname, adv.mobile, adv.email,
      intern.evaluation_type
      `,
      [id]
    );

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    }
    const studentData = data[0];

    const activities = await sql(
      `SELECT act.*, cat.name as category_name
      FROM student_activities act
      inner join activity_categories cat on act.category_id = cat.id
      WHERE act.student_id = $1 and act.calendar_id = $2
      ORDER BY act.activity_date DESC`,
      [studentData.id, studentData.calendar_id]
    );

    let form = [];
    for (const item of studentData.evaluations) {
      const data = await sql(
        `SELECT form.name, form.short_name, form.id,
        case when res.id is not null then true else false end as is_submit,
        res.evaluator,res.evaluation_date
        FROM evaluations_form form
        left join evaluations_result res ON res.form_id = form.id 
          and res.intern_id = $2 and res.type_id = $3
        WHERE form.id = ANY($1::int[]) 
        order by form.seq asc`,
        [item.form, id, item.id]
      );
      form.push(data);
    }

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: studentData,
      activities: activities,
      evaluation: form,
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
    const { id } = await params;
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, group, form } = body;

    console.log("Updating evaluations_type with data:", {
      id,
      name,
      group,
      form,
    });

    // Update evaluations_type
    const data = await sql(
      `UPDATE evaluations_type SET name = $2, "group" = $3, form = $4, updated_at = $5 WHERE id = $1 RETURNING *`,
      [id, name, group, form, new Date()]
    );

    console.log("Updated evaluations_type data:", data);
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
