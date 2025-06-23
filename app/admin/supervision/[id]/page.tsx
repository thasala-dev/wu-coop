"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  User,
  Building,
  Edit,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Image from "next/image";

// ข้อมูลตัวอย่าง
const mockSupervision = {
  id: 1,
  student: {
    id: 101,
    name: "นายทดสอบ ระบบ",
    student_id: "64000001",
    program: "วิศวกรรมซอฟต์แวร์",
    faculty: "วิทยาศาสตร์และเทคโนโลยี",
  },
  company: {
    id: 201,
    name: "บริษัท เอบีซี จำกัด",
    address: "123 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900",
    contact_person: "คุณสมหมาย ใจดี",
    contact_phone: "02-123-4567",
    contact_email: "sommai@abc.co.th",
  },
  advisor: {
    id: 301,
    name: "อาจารย์ใจดี มากมาย",
    phone: "081-234-5678",
    email: "jaidee@university.ac.th",
  },
  scheduled_date: "2025-06-28",
  status: 1, // 1=รอดำเนินการ
  details: {
    visit_date: null,
    start_time: null,
    end_time: null,
    activity_details: "",
    student_performance: "",
    mentor_feedback: "",
    advisor_feedback: "",
    issues: "",
    next_goals: "",
  },
  photos: [],
};

// ข้อมูลตัวอย่างสำหรับการนิเทศที่เสร็จสิ้นแล้ว
const mockCompletedSupervision = {
  id: 2,
  student: {
    id: 102,
    name: "นางสาวสมศรี เรียนดี",
    student_id: "64000002",
    program: "วิทยาการคอมพิวเตอร์",
    faculty: "วิทยาศาสตร์และเทคโนโลยี",
  },
  company: {
    id: 202,
    name: "บริษัท เทคโนโลยีไทย จำกัด",
    address: "456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
    contact_person: "คุณมานี รักงาน",
    contact_phone: "02-987-6543",
    contact_email: "manee@thaitech.co.th",
  },
  advisor: {
    id: 302,
    name: "ผศ.ดร.สมชาย สอนเก่ง",
    phone: "089-876-5432",
    email: "somchai@university.ac.th",
  },
  scheduled_date: "2025-06-18",
  status: 2, // 2=เสร็จสิ้น
  details: {
    visit_date: "2025-06-18",
    start_time: "10:00:00",
    end_time: "12:00:00",
    activity_details:
      "พบนักศึกษาและพี่เลี้ยง ตรวจเยี่ยมสถานประกอบการ ติดตามความคืบหน้าโครงงาน และให้คำแนะนำการทำงาน",
    student_performance:
      "นักศึกษามีความรับผิดชอบในงานที่ได้รับมอบหมาย มีความตรงต่อเวลา และสามารถทำงานร่วมกับทีมได้ดี",
    mentor_feedback:
      "นักศึกษามีความกระตือรือร้นในการเรียนรู้ สามารถปรับตัวเข้ากับทีมได้เร็ว แต่ควรพัฒนาทักษะการสื่อสารให้มากขึ้น",
    advisor_feedback:
      "นักศึกษามีพัฒนาการที่ดี ควรฝึกฝนทักษะการนำเสนอและการสื่อสารให้มากขึ้น รวมถึงเรียนรู้เทคโนโลยีใหม่ๆ ที่เกี่ยวข้องกับงาน",
    issues:
      "นักศึกษายังไม่คุ้นเคยกับการใช้เครื่องมือบางอย่างในการพัฒนาซอฟต์แวร์",
    next_goals:
      "ฝึกฝนการใช้ Git และ CI/CD ให้คล่องมากขึ้น พัฒนาทักษะการนำเสนอโดยการฝึกซ้อมก่อนนำเสนองาน",
  },
  photos: [
    {
      id: 1,
      supervision_id: 2,
      photo_path: "/placeholder.jpg",
      description: "การประชุมร่วมกับทีมพี่เลี้ยง",
    },
    {
      id: 2,
      supervision_id: 2,
      photo_path: "/placeholder.jpg",
      description: "นักศึกษานำเสนอความคืบหน้าโครงงาน",
    },
  ],
};

