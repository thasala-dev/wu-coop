"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Building,
  Calendar,
  Settings,
  Shield,
  BarChart,
  LinkIcon,
  Menu,
  X,
  GraduationCap,
  User,
  Activity,
  FileText,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SidebarProps {
  userType: "student" | "advisor" | "mentor" | "admin";
  activePage?: string;
}

export function Sidebar({
  userType = "admin",
  activePage = "dashboard",
}: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuTitles = {
    student: "เมนูนักศึกษา",
    advisor: "เมนูอาจารย์ที่ปรึกษา",
    mentor: "เมนูแหล่งฝึกงาน",
    admin: "เมนูผู้ดูแลระบบ",
  };

  const colors = {
    student: "blue",
    advisor: "purple",
    mentor: "green",
    admin: "red",
  };

  const menuIcons = {
    student: <GraduationCap className="h-5 w-5 text-blue-600" />,
    advisor: <User className="h-5 w-5 text-purple-600" />,
    mentor: <Building className="h-5 w-5 text-green-600" />,
    admin: <Shield className="h-5 w-5 text-red-600" />,
  };

  const menuItems = {
    student: [
      {
        href: "/student/dashboard",
        page: "dashboard",
        label: "หน้าหลัก",
        icon: LayoutDashboard,
      },
      {
        href: "/student/profile",
        page: "profile",
        label: "ข้อมูลส่วนตัว",
        icon: Users,
      },
      {
        href: "/student/activities",
        page: "activities",
        label: "บันทึกกิจกรรม",
        icon: Activity,
      },
      {
        href: "/student/reports",
        page: "reports",
        label: "รายงานผล",
        icon: FileText,
      },
      {
        href: "/student/schedule",
        page: "schedule",
        label: "ตารางนัดหมาย",
        icon: Calendar,
      },
    ],
    advisor: [],
    mentor: [],
    admin: [
      {
        label: "แดชบอร์ด",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        page: "dashboard",
      },
      {
        label: "ปฏิทินกิจกรรม",
        href: "/admin/calendar",
        icon: Calendar,
        page: "calendar",
      },
      {
        label: "สถานประกอบการ",
        href: "/admin/companies",
        icon: Building,
        page: "companies",
      },
      {
        label: "นักศึกษา",
        href: "/admin/students",
        icon: Users,
        page: "students",
      },
      {
        label: "จับคู่นักศึกษา-บริษัท",
        href: "/admin/matching",
        icon: LinkIcon,
        page: "matching",
      },
      {
        label: "รายงาน",
        href: "/admin/reports",
        icon: BarChart,
        page: "reports",
      },
      {
        label: "ตั้งค่าระบบ",
        href: "/admin/settings",
        icon: Settings,
        page: "settings",
      },
    ],
  };

  const renderMenu = (onClickClose?: () => void) =>
    menuItems[userType].map(({ label, href, icon: Icon, page }) => (
      <Link
        key={page}
        href={href}
        onClick={onClickClose}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
          activePage === page
            ? `bg-${colors[userType]}-100 text-${colors[userType]}-700 font-medium shadow-sm`
            : `text-gray-600 hover:bg-${colors[userType]}-50 hover:text-${colors[userType]}-600`
        }`}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    ));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="h-screen border-r border-gray-200 bg-white hidden md:block">
        <Card className="h-full border-0 rounded-none shadow-none">
          <CardHeader className={`border-0 py-4 bg-${colors[userType]}-50`}>
            <div className="flex items-center gap-2">
              {menuIcons[userType]}
              <CardTitle
                className={`text-${colors[userType]}-700 text-lg font-bold`}
              >
                {menuTitles[userType]}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <nav className="space-y-1">{renderMenu()}</nav>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Header */}
      <div
        className={`md:hidden flex items-center justify-between px-4 py-3 bg-${colors[userType]}-50 border-b border-${colors[userType]}-100`}
      >
        <div className="flex items-center gap-2">
          {menuIcons[userType]}
          <span className={`text-lg font-bold text-${colors[userType]}-700`}>
            {menuTitles[userType]}
          </span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu className={`h-6 w-6 text-${colors[userType]}-600`} />
        </button>
      </div>

      {/* Mobile Sidebar Dialog */}
      <Dialog
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className="relative z-50 md:hidden"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <span className={`font-bold text-${colors[userType]}-700 text-lg`}>
              {menuTitles[userType]}
            </span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <nav className="space-y-1">
            {renderMenu(() => setMobileMenuOpen(false))}
          </nav>
        </div>
      </Dialog>
    </>
  );
}

export default Sidebar;
