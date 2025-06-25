"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  showText?: boolean;
  callbackUrl?: string;
  userId?: string | number;
  userRole?: string;
}

export default function LogoutButton({
  variant = "ghost",
  className = "",
  showText = true,
  callbackUrl = "/",
  userId,
  userRole,
}: LogoutButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // บันทึกประวัติการออกจากระบบไปที่ API เดิม (ถ้าต้องการ)
      try {
        await fetch("/api/log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "ผู้ใช้ออกจากระบบ",
            user_id: userId,
            user_role: userRole,
          }),
        });
      } catch (error) {
        console.error("Failed to log logout:", error);
      }

      toast({
        title: "ออกจากระบบสำเร็จ",
        variant: "success",
      });

      // ใช้ signOut ของ NextAuth
      await signOut({
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "ออกจากระบบไม่สำเร็จ",
        description: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      className={className}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4 mr-2" />
      )}
      {showText && "ออกจากระบบ"}
    </Button>
  );
}
