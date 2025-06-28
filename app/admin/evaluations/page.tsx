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
import { Badge } from "@/components/ui/badge";
import {
  Plus as PlusIcon,
  FileEdit as FileEditIcon,
  Eye as EyeIcon,
  Trash as TrashIcon,
  ClipboardCheck as ClipboardCheckIcon,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

export default function AdminEvaluations() {
  const [loading, setLoading] = useState(true);
  const [evalationList, setEvalationList] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const response = await fetch(`/api/evaluations_type`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (res.success) {
      setEvalationList(res.data);
    }
    setLoading(false);
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="evaluations" userType="admin" />

          <div className="md:col-span-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-xl font-bold">แบบประเมิน</h1>
                <p className="text-gray-500">จัดการแบบประเมินทั้งหมดในระบบ</p>
              </div>
              <Link href="/admin/evaluations/new">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  สร้างแบบประเมินใหม่
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="student">นักศึกษา</TabsTrigger>
                <TabsTrigger value="advisor">อาจารย์</TabsTrigger>
                <TabsTrigger value="mentor">แหล่งฝึก</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>แบบประเมินทั้งหมด</CardTitle>
                    <CardDescription>
                      รายการแบบประเมินทั้งหมดในระบบ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {evalationList.map((item: any, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                                <ClipboardCheckIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{item.name}</h3>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                                  >
                                    แหล่งฝึก
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  สำหรับแหล่งฝึกประเมินนักศึกษา •{" "}
                                  {"10 หัวข้อการประเมิน"}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <span className="text-xs text-gray-500">
                                    แก้ไขล่าสุด: 15 พ.ค. 2567
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ใช้งาน: 38 ครั้ง
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <EyeIcon className="h-4 w-4 mr-1" />
                                ดูตัวอย่าง
                              </Button>
                              <Button variant="outline" size="sm">
                                <FileEditIcon className="h-4 w-4 mr-1" />
                                แก้ไข
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-500 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* แบบประเมินที่ 1
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                              <ClipboardCheckIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  แบบประเมินผลการปฏิบัติงานนักศึกษาฝึกงาน
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                                >
                                  แหล่งฝึก
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                สำหรับแหล่งฝึกประเมินนักศึกษา •{" "}
                                {"10 หัวข้อการประเมิน"}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  แก้ไขล่าสุด: 15 พ.ค. 2567
                                </span>
                                <span className="text-xs text-gray-500">
                                  ใช้งาน: 38 ครั้ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดูตัวอย่าง
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileEditIcon className="h-4 w-4 mr-1" />
                              แก้ไข
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                     
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                              <ClipboardCheckIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  แบบประเมินรายงานฝึกงาน
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 hover:bg-green-50"
                                >
                                  อาจารย์
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                สำหรับอาจารย์ประเมินรายงาน •{" "}
                                {"8 หัวข้อการประเมิน"}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  แก้ไขล่าสุด: 10 พ.ค. 2567
                                </span>
                                <span className="text-xs text-gray-500">
                                  ใช้งาน: 25 ครั้ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดูตัวอย่าง
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileEditIcon className="h-4 w-4 mr-1" />
                              แก้ไข
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                   
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                              <ClipboardCheckIcon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  แบบประเมินตนเองของนักศึกษา
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-purple-50 text-purple-700 hover:bg-purple-50"
                                >
                                  นักศึกษา
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                สำหรับนักศึกษาประเมินตนเอง •{" "}
                                {"12 หัวข้อการประเมิน"}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  แก้ไขล่าสุด: 5 พ.ค. 2567
                                </span>
                                <span className="text-xs text-gray-500">
                                  ใช้งาน: 142 ครั้ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดูตัวอย่าง
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileEditIcon className="h-4 w-4 mr-1" />
                              แก้ไข
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

               
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-md flex items-center justify-center">
                              <ClipboardCheckIcon className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  แบบประเมินแหล่งฝึกงาน
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-orange-50 text-orange-700 hover:bg-orange-50"
                                >
                                  นักศึกษา
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                สำหรับนักศึกษาประเมินแหล่งฝึกงาน •{" "}
                                {"8 หัวข้อการประเมิน"}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  แก้ไขล่าสุด: 1 พ.ค. 2567
                                </span>
                                <span className="text-xs text-gray-500">
                                  ใช้งาน: 118 ครั้ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดูตัวอย่าง
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileEditIcon className="h-4 w-4 mr-1" />
                              แก้ไข
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="student">
                <Card>
                  <CardHeader>
                    <CardTitle>แบบประเมินสำหรับนักศึกษา</CardTitle>
                    <CardDescription>
                      แบบประเมินที่นักศึกษาต้องทำ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* แบบประเมินนักศึกษาที่ 1 */}
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                              <ClipboardCheckIcon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  แบบประเมินตนเองของนักศึกษา
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-purple-50 text-purple-700 hover:bg-purple-50"
                                >
                                  นักศึกษา
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                สำหรับนักศึกษาประเมินตนเอง •{" "}
                                {"12 หัวข้อการประเมิน"}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  แก้ไขล่าสุด: 5 พ.ค. 2567
                                </span>
                                <span className="text-xs text-gray-500">
                                  ใช้งาน: 142 ครั้ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดูตัวอย่าง
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileEditIcon className="h-4 w-4 mr-1" />
                              แก้ไข
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* แบบประเมินนักศึกษาที่ 2 */}
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-md flex items-center justify-center">
                              <ClipboardCheckIcon className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  แบบประเมินแหล่งฝึกงาน
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-orange-50 text-orange-700 hover:bg-orange-50"
                                >
                                  นักศึกษา
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                สำหรับนักศึกษาประเมินแหล่งฝึกงาน •{" "}
                                {"8 หัวข้อการประเมิน"}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  แก้ไขล่าสุด: 1 พ.ค. 2567
                                </span>
                                <span className="text-xs text-gray-500">
                                  ใช้งาน: 118 ครั้ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดูตัวอย่าง
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileEditIcon className="h-4 w-4 mr-1" />
                              แก้ไข
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advisor">
                <Card>
                  <CardHeader>
                    <CardTitle>แบบประเมินสำหรับอาจารย์</CardTitle>
                    <CardDescription>
                      แบบประเมินที่อาจารย์ต้องทำ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* แบบประเมินอาจารย์ที่ 1 */}
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                              <ClipboardCheckIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  แบบประเมินรายงานฝึกงาน
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 hover:bg-green-50"
                                >
                                  อาจารย์
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                สำหรับอาจารย์ประเมินรายงาน •{" "}
                                {"8 หัวข้อการประเมิน"}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  แก้ไขล่าสุด: 10 พ.ค. 2567
                                </span>
                                <span className="text-xs text-gray-500">
                                  ใช้งาน: 25 ครั้ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดูตัวอย่าง
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileEditIcon className="h-4 w-4 mr-1" />
                              แก้ไข
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mentor">
                <Card>
                  <CardHeader>
                    <CardTitle>แบบประเมินสำหรับแหล่งฝึก</CardTitle>
                    <CardDescription>
                      แบบประเมินที่แหล่งฝึกต้องทำ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* แบบประเมินแหล่งฝึกที่ 1 */}
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                              <ClipboardCheckIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  แบบประเมินผลการปฏิบัติงานนักศึกษาฝึกงาน
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                                >
                                  แหล่งฝึก
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                สำหรับแหล่งฝึกประเมินนักศึกษา •{" "}
                                {"10 หัวข้อการประเมิน"}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  แก้ไขล่าสุด: 15 พ.ค. 2567
                                </span>
                                <span className="text-xs text-gray-500">
                                  ใช้งาน: 38 ครั้ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดูตัวอย่าง
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileEditIcon className="h-4 w-4 mr-1" />
                              แก้ไข
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
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
