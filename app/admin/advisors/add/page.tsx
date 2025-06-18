"use client";

import React, { useState } from "react";
import { ArrowLeft, Edit, ChevronRight, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";
import { callUploadApi, callDeleteApi } from "@/lib/file-api";

// --- Schema การตรวจสอบข้อมูล (Zod) ---
const formSchema = z.object({
  fullname: z.string().min(1, "กรุณากรอกชื่ออาจารย์นิเทศ"),
  image: z.string().optional(),
  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้งาน"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      image: "",
      username: "",
      password: "",
    },
  });

  // --- Handlers สำหรับการจัดการไฟล์ ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files ? event.target.files[0] : null);
    if (event.target.files && event.target.files[0]) {
      setCurrentImageUrl(URL.createObjectURL(event.target.files[0]));
      setValue("image", ""); // Clear image field until upload
    } else {
      setCurrentImageUrl(initialImageUrl); // Revert if file selection is cancelled
      setValue("image", initialImageUrl);
    }
  };

  const handleImageDeleteClick = async () => {
    setSelectedFile(null);
    setCurrentImageUrl("");
    setValue("image", "");
  };

  // --- Handler สำหรับการส่งฟอร์มหลัก ---
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    let finalImageUrl = values.image || "";
    let hasUploadError = false;

    try {
      // 1. อัพโหลดไฟล์ถ้ามี
      if (selectedFile) {
        const uploadResult = await callUploadApi(selectedFile, "advisors");
        if (uploadResult.filePath) {
          finalImageUrl = uploadResult.filePath;
          setSelectedFile(null);
          setCurrentImageUrl(finalImageUrl);
        } else {
          hasUploadError = true;
        }
      }

      if (hasUploadError) {
        setLoading(false);
        toast({
          title: "อัปโหลดรูปไม่สำเร็จ",
          description: "กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
        return;
      }

      // 2. เตรียมข้อมูลสำหรับส่ง
      const payload = { ...values, image: finalImageUrl };

      // 3. ส่งข้อมูลไปที่ API
      const response = await fetch("/api/advisor", {
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
          description: data.message || "เพิ่มอาจารย์นิเทศสำเร็จ",
          variant: "success",
        });
        router.push("/admin/advisors");
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
          <Sidebar activePage="advisors" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <a href="/admin/advisors">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/advisors" className="hover:text-gray-900">
                  อาจารย์นิเทศ
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">เพิ่มบัญชีใหม่</span>
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
                          {/* ส่วนการอัปโหลดรูปภาพ (ดีไซน์ใหม่) */}
                          <div className="sm:col-span-12 flex flex-col items-center justify-center text-center">
                            <div className="flex flex-row items-center justify-center gap-4">
                              <div className="relative flex items-center justify-center">
                                <input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="image-upload"
                                  className="cursor-pointer"
                                >
                                  <CustomAvatar
                                    id={`advisor${getValues("username")}`}
                                    image={currentImageUrl}
                                    size="32"
                                  />
                                </label>
                                {currentImageUrl && (
                                  <Button
                                    type="button"
                                    onClick={handleImageDeleteClick}
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow bg-white border border-gray-200"
                                    disabled={loading}
                                    title="ลบรูปภาพ"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="sm:col-span-12">
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
                              placeholder="กรุณากรอกชื่ออาจารย์นิเทศ"
                            />
                            {errors.fullname && (
                              <p className="text-sm text-red-600">
                                {errors.fullname.message}
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
                                {errors.password.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-12">
                            <div className="flex items-center gap-2">
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
