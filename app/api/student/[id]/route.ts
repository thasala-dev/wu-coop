import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT std.*, advisor.fullname AS advisor_name, advisor.email AS advisor_email, advisor.mobile AS advisor_mobile
       FROM user_student std
       LEFT JOIN user_advisor advisor ON std.advisor_id = advisor.id
       WHERE std.id = $1`,
      [id]
    );

    if (data.length === 0) {
      console.log("No student found for ID:", id);
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลผู้ใช้งาน" },
        { status: 404 }
      );
    } else {
      console.log("Student found:", data[0]);
      return NextResponse.json({
        success: true,
        message: "ดำเนินการสำเร็จ",
        data: data[0],
      });
    }
  } catch (error) {
    console.error("Error in GET /api/student/[id]:", error);
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
    console.log("PUT student ID:", id, "with body:", body);

    const sql = neon(`${process.env.DATABASE_URL}`);

    const updateFields = [];
    const params = [id];
    let paramCount = 2;

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
    if (body.advisor_id !== undefined) {
      updateFields.push(`advisor_id = $${paramCount++}`);
      params.push(body.advisor_id === "" ? null : body.advisor_id);
    }
    if (body.emergency_contact_name !== undefined) {
      updateFields.push(`emergency_contact_name = $${paramCount++}`);
      params.push(body.emergency_contact_name);
    }
    if (body.emergency_contact_phone !== undefined) {
      updateFields.push(`emergency_contact_phone = $${paramCount++}`);
      params.push(body.emergency_contact_phone);
    }
    if (body.emergency_contact_relation !== undefined) {
      updateFields.push(`emergency_contact_relation = $${paramCount++}`);
      params.push(body.emergency_contact_relation);
    }
    if (body.image !== undefined) {
      updateFields.push(`image = $${paramCount++}`);
      params.push(body.image);
    }

    if (body.username !== undefined) {
      updateFields.push(`username = $${paramCount++}`);
      params.push(body.username);
    }

    if (body.password !== undefined) {
      updateFields.push(`password_hash = $${paramCount++}`);
      params.push(body.password);
    }

    if (body.nickname !== undefined) {
      updateFields.push(`nickname = $${paramCount++}`);
      params.push(body.nickname);
    }
    if (body.date_of_birth !== undefined && body.date_of_birth !== "") {
      updateFields.push(`date_of_birth = $${paramCount++}`);
      params.push(body.date_of_birth);
    }
    if (body.id_card !== undefined) {
      updateFields.push(`id_card = $${paramCount++}`);
      params.push(body.id_card);
    }
    if (body.nationality !== undefined) {
      updateFields.push(`nationality = $${paramCount++}`);
      params.push(body.nationality);
    }
    if (body.religion !== undefined) {
      updateFields.push(`religion = $${paramCount++}`);
      params.push(body.religion);
    }
    if (body.parent_name !== undefined) {
      updateFields.push(`parent_name = $${paramCount++}`);
      params.push(body.parent_name);
    }
    if (body.parent_occupation !== undefined) {
      updateFields.push(`parent_occupation = $${paramCount++}`);
      params.push(body.parent_occupation);
    }
    if (body.parent_phone !== undefined) {
      updateFields.push(`parent_phone = $${paramCount++}`);
      params.push(body.parent_phone);
    }
    if (body.scholarship !== undefined) {
      updateFields.push(`scholarship = $${paramCount++}`);
      params.push(body.scholarship);
    }
    if (body.medical_condition !== undefined) {
      updateFields.push(`medical_condition = $${paramCount++}`);
      params.push(body.medical_condition);
    }
    if (body.skills !== undefined) {
      updateFields.push(`skills = $${paramCount++}`);
      params.push(body.skills);
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

    console.log("Update query:", query);
    console.log("Update params:", params);

    const data = await sql(query, params);

    console.log("Update result:", data);

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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    console.log("DELETE student ID:", id);

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Soft delete by setting flag_del to 1
    const result = await sql(
      `UPDATE user_student SET
      flag_del = 1
      WHERE id = $1
      RETURNING *`,
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลหรือข้อมูลถูกลบไปแล้ว" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
