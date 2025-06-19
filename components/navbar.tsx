"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  UserIcon,
  HelpCircle,
  MessageSquare,
  Zap,
  Pill,
} from "lucide-react";
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
import { useAuth } from "@/contexts/auth-context";
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
    student: "bg-gradient-to-r from-blue-600 to-blue-700",
    advisor: "bg-gradient-to-r from-purple-600 to-purple-700",
    mentor: "bg-gradient-to-r from-green-600 to-green-700",
    admin: "bg-gradient-to-r from-red-600 to-red-700",
  };

  const headerColor = headerColors[userType];

  // กำหนดตัวอักษรแรกของ Avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const [mounted, setMounted] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!user) return null;

  const config = genConfig(user.role + user?.username);

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
          </Link>

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 relative"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>การแจ้งเตือน</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notificationCount > 0 ? (
                  <div className="max-h-80 overflow-auto">
                    <div className="p-3 hover:bg-gray-100 cursor-pointer border-b">
                      <div className="font-medium">
                        มีเอกสารใหม่รอการตรวจสอบ
                      </div>
                      <div className="text-sm text-gray-500">
                        2 ชั่วโมงที่แล้ว
                      </div>
                    </div>
                    <div className="p-3 hover:bg-gray-100 cursor-pointer border-b">
                      <div className="font-medium">
                        กำหนดส่งรายงานความก้าวหน้า
                      </div>
                      <div className="text-sm text-gray-500">1 วันที่แล้ว</div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 px-2 text-center text-gray-500">
                    <p>ไม่มีการแจ้งเตือนใหม่</p>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center">
                  ดูการแจ้งเตือนทั้งหมด
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>ข้อความ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>ตั้งค่า</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} disabled={isLoading}>
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
