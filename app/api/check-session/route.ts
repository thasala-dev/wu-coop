import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // ตรวจสอบ cookie จาก request
  const cookieHeader = request.headers.get("cookie");
  console.log("Cookie header:", cookieHeader);

  // ดึง cookie ชื่อ user
  const userCookie = cookieHeader
    ?.split(";")
    .find((c) => c.trim().startsWith("user="));

  return NextResponse.json({
    cookieExists: !!userCookie,
    timestamp: new Date().toISOString(),
  });
}