export default function SupervisionDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [supervision, setSupervision] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupervisionDetail();
  }, []);

  const fetchSupervisionDetail = async () => {
    setLoading(true);
    try {
      // ในอนาคตจะใช้ API จริง
      // const response = await fetch(`/api/supervision/${id}`);
      // const data = await response.json();
      // if (data.success) {
      //   setSupervision(data.data);
      // }

      // จำลองการดึงข้อมูล
      setTimeout(() => {
        // สำหรับการทดสอบ แสดงข้อมูลการนิเทศที่เสร็จสิ้นแล้ว
        setSupervision(id === "2" ? mockCompletedSupervision : mockSupervision);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching supervision detail:", error);
      setLoading(false);
    }
  };

  // ฟังก์ชั่นแปลง Date เป็น String ในรูปแบบไทย
  const formatToThaiDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: th });
  };

  // ฟังก์ชั่นแสดงสถานะการนิเทศ
  const renderStatus = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-yellow-500">รอดำเนินการ</Badge>;
      case 2:
        return <Badge className="bg-green-500">เสร็จสิ้น</Badge>;
      case 3:
        return <Badge className="bg-red-500">ยกเลิก</Badge>;
      default:
        return <Badge className="bg-gray-500">ไม่ระบุ</Badge>;
    }
  };

  // ฟังก์ชั่นแปลงเวลา
  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!supervision) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">ไม่พบข้อมูลการนิเทศ</h2>
          <Button asChild>
            <Link href="/admin/supervision">กลับไปยังรายการการนิเทศ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-0 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="supervision" userType="admin" />

          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <a href="/admin/supervision">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/supervision" className="hover:text-gray-900">
                  การนิเทศ
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">รายละเอียดการนิเทศ</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">รายละเอียดการนิเทศ</h1>

              <div className="flex gap-2">
                {supervision.status === 1 && (
                  <Link
                    href={`/advisor/visits/record/${supervision.id}`}
                    passHref
                  >
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      บันทึกการนิเทศ
                    </Button>
                  </Link>
                )}
                <Link
                  href={`/admin/supervision/edit/${supervision.id}`}
                  passHref
                >
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    แก้ไข
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>ข้อมูลการนิเทศ</CardTitle>
                  <div>{renderStatus(supervision.status)}</div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      รายละเอียดการนิเทศ
                    </h3>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="font-medium text-gray-500">
                        วันที่นัดหมาย:
                      </div>
                      <div className="col-span-2">
                        {formatToThaiDate(supervision.scheduled_date)}
                      </div>

                      {supervision.status === 2 &&
                        supervision.details.visit_date && (
                          <>
                            <div className="font-medium text-gray-500">
                              วันที่นิเทศจริง:
                            </div>
                            <div className="col-span-2">
                              {formatToThaiDate(supervision.details.visit_date)}
                            </div>

                            <div className="font-medium text-gray-500">
                              เวลาเริ่มต้น:
                            </div>
                            <div className="col-span-2">
                              {formatTime(supervision.details.start_time)} น.
                            </div>

                            <div className="font-medium text-gray-500">
                              เวลาสิ้นสุด:
                            </div>
                            <div className="col-span-2">
                              {formatTime(supervision.details.end_time)} น.
                            </div>
                          </>
                        )}
                    </div>

                    <h3 className="text-lg font-medium flex items-center mt-6">
                      <User className="h-5 w-5 mr-2 text-blue-500" />
                      นักศึกษา
                    </h3>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="font-medium text-gray-500">
                        ชื่อ-นามสกุล:
                      </div>
                      <div className="col-span-2">
                        {supervision.student.name}
                      </div>

                      <div className="font-medium text-gray-500">
                        รหัสนักศึกษา:
                      </div>
                      <div className="col-span-2">
                        {supervision.student.student_id}
                      </div>

                      <div className="font-medium text-gray-500">หลักสูตร:</div>
                      <div className="col-span-2">
                        {supervision.student.program}
                      </div>

                      <div className="font-medium text-gray-500">คณะ:</div>
                      <div className="col-span-2">
                        {supervision.student.faculty}
                      </div>
                    </div>

                    <h3 className="text-lg font-medium flex items-center mt-6">
                      <User className="h-5 w-5 mr-2 text-blue-500" />
                      อาจารย์นิเทศ
                    </h3>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="font-medium text-gray-500">
                        ชื่อ-นามสกุล:
                      </div>
                      <div className="col-span-2">
                        {supervision.advisor.name}
                      </div>

                      <div className="font-medium text-gray-500">
                        เบอร์โทรศัพท์:
                      </div>
                      <div className="col-span-2">
                        {supervision.advisor.phone}
                      </div>

                      <div className="font-medium text-gray-500">อีเมล:</div>
                      <div className="col-span-2">
                        {supervision.advisor.email}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-500" />
                      สถานประกอบการ
                    </h3>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="font-medium text-gray-500">
                        ชื่อบริษัท:
                      </div>
                      <div className="col-span-2">
                        {supervision.company.name}
                      </div>

                      <div className="font-medium text-gray-500">ที่อยู่:</div>
                      <div className="col-span-2">
                        {supervision.company.address}
                      </div>

                      <div className="font-medium text-gray-500">
                        ผู้ประสานงาน:
                      </div>
                      <div className="col-span-2">
                        {supervision.company.contact_person}
                      </div>

                      <div className="font-medium text-gray-500">
                        เบอร์โทรศัพท์:
                      </div>
                      <div className="col-span-2">
                        {supervision.company.contact_phone}
                      </div>

                      <div className="font-medium text-gray-500">อีเมล:</div>
                      <div className="col-span-2">
                        {supervision.company.contact_email}
                      </div>
                    </div>
                  </div>
                </div>

                {supervision.status === 2 && (
                  <>
                    <Separator className="my-6" />

                    <div className="mt-6">
                      <Tabs defaultValue="detail" className="w-full">
                        <TabsList className="grid grid-cols-2 mb-6">
                          <TabsTrigger value="detail">
                            รายละเอียดการนิเทศ
                          </TabsTrigger>
                          <TabsTrigger value="photos">
                            ภาพถ่ายการนิเทศ
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="detail">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2">
                                รายละเอียดกิจกรรม
                              </h3>
                              <p className="text-gray-700">
                                {supervision.details.activity_details || "-"}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">
                                การปฏิบัติงานของนักศึกษา
                              </h3>
                              <p className="text-gray-700">
                                {supervision.details.student_performance || "-"}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">
                                ข้อเสนอแนะจากพี่เลี้ยง
                              </h3>
                              <p className="text-gray-700">
                                {supervision.details.mentor_feedback || "-"}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">
                                ข้อเสนอแนะจากอาจารย์
                              </h3>
                              <p className="text-gray-700">
                                {supervision.details.advisor_feedback || "-"}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">
                                ปัญหาที่พบ
                              </h3>
                              <p className="text-gray-700">
                                {supervision.details.issues || "-"}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">
                                เป้าหมายในการดำเนินการต่อไป
                              </h3>
                              <p className="text-gray-700">
                                {supervision.details.next_goals || "-"}
                              </p>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="photos">
                          {supervision.photos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {supervision.photos.map((photo: any) => (
                                <div
                                  key={photo.id}
                                  className="border rounded-lg overflow-hidden"
                                >
                                  <div className="relative h-48 w-full">
                                    <Image
                                      src={photo.photo_path}
                                      alt={photo.description || "ภาพการนิเทศ"}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="p-3 bg-gray-50">
                                    <p className="text-sm">
                                      {photo.description || "ไม่มีคำอธิบาย"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                              <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
                              <p>ไม่มีภาพถ่ายการนิเทศ</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
