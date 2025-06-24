"use client";

import { Navbar } from "@/components/navbar-nextauth";
import AuthGuard from "@/components/auth-guard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="student">
      <div>
        <Navbar userType="student" />
        {children}
      </div>
    </AuthGuard>
  );
}
