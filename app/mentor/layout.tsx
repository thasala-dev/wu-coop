"use client";

import AuthGuard from "@/components/auth-guard";
import { Navbar } from "@/components/navbar-nextauth";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="mentor">
      <div>
        <Navbar userType="mentor" />
        {children}
      </div>
    </AuthGuard>
  );
}
