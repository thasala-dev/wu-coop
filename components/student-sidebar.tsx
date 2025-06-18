import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, LayoutDashboard, User, Activity, FileText, Calendar } from "lucide-react"

interface StudentSidebarProps {
  activePage?: string
}

export default function StudentSidebar({ activePage = "dashboard" }: StudentSidebarProps) {
  const menuItems = [
    { href: "/student/dashboard", id: "dashboard", label: "หน้าหลัก", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/student/profile", id: "profile", label: "ข้อมูลส่วนตัว", icon: <User className="h-5 w-5" /> },
    { href: "/student/activities", id: "activities", label: "บันทึกกิจกรรม", icon: <Activity className="h-5 w-5" /> },
    { href: "/student/schedule", id: "schedule", label: "ตารางนัดหมาย", icon: <Calendar className="h-5 w-5" /> },
  ]

  return (
    <div className="md:col-span-1">
      <Card className="border-blue-200 shadow-md bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <GraduationCap className="h-6 w-6" />
            <span>เมนูนักศึกษา</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  activePage === item.id
                    ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {activePage === item.id && <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}

export { StudentSidebar }
