"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { ArrowLeft, Edit, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminSidebar from "@/components/admin-sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";

const formSchema = z.object({
  fullname: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
  studentId: z.string().min(1, "กรุณากรอกรหัสนักศึกษา"),
  email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง").optional(),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง")
    .optional(),
  faculty: z.string().min(1, "กรุณาเลือกคณะ").optional(),
  major: z.string().min(1, "กรุณาเลือกสาขา").optional(),
  stdYear: z.string().min(1, "กรุณาเลือกชั้นปี").optional(),
  address: z.string().min(1, "กรุณากรอกที่อยู่").optional(),
  statusId: z.string().min(1, "กรุณาเลือกสถานะ").optional(),
  gpa: z.string().min(1, "กรุณากรอกเกรดเฉลี่ย").optional(),
});

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      studentId: "",
    },
  });

  useEffect(() => {
    fetchStudentData();
  }, []);

  async function fetchStudentData() {
    const response = await fetch(`/api/student/${id}`);
    if (!response.ok) {
      toast({
        title: "ไม่สามารถโหลดข้อมูลนักศึกษาได้",
        description: "เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา",
        variant: "destructive",
      });
      return;
    }
    const data = await response.json();
    if (data.success) {
      setValue("fullname", data.data.fullname);
      setValue("studentId", data.data.student_id);
    } else {
      toast({
        title: "ไม่พบข้อมูลนักศึกษา",
        description: data.message || "เกิดข้อผิดพลาด",
        variant: "destructive",
      });
    }
  }

  async function onSubmit(values: any) {
    values.username = values.studentId;
    values.password = values.studentId;

    const response = await fetch(`/api/student/${id}`, {
      method: "PUT",
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
      router.push("/admin/students");
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <AdminSidebar activePage="students" />

          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <a href="/admin/students">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/students" className="hover:text-gray-900">
                  นักศึกษาทั้งหมด
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">แก้ไขนักศึกษา</span>
              </div>
            </div>

            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="p-0">
                  <div className="p-6 relative">
                    <div>
                      <div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                          <div className="sm:col-span-6">
                            <label>ชื่อ-นามสกุล</label>
                            <input
                              id="fullname"
                              type="text"
                              {...register("fullname")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.fullname
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกชื่อ-นามสกุล"
                            />
                            {errors.fullname && (
                              <p className="text-sm text-red-600">
                                {errors.fullname.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>รหัสนักศึกษา</label>
                            <input
                              id="studentId"
                              type="text"
                              {...register("studentId")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.studentId
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกรหัสนักศึกษา"
                            />
                            {errors.studentId && (
                              <p className="text-sm text-red-600">
                                {errors.studentId.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <div className="flex items-center gap-2">
                              <Button
                                type="submit"
                                className="flex items-center gap-1 h-9 px-3 rounded-md bg-gray-900 hover:bg-gray-800"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                บันทึกข้อมูล
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
