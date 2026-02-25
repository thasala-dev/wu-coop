import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "ไม่พบ token" },
        { status: 400 }
      );
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.error("TURNSTILE_SECRET_KEY is not set");
      return NextResponse.json(
        { success: false, message: "ไม่ได้ตั้งค่า secret key" },
        { status: 500 }
      );
    }

    // Verify token with Cloudflare
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "");

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await verifyRes.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "การยืนยันตัวตนล้มเหลว", errors: data["error-codes"] },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Turnstile verify error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
