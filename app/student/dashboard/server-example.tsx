import { getSession, checkSessionServer } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboardServerPage() {
  // ตรวจสอบสิทธิ์และรับข้อมูลผู้ใช้
  const { isAuthenticated, hasRole, user } = await checkSessionServer(
    "student"
  );

  // ถ้าไม่มีการเข้าสู่ระบบ ให้ redirect ไปที่หน้า login
  if (!isAuthenticated || !hasRole) {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        ยินดีต้อนรับ {user.fullname || user.name}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          ข้อมูลผู้ใช้ (Server Component)
        </h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
