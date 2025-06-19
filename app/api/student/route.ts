import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      "SELECT * FROM user_student ORDER BY updated_at DESC"
    );
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    const check = await sql("SELECT * FROM user_student WHERE username = $1", [
      body.username,
    ]);
    if (check.length > 0) {
      return NextResponse.json(
        { success: false, message: "รหัสนักศึกษานี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    const columns = [];
    const values = [];
    const params = [];
    let paramCount = 1;

    if (body.fullname !== undefined) {
      columns.push("fullname");
      values.push(`$${paramCount++}`);
      params.push(body.fullname);
    }

    if (body.password !== undefined) {
      columns.push("password_hash");
      values.push(`$${paramCount++}`);
      params.push(body.password);
    }

    if (body.username !== undefined) {
      columns.push("username");
      values.push(`$${paramCount++}`);
      params.push(body.username);
    }

    if (body.student_id !== undefined) {
      columns.push("student_id");
      values.push(`$${paramCount++}`);
      params.push(body.student_id);
    }

    if (body.email !== undefined) {
      columns.push("email");
      values.push(`$${paramCount++}`);
      params.push(body.email);
    }

    if (body.mobile !== undefined) {
      columns.push("mobile");
      values.push(`$${paramCount++}`);
      params.push(body.mobile);
    }

    if (body.faculty !== undefined) {
      columns.push("faculty");
      values.push(`$${paramCount++}`);
      params.push(body.faculty);
    }

    if (body.major !== undefined) {
      columns.push("major");
      values.push(`$${paramCount++}`);
      params.push(body.major);
    }
    if (body.std_year !== undefined) {
      columns.push("std_year");
      values.push(`$${paramCount++}`);
      params.push(body.std_year);
    }
    if (body.address !== undefined) {
      columns.push("address");
      values.push(`$${paramCount++}`);
      params.push(body.address);
    }
    if (body.gpa !== undefined) {
      columns.push("gpa");
      values.push(`$${paramCount++}`);
      params.push(body.gpa);
    }
    if (body.image !== undefined) {
      columns.push("image");
      values.push(`$${paramCount++}`);
      params.push(body.image);
    }

    if (columns.length === 0) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุข้อมูลที่ต้องการเพิ่ม" },
        { status: 400 }
      );
    }

    const data = await sql(
      `INSERT INTO user_student (${columns.join(", ")}) VALUES (${values.join(
        ", "
      )}) RETURNING *`,
      params
    );

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
