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
  std_year: z.string().min(1, "กรุณาเลือกกลุ่มรหัสนักศึกษา"),
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

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
    let finalImageUrl = values.image || "";
    let hasUploadError = false;

    try {
      // 1. อัพโหลดไฟล์ถ้ามี
      if (selectedFile) {
        const uploadResult = await callUploadApi(selectedFile, "students");
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
      const payload = {
        ...values,
        image: finalImageUrl,
        username: values.student_id,
        password: values.student_id,
      };

      // 3. ส่งข้อมูลไปที่ API
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
                                    id={`student${getValues("student_id")}`}
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
                                เลือกกลุ่มรหัสนักศึกษา
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
