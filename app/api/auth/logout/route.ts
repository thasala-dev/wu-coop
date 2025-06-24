import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";
const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user } = body;
    await sql(
      "INSERT INTO log (title, user_id, user_role) VALUES ($1, $2, $3)",
      [
        `${
          user.role === "mentor" ? user.name : user.fullname
        } ได้ออกจากระบบสำเร็จ`,
        user.id,
        user.role,
      ]
    ); // สร้าง response และลบทั้ง client-side และ HTTP-only cookies
    const response = NextResponse.json({
      success: true,
      message: "ออกจากระบบสำเร็จ",
    });

    // ลบ HTTP-only cookie
    response.cookies.delete("session_id");

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการออกจากระบบ" },
      { status: 500 }
    );
  }
}
