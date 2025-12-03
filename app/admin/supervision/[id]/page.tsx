"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  Building,
  User,
  Edit,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/sidebar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface SupervisionDetail {
  id: number;
  regist_intern_id: number;
  advisor_id: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  visit_type: string;
  type: string;
  comments: string;
  status: number;
  created_at: string;
  updated_at: string;

  // Student info from API
  student_name: string;
  student_code: string;
  student_faculty: string;
  student_major: string;
  student_mobile: string;
  student_email: string;

  // Advisor info from API
  advisor_name: string;
  advisor_mobile: string;
  advisor_email: string;

  // Company info from API
  company_name: string;
  company_address: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
}

export default function SupervisionDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const [supervision, setSupervision] = useState<SupervisionDetail | null>(
    null
  );
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
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return format(date, "d MMMM yyyy", { locale: th });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  // ฟังก์ชั่นแสดงสถานะการนิเทศ
  const renderStatus = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            รอดำเนินการ
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            เสร็จสิ้น
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            ยกเลิก
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            ไม่ระบุ
          </Badge>
        );
    }
  };

  // ฟังก์ชั่นแปลงเวลา
  const formatTime = (timeString: string) => {
    if (!timeString) return "-";

    // ถ้าเป็นรูปแบบ HH:MM:SS หรือ HH:MM ให้ใช้ได้เลย
    if (
      typeof timeString === "string" &&
      timeString.match(/^\d{1,2}:\d{2}(:\d{2})?$/)
    ) {
      return timeString.substring(0, 5); // เอาแค่ HH:MM
    }

    // ถ้าเป็น timestamp ให้แปลงเป็น time
    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }
    } catch (error) {
      console.error("Error formatting time:", error);
    }

    return timeString.toString().substring(0, 5) || "-";
  };

  // ฟังก์ชั่นแปลงประเภทการนิเทศ
  const renderVisitType = (type: string) => {
    switch (type) {
      case "onsite":
        return "นิเทศ ณ แหล่งฝึก";
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
                <Link href="/admin/supervision">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Link href="/admin/supervision" className="hover:text-gray-900">
                  การนิเทศ
                </Link>
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

                      {supervision.comments && (
                        <>
                          <div className="font-medium text-gray-500">
                            หมายเหตุ:
                          </div>
                          <div className="col-span-2">
                            {supervision.comments}
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

                      {supervision.student_mobile && (
                        <>
                          <div className="font-medium text-gray-500">
                            เบอร์โทรศัพท์:
                          </div>
                          <div className="col-span-2">
                            {supervision.student_mobile}
                          </div>
                        </>
                      )}

                      {supervision.student_email && (
                        <>
                          <div className="font-medium text-gray-500">
                            อีเมล:
                          </div>
                          <div className="col-span-2">
                            {supervision.student_email}
                          </div>
                        </>
                      )}
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

                      {supervision.advisor_mobile && (
                        <>
                          <div className="font-medium text-gray-500">
                            เบอร์โทรศัพท์:
                          </div>
                          <div className="col-span-2">
                            {supervision.advisor_mobile}
                          </div>
                        </>
                      )}

                      {supervision.advisor_email && (
                        <>
                          <div className="font-medium text-gray-500">
                            อีเมล:
                          </div>
                          <div className="col-span-2">
                            {supervision.advisor_email}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-500" />
                      แหล่งฝึก
                    </h3>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="font-medium text-gray-500">
                        ชื่อบริษัท:
                      </div>
                      <div className="col-span-2">
                        {supervision.company_name || "-"}
                      </div>

                      {supervision.company_address && (
                        <>
                          <div className="font-medium text-gray-500">
                            ที่อยู่:
                          </div>
                          <div className="col-span-2">
                            {supervision.company_address}
                          </div>
                        </>
                      )}

                      {supervision.contact_name && (
                        <>
                          <div className="font-medium text-gray-500">
                            ผู้ประสานงาน:
                          </div>
                          <div className="col-span-2">
                            {supervision.contact_name}
                          </div>
                        </>
                      )}

                      {supervision.contact_phone && (
                        <>
                          <div className="font-medium text-gray-500">
                            เบอร์โทรศัพท์:
                          </div>
                          <div className="col-span-2">
                            {supervision.contact_phone}
                          </div>
                        </>
                      )}

                      {supervision.contact_email && (
                        <>
                          <div className="font-medium text-gray-500">
                            อีเมล:
                          </div>
                          <div className="col-span-2">
                            {supervision.contact_email}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">ข้อมูลเพิ่มเติม</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">
                        วันที่สร้าง:{" "}
                      </span>
                      {formatToThaiDate(supervision.created_at)}
                    </div>

                    <div>
                      <span className="font-medium text-gray-500">
                        แก้ไขล่าสุด:{" "}
                      </span>
                      {formatToThaiDate(supervision.updated_at)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
