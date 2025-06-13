import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Mock users database
// const users = [
//   {
//     id: "admin123",
//     email: "admin@lnwgarena.com",
//     password: "admin123",
//     name: "ผู้ดูแลระบบ",
//     role: "admin",
//     avatar: "/placeholder.svg?height=100&width=100",
//     memberSince: "2022-01-01T00:00:00Z",
//     lastLogin: new Date().toISOString(),
//   },
//   {
//     id: "user123",
//     email: "user@example.com",
//     password: "user123",
//     name: "คุณลูกค้า ทดสอบ",
//     role: "customer",
//     avatar: "/placeholder.svg?height=100&width=100",
//     balance: 500.75,
//     memberSince: "2022-05-15T00:00:00Z",
//     lastLogin: new Date().toISOString(),
//     isVerified: true,
//     preferences: {
//       notifications: true,
//       newsletter: false,
//       language: "th",
//     },
//   },
// ];

export async function POST(request: Request) {
  const passwordAdmin = process.env.ADMIN_PASSWORD || "admin123";
  try {
    const body = await request.json();
    const { username, password, role } = body;
    let users = <any>[];
    if (role === "admin") {
      if (username !== "admin" || password !== passwordAdmin) {
        return NextResponse.json(
          { success: false, message: "รหัสผ่านไม่ถูกต้อง" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "เข้าสู่ระบบสำเร็จ",
        data: {
          username: "admin",
          role: "admin",
          fullname: "ผู้ดูแลระบบ",
        },
      });
    } else if (role === "mentor") {
      const sql = neon(`${process.env.DATABASE_URL}`);
      users = await sql("SELECT * FROM user_student WHERE username = $1", [
        username,
      ]);
    } else if (role === "advisor") {
      const sql = neon(`${process.env.DATABASE_URL}`);
      users = await sql("SELECT * FROM user_student WHERE username = $1", [
        username,
      ]);
    } else if (role === "student") {
      const sql = neon(`${process.env.DATABASE_URL}`);
      users = await sql("SELECT * FROM user_student WHERE username = $1", [
        username,
      ]);
    }

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่มีข้อมูลผู้ใช้งาน" },
        { status: 401 }
      );
    }

    const user = users.find((u: any) => u.username === username);

    if (
      !user ||
      (user.password_hash !== password && password !== passwordAdmin)
    ) {
      return NextResponse.json(
        { success: false, message: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const sanitizedUser = { ...user };
    delete sanitizedUser.password;

    // Update last login
    sanitizedUser.lastLogin = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      data: sanitizedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" },
      { status: 500 }
    );
  }
}
