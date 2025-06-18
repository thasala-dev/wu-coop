"use client";
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
import { BuildingIcon, FileSpreadsheetIcon } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    currentCalendar: null,
    data: [],
  });
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    setLoading(true);
    const response = await fetch("/api/admin/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const res = await response.json();
    if (res.success) {
      setData({
        currentCalendar: res.currentCalendar,
        data: res.data,
      });
      setLoading(false);
    }
    console.log("Dashboard Data:", data);
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="dashboard" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
                <TabsTrigger value="cycles">รอบสหกิจศึกษา</TabsTrigger>
                <TabsTrigger value="stats">สถิติ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">รอบปัจจุบัน</CardTitle>
                      <CardDescription>
                        ภาคการศึกษาที่ {data.currentCalendar?.semester}/
                        {data.currentCalendar?.year}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {data.currentCalendar?.name}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(
                          data.currentCalendar?.start_date
                        ).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(
                          data.currentCalendar?.end_date
                        ).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                        <div>
                          <div className="font-medium">นักศึกษา</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {data.currentCalendar?.total_intern}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">บริษัท</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {data.currentCalendar?.total_regist}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">นักศึกษาในระบบ</CardTitle>
                      <CardDescription>แบ่งตามสถานะ</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>รอการจับคู่</span>
                          <span className="font-bold">24</span>
                        </div>
                        <div className="flex justify-between">
                          <span>จับคู่แล้ว</span>
                          <span className="font-bold">96</span>
                        </div>
                        <div className="flex justify-between">
                          <span>กำลังฝึกงาน</span>
                          <span className="font-bold">118</span>
                        </div>
                        <div className="flex justify-between">
                          <span>เสร็จสิ้นแล้ว</span>
                          <span className="font-bold">0</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t">
                        <Link href="/admin/students">
                          <Button variant="ghost" size="sm" className="w-full">
                            ดูทั้งหมด
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        ภาระงานที่ต้องตรวจสอบ
                      </CardTitle>
                      <CardDescription>ต้องการการดำเนินการ</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>คำขอการจับคู่</span>
                          <span className="font-bold text-orange-500">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>เอกสารรอตรวจสอบ</span>
                          <span className="font-bold text-orange-500">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span>รายงานความก้าวหน้า</span>
                          <span className="font-bold text-orange-500">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ข้อความรอตอบ</span>
                          <span className="font-bold text-orange-500">3</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t">
                        <Link href="/admin/tasks">
                          <Button variant="ghost" size="sm" className="w-full">
                            ดูทั้งหมด
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        บริษัทล่าสุดที่เข้าร่วม
                      </CardTitle>
                      <CardDescription>
                        อัพเดทล่าสุด: 5 วันที่ผ่านมา
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <BuildingIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">
                              บริษัท เทคโนโลยีชั้นนำ จำกัด
                            </div>
                            <div className="text-sm text-gray-500">
                              4 ตำแหน่งงาน • 6 นักศึกษา
                            </div>
                          </div>
                          <Link href="/admin/companies/1">
                            <Button variant="ghost" size="sm">
                              ดูข้อมูล
                            </Button>
                          </Link>
                        </div>
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <BuildingIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">
                              บริษัท ออโตเมชั่น โซลูชั่น จำกัด
                            </div>
                            <div className="text-sm text-gray-500">
                              2 ตำแหน่งงาน • 3 นักศึกษา
                            </div>
                          </div>
                          <Link href="/admin/companies/2">
                            <Button variant="ghost" size="sm">
                              ดูข้อมูล
                            </Button>
                          </Link>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <BuildingIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">
                              บริษัท ดาต้า แอนาไลติกส์ จำกัด
                            </div>
                            <div className="text-sm text-gray-500">
                              1 ตำแหน่งงาน • 2 นักศึกษา
                            </div>
                          </div>
                          <Link href="/admin/companies/3">
                            <Button variant="ghost" size="sm">
                              ดูข้อมูล
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t">
                        <Link href="/admin/companies">
                          <Button variant="ghost" size="sm" className="w-full">
                            ดูบริษัททั้งหมด
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">กำหนดการสำคัญ</CardTitle>
                      <CardDescription>ภาคการศึกษาที่ 1/2567</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-3 p-3 border-l-4 border-green-500 bg-green-50 rounded-r-md">
                          <div className="text-center min-w-[60px]">
                            <div className="font-bold">25</div>
                            <div className="text-xs">พ.ค. 67</div>
                          </div>
                          <div>
                            <h3 className="font-medium">
                              จับคู่นักศึกษากับบริษัท
                            </h3>
                            <p className="text-sm text-gray-600">
                              กำหนดจับคู่และประกาศผล
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                          <div className="text-center min-w-[60px]">
                            <div className="font-bold">1</div>
                            <div className="text-xs">มิ.ย. 67</div>
                          </div>
                          <div>
                            <h3 className="font-medium">
                              เริ่มปฏิบัติงานสหกิจศึกษา
                            </h3>
                            <p className="text-sm text-gray-600">
                              นักศึกษาเริ่มฝึกงานที่บริษัท
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 p-3 border-l-4 border-purple-500 bg-purple-50 rounded-r-md">
                          <div className="text-center min-w-[60px]">
                            <div className="font-bold">15</div>
                            <div className="text-xs">ก.ค. 67</div>
                          </div>
                          <div>
                            <h3 className="font-medium">
                              กำหนดส่งรายงานความก้าวหน้า
                            </h3>
                            <p className="text-sm text-gray-600">
                              รายงานความก้าวหน้าครั้งที่ 1
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t">
                        <Link href="/admin/calendar">
                          <Button variant="ghost" size="sm" className="w-full">
                            ดูปฏิทินทั้งหมด
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="cycles">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">รอบสหกิจศึกษา</CardTitle>
                      <CardDescription>
                        จัดการรอบสหกิจศึกษาทั้งหมด
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                              กำลังดำเนินการ
                            </span>
                            <h3 className="text-lg font-medium">
                              ภาคการศึกษาที่ 1/2567
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              1 มิถุนายน - 30 กันยายน 2567
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-sm text-gray-600">
                                นักศึกษา: 142 คน
                              </span>
                              <span className="text-sm text-gray-600">
                                บริษัท: 38 แห่ง
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              แก้ไข
                            </Button>
                            <Button size="sm">จัดการ</Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mb-2">
                              เตรียมการ
                            </span>
                            <h3 className="text-lg font-medium">
                              ภาคการศึกษาที่ 2/2567
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              1 พฤศจิกายน 2567 - 28 กุมภาพันธ์ 2568
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-sm text-gray-600">
                                นักศึกษา: 92 คน
                              </span>
                              <span className="text-sm text-gray-600">
                                บริษัท: 25 แห่ง
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              แก้ไข
                            </Button>
                            <Button size="sm">จัดการ</Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-2">
                              เสร็จสิ้น
                            </span>
                            <h3 className="text-lg font-medium">
                              ภาคการศึกษาที่ 2/2566
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              1 พฤศจิกายน 2566 - 28 กุมภาพันธ์ 2567
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-sm text-gray-600">
                                นักศึกษา: 128 คน
                              </span>
                              <span className="text-sm text-gray-600">
                                บริษัท: 35 แห่ง
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              ดูรายงาน
                            </Button>
                            <Button variant="ghost" size="sm">
                              จัดการ
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-2">
                              เสร็จสิ้น
                            </span>
                            <h3 className="text-lg font-medium">
                              ภาคการศึกษาที่ 1/2566
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              1 มิถุนายน - 30 กันยายน 2566
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-sm text-gray-600">
                                นักศึกษา: 135 คน
                              </span>
                              <span className="text-sm text-gray-600">
                                บริษัท: 32 แห่ง
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              ดูรายงาน
                            </Button>
                            <Button variant="ghost" size="sm">
                              จัดการ
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">สถิติและรายงาน</CardTitle>
                    <CardDescription>ข้อมูลสถิติและรายงานสรุป</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">
                          อัตราส่วนผ่าน/ไม่ผ่านสหกิจศึกษา
                        </h3>
                        <div className="h-52 bg-gray-100 rounded-md flex items-center justify-center">
                          <div className="text-center">
                            <div className="font-medium text-gray-500">
                              แผนภูมิแท่งแสดงสถิตินักศึกษา
                            </div>
                            <div className="text-sm text-gray-400">
                              ผ่าน/ไม่ผ่านสหกิจศึกษา
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">
                          การกระจายตัวของนักศึกษาตามสาขา
                        </h3>
                        <div className="h-52 bg-gray-100 rounded-md flex items-center justify-center">
                          <div className="text-center">
                            <div className="font-medium text-gray-500">
                              แผนภูมิวงกลมแสดงสัดส่วน
                            </div>
                            <div className="text-sm text-gray-400">
                              นักศึกษาแต่ละสาขา
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-lg mb-3">รายงานสรุป</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <span className="font-medium">
                            รายงานผลการประเมินนักศึกษา
                          </span>
                          <Button variant="outline" size="sm">
                            <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                            ส่งออก Excel
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <span className="font-medium">
                            รายงานสรุปบริษัทและตำแหน่งงาน
                          </span>
                          <Button variant="outline" size="sm">
                            <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                            ส่งออก Excel
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <span className="font-medium">
                            รายงานการนิเทศนักศึกษา
                          </span>
                          <Button variant="outline" size="sm">
                            <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                            ส่งออก Excel
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button>
                        <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                        ส่งออกรายงานทั้งหมด
                      </Button>
                      <Button variant="outline">สร้างรายงานใหม่</Button>
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
