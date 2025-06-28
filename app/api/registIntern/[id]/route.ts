import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function PUT(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateFields = [];

    let paramCount = 2;
    const parameters = [id];
    if (body.company_id !== undefined) {
      updateFields.push(`company_id = $${paramCount++}`);
      parameters.push(body.company_id);
    }

    if (body.register_date !== undefined) {
      updateFields.push(`register_date = $${paramCount++}`);
      parameters.push(body.register_date);
    }

    if (body.advisor_id !== undefined) {
      updateFields.push(`advisor_id = $${paramCount++}`);
      parameters.push(body.advisor_id);
    }

    if (body.evaluation_type !== undefined) {
      updateFields.push(`evaluation_type = $${paramCount++}`);
      parameters.push(body.evaluation_type);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่มีข้อมูลที่จะอัปเดต" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const query = `UPDATE regist_intern SET ${updateFields.join(
      ", "
    )} WHERE id = $1 RETURNING *`;
    const data = await sql(query, parameters);

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

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Delete the registration completely
    const query = `DELETE FROM regist_intern WHERE id = $1 RETURNING *`;
    const data = await sql(query, [id]);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลที่จะลบ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: data,
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
