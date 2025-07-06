"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ChevronDown,
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
import { useRouter } from "next/navigation";
import Avatar, { genConfig } from "react-nice-avatar";
import CustomAvatar from "@/components/avatar";
import { useSession } from "next-auth/react";
import LogoutButton from "./logout-button";

interface NavbarProps {
  userType: "student" | "advisor" | "mentor" | "admin";
  notificationCount?: number;
}

export function Navbar({ userType, notificationCount = 0 }: NavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [config, setConfig] = useState<any>(null);

  const userName = session?.user?.fullname || session?.user?.name || "ผู้ใช้";
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const userImage = session?.user?.image || null;

  // กำหนดสีตามประเภทผู้ใช้
  const headerColors = {
    student: "bg-gradient-to-r from-sky-500 to-sky-600",
    advisor: "bg-gradient-to-r from-fuchsia-500 to-fuchsia-600",
    mentor: "bg-gradient-to-r from-lime-500 to-lime-600",
    admin: "bg-gradient-to-r from-rose-500 to-rose-600",
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
  useEffect(() => {
    if (session?.user) {
      // ใช้ user.email หรือชื่อเป็น seed
      const seed = (session.user.email || userName) as string;
      setConfig(genConfig(seed));
    }
  }, [session, userName]);

  return (
    <header className={`${headerColor} w-full`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <img src="/spm.png" alt="Logo" className="h-8 text-white" />
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              ระบบฝึกงาน{" "}
              <span className="hidden md:block">
                สำนักเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์
              </span>
            </h1>
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
                  <CustomAvatar
                    id={`${user?.rolw}${user?.username}`}
                    image={user?.image}
                    size="8"
                  />
                  <span className="hidden md:inline">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {userType !== "admin" && (
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <Link href={`/${userType}/profile`}>โปรไฟล์</Link>
                    </DropdownMenuItem>
                  )}

                  {/* <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link href={`/${userType}/settings`}>ตั้งค่า</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <Link href={`/${userType}/help`}>ช่วยเหลือ</Link>
                  </DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <Link href="/contact">ติดต่อผู้ดูแล</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem asChild>
                  <LogoutButton
                    className="w-full cursor-pointer justify-start"
                    variant="ghost"
                    showText={true}
                    userId={userId}
                    userRole={userRole}
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
