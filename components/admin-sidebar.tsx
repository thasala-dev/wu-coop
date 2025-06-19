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
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminSidebarProps {
  activePage?: string;
}

export function AdminSidebar({ activePage = "dashboard" }: AdminSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItems = [
    {
      label: "แดชบอร์ด",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      page: "dashboard",
    },
    {
      label: "ปฏิทินสหกิจ",
      href: "/admin/calendar",
      icon: Calendar,
      page: "calendar",
    },
    {
      label: "กิจกรรมสหกิจ",
      href: "/admin/event",
      icon: Calendar,
      page: "event",
    },
    {
      label: "แหล่งฝึกงาน",
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
      label: "จับคู่นักศึกษา-แหล่งฝึกงาน",
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
  ];

  const renderMenu = (onClickClose?: () => void) =>
    menuItems.map(({ label, href, icon: Icon, page }) => (
      <Link
        key={page}
        href={href}
        onClick={onClickClose}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
          activePage === page
            ? "bg-red-100 text-red-700 font-medium shadow-sm"
            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    ));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="h-screen w-64 border-r border-gray-200 bg-white hidden md:block">
        <Card className="h-full border-0 rounded-none shadow-none">
          <CardHeader className="bg-red-50 border-b border-red-100 py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg font-bold text-red-700">
                เมนูผู้ดูแลระบบ
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <nav className="space-y-1">{renderMenu()}</nav>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-100">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          <span className="text-lg font-bold text-red-700">
            เมนูผู้ดูแลระบบ
          </span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-6 w-6 text-red-600" />
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
            <span className="font-bold text-red-700 text-lg">
              เมนูผู้ดูแลระบบ
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

export default AdminSidebar;
