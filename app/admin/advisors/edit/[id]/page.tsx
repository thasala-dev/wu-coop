"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit, ChevronRight, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { callUploadApi, callDeleteApi } from "@/lib/file-api";
import CustomAvatar from "@/components/avatar";
import AvatarDesign from "@/components/AvatarDesign";

// --- Schema การตรวจสอบข้อมูล (Zod) ---
const formSchema = z.object({
  fullname: z.string().min(1, "กรุณากรอกชื่ออาจารย์นิเทศ"),
  image: z.string().optional(),
  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้"),
  password: z.string().optional().or(z.literal("")), // รหัสผ่าน, optional หรือค่าว่าง
});

// --- Component หลัก ---
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

  // --- Effect สำหรับโหลดข้อมูลเมื่อ Component ถูก mount หรือ ID เปลี่ยน ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/advisor/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        if (data.success) {
          const advisorData = data.data;
          setValue("fullname", advisorData.fullname);
          setValue("image", advisorData.image || "");
          setValue("username", advisorData.username);
          // ไม่ต้อง setValue 'password' ที่ดึงมาจาก API เพราะมันไม่ควรถูกแสดง
        } else {
          toast({
            title: "ไม่พบข้อมูล",
            description: data.message || "เกิดข้อผิดพลาด",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching advisor data:", error);
        toast({
          title: "ไม่สามารถโหลดข้อมูลได้",
          description: "เกิดข้อผิดพลาดในการดึงข้อมูล",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setValue, toast]);

  // --- Handler สำหรับการส่งฟอร์มหลัก ---
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const payload = values; // Ensure 'image' field reflects the latest status
      if (payload.password === "") {
        delete payload.password; // ลบ password ออกจาก payload หากเป็นค่าว่าง
      }

      // 4. Submit main form data
      const response = await fetch(`/api/advisor/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: "ดำเนินการสำเร็จ",
          description: data.message || "แก้ไขข้อมูลอาจารย์นิเทศสำเร็จ",
          variant: "success",
        });
        router.push("/admin/advisors");
      } else {
        toast({
          title: "ดำเนินการไม่สำเร็จ",
          description: data.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อบันทึกข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // --- Render UI ---
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="advisors" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            {/* ส่วนหัวของหน้า */}
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
                <span className="text-gray-900">แก้ไขอาจารย์นิเทศ</span>
              </div>
            </div>

            {/* Card Form หลัก */}
            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="p-0">
                  <div className="p-6 relative">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                      {/* ข้อมูลทั่วไป */}
                      <div className="sm:col-span-12">
                        <h2 className="font-semibold tracking-tight text-lg">
                          ข้อมูลทั่วไป
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

                      <div className="sm:col-span-12">
                        <label htmlFor="fullname">ชื่ออาจารย์นิเทศ</label>
                        <input
                          id="fullname"
                          type="text"
                          {...register("fullname")}
                          className={`w-full p-2 border rounded-md ${
                            errors.fullname ? "border-red-600 border-2" : ""
                          }`}
                          placeholder="กรุณากรอกชื่ออาจารย์นิเทศ"
                        />
                        {errors.fullname && (
                          <p className="text-sm text-red-600">
                            {errors.fullname.message}
                          </p>
                        )}
                      </div>

                      {/* ข้อมูลผู้ใช้งาน */}
                      <div className="sm:col-span-12">
                        <h2 className="font-semibold tracking-tight text-lg">
                          ข้อมูลผู้ใช้งาน
                        </h2>
                      </div>
                      <div className="sm:col-span-6">
                        <label htmlFor="username">Username</label>
                        <input
                          id="username"
                          type="text"
                          {...register("username")}
                          className={`w-full p-2 border rounded-md ${
                            errors.username ? "border-red-600 border-2" : ""
                          }`}
                          placeholder="กรุณากรอกชื่อผู้ใช้งาน"
                        />
                        {errors.username && (
                          <p className="text-sm text-red-600">
                            {errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-6">
                        <label htmlFor="password">
                          Password (หากไม่ต้องการแก้ไขไม่ต้องกรอก)
                        </label>
                        <input
                          id="password"
                          type="password"
                          {...register("password")}
                          className={`w-full p-2 border rounded-md ${
                            errors.password ? "border-red-600 border-2" : ""
                          }`}
                          placeholder="กรุณากรอกรหัสผ่าน"
                        />
                        {errors.password && (
                          <p className="text-sm text-red-600">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* ปุ่มบันทึก */}
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
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
