import Link from "next/link"
import { LayoutDashboardIcon, UsersIcon, ClipboardCheckIcon, CalendarIcon, MapPinIcon, SchoolIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdvisorSidebarProps {
  activePage: string
}

export function AdvisorSidebar({ activePage }: AdvisorSidebarProps) {
  return (
    <div className="md:col-span-1">
      <Card className="border-purple-200 shadow-md">
        <CardHeader className="bg-purple-50 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <SchoolIcon className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg font-bold text-purple-700">เมนูอาจารย์ที่ปรึกษา</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <nav className="space-y-1">
            <Link
              href="/advisor/dashboard"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "dashboard"
                  ? "bg-purple-100 text-purple-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              <LayoutDashboardIcon className="h-5 w-5" />
              <span>แดชบอร์ด</span>
            </Link>
            <Link
              href="/advisor/students"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "students"
                  ? "bg-purple-100 text-purple-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              <span>นักศึกษาในความดูแล</span>
            </Link>
            <Link
              href="/advisor/visits"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "visits"
                  ? "bg-purple-100 text-purple-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              <MapPinIcon className="h-5 w-5" />
              <span>การนิเทศ</span>
            </Link>
            <Link
              href="/advisor/evaluations"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "evaluations"
                  ? "bg-purple-100 text-purple-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              <ClipboardCheckIcon className="h-5 w-5" />
              <span>ประเมินผล</span>
            </Link>
            <Link
              href="/advisor/schedule"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activePage === "schedule"
                  ? "bg-purple-100 text-purple-700 font-medium shadow-sm"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
              <span>ตารางนัดหมาย</span>
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvisorSidebar
