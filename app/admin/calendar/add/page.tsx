"use client";

import React from "react";
import { useState } from "react";
import { ArrowLeft, Edit, ChevronRight, Save } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อสถานประกอบการ"),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
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
                  รอบฝึกงาน
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">เพิ่มรอบฝึกงาน</span>
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
                              ข้อมูลรอบฝึกงาน
                            </div>
                          </div>
                          <div className="sm:col-span-6 space-y-1">
                            <label>ชื่อรอบฝึกงาน</label>
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
                                {errors.name.message}
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
                                {errors.semester.message}
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
                                {errors.year.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-4">
                            <label>วันที่เริ่มต้น</label>
                            <input
                              id="startDate"
                              type="date"
                              {...register("startDate")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.startDate
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="วันที่เริ่มต้น"
                            />
                            {errors.startDate && (
                              <p className="text-sm text-red-600">
                                {errors.startDate.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-4">
                            <label>วันที่สิ้นสุด</label>
                            <input
                              id="endDate"
                              type="date"
                              {...register("endDate")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.endDate
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="วันที่สิ้นสุด"
                            />
                            {errors.endDate && (
                              <p className="text-sm text-red-600">
                                {errors.endDate.message}
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
                                {errors.statusId.message}
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
