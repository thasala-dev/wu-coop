import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StudentSidebar from "@/components/student-sidebar";
import { Sidebar } from "@/components/sidebar";
import {
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Users,
} from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="dashboard" userType="student" />

          <div className="md:col-span-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-800">
                แดชบอร์ดนักศึกษา
              </h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">การแจ้งเตือน</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">ปฏิทิน</span>
                </Button>
              </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  สถานะการฝึกงาน
                </CardTitle>
                <CardDescription>
                  ติดตามสถานะการฝึกงานฝึกงานของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">ความคืบหน้า:</span>
                      <span className="text-blue-700 font-medium">75%</span>
                    </div>
                    <Badge className="bg-blue-500">กำลังดำเนินการ</Badge>
                  </div>
                  <Progress value={75} className="h-2 bg-blue-100" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">ลงทะเบียน</div>
                        <div className="text-xs text-gray-500">เสร็จสิ้น</div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">ส่งใบสมัคร</div>
                        <div className="text-xs text-gray-500">เสร็จสิ้น</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">สัมภาษณ์</div>
                        <div className="text-xs text-gray-500">รอดำเนินการ</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">อนุมัติ</div>
                        <div className="text-xs text-gray-500">รอดำเนินการ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  ประกาศล่าสุด
                </CardTitle>
                <CardDescription>
                  ข่าวสารและประกาศสำคัญเกี่ยวกับฝึกงาน
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        เปิดรับสมัครฝึกงานประจำภาคการศึกษาที่ 2/2566
                      </h3>
                      <Badge className="bg-blue-500">ประกาศ</Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      วันที่ 15 ตุลาคม 2566
                    </div>
                    <p className="text-sm mt-2">
                      ขอเชิญนักศึกษาที่สนใจเข้าร่วมโครงการฝึกงานประจำภาคการศึกษาที่
                      2/2566 สมัครได้ตั้งแต่วันนี้ถึง 30 ตุลาคม 2566
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      อ่านเพิ่มเติม
                    </Button>
                  </div>

                  <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        การอบรมเตรียมความพร้อมฝึกงาน
                      </h3>
                      <Badge className="bg-green-500">กิจกรรม</Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      วันที่ 10 ตุลาคม 2566
                    </div>
                    <p className="text-sm mt-2">
                      ขอเชิญนักศึกษาที่สมัครโครงการฝึกงานเข้าร่วมการอบรมเตรียมความพร้อมในวันที่
                      1 พฤศจิกายน 2566
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      อ่านเพิ่มเติม
                    </Button>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    ดูประกาศทั้งหมด
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
