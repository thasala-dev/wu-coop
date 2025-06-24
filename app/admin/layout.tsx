"use client";

import AuthGuard from "@/components/auth-guard";
import { Navbar } from "@/components/navbar-nextauth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
      <div>
        <Navbar userType="admin" />
        {children}
      </div>
    </AuthGuard>
  );
}
