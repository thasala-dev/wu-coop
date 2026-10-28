import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getToken } from "next-auth/jwt";

// แก้ไขข้อมูลแบบฟอร์ม body: { name, short_name, group }
export async function PUT(request: NextRequest, { params }: any) {
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
        { status: 403 }
      );
    }

    const { id } = await params;
    const { name, short_name, group } = await request.json();
    if (!name || !short_name || !group) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql.query(
      `UPDATE evaluations_form SET name = $2, short_name = $3, "group" = $4
      WHERE id = $1 RETURNING *`,
      [id, name, short_name, group]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data.length > 0 ? data[0] : null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
