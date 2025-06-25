"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  ChevronDown,
  Settings,
  UserIcon,
  HelpCircle,
  MessageSquare,
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
import { useSession } from "next-auth/react";
import LogoutButton from "./logout-button";

interface UserHeaderProps {
  userType: "student" | "advisor" | "mentor" | "admin";
  notificationCount?: number;
}

export function UserHeader({
  userType,
  notificationCount = 0,
}: UserHeaderProps) {
  const { data: session } = useSession();

  // ชื่อผู้ใช้ - ให้ใช้จาก session
  const userName = session?.user?.fullname || session?.user?.name || "ผู้ใช้";
  const userRole = session?.user?.role;

  // กำหนดสีตามประเภทผู้ใช้
  const headerColors = {
    student: "bg-gradient-to-r from-blue-600 to-blue-700",
    advisor: "bg-gradient-to-r from-purple-600 to-purple-700",
    mentor: "bg-gradient-to-r from-green-600 to-green-700",
    admin: "bg-gradient-to-r from-red-600 to-red-700",
  };

  const headerColor = headerColors[userType];

  // กำหนดชื่อระบบตามประเภทผู้ใช้
  const systemNames = {
    student: "ระบบฝึกงาน (นักศึกษา)",
    advisor: "ระบบฝึกงาน (อาจารย์ที่ปรึกษา)",
    mentor: "ระบบฝึกงาน (แหล่งฝึก)",
    admin: "ระบบฝึกงาน (ผู้ดูแล)",
  };

  const systemName = systemNames[userType];

  return (
    <header className={`${headerColor} w-full`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <img src="/logo.svg" alt="Logo" className="h-9 w-9" />
            <h1 className="text-lg font-semibold">{systemName}</h1>
          </div>

          <div className="flex items-center space-x-3">
            {notificationCount > 0 && (
              <Link href={`/${userType}/notifications`}>
                <Button size="icon" variant="ghost" className="text-white">
                  <Badge className="absolute top-0 right-0 h-5 w-5 p-0 flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Badge>
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-white"
                >
                  <Avatar className="h-7 w-7 border-2 border-white">
                    <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                    <AvatarFallback>
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <Link href={`/${userType}/profile`}>โปรไฟล์</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link href={`/${userType}/settings`}>ตั้งค่า</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <Link href={`/${userType}/help`}>ช่วยเหลือ</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <Link href="/contact">ติดต่อผู้ดูแล</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogoutButton
                    className="w-full cursor-pointer justify-start"
                    variant="ghost"
                    showText={true}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
