import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query("SELECT * FROM user_admin WHERE id = $1", [id]);

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูล" },
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

    const updateFields = [];
    const params = [id];
    let paramCount = 2;

    if (body.image !== undefined) {
      updateFields.push(`image = $${paramCount++}`);
      params.push(body.image);
    }

    if (body.fullname !== undefined) {
      updateFields.push(`fullname = $${paramCount++}`);
      params.push(body.fullname);
    }
    if (body.username !== undefined) {
      updateFields.push(`username = $${paramCount++}`);
      params.push(body.username);
    }

    if (body.password !== undefined) {
      updateFields.push(`password_hash = $${paramCount++}`);
      params.push(body.password);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    const query = `UPDATE user_admin SET ${updateFields.join(
      ", "
    )} WHERE id = $1 RETURNING *`;
    const data = await sql.query(query, params);

    // const data = await sql.query(
    //   `UPDATE user_admin SET
    //   fullname = $2,
    //   image = $3,
    //   username = $4
    //   WHERE id = $1
    //   RETURNING *`,
    //   [id, body.fullname, body.image || null, body.username || null]
    // );

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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Soft delete by setting flag_del to 1
    const result = await sql.query(
      `UPDATE user_admin SET
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
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
