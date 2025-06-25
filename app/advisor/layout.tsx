"use client";

import AuthGuard from "@/components/auth-guard";
import { Navbar } from "@/components/navbar-nextauth";

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="advisor">
      <div>
        <Navbar userType="advisor" />
        {children}
      </div>
    </AuthGuard>
  );
}
