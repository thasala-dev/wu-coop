"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  Edit,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/sidebar";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

interface SupervisionDetail {
  id: number;
  regist_intern_id: number;
  advisor_id: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  visit_type: string;
  comments: string;
  status: number;
  created_at: string;
  updated_at: string;
  
  // Regist Intern info
  ri_id: number;
  ri_student_id: number;
  ri_calendar_id: number;
  ri_company_id: number;

  // Student info
  student_name: string;
  student_code: string;
  student_faculty: string;
  student_major: string;
  student_mobile: string;
  student_email: string;

  // Advisor info
  advisor_name: string;
  advisor_mobile: string;
  advisor_email: string;

  // Company info
  company_name: string;
  company_address: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
}

export default function SupervisionDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const [supervision, setSupervision] = useState<SupervisionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupervisionDetail();
  }, []);

  const fetchSupervisionDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/supervision/${id}`);
      const data = await response.json();

      if (data.success) {
        setSupervision(data.data);
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่พบข้อมูลการนิเทศที่ต้องการ",
          variant: "destructive",
        });
        router.push("/admin/supervision");
      }
    } catch (error) {
      console.error("Error fetching supervision detail:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลการนิเทศได้",
        variant: "destructive",
      });
    } finally {
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
  
  // ฟังก์ชั่นแปลงประเภทการนิเทศ
  const renderVisitType = (type: string) => {
    switch (type) {
      case "onsite":
        return "นิเทศ ณ สถานประกอบการ";
      case "online":
        return "นิเทศออนไลน์";
      case "hybrid":
        return "นิเทศแบบผสมผสาน";
      default:
        return "ไม่ระบุ";
    }
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

                      <div className="font-medium text-gray-500">
                        เวลาเริ่มต้น:
                      </div>
                      <div className="col-span-2">
                        {formatTime(supervision.start_time)} น.
                      </div>

                      <div className="font-medium text-gray-500">
                        เวลาสิ้นสุด:
                      </div>
                      <div className="col-span-2">
                        {formatTime(supervision.end_time)} น.
                      </div>
                      
                      <div className="font-medium text-gray-500">
                        ประเภทการนิเทศ:
                      </div>
                      <div className="col-span-2">
                        {renderVisitType(supervision.visit_type)}
                      </div>
                      
                      <div className="font-medium text-gray-500">
                        หมายเหตุ:
                      </div>
                      <div className="col-span-2">
                        {supervision.comments || "-"}
                      </div>
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
                        {supervision.student_name || "-"}
                      </div>

                      <div className="font-medium text-gray-500">
                        รหัสนักศึกษา:
                      </div>
                      <div className="col-span-2">
                        {supervision.student_code || "-"}
                      </div>

                      <div className="font-medium text-gray-500">สาขาวิชา:</div>
                      <div className="col-span-2">
                        {supervision.student_major || "-"}
                      </div>

                      <div className="font-medium text-gray-500">คณะ:</div>
                      <div className="col-span-2">
                        {supervision.student_faculty || "-"}
                      </div>
                      
                      <div className="font-medium text-gray-500">เบอร์โทรศัพท์:</div>
                      <div className="col-span-2">
                        {supervision.student_mobile || "-"}
                      </div>
                      
                      <div className="font-medium text-gray-500">อีเมล:</div>
                      <div className="col-span-2">
                        {supervision.student_email || "-"}
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
                        {supervision.advisor_name || "-"}
                      </div>

                      <div className="font-medium text-gray-500">
                        เบอร์โทรศัพท์:
                      </div>
                      <div className="col-span-2">
                        {supervision.advisor_mobile || "-"}
                      </div>

                      <div className="font-medium text-gray-500">อีเมล:</div>
                      <div className="col-span-2">
                        {supervision.advisor_email || "-"}
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
                        {supervision.company_name || "-"}
                      </div>

                      <div className="font-medium text-gray-500">ที่อยู่:</div>
                      <div className="col-span-2">
                        {supervision.company_address || "-"}
                      </div>

                      <div className="font-medium text-gray-500">
                        ผู้ประสานงาน:
                      </div>
                      <div className="col-span-2">
                        {supervision.contact_name || "-"}
                      </div>

                      <div className="font-medium text-gray-500">
                        เบอร์โทรศัพท์:
                      </div>
                      <div className="col-span-2">
                        {supervision.contact_phone || "-"}
                      </div>

                      <div className="font-medium text-gray-500">อีเมล:</div>
                      <div className="col-span-2">
                        {supervision.contact_email || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>  );
}
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
                                ข้อเสนอแนะจากแหล่งฝึก
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
