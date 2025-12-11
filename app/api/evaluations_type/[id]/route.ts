import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(`SELECT * FROM evaluations_type WHERE id = $1`, [
      id,
    ]);

    const form = await sql.query(
      `SELECT * FROM evaluations_form ORDER BY "group" ASC,"seq" ASC`
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data[0] || {},
      form: form || [],
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
    const data = await sql.query(
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
