"use client";

import React from "react";
import { useState } from "react";
import { ArrowLeft, Edit, ChevronRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminSidebar from "@/components/admin-sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import Sidebar from "@/components/sidebar";
import CustomAvatar from "@/components/avatar";
import { callUploadApi, callDeleteApi } from "@/lib/file-api";
import AvatarDesign from "@/components/AvatarDesign";
import { exit } from "process";

const formSchema = z.object({
  fullname: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
  student_id: z.string().min(1, "กรุณากรอกรหัสนักศึกษา"),

  email: z
    .string()
    .email("กรุณากรอกอีเมลที่ถูกต้อง")
    .optional()
    .or(z.literal("")),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง")
    .optional()
    .or(z.literal("")),
  major: z.string(),
  std_year: z.string().min(1, "กรุณาเลือกปีรหัส"),
  address: z.string(),
  gpa: z.string(),

  image: z.string().optional(),
});

const years = Array.from(
  {
    length: new Date().getFullYear() + 544 - 2564 + 1,
  },
  (_, i) => (2564 + i).toString().slice(-2)
);

export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      student_id: "",
      email: "",
      mobile: "",
      major: "",
      std_year: "",
      address: "",
      gpa: "",

      image: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const payload = {
        ...values,
        username: values.student_id,
        password: values.student_id,
      };

      const response = await fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        toast({
          title: "ดำเนินการสำเร็จ",
          description: data.message || "เพิ่มนักศึกษาเรียบร้อยแล้ว",
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
    } catch (error) {
      setLoading(false);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อบันทึกข้อมูลได้",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="students" userType="admin" />
          {loading && <Loading />}

          <div className="md:col-span-4">
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
                <span className="text-gray-900">เพิ่มนักศึกษา</span>
              </div>
            </div>

            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="p-0">
                  <div className="p-6 relative">
                    <div>
                      <div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                          <div className="sm:col-span-12">
                            <h2 className="font-semibold tracking-tight text-lg">
                              ข้อมูลนักศึกษา
                            </h2>
                          </div>
                          <div className="sm:col-span-12 flex flex-col items-center justify-center text-center">
                            <AvatarDesign
                              value={getValues("image")}
                              setValue={(val: any) => {
                                setValue("image", val);
                              }}
                              size="32"
                            />
                          </div>
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
                              id="student_id"
                              type="text"
                              {...register("student_id")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.student_id
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกรหัสนักศึกษา"
                            />
                            {errors.student_id && (
                              <p className="text-sm text-red-600">
                                {errors.student_id.message}
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
                              <option value="SCI">
                                สาขาวิชาเภสัชกรรมอุตสาหการ
                              </option>
                              <option value="CARE">
                                สาขาวิชาการบริบาลทางเภสัชกรรม
                              </option>
                            </select>

                            {errors.major && (
                              <p className="text-sm text-red-600">
                                {errors.major.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-3">
                            <label>ปีรหัส</label>
                            <select
                              id="std_year"
                              {...register("std_year")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.std_year
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกปีรหัส
                              </option>
                              {years.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>

                            {errors.std_year && (
                              <p className="text-sm text-red-600">
                                {errors.std_year.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-3">
                            <label>GPAX</label>
                            <input
                              id="gpa"
                              type="text"
                              {...register("gpa")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.gpa ? "border-red-600  border-2" : "")
                              }
                              placeholder="กรุณากรอก GPAX (เกรดเฉลี่ย)"
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
                              {" "}
                              <Button
                                type="submit"
                                className="flex items-center gap-1 h-9 px-3 rounded-md bg-gray-900 hover:bg-gray-800"
                                disabled={loading}
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
