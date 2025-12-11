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
import {
  CalendarIcon,
  FileTextIcon,
  BriefcaseIcon,
  UserIcon,
  BookOpenIcon,
  ClipboardListIcon,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">เมนูหลัก</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 rounded-md"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    <span>หน้าหลัก</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>ข้อมูลส่วนตัว</span>
                  </Link>
                  <Link
                    href="/dashboard/jobs"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <BriefcaseIcon className="h-4 w-4" />
                    <span>ตำแหน่งงาน</span>
                  </Link>
                  <Link
                    href="/dashboard/documents"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    <span>เอกสาร</span>
                  </Link>
                  <Link
                    href="/dashboard/schedule"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span>ตารางนัดหมาย</span>
                  </Link>
                  <Link
                    href="/dashboard/reports"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <ClipboardListIcon className="h-4 w-4" />
                    <span>รายงานผล</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
                <TabsTrigger value="announcements">ประกาศ</TabsTrigger>
                <TabsTrigger value="calendar">ปฏิทินกิจกรรม</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        สถานะการสมัครงาน
                      </CardTitle>
                      <CardDescription>
                        อัพเดทล่าสุด: 8 เม.ย. 2025
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>แหล่งฝึกงาน เอบีซี จำกัด</span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            รอการตอบรับ
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>แหล่งฝึกงาน เทคโนโลยี จำกัด</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            ผ่านการคัดเลือก
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>แหล่งฝึกงาน ซอฟต์แวร์ จำกัด</span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            ไม่ผ่านการคัดเลือก
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        เอกสารที่ต้องส่ง
                      </CardTitle>
                      <CardDescription>
                        กำหนดส่งเร็วที่สุด: 15 เม.ย. 2025
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>แบบฟอร์มสมัครงานสหกิจ</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            ส่งแล้ว
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>แบบขออนุมัติฝึกงาน</span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            ยังไม่ส่ง
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>รายงานความก้าวหน้า</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            ยังไม่ถึงกำหนด
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ตำแหน่งงานแนะนำ</CardTitle>
                    <CardDescription>ตำแหน่งงานที่เหมาะกับคุณ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border p-4 rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              นักพัฒนาเว็บไซต์ (Web Developer)
                            </h3>
                            <p className="text-sm text-gray-600">
                              แหล่งฝึกงาน เทคโนโลยีดิจิทัล จำกัด
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              กรุงเทพมหานคร • เงินเดือน 15,000 บาท
                            </p>
                          </div>
                          <Link href="/dashboard/jobs/1">
                            <Button size="sm">ดูรายละเอียด</Button>
                          </Link>
                        </div>
                      </div>

                      <div className="border p-4 rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              นักพัฒนาแอปพลิเคชัน (Mobile Developer)
                            </h3>
                            <p className="text-sm text-gray-600">
                              แหล่งฝึกงาน แอพพลิเคชั่น จำกัด
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              เชียงใหม่ • เงินเดือน 13,000 บาท
                            </p>
                          </div>
                          <Link href="/dashboard/jobs/2">
                            <Button size="sm">ดูรายละเอียด</Button>
                          </Link>
                        </div>
                      </div>

                      <div className="border p-4 rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              ผู้ช่วยนักวิเคราะห์ข้อมูล (Data Analyst)
                            </h3>
                            <p className="text-sm text-gray-600">
                              แหล่งฝึกงาน ดาต้า อินไซต์ จำกัด
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              กรุงเทพมหานคร • เงินเดือน 14,000 บาท
                            </p>
                          </div>
                          <Link href="/dashboard/jobs/3">
                            <Button size="sm">ดูรายละเอียด</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="announcements">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ประกาศล่าสุด</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="font-medium">
                          การปฐมนิเทศนักศึกษาฝึกงาน ประจำปีการศึกษา 2025
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          วันที่ 20 เมษายน 2025 เวลา 09:00-12:00 น. ณ
                          ห้องประชุมคณะ
                        </p>
                        <p className="text-sm mt-2">
                          ขอเชิญนักศึกษาที่ลงทะเบียนฝึกงานทุกท่านเข้าร่วมการปฐมนิเทศ
                          เพื่อรับทราบข้อมูลสำคัญและแนวทางการปฏิบัติงาน
                        </p>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="font-medium">
                          กำหนดส่งเอกสารสมัครงานฝึกงาน
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          ภายในวันที่ 15 เมษายน 2025
                        </p>
                        <p className="text-sm mt-2">
                          นักศึกษาที่ประสงค์จะออกปฏิบัติงานฝึกงานในภาคการศึกษาที่
                          1/2025 กรุณาส่งเอกสารการสมัครงานภายในวันที่กำหนด
                        </p>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="font-medium">
                          การอบรมเตรียมความพร้อมก่อนออกปฏิบัติงานฝึกงาน
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          วันที่ 25-26 เมษายน 2025
                        </p>
                        <p className="text-sm mt-2">
                          การอบรมจะจัดขึ้นในรูปแบบออนไลน์ผ่านระบบ Zoom
                          นักศึกษาทุกคนต้องเข้าร่วมการอบรมครบทั้ง 2 วัน
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      ปฏิทินกิจกรรมฝึกงาน
                    </CardTitle>
                    <CardDescription>ภาคการศึกษาที่ 1/2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                        <div className="text-center min-w-[60px]">
                          <div className="font-bold">15</div>
                          <div className="text-xs">เม.ย.</div>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            วันสุดท้ายของการส่งเอกสารสมัครงาน
                          </h3>
                          <p className="text-sm text-gray-600">
                            ส่งเอกสารที่ห้องฝึกงาน หรือผ่านระบบออนไลน์
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 border-l-4 border-green-500 bg-green-50 rounded-r-md">
                        <div className="text-center min-w-[60px]">
                          <div className="font-bold">20</div>
                          <div className="text-xs">เม.ย.</div>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            ปฐมนิเทศนักศึกษาฝึกงาน
                          </h3>
                          <p className="text-sm text-gray-600">
                            เวลา 09:00-12:00 น. ณ ห้องประชุมคณะ
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 border-l-4 border-purple-500 bg-purple-50 rounded-r-md">
                        <div className="text-center min-w-[60px]">
                          <div className="font-bold">25-26</div>
                          <div className="text-xs">เม.ย.</div>
                        </div>
                        <div>
                          <h3 className="font-medium">อบรมเตรียมความพร้อม</h3>
                          <p className="text-sm text-gray-600">
                            อบรมออนไลน์ผ่าน Zoom เวลา 09:00-16:00 น.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-md">
                        <div className="text-center min-w-[60px]">
                          <div className="font-bold">1</div>
                          <div className="text-xs">มิ.ย.</div>
                        </div>
                        <div>
                          <h3 className="font-medium">เริ่มปฏิบัติงานฝึกงาน</h3>
                          <p className="text-sm text-gray-600">
                            นักศึกษารายงานตัวที่แหล่งฝึกงาน
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 border-l-4 border-red-500 bg-red-50 rounded-r-md">
                        <div className="text-center min-w-[60px]">
                          <div className="font-bold">30</div>
                          <div className="text-xs">ก.ย.</div>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            สิ้นสุดการปฏิบัติงานฝึกงาน
                          </h3>
                          <p className="text-sm text-gray-600">
                            ส่งรายงานฉบับสมบูรณ์และนำเสนอผลงาน
                          </p>
                        </div>
                      </div>
                    </div>
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
