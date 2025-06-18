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
import { provinces, companyType } from "@/lib/global";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";

const formSchema = z.object({
  fullname: z.string().min(1, "กรุณากรอกชื่ออาจารย์นิเทศ"),
  image: z.string(),

  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้"),
  password: z.string(),
});

export default function Page() {
  const [loading, setLoading] = useState(true);
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
      image: "",

      username: "",
      password: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await fetch(`/api/advisor/${id}`);
    if (!response.ok) {
      toast({
        title: "ไม่สามารถโหลดข้อมูลได้",
        description: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        variant: "destructive",
      });
      return;
    }
    const data = await response.json();
    setLoading(false);
    if (data.success) {
      console.log(data);

      const company = data.data;
      setValue("fullname", company.fullname);
      setValue("image", company.image || "");
      setValue("username", company.username);
      setValue("password", "");
    } else {
      toast({
        title: "ไม่พบข้อมูล",
        description: data.message || "เกิดข้อผิดพลาด",
        variant: "destructive",
      });
    }
  }

  async function onSubmit(values: any) {
    setLoading(true);
    const response = await fetch(`/api/advisor/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    setLoading(false);
    if (data.success) {
      toast({
        title: "ดำเนินการสำเร็จ",
        description: data.message || "เกิดข้อผิดพลาด",
        variant: "success",
      });
      router.push("/admin/admins");
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
          <Sidebar activePage="admins" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <a href="/admin/admins">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/admins" className="hover:text-gray-900">
                  อาจารย์นิเทศ
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">แก้ไขอาจารย์นิเทศ</span>
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
                            <div className="font-semibold tracking-tight text-lg">
                              ข้อมูลทั่วไป
                            </div>
                          </div>
                          <div className="sm:col-span-6">
                            <label>ชื่ออาจารย์นิเทศ</label>
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
                              placeholder="กรุณากรอกชื่อสถานประกอบการ"
                            />
                            {errors.fullname && (
                              <p className="text-sm text-red-600">
                                {errors.fullname.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-6">
                            <label>ลิงค์รูปประจำตัว (ไม่บังคับ)</label>
                            <input
                              id="image"
                              type="text"
                              {...register("image")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.image ? "border-red-600  border-2" : "")
                              }
                              placeholder="ตัวอย่าง: https://example.com/image.jpg"
                            />
                            {errors.image && (
                              <p className="text-sm text-red-600">
                                {errors.image.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <div className="font-semibold tracking-tight text-lg">
                              ข้อมูลผู้ใช้งาน
                            </div>
                          </div>
                          <div className="sm:col-span-6">
                            <label>Username</label>
                            <input
                              id="username"
                              type="text"
                              {...register("username")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.username
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกชื่อผู้ใช้งาน"
                            />
                            {errors.username && (
                              <p className="text-sm text-red-600">
                                {errors.username.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>
                              Password (หากไม่ต้องการแก้ไขไม่ต้องกรอก)
                            </label>
                            <input
                              id="password"
                              type="password"
                              {...register("password")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.password
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกรหัสผ่าน"
                            />
                            {errors.password && (
                              <p className="text-sm text-red-600">
                                {errors.password.message}
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
