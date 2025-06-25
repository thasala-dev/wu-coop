import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// รายการเส้นทางที่ไม่ต้องการตรวจสอบ (public routes)
const publicRoutes = ["/", "/api"];

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  // Debug information
  console.log("Middleware processing path:", currentPath);

  // ข้ามการตรวจสอบสำหรับไฟล์ static หรือ API routes หรือ public routes
  if (
    currentPath.startsWith("/_next") ||
    currentPath.startsWith("/api/auth") || // ให้เข้าถึง NextAuth API routes ได้
    currentPath.includes(".") ||
    currentPath === "/favicon.ico" ||
    publicRoutes.some((route) => currentPath === route)
  ) {
    console.log("Skipping middleware check for public path");
    return NextResponse.next();
  }

  // ตรวจสอบ session จาก NextAuth
  const token = await getToken({
    req: request,
    secret:
      process.env.NEXTAUTH_SECRET ||
      "your-secret-key-change-this-in-production",
  });

  console.log("NextAuth token exists:", !!token);

  // ถ้าไม่มี token และกำลังพยายามเข้าถึงเส้นทางที่ต้องการการเข้าสู่ระบบ
  if (!token) {
    console.log(
      "No token and trying to access protected route, redirecting to login"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ตรวจสอบสิทธิ์การเข้าถึง role-specific routes
  if (token) {
    const userRole = token.role as string;
    console.log("User role from token:", userRole);

    // ตรวจสอบว่าผู้ใช้พยายามเข้าถึงเส้นทางที่ตรงกับบทบาทของตนหรือไม่
    if (currentPath.startsWith("/student") && userRole !== "student") {
      console.log("Role mismatch: trying to access student route as", userRole);
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (currentPath.startsWith("/mentor") && userRole !== "mentor") {
      console.log("Role mismatch: trying to access mentor route as", userRole);
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (currentPath.startsWith("/advisor") && userRole !== "advisor") {
      console.log("Role mismatch: trying to access advisor route as", userRole);
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (currentPath.startsWith("/admin") && userRole !== "admin") {
      console.log("Role mismatch: trying to access admin route as", userRole);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
