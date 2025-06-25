import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql("SELECT * FROM user_company WHERE id = $1", [id]);

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
    const data = await sql(
      `UPDATE user_company SET
      name = $2,
      business_type = $3,
      location = $4,
      establish_year = $5,
      total_employees = $6,
      joined_year = $7,
      website = $8,
      contact_name = $9,
      contact_position = $10,
      contact_email = $11,
      contact_phone = $12,
      contact_address = $13,
      detail = $14,
      image = $15
      WHERE id = $1
      RETURNING *`,
      [
        id,
        body.name,
        body.businessType,
        body.location,
        body.establishYear || null,
        body.totalEmployees || null,
        body.joinedYear || null,
        body.website || null,
        body.contactName,
        body.contactPosition,
        body.contactEmail || null,
        body.contactPhone || null,
        body.contactAddress || null,
        body.detail || null,
        body.image || null,
      ]
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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Soft delete: Set flag_del = 1 instead of removing the record
    const data = await sql(
      `UPDATE user_company SET flag_del = 1 WHERE id = $1 RETURNING *`,
      [id]
    );

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
