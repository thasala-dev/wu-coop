"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/loading";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * คอมโพเนนต์สำหรับป้องกันหน้าที่ต้องการการเข้าสู่ระบบ
 * สามารถระบุ role ที่ต้องการได้
 */
export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // ถ้ากำลังโหลดให้รอก่อน
    if (status === "loading") return;

    // ถ้าไม่มีการเข้าสู่ระบบ ให้ redirect ไปที่หน้า login
    if (status === "unauthenticated") {
      console.log("Not authenticated, redirecting to login");
      router.replace("/");
      return;
    }

    // ถ้ามีการระบุ role ที่ต้องการ และ role ไม่ตรงกับที่ต้องการ
    if (requiredRole && session?.user?.role !== requiredRole) {
      console.log(
        `Role mismatch: required ${requiredRole}, got ${session?.user?.role}`
      );
      router.replace("/");
      return;
    }
  }, [status, session, router, requiredRole]);

  // ถ้ากำลังโหลดหรือไม่มีการเข้าสู่ระบบ ให้แสดง loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // ถ้าไม่มีการเข้าสู่ระบบ หรือ role ไม่ตรงกับที่ต้องการ ไม่แสดงอะไร (จะถูก redirect โดย useEffect)
  if (
    status === "unauthenticated" ||
    (requiredRole && session?.user?.role !== requiredRole)
  ) {
    return null;
  }

  // แสดงเนื้อหาเมื่อมีการเข้าสู่ระบบและมี role ตรงตามที่ต้องการ
  return <>{children}</>;
}
