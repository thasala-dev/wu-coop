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
