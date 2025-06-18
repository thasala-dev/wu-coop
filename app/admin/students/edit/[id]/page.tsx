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
  // faculty: z.string().min(1, "กรุณาเลือกคณะ").optional(),
  major: z.string(),
  stdYear: z.string().min(1, "กรุณาเลือกชั้นปี"),
  address: z.string().min(1, "กรุณากรอกที่อยู่"),
  gpa: z.string(),
});

const years = Array.from(
  {
    length: new Date().getFullYear() + 544 - 2564 + 1,
  },
  (_, i) => (2564 + i).toString()
);

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
      email: "",
      mobile: "",
      faculty: "",
      major: "",
      stdYear: "",
      address: "",
      gpa: "",
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
      setValue("email", data.data.email || "");
      setValue("mobile", data.data.mobile || "");
      setValue("faculty", data.data.faculty || "");
      setValue("major", data.data.major || "");
      setValue("stdYear", data.data.std_year || "");
      setValue("address", data.data.address || "");
      setValue("gpa", data.data.gpa || "");
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

    console.log("Submitting form with values:", values);

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
                          <div className="sm:col-span-6">
                            <label>E-mail</label>
                            <input
                              id="email"
                              type="text"
                              {...register("email")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.email ? "border-red-600  border-2" : "")
                              }
                              placeholder="กรุณากรอกอีเมล"
                            />
                            {errors.email && (
                              <p className="text-sm text-red-600">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>เบอร์โทรศัพท์</label>
                            <input
                              id="mobile"
                              type="text"
                              {...register("mobile")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.mobile
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกเบอร์โทรศัพท์"
                            />
                            {errors.mobile && (
                              <p className="text-sm text-red-600">
                                {errors.mobile.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>สาขาวิชา</label>
                            <select
                              id="major"
                              {...register("major")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.major ? "border-red-600  border-2" : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกสาขาวิชา
                              </option>
                              <option value="SCI">สาย SCI</option>
                              <option value="CARE">สาย CARE</option>
                            </select>

                            {errors.major && (
                              <p className="text-sm text-red-600">
                                {errors.major.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-3">
                            <label>กลุ่มรหัสนักศึกษา</label>
                            <select
                              id="stdYear"
                              {...register("stdYear")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.stdYear
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกกลุ่มรหัสนักศึกษา
                              </option>
                              {years.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>

                            {errors.stdYear && (
                              <p className="text-sm text-red-600">
                                {errors.stdYear.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-3">
                            <label>GPA</label>
                            <input
                              id="gpa"
                              type="text"
                              {...register("gpa")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.gpa ? "border-red-600  border-2" : "")
                              }
                              placeholder="กรุณากรอก GPA (เกรดเฉลี่ย)"
                            />
                            {errors.gpa && (
                              <p className="text-sm text-red-600">
                                {errors.gpa.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <label>ที่อยู่ที่ติดต่อได้</label>
                            <input
                              id="address"
                              type="text"
                              {...register("address")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.address
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกที่อยู่ที่ติดต่อได้"
                            />
                            {errors.address && (
                              <p className="text-sm text-red-600">
                                {errors.address.message}
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
