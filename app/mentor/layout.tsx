"use client";

import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading]);
  return (
    <div>
      <Navbar userType="mentor" />
      {children}
    </div>
  );
}
