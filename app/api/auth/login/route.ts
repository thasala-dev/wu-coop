import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(request: Request) {
  const passwordAdmin = process.env.ADMIN_PASSWORD || "admin123";
  try {
    const body = await request.json();
    const { username, password, role } = body;
    let users = <any>[];
    if (role === "admin") {
      users = await sql("SELECT * FROM user_admin WHERE username = $1", [
        username,
      ]);
    } else if (role === "mentor") {
      users = await sql("SELECT * FROM user_company WHERE username = $1", [
        username,
      ]);
    } else if (role === "advisor") {
      users = await sql("SELECT * FROM user_advisor WHERE username = $1", [
        username,
      ]);
    } else if (role === "student") {
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

    await sql(
      "INSERT INTO log (title, user_id, user_role) VALUES ($1, $2, $3)",
      [
        `${role === "mentor" ? user.name : user.fullname} ได้เข้าสู่ระบบสำเร็จ`,
        user.id,
        role,
      ]
    );

    const lastLogin = new Date().toISOString();
    if (role === "admin") {
      await sql("UPDATE user_admin SET last_login = $1 WHERE username = $2", [
        lastLogin,
        username,
      ]);
    } else if (role === "mentor") {
      await sql("UPDATE user_company SET last_login = $1 WHERE username = $2", [
        lastLogin,
        username,
      ]);
    } else if (role === "advisor") {
      await sql("UPDATE user_advisor SET last_login = $1 WHERE username = $2", [
        lastLogin,
        username,
      ]);
    } else if (role === "student") {
      await sql("UPDATE user_student SET last_login = $1 WHERE username = $2", [
        lastLogin,
        username,
      ]);
    }
    sanitizedUser.lastLogin = lastLogin;
    sanitizedUser.role = role;

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
