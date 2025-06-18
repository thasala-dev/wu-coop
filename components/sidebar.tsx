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
  School,
  Briefcase,
  Pill,
  ShieldCheck,
  MapPinIcon,
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
    student: "เมนูสำหรับนักศึกษา",
    advisor: "เมนูสำหรับอาจารย์",
    mentor: "เมนูสำหรับแหล่งฝึกงาน",
    admin: "เมนูสำหรับผู้ดูแลระบบ",
  };

  const colors = {
    student: "blue",
    advisor: "purple",
    mentor: "green",
    admin: "red",
  };

  const menuIcons = {
    student: <GraduationCap className="h-5 w-5 text-white" />,
    advisor: <School className="h-5 w-5 text-white" />,
    mentor: <Briefcase className="h-5 w-5 text-white" />,
    admin: <ShieldCheck className="h-5 w-5 text-white" />,
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
        href: "/student/schedule",
        page: "schedule",
        label: "ตารางนัดหมาย",
        icon: Calendar,
      },
    ],
    advisor: [
      {
        href: "/advisor/dashboard",
        page: "dashboard",
        label: "หน้าหลัก",
        icon: LayoutDashboard,
      },
      {
        href: "/advisor/students",
        page: "students",
        label: "นักศึกษาในความดูแล",
        icon: Users,
      },
      {
        href: "/advisor/visits",
        page: "visits",
        label: "การนิเทศน์",
        icon: MapPinIcon,
      },
      {
        href: "/advisor/evaluations",
        page: "evaluations",
        label: "ประเมินผลนักศึกษา",
        icon: FileText,
      },
      {
        href: "/advisor/schedule",
        page: "schedule",
        label: "ตารางนัดหมาย",
        icon: Calendar,
      },
    ],
    mentor: [
      {
        href: "/mentor/dashboard",
        page: "dashboard",
        label: "หน้าหลัก",
        icon: LayoutDashboard,
      },
      {
        href: "/mentor/students",
        page: "students",
        label: "นักศึกษาในความดูแล",
        icon: Users,
      },
      {
        href: "/mentor/evaluations",
        page: "evaluations",
        label: "ประเมินผลนักศึกษา",
        icon: FileText,
      },
      {
        href: "/mentor/schedule",
        page: "schedule",
        label: "ตารางนัดหมาย",
        icon: Calendar,
      },
    ],
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
        label: "อาจารย์นิเทศ",
        href: "/admin/advisors",
        icon: School,
        page: "advisors",
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
        label: "ผู้ดูแลระบบ",
        href: "/admin/admins",
        icon: Shield,
        page: "admins",
      },
      {
        label: "Logs",
        href: "/admin/logs",
        icon: FileText,
        page: "logs",
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
        {activePage === page && (
          <div
            className={`ml-auto w-1.5 h-5 bg-${colors[userType]}-600 rounded-full`}
          ></div>
        )}
      </Link>
    ));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Card
          className={`bg-white shadow-none border-${colors[userType]}-100 shadow-sm`}
        >
          <CardHeader
            className={`bg-gradient-to-r from-${colors[userType]}-600 to-${colors[userType]}-700 p-4 rounded-t-lg`}
          >
            <div className="flex items-center gap-2">
              <CardTitle
                className={`text-lg flex items-center gap-2 text-white`}
              >
                {menuIcons[userType]}
                <span>{menuTitles[userType]}</span>
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
        className={`md:hidden flex items-center justify-between px-4 py-3 bg-${colors[userType]}-50 border border-${colors[userType]}-100 rounded-lg shadow-sm`}
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
