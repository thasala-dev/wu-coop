"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell, // เพิ่มกลับมาเนื่องจากยังต้องใช้ชั่วคราว
  ChevronDown,
  LogOut,
  Settings,
  UserIcon,
  HelpCircle,
  MessageSquare,
  Zap,
  Pill,
} from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Avatar, { genConfig } from "react-nice-avatar";
import CustomAvatar from "@/components/avatar";

interface NavbarProps {
  userType: "student" | "advisor" | "mentor" | "admin";

  notificationCount?: number;
}

export function Navbar({
  userType,

  notificationCount = 0,
}: NavbarProps) {
  // กำหนดสีตามประเภทผู้ใช้
  const headerColors = {
    student: "bg-gradient-to-r from-sky-500 to-sky-600",
    advisor: "bg-gradient-to-r from-fuchsia-500 to-fuchsia-600",
    mentor: "bg-gradient-to-r from-lime-500 to-lime-600",
    admin: "bg-gradient-to-r from-rose-500 to-rose-600",
  };

  const headerColor = headerColors[userType];

  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!user) return null;

  return (
    <header className={`${headerColor} shadow-md sticky top-0 z-50 `}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            href={`/${userType}/dashboard`}
            className="flex items-center gap-2"
          >
            <img src="/icon.png" alt="Logo" className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              ระบบฝึกงาน{" "}
              <span className="hidden md:block">
                สำนักเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์
              </span>
            </h1>
          </Link>{" "}
          <div className="flex items-center gap-1">
            {/* <div className="text-white hover:bg-white/20 rounded-md">
              <NotificationBell />
            </div> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:bg-white/20"
                >
                  <CustomAvatar
                    id={user.role + user?.username}
                    image={user.image}
                    size="8"
                  />

                  <div className="hidden md:block text-left">
                    <div className="font-medium">
                      {user.role == "mentor" ? user?.name : user?.fullname}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>โปรไฟล์</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />{" "}
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
