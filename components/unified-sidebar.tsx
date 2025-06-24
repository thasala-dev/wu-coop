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
  MapPin,
  ClipboardCheck,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

interface SidebarProps {
  userType: "student" | "advisor" | "mentor" | "admin";
  activePage?: string;
}

export default function Sidebar({
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
    student: "sky",
    advisor: "fuchsia",
    mentor: "lime",
    admin: "rose",
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
        icon: User,
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
        label: "รายงาน",
        icon: FileText,
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
        label: "ตารางนิเทศ",
        icon: MapPin,
      },
      {
        href: "/advisor/schedule",
        page: "schedule",
        label: "ตารางนัดหมาย",
        icon: Calendar,
      },
      {
        href: "/advisor/evaluations",
        page: "evaluations",
        label: "ประเมินนักศึกษา",
        icon: ClipboardCheck,
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
        href: "/mentor/schedule",
        page: "schedule",
        label: "ตารางนัดหมาย",
        icon: Calendar,
      },
      {
        href: "/mentor/evaluations",
        page: "evaluations",
        label: "ประเมินนักศึกษา",
        icon: ClipboardCheck,
      },
    ],
    admin: [
      {
        href: "/admin/dashboard",
        page: "dashboard",
        label: "แดชบอร์ด",
        icon: LayoutDashboard,
      },
      {
        href: "/admin/calendar",
        page: "calendar",
        label: "ปฏิทินสหกิจ",
        icon: Calendar,
      },
      {
        href: "/admin/event",
        page: "event",
        label: "กิจกรรมสหกิจ",
        icon: Calendar,
      },
      {
        href: "/admin/companies",
        page: "companies",
        label: "แหล่งฝึกงาน",
        icon: Building,
      },
      {
        href: "/admin/advisors",
        page: "advisors",
        label: "อาจารย์นิเทศ",
        icon: School,
      },
      {
        href: "/admin/students",
        page: "students",
        label: "นักศึกษา",
        icon: Users,
      },
      {
        href: "/admin/matching",
        page: "matching",
        label: "จับคู่ฝึกงาน",
        icon: LinkIcon,
      },
      {
        href: "/admin/supervision",
        page: "supervision",
        label: "ดูแลนิเทศ",
        icon: MapPin,
      },
      {
        href: "/admin/evaluations",
        page: "evaluations",
        label: "ประเมินผล",
        icon: ClipboardList,
      },
      {
        href: "/admin/reports",
        page: "reports",
        label: "รายงาน",
        icon: BarChart,
      },
      {
        href: "/admin/logs",
        page: "logs",
        label: "ประวัติกิจกรรม",
        icon: Activity,
      },
      {
        href: "/admin/admins",
        page: "admins",
        label: "ผู้ดูแลระบบ",
        icon: Shield,
      },
      {
        href: "/admin/settings",
        page: "settings",
        label: "ตั้งค่า",
        icon: Settings,
      },
    ],
  };

  const color = colors[userType];
  const menuTitle = menuTitles[userType];
  const headerMenuIcon = menuIcons[userType];

  return (
    <div>
      {/* Mobile menu */}
      <div className="flex lg:hidden">
        <button
          type="button"
          className={`inline-flex items-center justify-center rounded-md p-2 text-${color}-200 hover:bg-${color}-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-${color}-500`}
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 text-${color}-600`}>
              <div
                className={`rounded-full bg-${color}-500 p-2 flex items-center justify-center`}
              >
                {headerMenuIcon}
              </div>
              <span className="font-bold">{menuTitle}</span>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {menuItems[userType].map((item) => (
                  <Link
                    key={item.page}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      activePage === item.page
                        ? `bg-${color}-50 text-${color}-600`
                        : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Desktop menu */}
      <Card className={`hidden lg:block border-${color}-200 shadow-md`}>
        <CardHeader className={`bg-${color}-500 text-white p-4`}>
          <CardTitle className="text-lg flex items-center gap-2">
            {headerMenuIcon}
            <span>{menuTitle}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <nav className="space-y-1">
            {menuItems[userType].map((item) => (
              <Link
                key={item.page}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  activePage === item.page
                    ? `bg-${color}-100 text-${color}-700 font-medium shadow-sm`
                    : `text-gray-700 hover:bg-${color}-50 hover:text-${color}-600`
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {activePage === item.page && (
                  <div
                    className={`ml-auto w-1.5 h-5 bg-${color}-600 rounded-full`}
                  ></div>
                )}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}
