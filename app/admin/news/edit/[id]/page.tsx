"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit, ChevronRight, Trash2, Calendar } from "lucide-react";
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
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamic import สำหรับ ReactQuill เพื่อหลีกเลี่ยง SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// --- Schema การตรวจสอบข้อมูล (Zod) ---
const formSchema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อประชาสัมพันธ์"),
  detail: z.string().min(1, "กรุณากรอกเนื้อหาประชาสัมพันธ์"),
  news_date: z.string().min(1, "กรุณาเลือกวันที่ประชาสัมพันธ์"),
  status: z.string().min(1, "กรุณาเลือกสถานะ"),
});

// --- Component หลัก ---
export default function Page() {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [newsDate, setNewsDate] = useState<Date | null>(null);
  const [editorContent, setEditorContent] = useState("");
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
      title: "",
      detail: "",
      news_date: "",
      status: "1",
    },
  });

  // --- Effect สำหรับโหลดข้อมูลเมื่อ Component ถูก mount หรือ ID เปลี่ยน ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        if (data.success) {
          const newsData = data.data;
          setValue("title", newsData.title || "");
          setValue("detail", newsData.detail || "");
          setValue("news_date", newsData.news_date || "");
          setValue("status", String(newsData.status || "1"));
          setNewsDate(newsData.news_date ? new Date(newsData.news_date) : null);
          setEditorContent(newsData.detail || "");
        } else {
          toast({
            title: "ไม่พบข้อมูล",
            description:
              data.message || "ไม่พบข่าวประชาสัมพันธ์ที่ต้องการแก้ไข",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching news data:", error);
        toast({
          title: "ไม่สามารถโหลดข้อมูลได้",
          description: "เกิดข้อผิดพลาดในการดึงข้อมูลข่าวประชาสัมพันธ์",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setValue, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const payload = {
        ...values,
        detail: editorContent, // ใช้เนื้อหาจาก editor
        status: parseInt(values.status),
      };

      const response = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: "ดำเนินการสำเร็จ",
          description: data.message || "แก้ไขข่าวประชาสัมพันธ์สำเร็จ",
          variant: "success",
        });
        router.push("/admin/news");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="news" userType="admin" />
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
                <a href="/admin/news">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/news" className="hover:text-gray-900">
                  ข่าวประชาสัมพันธ์
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">แก้ไขข่าวประชาสัมพันธ์</span>
              </div>
            </div>

            {/* Card Form หลัก */}
            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="p-0">
                  <div className="p-6 relative">
                    <div>
                      <div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                          <div className="sm:col-span-12">
                            <div className="font-semibold tracking-tight text-lg">
                              แก้ไขข่าวประชาสัมพันธ์
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
                            <textarea
                              id="detail"
                              {...register("detail")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.detail
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกเนื้อหาประชาสัมพันธ์"
                              rows={4}
                            ></textarea>
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
