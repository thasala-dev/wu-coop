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
  registInternId: z.string().min(1, "กรุณาเลือกนักศึกษา"),
  advisorId: z.string().min(1, "กรุณาเลือกอาจารย์นิเทศ"),
  scheduledDate: z.string().min(1, "กรุณาเลือกวันที่นิเทศ"),
});

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

export default function AddSupervision() {
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
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
    },
  });

  // ฟังก์ชั่นสำหรับดึงข้อมูลนักศึกษาที่ลงทะเบียนฝึกงาน
  const fetchRegisteredStudents = async () => {
    try {
      // ในอนาคตจะใช้ API จริง
      // const response = await fetch('/api/regist-intern');
      // const data = await response.json();
      // if (data.success) {
      //   setStudents(data.data);
      // }
    } catch (error) {
      console.error("Error fetching registered students:", error);
    }
  };

  // ฟังก์ชั่นสำหรับดึงข้อมูลอาจารย์
  const fetchAdvisors = async () => {
    try {
      // ในอนาคตจะใช้ API จริง
      // const response = await fetch('/api/advisors');
      // const data = await response.json();
      // if (data.success) {
      //   setAdvisors(data.data);
      // }
    } catch (error) {
      console.error("Error fetching advisors:", error);
    }
  };

  useEffect(() => {
    fetchRegisteredStudents();
    fetchAdvisors();
  }, []);

  // เมื่อกดปุ่มบันทึก
  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      // ในอนาคตจะใช้ API จริง
      // const response = await fetch("/api/supervisions", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(values),
      // });
      // const data = await response.json();

      // จำลองการส่งข้อมูล
      console.log("Submitted values:", values);

      setTimeout(() => {
        toast({
          title: "บันทึกข้อมูลสำเร็จ",
          description: "เพิ่มรายการนิเทศเรียบร้อยแล้ว",
          variant: "success",
        });
        router.push("/admin/supervision");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding supervision:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง",
        variant: "destructive",
      });
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
                    </div>

                    <div className="sm:col-span-6 space-y-1">
                      <label
                        htmlFor="registInternId"
                        className="block text-sm font-medium"
                      >
                        นักศึกษา <span className="text-red-500">*</span>
                      </label>
                      <Select
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
