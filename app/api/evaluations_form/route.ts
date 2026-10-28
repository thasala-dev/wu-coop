import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getToken } from "next-auth/jwt";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `SELECT * FROM evaluations_form
      ORDER BY seq ASC`,
    );
    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 },
    );
  }
}

// เพิ่มแบบฟอร์มใหม่ต่อท้ายลำดับ body: { name, short_name, group }
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET ||
        "your-secret-key-change-this-in-production",
    });
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "ไม่มีสิทธิ์ดำเนินการ" },
        { status: 403 },
      );
    }

    const { name, short_name, group } = await request.json();
    if (!name || !short_name || !group) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `INSERT INTO evaluations_form (name, short_name, "group", seq)
      VALUES ($1, $2, $3, (SELECT COALESCE(MAX(seq), 0) + 1 FROM evaluations_form))
      RETURNING *`,
      [name, short_name, group],
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 },
    );
  }
}

// บันทึกลำดับแบบฟอร์ม body: { items: [{ id, seq }] }
export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET ||
        "your-secret-key-change-this-in-production",
    });
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "ไม่มีสิทธิ์ดำเนินการ" },
        { status: 403 },
      );
    }

    const { items } = await request.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql.query(
      `UPDATE evaluations_form AS form SET seq = v.seq
      FROM (SELECT unnest($1::text[]) AS id, unnest($2::int[]) AS seq) AS v
      WHERE form.id::text = v.id`,
      [
        items.map((item: any) => String(item.id)),
        items.map((item: any) => Number(item.seq)),
      ],
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 },
    );
  }
}
