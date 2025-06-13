import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // ลบ cookie ที่เก็บข้อมูลผู้ใช้
    cookies().delete("user")

    return NextResponse.json({
      success: true,
      message: "ออกจากระบบสำเร็จ",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการออกจากระบบ" }, { status: 500 })
  }
}
