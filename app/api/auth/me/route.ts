import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // ในระบบจริงควรตรวจสอบ token หรือ session
    // แต่สำหรับ mockup เราจะตรวจสอบจาก cookie
    const cookieStore = cookies()
    const userCookie = cookieStore.get("user")

    if (!userCookie) {
      return NextResponse.json({ success: false, message: "ไม่พบข้อมูลการเข้าสู่ระบบ" }, { status: 401 })
    }

    // Parse user data from cookie
    const userData = JSON.parse(decodeURIComponent(userCookie.value))

    return NextResponse.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการตรวจสอบสถานะการเข้าสู่ระบบ" }, { status: 500 })
  }
}
