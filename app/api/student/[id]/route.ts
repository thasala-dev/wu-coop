import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql("SELECT * FROM user_student WHERE id = $1", [id]);

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลผู้ใช้งาน" },
        { status: 404 }
      );
    } else {
      return NextResponse.json({
        success: true,
        message: "ดำเนินการสำเร็จ",
        data: data[0],
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Prepare update fields and values dynamically
    const updateFields = [];
    const params = [id]; // First parameter is always the ID
    let paramCount = 2; // Start from $2 since $1 is the id

    // Add fields that are present in the request body
    if (body.fullname !== undefined) {
      updateFields.push(`fullname = $${paramCount++}`);
      params.push(body.fullname);
    }
    if (body.student_id !== undefined) {
      updateFields.push(`student_id = $${paramCount++}`);
      params.push(body.student_id);
    }
    if (body.email !== undefined) {
      updateFields.push(`email = $${paramCount++}`);
      params.push(body.email);
    }
    if (body.mobile !== undefined) {
      updateFields.push(`mobile = $${paramCount++}`);
      params.push(body.mobile);
    }
    if (body.faculty !== undefined) {
      updateFields.push(`faculty = $${paramCount++}`);
      params.push(body.faculty);
    }
    if (body.major !== undefined) {
      updateFields.push(`major = $${paramCount++}`);
      params.push(body.major);
    }
    if (body.std_year !== undefined) {
      updateFields.push(`std_year = $${paramCount++}`);
      params.push(body.std_year);
    }
    if (body.address !== undefined) {
      updateFields.push(`address = $${paramCount++}`);
      params.push(body.address);
    }
    if (body.gpa !== undefined) {
      updateFields.push(`gpa = $${paramCount++}`);
      params.push(body.gpa);
    }
    if (body.image !== undefined) {
      updateFields.push(`image = $${paramCount++}`);
      params.push(body.image);
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    // If no fields to update, return
    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่มีข้อมูลที่จะอัปเดต" },
        { status: 400 }
      );
    }

    const query = `UPDATE user_student SET ${updateFields.join(
      ", "
    )} WHERE id = $1 RETURNING *`;
    const data = await sql(query, params);

    return NextResponse.json({
      success: true,
      message: "อัปเดตข้อมูลสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    );
  }
}
