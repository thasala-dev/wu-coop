"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Save,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { th } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema สำหรับตรวจสอบการกรอกฟอร์ม
const formSchema = z
  .object({
    registInternId: z.string().min(1, "กรุณาเลือกนักศึกษา"),
    advisorId: z.string().min(1, "กรุณาเลือกอาจารย์นิเทศ"),
    scheduledDate: z.string().min(1, "กรุณาเลือกวันที่นิเทศ"),
    start_time: z.string().min(1, "กรุณาระบุเวลาเริ่มต้น"),
    end_time: z.string().min(1, "กรุณาระบุเวลาสิ้นสุด"),
    visit_type: z.string().optional(),
    comments: z.string().optional(),
    status: z.string().min(1, "กรุณาเลือกสถานะ"),
  })
  .refine(
    (data) => {
      // ตรวจสอบว่าเวลาสิ้นสุดมากกว่าเวลาเริ่มต้น
      return data.start_time < data.end_time;
    },
    {
      message: "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น",
      path: ["end_time"],
    }
  );

// ข้อมูลตัวอย่าง
const mockStudents = [
  {
    id: "101",
    name: "นายทดสอบ ระบบ",
    student_id: "64000001",
    company: "บริษัท เอบีซี จำกัด",
  },
  {
    id: "102",
    name: "นางสาวสมศรี เรียนดี",
    student_id: "64000002",
    company: "บริษัท เทคโนโลยีไทย จำกัด",
  },
  {
    id: "103",
    name: "นายมานะ ตั้งใจ",
    student_id: "64000003",
    company: "บริษัท ซอฟต์แวร์ไทย จำกัด",
  },
];

const mockAdvisors = [
  { id: "301", name: "อาจารย์ใจดี มากมาย" },
  { id: "302", name: "ผศ.ดร.สมชาย สอนเก่ง" },
  { id: "303", name: "รศ.ดร.สมศรี วิจัยเด่น" },
];

// ข้อมูลตัวอย่างการนิเทศ
const mockSupervision = {
  id: 1,
  regist_intern_id: "101",
  advisor_id: "301",
  scheduled_date: "2025-06-28",
  start_time: "09:00",
  end_time: "12:00",
  visit_type: "onsite",
  comments: "บันทึกการนิเทศตัวอย่าง",
  status: "1", // 1=รอดำเนินการ
};

