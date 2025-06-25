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
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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
const formSchema = z.object({
  regist_intern_id: z.string().min(1, "กรุณาเลือกนักศึกษา"),
  advisor_id: z.string().min(1, "กรุณาเลือกอาจารย์นิเทศ"),
  scheduled_date: z.string().min(1, "กรุณาเลือกวันที่นิเทศ"),
  visit_type: z.string().optional(),
  comments: z.string().optional(),
});



export default function AddSupervision() {
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string>("");
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
      regist_intern_id: "",
      advisor_id: "",
      scheduled_date: "",
      visit_type: "",
      comments: "",
    },
  });
  // ฟังก์ชั่นสำหรับดึงข้อมูลปฏิทินฝึกงาน
  const fetchCalendars = async () => {
    try {
      const response = await fetch('/api/calendar');
      const data = await response.json();
      if (data.success) {
        setCalendars(data.data);
        // เลือกปฏิทินล่าสุดโดยอัตโนมัติถ้ามี
        if (data.data.length > 0) {
          setSelectedCalendar(data.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching calendars:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลปฏิทินฝึกงานได้",
        variant: "destructive",
      });
    }
  };

  // ฟังก์ชั่นสำหรับดึงข้อมูลนักศึกษาที่ลงทะเบียนฝึกงาน
  const fetchRegisteredStudents = async (calendarId: string) => {
    if (!calendarId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/calendar/${calendarId}/info`);
      const data = await response.json();
      
      if (data.success) {
        // นำข้อมูลนักศึกษาที่มีการจับคู่กับบริษัทแล้วมาใช้
        const matchedStudents = data.intern
          .filter((item: any) => item.company_id !== null)
          .map((item: any) => {
            const company = data.company.find((c: any) => c.company_id === item.company_id);
            return {
              id: item.id, // regist_intern_id
              name: item.fullname,
              student_id: item.student_code,
              company: company ? company.name : 'ไม่ระบุบริษัท'
            };
          });
          
        setStudents(matchedStudents);
      }
    } catch (error) {
      console.error("Error fetching registered students:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลนักศึกษาได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
  useEffect(() => {
    fetchCalendars();
    fetchAdvisors();
  }, []);
  
  // เมื่อมีการเลือกปฏิทินใหม่ ให้ดึงข้อมูลนักศึกษาที่ลงทะเบียนในปฏิทินนั้น
  useEffect(() => {
    if (selectedCalendar) {
      fetchRegisteredStudents(selectedCalendar);
    }
  }, [selectedCalendar]);
  // เมื่อกดปุ่มบันทึก
  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log("ส่งข้อมูล:", values);
      
      const response = await fetch("/api/supervision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "บันทึกข้อมูลสำเร็จ",
          description: "เพิ่มรายการนิเทศเรียบร้อยแล้ว",
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
      console.error("Error adding supervision:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                <span className="text-gray-900">เพิ่มรายการนิเทศใหม่</span>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>เพิ่มรายการนิเทศใหม่</CardTitle>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <div className="font-medium mb-2">ข้อมูลการนิเทศ</div>
                    </div>                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="calendarId"
                        className="block text-sm font-medium"
                      >
                        ปฏิทินฝึกงาน <span className="text-red-500">*</span>
                      </label>
                      <Select
                        onValueChange={(value) => {
                          setSelectedCalendar(value);
                        }}
                        defaultValue={selectedCalendar}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="เลือกปฏิทินฝึกงาน" />
                        </SelectTrigger>
                        <SelectContent>
                          {calendars.map((calendar) => (
                            <SelectItem key={calendar.id} value={calendar.id}>
                              {calendar.name} ({format(new Date(calendar.start_date), "d MMM yyyy", { locale: th })} - {format(new Date(calendar.end_date), "d MMM yyyy", { locale: th })})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="regist_intern_id"
                        className="block text-sm font-medium"
                      >
                        นักศึกษา <span className="text-red-500">*</span>
                      </label>
                      <Select
                        onValueChange={(value) =>
                          setValue("regist_intern_id", value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.regist_intern_id
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
                      <input type="hidden" {...register("regist_intern_id")} />
                      {errors.regist_intern_id && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.regist_intern_id)}
                        </p>
                      )}
                    </div>                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="advisor_id"
                        className="block text-sm font-medium"
                      >
                        อาจารย์นิเทศ <span className="text-red-500">*</span>
                      </label>
                      <Select
                        onValueChange={(value) => setValue("advisor_id", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.advisor_id ? "border-red-600 border-2" : ""
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
                      <input type="hidden" {...register("advisor_id")} />
                      {errors.advisor_id && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.advisor_id)}
                        </p>
                      )}
                    </div>                    <div className="sm:col-span-6 space-y-1">
                      <label className="block text-sm font-medium">
                        วันที่นิเทศ <span className="text-red-500">*</span>
                      </label>
                      <div>
                        <input
                          type="hidden"
                          {...register("scheduled_date")}
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
                                errors.scheduled_date
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
                                    "scheduled_date",
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
                      {errors.scheduled_date && (
                        <p className="text-sm text-red-600">
                          {getErrorMessage(errors.scheduled_date)}
                        </p>                      )}
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="visit_type"
                        className="block text-sm font-medium"
                      >
                        รูปแบบการนิเทศ
                      </label>
                      <Select
                        onValueChange={(value) => setValue("visit_type", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="เลือกรูปแบบการนิเทศ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onsite">นิเทศ ณ สถานประกอบการ</SelectItem>
                          <SelectItem value="online">นิเทศออนไลน์</SelectItem>
                          <SelectItem value="hybrid">นิเทศแบบผสมผสาน</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" {...register("visit_type")} />
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="comments"
                        className="block text-sm font-medium"
                      >
                        หมายเหตุ
                      </label>
                      <textarea
                        {...register("comments")}
                        className="w-full p-2 border rounded-md h-24"
                        placeholder="บันทึกรายละเอียดเพิ่มเติม (ถ้ามี)"
                      />
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
