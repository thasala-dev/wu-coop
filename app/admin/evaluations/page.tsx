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
  const [activeTab, setActiveTab] = useState("all");
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

  // ฟังก์ชันกรองรายการตาม tab ที่เลือก
  const getFilteredEvaluations = () => {
    if (activeTab === "all") {
      return evalationList;
    } else {
      return evalationList.filter((item: any) => item.group === activeTab);
    }
  };

  // แสดงจำนวนรายการในแต่ละกลุ่ม
  const getGroupCount = (group: string) => {
    if (group === "all") {
      return evalationList.length;
    }
    return evalationList.filter((item: any) => item.group === group).length;
  };

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
              {/* <Link href="/admin/evaluations/new">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  สร้างแบบประเมินใหม่
                </Button>
              </Link> */}
            </div>

            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all" className="relative">
                  ทั้งหมด
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">
                    {getGroupCount("all")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="CARE" className="relative">
                  CARE
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium">
                    {getGroupCount("CARE")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="SCI" className="relative">
                  SCI
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium">
                    {getGroupCount("SCI")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="SOCIAL_CARE" className="relative">
                  SOCIAL CARE
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-xs font-medium">
                    {getGroupCount("SOCIAL_CARE")}
                  </span>
                </TabsTrigger>
              </TabsList>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "all"
                      ? "แบบประเมินทั้งหมด"
                      : `แบบประเมิน ${activeTab}`}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "all"
                      ? "รายการแบบประเมินทั้งหมดในระบบ"
                      : `รายการแบบประเมินกลุ่ม ${activeTab}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                    ) : getFilteredEvaluations().length === 0 ? (
                      <div className="text-center py-12">
                        <ClipboardCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">
                          ไม่พบแบบประเมิน
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {activeTab === "all"
                            ? "ยังไม่มีแบบประเมินในระบบ"
                            : `ยังไม่มีแบบประเมินในกลุ่ม ${activeTab}`}
                        </p>
                      </div>
                    ) : (
                      getFilteredEvaluations().map((item: any, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex-shrink-0 h-10 w-10 bg-${
                                  item.group === "CARE"
                                    ? "blue"
                                    : item.group === "SCI"
                                    ? "green"
                                    : item.group === "SOCIAL_CARE"
                                    ? "purple"
                                    : "gray"
                                }-100 rounded-md flex items-center justify-center`}
                              >
                                <ClipboardCheckIcon
                                  className={`h-5 w-5 text-${
                                    item.group === "CARE"
                                      ? "blue"
                                      : item.group === "SCI"
                                      ? "green"
                                      : item.group === "SOCIAL_CARE"
                                      ? "purple"
                                      : "gray"
                                  }-600`}
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{item.name}</h3>
                                  <Badge
                                    variant="outline"
                                    className={
                                      item.group === "CARE"
                                        ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                        : item.group === "SCI"
                                        ? "bg-green-50 text-green-700 hover:bg-green-50"
                                        : item.group === "SOCIAL_CARE"
                                        ? "bg-purple-50 text-purple-700 hover:bg-purple-50"
                                        : "bg-gray-50 text-gray-700 hover:bg-gray-50"
                                    }
                                  >
                                    {item.group === "CARE"
                                      ? "CARE"
                                      : item.group === "SCI"
                                      ? "SCI"
                                      : item.group === "SOCIAL_CARE"
                                      ? "SOCIAL CARE"
                                      : "อื่นๆ"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {Array.isArray(item.form)
                                    ? `${item.form.length} หัวข้อการประเมิน`
                                    : "0 หัวข้อการประเมิน"}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <span className="text-xs text-gray-500">
                                    แก้ไขล่าสุด:{" "}
                                    {new Date(
                                      item.updated_at
                                    ).toLocaleDateString("th-TH", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}{" "}
                                    • ใช้งาน: {item.total_regist || 0} ครั้ง
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {/* <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              ดูตัวอย่าง
                            </Button> */}
                              <Link href={`/admin/evaluations/${item.id}`}>
                                <Button variant="outline" size="sm">
                                  <FileEditIcon className="h-4 w-4 mr-1" />
                                  แก้ไข
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
