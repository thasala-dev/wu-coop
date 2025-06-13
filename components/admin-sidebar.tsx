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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminSidebarProps {
  activePage?: string;
}

export function AdminSidebar({ activePage = "dashboard" }: AdminSidebarProps) {
  return (
    <div className="h-screen w-64 border-r border-gray-200 bg-white">
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
          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "dashboard"
                  ? "bg-red-100 text-red-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>แดชบอร์ด</span>
            </Link>
            <Link
              href="/admin/calendar"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "calendar"
                  ? "bg-red-100 text-red-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>ปฏิทินกิจกรรม</span>
            </Link>
            <Link
              href="/admin/companies"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "companies"
                  ? "bg-red-100 text-red-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <Building className="h-5 w-5" />
              <span>สถานประกอบการ</span>
            </Link>
            <Link
              href="/admin/students"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "students"
                  ? "bg-red-100 text-red-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>นักศึกษา</span>
            </Link>

            <Link
              href="/admin/matching"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "matching"
                  ? "bg-red-100 text-red-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <LinkIcon className="h-5 w-5" />
              <span>จับคู่นักศึกษา-บริษัท</span>
            </Link>

            <Link
              href="/admin/reports"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "reports"
                  ? "bg-red-100 text-red-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <BarChart className="h-5 w-5" />
              <span>รายงาน</span>
            </Link>
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "settings"
                  ? "bg-red-100 text-red-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>ตั้งค่าระบบ</span>
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminSidebar;
