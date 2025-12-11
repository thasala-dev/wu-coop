"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
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
import AdminSidebar from "@/components/admin-sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/sidebar";

const formSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อกิจกรรม"),
  description: z.string().optional(),
  eventDate: z.string().min(1, "กรุณาเลือกวันที่จัดกิจกรรม"),
  location: z.string().min(1, "กรุณากรอกสถานที่จัดกิจกรรม"),
  calendarId: z.string().min(1, "กรุณาเลือกผลัดฝึกงาน"),
  typeId: z.string().min(1, "กรุณาเลือกประเภทกิจกรรม"),
  statusId: z.string().min(1, "กรุณาเลือกสถานะ"),
});

type CalendarType = {
  id: number;
  name: string;
  semester: number;
  year: number;
};

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const { toast } = useToast();
  const router = useRouter();
  const [calendars, setCalendars] = useState<CalendarType[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventDate, setEventDate] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      eventDate: "",
      location: "",
      calendarId: id || "",
      typeId: "1",
      statusId: "1",
    },
  });

  useEffect(() => {
    fetchCalendars();
  }, []);

  async function fetchCalendars() {
    try {
      const response = await fetch("/api/calendar");
      if (!response.ok) {
        toast({
          title: "ไม่สามารถโหลดข้อมูลผลัดฝึกงานได้",
          description: "เกิดข้อผิดพลาดในการดึงข้อมูล",
          variant: "destructive",
        });
        return;
      }
      const data = await response.json();
      if (data.success) {
        setCalendars(data.data);
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลผลัดฝึกงานได้",
        variant: "destructive",
      });
    }
  }

  async function onSubmit(values: any) {
    setLoading(true);
    try {
      // Convert string values to integers
      values.calendarId = parseInt(values.calendarId);
      values.typeId = parseInt(values.typeId);
      values.statusId = parseInt(values.statusId);

      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "ดำเนินการสำเร็จ",
          description: "เพิ่มกิจกรรมสำเร็จ",
          variant: "success",
        });
        router.push("/admin/calendar");
      } else {
        toast({
          title: "ดำเนินการไม่สำเร็จ",
          description: data.message || "เกิดข้อผิดพลาด",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มกิจกรรมได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Helper function to safely display error messages
  const getErrorMessage = (error: any) => {
    if (!error) return "";
    if (typeof error.message === "string") return error.message;
    return String(error.message || "Invalid input");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="calendar" userType="admin" />

          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <a href="/admin/event">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/event" className="hover:text-gray-900">
                  กิจกรรมฝึกงาน
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">เพิ่มกิจกรรม</span>
              </div>
            </div>

            <Card className="mb-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="p-0">
                  <div className="p-6 relative">
                    <div>
                      <div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                          <div className="sm:col-span-12">
                            <div className="font-semibold tracking-tight text-lg">
                              ข้อมูลกิจกรรม
                            </div>
                          </div>
                          <div className="sm:col-span-8 space-y-1">
                            <label>ชื่อกิจกรรม</label>
                            <input
                              id="title"
                              type="text"
                              {...register("title")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.title ? "border-red-600 border-2" : "")
                              }
                              placeholder="ชื่อกิจกรรม"
                            />{" "}
                            {errors.title && (
                              <p className="text-sm text-red-600">
                                {String(errors.title.message)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-4 space-y-1">
                            <label>ผลัดฝึกงาน</label>
                            <select
                              id="calendarId"
                              {...register("calendarId")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.calendarId
                                  ? "border-red-600 border-2"
                                  : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกผลัดฝึกงาน
                              </option>
                              {calendars.map((calendar) => (
                                <option key={calendar.id} value={calendar.id}>
                                  {calendar.name} ({calendar.semester}/
                                  {calendar.year})
                                </option>
                              ))}
                            </select>{" "}
                            {errors.calendarId && (
                              <p className="text-sm text-red-600">
                                {String(errors.calendarId.message)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-12 space-y-1">
                            <label>รายละเอียด</label>
                            <textarea
                              id="description"
                              rows={3}
                              {...register("description")}
                              className="w-full p-2 border rounded-md"
                              placeholder="รายละเอียดกิจกรรม"
                            />
                          </div>{" "}
                          <div className="sm:col-span-4 space-y-1">
                            <label>วันที่จัดกิจกรรม</label>
                            <div>
                              <input
                                type="hidden"
                                {...register("eventDate")}
                                value={
                                  eventDate
                                    ? format(eventDate, "yyyy-MM-dd")
                                    : ""
                                }
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !eventDate && "text-muted-foreground",
                                      errors.eventDate
                                        ? "border-red-600 border-2"
                                        : ""
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {eventDate ? (
                                      format(eventDate, "d MMMM yyyy", {
                                        locale: th,
                                      })
                                    ) : (
                                      <span>เลือกวันที่จัดกิจกรรม</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0 shadow-md rounded-md"
                                  align="start"
                                >
                                  <Calendar
                                    selected={eventDate || undefined}
                                    onSelect={(date: Date | null) => {
                                      setEventDate(date);
                                      if (date) {
                                        setValue(
                                          "eventDate",
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
                            {errors.eventDate && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.eventDate)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-8 space-y-1">
                            <label>สถานที่</label>
                            <input
                              id="location"
                              type="text"
                              {...register("location")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.location
                                  ? "border-red-600 border-2"
                                  : "")
                              }
                              placeholder="สถานที่จัดกิจกรรม"
                            />{" "}
                            {errors.location && (
                              <p className="text-sm text-red-600">
                                {String(errors.location.message)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6 space-y-1">
                            <label>ประเภทกิจกรรม</label>
                            <select
                              id="typeId"
                              {...register("typeId")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.typeId ? "border-red-600 border-2" : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกประเภทกิจกรรม
                              </option>
                              <option value="1">การประชุม</option>
                              <option value="2">อบรม</option>
                              <option value="3">สัมมนา</option>
                              <option value="4">นำเสนอผลงาน</option>
                              <option value="5">ประเมินผล</option>
                              <option value="6">อื่นๆ</option>
                            </select>{" "}
                            {errors.typeId && (
                              <p className="text-sm text-red-600">
                                {String(errors.typeId.message)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6 space-y-1">
                            <label>สถานะ</label>
                            <select
                              id="statusId"
                              {...register("statusId")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.statusId
                                  ? "border-red-600 border-2"
                                  : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกสถานะ
                              </option>
                              <option value="1">กำลังดำเนินการ</option>
                              <option value="2">กำลังจะมาถึง</option>
                              <option value="3">เสร็จสิ้น</option>
                              <option value="4">ยกเลิก</option>
                            </select>{" "}
                            {errors.statusId && (
                              <p className="text-sm text-red-600">
                                {String(errors.statusId.message)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-2">
                  <a href="/admin/calendar">
                    <Button type="button" className="flex" variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      ยกเลิก
                    </Button>
                  </a>
                  <Button type="submit" className="flex" disabled={loading}>
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
