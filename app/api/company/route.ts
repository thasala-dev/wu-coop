import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql("SELECT * FROM user_company");
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

    // return NextResponse.json({
    //   success: false,
    //   message: "ดำเนินการสำเร็จ",
    //   data: body,
    // });

    const sql = neon(`${process.env.DATABASE_URL}`);

    const check = await sql("SELECT * FROM user_company WHERE username = $1", [
      body.username,
    ]);
    if (check.length > 0) {
      return NextResponse.json(
        { success: false, message: "Username นี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    const data = await sql(
      `INSERT INTO user_company 
      (username, password_hash, name, business_type, location, establish_year, total_employees, joined_year, website, contact_name, contact_position, contact_email, contact_phone, contact_address, detail) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        body.username,
        body.password,
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
