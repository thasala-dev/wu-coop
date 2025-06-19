import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClipboardListIcon,
  UserIcon,
  MapPinIcon,
  CarIcon,
} from "lucide-react";
import AdvisorSidebar from "@/components/advisor-sidebar";
import Sidebar from "@/components/sidebar";

export default function AdvisorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="dashboard" userType="advisor" />

          <div className="md:col-span-4">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
                <TabsTrigger value="students">นักศึกษาในที่ปรึกษา</TabsTrigger>
                <TabsTrigger value="visits">การนิเทศนักศึกษา</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        นักศึกษาในที่ปรึกษา
                      </CardTitle>
                      <CardDescription>ภาคการศึกษาที่ 1/2567</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        12
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        นักศึกษาฝึกงานทั้งหมด
                      </p>
                      <div className="mt-4 pt-4 border-t flex flex-col gap-1 text-sm">
                        <div className="flex justify-between">
                          <span>อยู่ระหว่างฝึกงาน</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>นิเทศแล้ว</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span>รอนิเทศ</span>
                          <span className="font-medium">4</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        การนิเทศที่กำลังจะถึง
                      </CardTitle>
                      <CardDescription>ในอีก 30 วันข้างหน้า</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        4
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        นักศึกษาที่ต้องนิเทศ
                      </p>
                      <div className="mt-4 pt-4 border-t">
                        <Link href="/advisor/visits">
                          <Button variant="ghost" size="sm" className="w-full">
                            ดูตารางการนิเทศ
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        แบบประเมินที่ต้องตรวจ
                      </CardTitle>
                      <CardDescription>แบบประเมินความก้าวหน้า</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        3
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        รายการที่รอการตรวจสอบ
                      </p>
                      <div className="mt-4 pt-4 border-t">
                        <Link href="/advisor/evaluations">
                          <Button variant="ghost" size="sm" className="w-full">
                            ตรวจแบบประเมิน
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        นักศึกษาในที่ปรึกษา
                      </CardTitle>
                      <CardDescription>ภาคการศึกษาที่ 1/2567</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">นายวิชัย เรียนดี</div>
                            <div className="text-sm text-gray-500">
                              แหล่งฝึกงาน เทคโนโลยีดิจิทัล จำกัด • กรุงเทพฯ
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            กำลังฝึกงาน
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">นางสาวนภา สุขใจ</div>
                            <div className="text-sm text-gray-500">
                              แหล่งฝึกงาน เน็ตเวิร์ค โซลูชั่น จำกัด • นนทบุรี
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            กำลังฝึกงาน
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">นายสมชาย ใจดี</div>
                            <div className="text-sm text-gray-500">
                              แหล่งฝึกงาน เทคโนโลยีดิจิทัล จำกัด • กรุงเทพฯ
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            กำลังฝึกงาน
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t">
                        <Link href="/advisor/students">
                          <Button variant="ghost" size="sm" className="w-full">
                            ดูนักศึกษาทั้งหมด
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        การนิเทศที่กำลังจะถึง
                      </CardTitle>
                      <CardDescription>
                        อัพเดทล่าสุด: 3 วันที่ผ่านมา
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                            <CalendarIcon className="h-6 w-6 text-purple-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">
                              นิเทศ นายวิชัย เรียนดี
                            </div>
                            <div className="text-sm text-gray-500">
                              15 ก.ค. 2567 • 10:00-12:00 น.
                            </div>
                            <div className="text-sm text-gray-500">
                              แหล่งฝึกงาน เทคโนโลยีดิจิทัล จำกัด
                            </div>
                          </div>
                          <Link href="/advisor/visits/1">
                            <Button size="sm">รายละเอียด</Button>
                          </Link>
                        </div>
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                            <CalendarIcon className="h-6 w-6 text-purple-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">
                              นิเทศ นางสาวนภา สุขใจ
                            </div>
                            <div className="text-sm text-gray-500">
                              17 ก.ค. 2567 • 13:00-15:00 น.
                            </div>
                            <div className="text-sm text-gray-500">
                              แหล่งฝึกงาน เน็ตเวิร์ค โซลูชั่น จำกัด
                            </div>
                          </div>
                          <Link href="/advisor/visits/2">
                            <Button size="sm">รายละเอียด</Button>
                          </Link>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                            <CalendarIcon className="h-6 w-6 text-purple-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">
                              นิเทศ นายมานะ ตั้งใจ และ นายธนา รักการเรียน
                            </div>
                            <div className="text-sm text-gray-500">
                              20 ก.ค. 2567 • 09:00-12:00 น.
                            </div>
                            <div className="text-sm text-gray-500">
                              แหล่งฝึกงาน อิเล็กทรอนิกส์ จำกัด
                            </div>
                          </div>
                          <Link href="/advisor/visits/3">
                            <Button size="sm">รายละเอียด</Button>
                          </Link>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t">
                        <Link href="/advisor/visits">
                          <Button variant="ghost" size="sm" className="w-full">
                            ดูการนิเทศทั้งหมด
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ปฏิทินกิจกรรม</CardTitle>
                    <CardDescription>กิจกรรมที่กำลังจะมาถึง</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4 p-3 border-l-4 border-purple-500 bg-purple-50 rounded-r-md">
                        <div className="text-center min-w-[60px]">
                          <div className="font-bold">15</div>
                          <div className="text-xs">ก.ค.</div>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            นิเทศนักศึกษา - แหล่งฝึกงาน เทคโนโลยีดิจิทัล จำกัด
                          </h3>
                          <p className="text-sm text-gray-600">
                            เวลา 10:00-12:00 น. • นายวิชัย เรียนดี
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 border-l-4 border-purple-500 bg-purple-50 rounded-r-md">
                        <div className="text-center min-w-[60px]">
                          <div className="font-bold">17</div>
                          <div className="text-xs">ก.ค.</div>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            นิเทศนักศึกษา - แหล่งฝึกงาน เน็ตเวิร์ค โซลูชั่น
                            จำกัด
                          </h3>
                          <p className="text-sm text-gray-600">
                            เวลา 13:00-15:00 น. • นางสาวนภา สุขใจ
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                        <div className="text-center min-w-[60px]">
                          <div className="font-bold">20</div>
                          <div className="text-xs">ก.ค.</div>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            ประชุมกับพี่เลี้ยงนักศึกษา
                          </h3>
                          <p className="text-sm text-gray-600">
                            เวลา 13:00-15:00 น. ผ่านระบบประชุมออนไลน์
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students">
                <Card>
                  <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">
                        นักศึกษาในที่ปรึกษา
                      </CardTitle>
                      <CardDescription>ภาคการศึกษาที่ 1/2567</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="ค้นหานักศึกษา..."
                        className="px-4 py-2 border rounded-md w-full md:w-auto"
                      />
                      <Button>ค้นหา</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">
                                นายวิชัย เรียนดี
                              </h3>
                              <p className="text-sm text-gray-600">
                                รหัสนักศึกษา: 64123456101
                              </p>
                              <p className="text-sm text-gray-600">
                                วิศวกรรมคอมพิวเตอร์ • GPA: 3.75
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  กำลังฝึกงาน
                                </Badge>
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPinIcon className="h-4 w-4 mr-1" />
                                  แหล่งฝึกงาน เทคโนโลยีดิจิทัล จำกัด • กรุงเทพฯ
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href="/advisor/students/1">
                              <Button variant="outline" size="sm">
                                ดูข้อมูล
                              </Button>
                            </Link>
                            <Link href="/advisor/visits/plan/1">
                              <Button size="sm">วางแผนนิเทศ</Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">
                                นางสาวนภา สุขใจ
                              </h3>
                              <p className="text-sm text-gray-600">
                                รหัสนักศึกษา: 64123456102
                              </p>
                              <p className="text-sm text-gray-600">
                                วิศวกรรมคอมพิวเตอร์ • GPA: 3.68
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  กำลังฝึกงาน
                                </Badge>
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPinIcon className="h-4 w-4 mr-1" />
                                  แหล่งฝึกงาน เน็ตเวิร์ค โซลูชั่น จำกัด •
                                  นนทบุรี
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href="/advisor/students/2">
                              <Button variant="outline" size="sm">
                                ดูข้อมูล
                              </Button>
                            </Link>
                            <Link href="/advisor/visits/plan/2">
                              <Button size="sm">วางแผนนิเทศ</Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">
                                นายสมชาย ใจดี
                              </h3>
                              <p className="text-sm text-gray-600">
                                รหัสนักศึกษา: 64123456789
                              </p>
                              <p className="text-sm text-gray-600">
                                วิศวกรรมคอมพิวเตอร์ • GPA: 3.45
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  กำลังฝึกงาน
                                </Badge>
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPinIcon className="h-4 w-4 mr-1" />
                                  แหล่งฝึกงาน เทคโนโลยีดิจิทัล จำกัด • กรุงเทพฯ
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href="/advisor/students/3">
                              <Button variant="outline" size="sm">
                                ดูข้อมูล
                              </Button>
                            </Link>
                            <Link href="/advisor/visits/plan/3">
                              <Button size="sm">วางแผนนิเทศ</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visits">
                <Card>
                  <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">
                        การนิเทศนักศึกษา
                      </CardTitle>
                      <CardDescription>
                        ตารางการนิเทศและบันทึกการนิเทศ
                      </CardDescription>
                    </div>
                    <Button>+ วางแผนการนิเทศใหม่</Button>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="upcoming">
                      <TabsList className="mb-4">
                        <TabsTrigger value="upcoming">กำลังจะถึง</TabsTrigger>
                        <TabsTrigger value="completed">
                          เสร็จสิ้นแล้ว
                        </TabsTrigger>
                        <TabsTrigger value="reports">
                          รายงานการนิเทศ
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="upcoming">
                        <div className="space-y-6">
                          <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-purple-200 rounded-md flex items-center justify-center">
                                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                  <div className="flex items-center text-sm text-purple-600 font-medium mb-1">
                                    <CalendarIcon className="h-4 w-4 mr-1" /> 15
                                    กรกฎาคม 2567 • 10:00-12:00 น.
                                  </div>
                                  <h3 className="text-lg font-medium">
                                    นิเทศนักศึกษา - แหล่งฝึกงาน เทคโนโลยีดิจิทัล
                                    จำกัด
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    นักศึกษา: นายวิชัย เรียนดี
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPinIcon className="h-4 w-4 mr-1" />
                                      กรุงเทพมหานคร
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <CarIcon className="h-4 w-4 mr-1" />
                                      ระยะทาง: 15 กม.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Link href="/advisor/visits/1">
                                  <Button variant="outline" size="sm">
                                    ดูรายละเอียด
                                  </Button>
                                </Link>
                                <Link href="/advisor/visits/record/1">
                                  <Button size="sm">บันทึกการนิเทศ</Button>
                                </Link>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                                  <CalendarIcon className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                  <div className="flex items-center text-sm text-purple-600 font-medium mb-1">
                                    <CalendarIcon className="h-4 w-4 mr-1" /> 17
                                    กรกฎาคม 2567 • 13:00-15:00 น.
                                  </div>
                                  <h3 className="text-lg font-medium">
                                    นิเทศนักศึกษา - แหล่งฝึกงาน เน็ตเวิร์ค
                                    โซลูชั่น จำกัด
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    นักศึกษา: นางสาวนภา สุขใจ
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPinIcon className="h-4 w-4 mr-1" />
                                      นนทบุรี
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <CarIcon className="h-4 w-4 mr-1" />
                                      ระยะทาง: 25 กม.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Link href="/advisor/visits/2">
                                  <Button variant="outline" size="sm">
                                    ดูรายละเอียด
                                  </Button>
                                </Link>
                                <Link href="/advisor/visits/record/2">
                                  <Button size="sm">บันทึกการนิเทศ</Button>
                                </Link>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                                  <CalendarIcon className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                  <div className="flex items-center text-sm text-purple-600 font-medium mb-1">
                                    <CalendarIcon className="h-4 w-4 mr-1" /> 20
                                    กรกฎาคม 2567 • 09:00-12:00 น.
                                  </div>
                                  <h3 className="text-lg font-medium">
                                    นิเทศนักศึกษา - แหล่งฝึกงาน อิเล็กทรอนิกส์
                                    จำกัด
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    นักศึกษา: นายมานะ ตั้งใจ, นายธนา รักการเรียน
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPinIcon className="h-4 w-4 mr-1" />
                                      ปทุมธานี
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <CarIcon className="h-4 w-4 mr-1" />
                                      ระยะทาง: 40 กม.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Link href="/advisor/visits/3">
                                  <Button variant="outline" size="sm">
                                    ดูรายละเอียด
                                  </Button>
                                </Link>
                                <Link href="/advisor/visits/record/3">
                                  <Button size="sm">บันทึกการนิเทศ</Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="completed">
                        <div className="text-center py-8 text-gray-500">
                          <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>ยังไม่มีการนิเทศที่เสร็จสิ้น</p>
                          <p className="text-sm">
                            การนิเทศที่เสร็จสิ้นแล้วจะแสดงที่นี่
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="reports">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                  การนิเทศทั้งหมด
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-purple-600">
                                  4/12
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  นักศึกษาที่ต้องนิเทศ
                                </p>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                  นิเทศเสร็จสิ้น
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-green-600">
                                  0/12
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  นักศึกษาที่นิเทศแล้ว
                                </p>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                  รวมระยะทาง
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-gray-600">
                                  0 กม.
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  ระยะทางการนิเทศทั้งหมด
                                </p>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-lg mb-4">
                              รายงานการนิเทศ
                            </h3>
                            <div className="text-center py-8 text-gray-500">
                              <ClipboardListIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                              <p>ยังไม่มีรายงานการนิเทศ</p>
                              <p className="text-sm">
                                รายงานการนิเทศจะแสดงที่นี่เมื่อคุณบันทึกการนิเทศ
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
