"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default function StudentDashboardClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ถ้าไม่มีการเข้าสู่ระบบหรือไม่ใช่นักศึกษา ให้ redirect ไปที่หน้า login
  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session?.user && session.user.role !== "student")
    ) {
      router.replace("/");
    }
  }, [session, status, router]);

  // แสดง loading ระหว่างตรวจสอบ session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // ถ้ายังไม่มีการเข้าสู่ระบบหรือไม่ใช่นักศึกษา ไม่แสดงอะไร
  if (
    status === "unauthenticated" ||
    !session?.user ||
    session.user.role !== "student"
  ) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        ยินดีต้อนรับ {session.user.fullname || session.user.name}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          ข้อมูลผู้ใช้ (Client Component)
        </h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {JSON.stringify(session.user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
