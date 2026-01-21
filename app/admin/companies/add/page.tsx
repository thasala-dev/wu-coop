"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { ArrowLeft, Edit, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { provinces, companyType } from "@/lib/global";
import UnifiedSidebar from "@/components/unified-sidebar";
import Loading from "@/components/loading";
import Sidebar from "@/components/sidebar";

const formSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อแหล่งฝึกงาน"),
  businessType: z.string().min(1, "กรุณาเลือกประเภทแหล่งฝึก"),
  detail: z.string().min(1, "กรุณากรอกรายละเอียดแหล่งฝึกงาน"),
  location: z.string().min(1, "กรุณากรอกที่อยู่แหล่งฝึกงาน"),
  image: z.string(),

  establishYear: z.string(),
  totalEmployees: z.string(),
  joinedYear: z.string(),
  website: z.string(),

  contactName: z.string().min(1, "กรุณากรอกชื่อผู้ประสานงาน"),
  contactPosition: z.string().min(1, "กรุณากรอกตำแหน่งผู้ประสานงาน"),
  contactEmail: z.string(),
  contactPhone: z.string().min(1, "กรุณากรอกเบอร์โทรศัพท์ผู้ประสานงาน"),
  contactAddress: z.string(),
  evaluationType: z
    .array(z.number())
    .min(1, "กรุณาเลือกรูปแบบการประเมินอย่างน้อย 1 รูปแบบ"),

  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้งาน"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export default function Page({ params }: any) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [evaluationsType, setEvaluationsType] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      businessType: "",
      detail: "",
      location: "",
      establishYear: "",
      totalEmployees: "",
      joinedYear: "",
      website: "",
      image: "",
      contactName: "",
      contactPosition: "",
      contactEmail: "",
      contactPhone: "",
      contactAddress: "",
      username: "",
      password: "",
      evaluationType: [],
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const res = await fetch(`/api/evaluations_type`);
    if (!res.ok) return;
    const evalations = await res.json();
    setEvaluationsType(evalations.data || []);
    setLoading(false);
  }

  async function onSubmit(values: any) {
    setLoading(true);
    const response = await fetch("/api/company", {
      method: "POST",
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
      router.push("/admin/companies");
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
      <div className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="companies" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <a href="/admin/companies">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/companies" className="hover:text-gray-900">
                  แหล่งฝึกงาน
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">เพิ่มแหล่งฝึกงาน</span>
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
                          <div className="sm:col-span-12">
                            <label>URL รูปภาพโลโก้</label>
                            <input
                              id="image"
                              type="url"
                              {...register("image")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.image ? "border-red-600  border-2" : "")
                              }
                              placeholder="กรุณากรอก URL รูปภาพโลโก้บริษัท"
                            />
                            {errors.image && (
                              <p className="text-sm text-red-600">
                                {typeof errors.image?.message === "string"
                                  ? errors.image.message
                                  : "กรุณาตรวจสอบ URL รูปภาพ"}
                              </p>
                            )}

                            {/* Image Preview */}
                            <div className="mt-2 flex justify-center">
                              {watch("image") && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium mb-1 text-center">
                                    ตัวอย่างรูปภาพ:
                                  </p>
                                  <div className="relative w-32 h-32 border rounded-md overflow-hidden mx-auto">
                                    <img
                                      src={watch("image")}
                                      alt="Company Logo Preview"
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "/placeholder-logo.svg";
                                        e.currentTarget.onerror = null;
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="sm:col-span-6">
                            <label>ชื่อแหล่งฝึกงาน</label>
                            <input
                              id="name"
                              type="text"
                              {...register("name")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.name ? "border-red-600  border-2" : "")
                              }
                              placeholder="กรุณากรอกชื่อแหล่งฝึกงาน"
                            />
                            {errors.name && (
                              <p className="text-sm text-red-600">
                                {typeof errors.name?.message === "string"
                                  ? errors.name.message
                                  : "กรุณากรอกชื่อแหล่งฝึกงาน"}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-6">
                            <label>ประเภทแหล่งฝึก</label>
                            <select
                              id="businessType"
                              {...register("businessType")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.businessType
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกประเภทแหล่งฝึก
                              </option>

                              {companyType.map((item, index) => (
                                <option key={index} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </select>

                            {errors.businessType && (
                              <p className="text-sm text-red-600">
                                {typeof errors.businessType?.message ===
                                "string"
                                  ? errors.businessType.message
                                  : "กรุณาเลือกประเภทแหล่งฝึก"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-12">
                            <label>รายละเอียดแหล่งฝึกงาน</label>
                            <textarea
                              id="detail"
                              {...register("detail")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.detail
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกรายละเอียดแหล่งฝึกงาน"
                              rows={4}
                            />
                            {errors.detail && (
                              <p className="text-sm text-red-600">
                                {typeof errors.detail?.message === "string"
                                  ? errors.detail.message
                                  : "กรุณากรอกรายละเอียดแหล่งฝึกงาน"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-4">
                            <label>สถานที่</label>
                            <select
                              id="location"
                              {...register("location")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.location
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกสถานที่
                              </option>
                              {provinces.map((province) => (
                                <option key={province} value={province}>
                                  {province}
                                </option>
                              ))}
                            </select>

                            {errors.location && (
                              <p className="text-sm text-red-600">
                                {typeof errors.location?.message === "string"
                                  ? errors.location.message
                                  : "กรุณาเลือกสถานที่"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-4">
                            <label>ปีที่ก่อตั้ง</label>
                            <input
                              id="establishYear"
                              type="text"
                              {...register("establishYear")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.establishYear
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกปีที่ก่อตั้ง"
                            />
                            {errors.establishYear && (
                              <p className="text-sm text-red-600">
                                {typeof errors.establishYear?.message ===
                                "string"
                                  ? errors.establishYear.message
                                  : "กรุณากรอกปีที่ก่อตั้ง"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-4">
                            <label>จำนวนพนักงานทั้งหมด</label>
                            <input
                              id="totalEmployees"
                              type="text"
                              {...register("totalEmployees")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.totalEmployees
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกจำนวนพนักงานทั้งหมด"
                            />
                            {errors.totalEmployees && (
                              <p className="text-sm text-red-600">
                                {typeof errors.totalEmployees?.message ===
                                "string"
                                  ? errors.totalEmployees.message
                                  : "กรุณากรอกจำนวนพนักงาน"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>ปีที่เข้าร่วม</label>
                            <input
                              id="joinedYear"
                              type="text"
                              {...register("joinedYear")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.joinedYear
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกปีที่เข้าร่วม"
                            />
                            {errors.joinedYear && (
                              <p className="text-sm text-red-600">
                                {typeof errors.joinedYear?.message === "string"
                                  ? errors.joinedYear.message
                                  : "กรุณากรอกปีที่เข้าร่วม"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>เว็บไซต์</label>
                            <input
                              id="website"
                              type="url"
                              {...register("website")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.website
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอก URL เว็บไซต์"
                            />
                            {errors.website && (
                              <p className="text-sm text-red-600">
                                {typeof errors.website?.message === "string"
                                  ? errors.website.message
                                  : "กรุณากรอก URL เว็บไซต์"}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <div className="font-semibold tracking-tight text-lg">
                              ข้อมูลติดต่อ
                            </div>
                          </div>
                          <div className="sm:col-span-6">
                            <label>ผู้ประสานงาน</label>
                            <input
                              id="contactName"
                              type="text"
                              {...register("contactName")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.contactName
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกชื่อแหล่งฝึกงาน"
                            />
                            {errors.contactName && (
                              <p className="text-sm text-red-600">
                                {typeof errors.contactName?.message === "string"
                                  ? errors.contactName.message
                                  : "กรุณากรอกชื่อผู้ประสานงาน"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>ตำแหน่ง</label>
                            <input
                              id="contactPosition"
                              type="text"
                              {...register("contactPosition")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.contactPosition
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกชื่อแหล่งฝึกงาน"
                            />
                            {errors.contactPosition && (
                              <p className="text-sm text-red-600">
                                {typeof errors.contactPosition?.message ===
                                "string"
                                  ? errors.contactPosition.message
                                  : "กรุณากรอกตำแหน่งผู้ประสานงาน"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>อีเมล</label>
                            <input
                              id="contactEmail"
                              type="email"
                              {...register("contactEmail")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.contactEmail
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกอีเมลผู้ประสานงาน"
                            />
                            {errors.contactEmail && (
                              <p className="text-sm text-red-600">
                                {typeof errors.contactEmail?.message ===
                                "string"
                                  ? errors.contactEmail.message
                                  : "กรุณากรอกอีเมลผู้ประสานงาน"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>เบอร์โทรศัพท์</label>
                            <input
                              id="contactPhone"
                              type="text"
                              {...register("contactPhone")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.contactPhone
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกเบอร์โทรศัพท์ผู้ประสานงาน"
                            />
                            {errors.contactPhone && (
                              <p className="text-sm text-red-600">
                                {typeof errors.contactPhone?.message ===
                                "string"
                                  ? errors.contactPhone.message
                                  : "กรุณากรอกเบอร์โทรศัพท์ผู้ประสานงาน"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-12">
                            <label>ที่อยู่</label>
                            <input
                              id="contactAddress"
                              type="text"
                              {...register("contactAddress")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.contactAddress
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกที่อยู่ผู้ประสานงาน"
                            />
                            {errors.contactAddress && (
                              <p className="text-sm text-red-600">
                                {typeof errors.contactAddress?.message ===
                                "string"
                                  ? errors.contactAddress.message
                                  : "กรุณากรอกที่อยู่ผู้ประสานงาน"}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <div className="font-semibold tracking-tight text-lg">
                              ข้อมูลการประเมิน
                            </div>
                          </div>

                          <div className="sm:col-span-12">
                            <label className="text-sm font-medium mb-3 block">
                              รูปแบบการประเมิน (เลือกได้หลายรูปแบบ)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-md bg-gray-50">
                              {evaluationsType.map((item: any) => (
                                <div
                                  key={item.id}
                                  className="flex items-center space-x-3"
                                >
                                  <input
                                    type="checkbox"
                                    id={`evaluation-${item.id}`}
                                    value={item.id}
                                    checked={watch("evaluationType")?.includes(
                                      item.id,
                                    )}
                                    onChange={(e) => {
                                      const currentValues =
                                        watch("evaluationType") || [];
                                      if (e.target.checked) {
                                        setValue("evaluationType", [
                                          ...currentValues,
                                          item.id,
                                        ]);
                                      } else {
                                        setValue(
                                          "evaluationType",
                                          currentValues.filter(
                                            (id: string) => id !== item.id,
                                          ),
                                        );
                                      }
                                    }}
                                    className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                  />
                                  <label
                                    htmlFor={`evaluation-${item.id}`}
                                    className="text-sm text-gray-700 cursor-pointer"
                                  >
                                    <span className="font-medium">
                                      {item.group}
                                    </span>{" "}
                                    - {item.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                            {errors.evaluationType && (
                              <p className="text-sm text-red-600 mt-2">
                                {typeof errors.evaluationType?.message ===
                                "string"
                                  ? errors.evaluationType.message
                                  : "กรุณาเลือกรูปแบบการประเมินอย่างน้อย 1 รูปแบบ"}
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
                                {typeof errors.username?.message === "string"
                                  ? errors.username.message
                                  : "กรุณากรอกชื่อผู้ใช้งาน"}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>Password</label>
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
                                {typeof errors.password?.message === "string"
                                  ? errors.password.message
                                  : "กรุณากรอกรหัสผ่าน"}
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
