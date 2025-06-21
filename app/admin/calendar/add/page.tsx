"use client";

import React from "react";
import { useState } from "react";
import { ArrowLeft, Edit, ChevronRight, Save, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminSidebar from "@/components/admin-sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อแหล่งฝึกงาน"),
  semester: z.string().min(1, "กรุณาเลือกภาคการศึกษา"),
  year: z.string().min(1, "กรุณาเลือกปีการศึกษา"),
  startDate: z.string().min(1, "กรุณาเลือกวันที่เริ่มต้น"),
  endDate: z.string().min(1, "กรุณาเลือกวันที่สิ้นสุด"),
  statusId: z.string().min(1, "กรุณาเลือกสถานะ"),
});

export default function Page({ params }: any) {
  const { toast } = useToast();
  const router = useRouter();
  const years = ["2568", "2569", "2570"];

  // Add state for date pickers
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Helper function to safely display error messages
  const getErrorMessage = (error: any) => {
    if (!error) return "";
    if (typeof error.message === "string") return error.message;
    return String(error.message || "Invalid input");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      semester: "",
      year: "",
      startDate: "",
      endDate: "",
      statusId: "",
    },
  });

  async function onSubmit(values: any) {
    values.year = parseInt(values.year);
    values.semester = parseInt(values.semester);
    values.statusId = parseInt(values.statusId);
    const response = await fetch("/api/calendar", {
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
        description: data.message || "เกิดข้อผิดพลาด",
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
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
                <a href="/admin/calendar">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/calendar" className="hover:text-gray-900">
                  ผลัดฝึกงาน
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">เพิ่มผลัดฝึกงาน</span>
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
                              ข้อมูลผลัดฝึกงาน
                            </div>
                          </div>
                          <div className="sm:col-span-6 space-y-1">
                            <label>ชื่อผลัดฝึกงาน</label>
                            <input
                              id="name"
                              type="text"
                              {...register("name")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.name ? "border-red-600  border-2" : "")
                              }
                              placeholder="เช่น ผลัดที่ 1"
                            />
                            {errors.name && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.name)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-3">
                            <label>ภาคการศึกษา</label>
                            <select
                              id="semester"
                              {...register("semester")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.semester
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกภาคการศึกษา
                              </option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </select>

                            {errors.semester && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.semester)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-3">
                            <label>ปีการศึกษา</label>
                            <select
                              id="year"
                              {...register("year")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.year ? "border-red-600  border-2" : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกปีการศึกษา
                              </option>
                              {years.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>

                            {errors.year && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.year)}
                              </p>
                            )}
                          </div>{" "}
                          <div className="sm:col-span-4">
                            <label>วันที่เริ่มต้น</label>
                            <div>
                              <input
                                type="hidden"
                                {...register("startDate")}
                                value={
                                  startDate
                                    ? format(startDate, "yyyy-MM-dd")
                                    : ""
                                }
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !startDate && "text-muted-foreground",
                                      errors.startDate
                                        ? "border-red-600 border-2"
                                        : ""
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {startDate ? (
                                      format(startDate, "d MMMM yyyy", {
                                        locale: th,
                                      })
                                    ) : (
                                      <span>เลือกวันที่เริ่มต้น</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0 shadow-md rounded-md"
                                  align="start"
                                >
                                  <CalendarComponent
                                    selected={startDate || undefined}
                                    onSelect={(date: Date | null) => {
                                      setStartDate(date);
                                      if (date) {
                                        setValue(
                                          "startDate",
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
                            {errors.startDate && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.startDate)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-4">
                            <label>วันที่สิ้นสุด</label>
                            <div>
                              <input
                                type="hidden"
                                {...register("endDate")}
                                value={
                                  endDate ? format(endDate, "yyyy-MM-dd") : ""
                                }
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !endDate && "text-muted-foreground",
                                      errors.endDate
                                        ? "border-red-600 border-2"
                                        : ""
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {endDate ? (
                                      format(endDate, "d MMMM yyyy", {
                                        locale: th,
                                      })
                                    ) : (
                                      <span>เลือกวันที่สิ้นสุด</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0 shadow-md rounded-md"
                                  align="start"
                                >
                                  <CalendarComponent
                                    selected={endDate || undefined}
                                    onSelect={(date: Date | null) => {
                                      setEndDate(date);
                                      if (date) {
                                        setValue(
                                          "endDate",
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
                            {errors.endDate && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.endDate)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-4">
                            <label>สถานะ</label>
                            <select
                              id="statusId"
                              {...register("statusId")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.statusId
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกสถานะ
                              </option>
                              <option value="1">กำลังดำเนินการ</option>
                              <option value="2">กำลังจะมาถึง</option>
                              <option value="3">วางแผน</option>
                              <option value="4">ยกเลิก</option>
                            </select>

                            {errors.statusId && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.statusId)}
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
                  <Button type="submit" className="flex">
                    <Save className="h-4 w-4 mr-2" />
                    บันทึก
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
