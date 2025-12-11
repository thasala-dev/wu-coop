"use client";

import React, { useState } from "react";
import { ArrowLeft, Edit, ChevronRight, Trash2, Calendar } from "lucide-react";
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
import AvatarDesign from "@/components/AvatarDesign";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamic import สำหรับ MDEditor เพื่อหลีกเลี่ยง SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// --- Schema การตรวจสอบข้อมูล (Zod) ---
const formSchema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อประชาสัมพันธ์"),
  detail: z.string().min(1, "กรุณากรอกเนื้อหาประชาสัมพันธ์"),
  news_date: z.string().min(1, "กรุณาเลือกวันที่ประชาสัมพันธ์"),
  status: z.string().min(1, "กรุณาเลือกสถานะ"),
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [newsDate, setNewsDate] = useState<Date | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      detail: "",
      news_date: "",
      status: "1",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const payload = {
        ...values,
        status: parseInt(values.status),
      };

      const response = await fetch("/api/news", {
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
          description: data.message || "เพิ่มข่าวประชาสัมพันธ์สำเร็จ",
          variant: "success",
        });
        router.push("/admin/news");
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
      <div className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="news" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <a href="/admin/news">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/news" className="hover:text-gray-900">
                  ข่าวประชาสัมพันธ์
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">เพิ่มใหม่</span>
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
                              เพิ่มใหม่
                            </div>
                          </div>

                          <div className="sm:col-span-12">
                            <label>หัวข้อประชาสัมพันธ์</label>
                            <input
                              id="title"
                              type="text"
                              {...register("title")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.title ? "border-red-600  border-2" : "")
                              }
                              placeholder="กรุณากรอกหัวข้อประชาสัมพันธ์"
                            />
                            {errors.title && (
                              <p className="text-sm text-red-600">
                                {errors.title.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-12">
                            <label>เนื้อหาประชาสัมพันธ์</label>
                            <div className="border rounded-md overflow-hidden">
                              <MDEditor
                                value={watch("detail") || ""}
                                onChange={(value) =>
                                  setValue("detail", value || "")
                                }
                                preview="edit"
                                height={300}
                                data-color-mode="light"
                              />
                            </div>
                            {errors.detail && (
                              <p className="text-sm text-red-600">
                                {errors.detail.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <label>สถานะ</label>
                            <select
                              {...register("status")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.status ? "border-red-600 border-2" : "")
                              }
                            >
                              <option value="1">เปิดใช้งาน</option>
                              <option value="0">ปิดใช้งาน</option>
                            </select>
                            {errors.status && (
                              <p className="text-sm text-red-600">
                                {errors.status.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <label>วันที่ประชาสัมพันธ์</label>
                            <div>
                              <input
                                type="hidden"
                                {...register("news_date")}
                                value={
                                  newsDate ? format(newsDate, "yyyy-MM-dd") : ""
                                }
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !newsDate && "text-muted-foreground",
                                      errors.news_date
                                        ? "border-red-600 border-2"
                                        : ""
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {newsDate ? (
                                      format(newsDate, "d MMMM yyyy", {
                                        locale: th,
                                      })
                                    ) : (
                                      <span>เลือกวันที่ประชาสัมพันธ์</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0 shadow-md rounded-md"
                                  align="start"
                                >
                                  <CalendarComponent
                                    selected={newsDate || undefined}
                                    onSelect={(date: Date | null) => {
                                      setNewsDate(date);
                                      if (date) {
                                        setValue(
                                          "news_date",
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
                            {errors.news_date && (
                              <p className="text-sm text-red-600">
                                {errors.news_date.message}
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
