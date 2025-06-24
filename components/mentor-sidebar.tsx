import Link from "next/link";
import {
  LayoutDashboardIcon,
  UsersIcon,
  ClipboardCheckIcon,
  CalendarIcon,
  BriefcaseIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MentorSidebarProps {
  activePage: string;
}

export default function MentorSidebar({ activePage }: MentorSidebarProps) {
  return (
    <div className="md:col-span-1">
      <Card className="border-green-200 shadow-md">
        <CardHeader className="bg-green-50 border-b border-green-100">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg font-bold text-green-700">
              เมนูแหล่งฝึก
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <nav className="space-y-1">
            <Link
              href="/mentor/dashboard"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "dashboard"
                  ? "bg-green-100 text-green-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <LayoutDashboardIcon className="h-5 w-5" />
              <span>แดชบอร์ด</span>
            </Link>
            <Link
              href="/mentor/students"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "students"
                  ? "bg-green-100 text-green-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              <span>นักศึกษาในความดูแล</span>
            </Link>
            <Link
              href="/mentor/evaluations"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "evaluations"
                  ? "bg-green-100 text-green-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <ClipboardCheckIcon className="h-5 w-5" />
              <span>ประเมินผล</span>
            </Link>
            <Link
              href="/mentor/schedule"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "schedule"
                  ? "bg-green-100 text-green-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
              <span>ตารางนัดหมาย</span>
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}
