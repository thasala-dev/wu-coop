import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql(
      `SELECT company.id,company.name,company.business_type,company.location,company.status_id,company.image,company.contact_name,company.last_login,
      (SELECT total FROM regist_company WHERE calendar_id = cal.id AND company_id = company.id) AS total_regist,
      (SELECT COUNT(*) FROM regist_intern WHERE calendar_id = cal.id AND company_id = company.id) AS total_intern,
      company.id AS company_id
      FROM user_company company
      LEFT JOIN calendar cal ON cal.active_id = 1
      WHERE company.flag_del = 0
      ORDER BY company.name DESC`
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
      (username, password_hash, name, business_type, location, establish_year, total_employees, joined_year, website, contact_name, contact_position, contact_email, contact_phone, contact_address, detail, image, evaluation_type) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
        body.image || null,
        body.evaluationType || null,
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
