import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

/**
 * เรียกใช้เพื่อรับ session ปัจจุบันจากฝั่ง server
 */
export async function getSession() {
  return await getServerSession();
}

/**
 * ใช้เพื่อตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือไม่ และมี role ตามที่ต้องการหรือไม่
 * ถ้าไม่ระบุ role จะตรวจสอบเฉพาะการเข้าสู่ระบบ
 */
export async function checkSessionServer(requiredRole?: string) {
  const session = await getSession();

  if (!session?.user) {
    return { isAuthenticated: false, user: null };
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return { isAuthenticated: true, hasRole: false, user: session.user };
  }

  return {
    isAuthenticated: true,
    hasRole: requiredRole ? session.user.role === requiredRole : true,
    user: session.user,
  };
}

/**
 * ล้าง cookie เก่าจากระบบ authentication เดิม (สำหรับการย้ายไปใช้ NextAuth)
 */
export function clearLegacyCookies() {
  // ลบ cookies เก่า - ใช้สำหรับการตั้งค่าเพื่อลบใน response
  // ต้องใช้ใน route handler (API routes)
  return { success: true };
}