export default function EditSupervision() {
  const params = useParams();
  const id = params?.id as string;
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [students, setStudents] = useState(mockStudents);
  const [advisors, setAdvisors] = useState(mockAdvisors);
  const { toast } = useToast();
  const router = useRouter();

  // Helper function for error messages
  const getErrorMessage = (error: any) => {
    if (!error) return "";
    if (typeof error.message === "string") return error.message;
    return String(error.message || "Invalid input");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registInternId: "",
      advisorId: "",
      scheduledDate: "",
      start_time: "09:00",
      end_time: "12:00",
      visit_type: "",
      comments: "",
      status: "",
    },
  });

  // ฟังก์ชั่นสำหรับดึงข้อมูลนักศึกษาที่ลงทะเบียนฝึกงาน
  const fetchRegisteredStudents = async () => {
    try {
      const response = await fetch('/api/calendar');
      const calendarData = await response.json();
      
      if (calendarData.success && calendarData.data.length > 0) {
        // ใช้ปฏิทินล่าสุด
        const latestCalendarId = calendarData.data[0].id;
        
        // ดึงข้อมูลนักศึกษาตามปฏิทิน
        const studentsResponse = await fetch(`/api/calendar/${latestCalendarId}/info`);
        const studentsData = await studentsResponse.json();
        
        if (studentsData.success) {
          // เฉพาะนักศึกษาที่จับคู่กับบริษัทแล้ว
          const matchedStudents = studentsData.intern
            .filter((item: any) => item.company_id !== null)
            .map((item: any) => {
              const company = studentsData.company.find((c: any) => c.company_id === item.company_id);
              return {
                id: item.id, // regist_intern_id
                name: item.fullname,
                student_id: item.student_code,
                company: company ? company.name : 'ไม่ระบุบริษัท'
              };
            });
            
          setStudents(matchedStudents);
        }
      }
    } catch (error) {
      console.error("Error fetching registered students:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลนักศึกษาได้",
        variant: "destructive",
      });
    }
  };

  // ฟังก์ชั่นสำหรับดึงข้อมูลอาจารย์
  const fetchAdvisors = async () => {
    try {
      const response = await fetch('/api/advisor');
      const data = await response.json();
      if (data.success) {
        const advisorsList = data.data.map((advisor: any) => ({
          id: advisor.id,
          name: advisor.fullname
        }));
        setAdvisors(advisorsList);
      }
    } catch (error) {
      console.error("Error fetching advisors:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลอาจารย์นิเทศได้",
        variant: "destructive",
      });
    }
  };

  // ฟังก์ชั่นสำหรับดึงข้อมูลการนิเทศ
  const fetchSupervisionData = async () => {
    setLoadingData(true);
    try {
      const response = await fetch(`/api/supervision/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const supervisionData = data.data;
        setValue("registInternId", supervisionData.regist_intern_id.toString());
        setValue("advisorId", supervisionData.advisor_id.toString());
        setValue("scheduledDate", supervisionData.scheduled_date);
        setValue("start_time", supervisionData.start_time || "09:00");
        setValue("end_time", supervisionData.end_time || "12:00");
        setValue("visit_type", supervisionData.visit_type || "");
        setValue("comments", supervisionData.comments || "");
        setValue("status", supervisionData.status.toString());
        
        if (supervisionData.scheduled_date) {
          setScheduledDate(parse(supervisionData.scheduled_date, "yyyy-MM-dd", new Date()));
        }
        
        setLoadingData(false);
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่พบข้อมูลการนิเทศที่ต้องการแก้ไข",
          variant: "destructive",
        });
        router.push("/admin/supervision");
      }
    } catch (error) {
      console.error("Error fetching supervision data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลการนิเทศได้",
        variant: "destructive",
      });
      setLoadingData(false);
      router.push("/admin/supervision");
    }
  };

  useEffect(() => {
    fetchRegisteredStudents();
    fetchAdvisors();
    fetchSupervisionData();
  }, []);

  // เมื่อกดปุ่มบันทึก
  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        regist_intern_id: values.registInternId,
        advisor_id: values.advisorId,
        scheduled_date: values.scheduledDate,
        start_time: values.start_time,
        end_time: values.end_time,
        visit_type: values.visit_type || null,
        comments: values.comments || null,
        status: parseInt(values.status)
      };
      
      const response = await fetch(`/api/supervision/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "บันทึกข้อมูลสำเร็จ",
          description: "แก้ไขรายการนิเทศเรียบร้อยแล้ว",
          variant: "success",
        });
        router.push("/admin/supervision");
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถบันทึกข้อมูลได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating supervision:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
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
                <span className="text-gray-900">แก้ไขรายการนิเทศ</span>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>แก้ไขรายการนิเทศ</CardTitle>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <div className="font-medium mb-2">ข้อมูลการนิเทศ</div>
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="registInternId"
                        className="block text-sm font-medium"
                      >
                        นักศึกษา <span className="text-red-500">*</span>
                      </label>
                      <Select
                        defaultValue={watch("registInternId")}
                        onValueChange={(value) =>
                          setValue("registInternId", value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.registInternId
                              ? "border-red-600 border-2"
                              : ""
                          )}
                        >
                          <SelectValue placeholder="เลือกนักศึกษาที่ลงทะเบียนฝึกงาน" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              <div>
                                <div>
                                  {student.name} ({student.student_id})
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.company}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input type="hidden" {...register("registInternId")} />
                      {errors.registInternId && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.registInternId)}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="advisorId"
                        className="block text-sm font-medium"
                      >
                        อาจารย์นิเทศ <span className="text-red-500">*</span>
                      </label>
                      <Select
                        defaultValue={watch("advisorId")}
                        onValueChange={(value) => setValue("advisorId", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.advisorId ? "border-red-600 border-2" : ""
                          )}
                        >
                          <SelectValue placeholder="เลือกอาจารย์นิเทศ" />
                        </SelectTrigger>
                        <SelectContent>
                          {advisors.map((advisor) => (
                            <SelectItem key={advisor.id} value={advisor.id}>
                              {advisor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input type="hidden" {...register("advisorId")} />
                      {errors.advisorId && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.advisorId)}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label className="block text-sm font-medium">
                        วันที่นิเทศ <span className="text-red-500">*</span>
                      </label>
                      <div>
                        <input
                          type="hidden"
                          {...register("scheduledDate")}
                          value={
                            scheduledDate
                              ? format(scheduledDate, "yyyy-MM-dd")
                              : ""
                          }
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !scheduledDate && "text-muted-foreground",
                                errors.scheduledDate
                                  ? "border-red-600 border-2"
                                  : ""
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {scheduledDate ? (
                                format(scheduledDate, "d MMMM yyyy", {
                                  locale: th,
                                })
                              ) : (
                                <span>เลือกวันที่นิเทศ</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 shadow-md rounded-md"
                            align="start"
                          >
                            <Calendar
                              selected={scheduledDate || undefined}
                              onSelect={(date: Date | null) => {
                                setScheduledDate(date);
                                if (date) {
                                  setValue(
                                    "scheduledDate",
                                    format(date, "yyyy-MM-dd")
                                  );
                                }
                              }}
                              locale={th}
                              className="rounded-md"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      {errors.scheduledDate && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.scheduledDate)}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label
                        htmlFor="start_time"
                        className="block text-sm font-medium"
                      >
                        เวลาเริ่มต้น <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        id="start_time"
                        {...register("start_time")}
                        className={cn(
                          "w-full p-2 border rounded-md",
                          errors.start_time ? "border-red-600 border-2" : ""
                        )}
                      />
                      {errors.start_time && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.start_time)}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label
                        htmlFor="end_time"
                        className="block text-sm font-medium"
                      >
                        เวลาสิ้นสุด <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        id="end_time"
                        {...register("end_time")}
                        className={cn(
                          "w-full p-2 border rounded-md",
                          errors.end_time ? "border-red-600 border-2" : ""
                        )}
                      />
                      {errors.end_time && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.end_time)}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="visit_type"
                        className="block text-sm font-medium"
                      >
                        ประเภทการเยี่ยมชม
                      </label>
                      <Select
                        defaultValue={watch("visit_type")}
                        onValueChange={(value) => setValue("visit_type", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.visit_type ? "border-red-600 border-2" : ""
                          )}
                        >
                          <SelectValue placeholder="เลือกประเภทการเยี่ยมชม" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onsite">นิเทศ ณ สถานประกอบการ</SelectItem>
                          <SelectItem value="online">นิเทศออนไลน์</SelectItem>
                          <SelectItem value="hybrid">นิเทศแบบผสมผสาน</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" {...register("visit_type")} />
                      {errors.visit_type && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.visit_type)}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="comments"
                        className="block text-sm font-medium"
                      >
                        หมายเหตุ
                      </label>
                      <textarea
                        id="comments"
                        {...register("comments")}
                        className={cn(
                          "w-full p-2 border rounded-md",
                          errors.comments ? "border-red-600 border-2" : ""
                        )}
                        rows={3}
                        placeholder="กรอกหมายเหตุเพิ่มเติมเกี่ยวกับการนิเทศ"
                      />
                      {errors.comments && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.comments)}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium"
                      >
                        สถานะ <span className="text-red-500">*</span>
                      </label>
                      <Select
                        defaultValue={watch("status")}
                        onValueChange={(value) => setValue("status", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.status ? "border-red-600 border-2" : ""
                          )}
                        >
                          <SelectValue placeholder="เลือกสถานะ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">รอดำเนินการ</SelectItem>
                          <SelectItem value="2">เสร็จสิ้น</SelectItem>
                          <SelectItem value="3">ยกเลิก</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" {...register("status")} />
                      {errors.status && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.status)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-center gap-2">
                  <a href="/admin/supervision">
                    <Button type="button" variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      ยกเลิก
                    </Button>
                  </a>
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
