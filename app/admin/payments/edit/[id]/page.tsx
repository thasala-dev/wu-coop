"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit, ChevronRight, Trash2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { callUploadApi, callDeleteApi } from "@/lib/file-api";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";

// --- Schema การตรวจสอบข้อมูล (Zod) ---
const formSchema = z.object({
  calendar_id: z.string().min(1, "กรุณาเลือกปีการศึกษา"),
  company_id: z.string().min(1, "กรุณาเลือกแหล่งฝึก"),
  amount: z
    .string()
    .min(1, "กรุณากรอกจำนวนเงิน")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "กรุณากรอกจำนวนเงินให้ถูกต้อง (สามารถมีทศนิยม 2 ตำแหน่งได้)"
    ),
  detail: z.string().optional(),
  payment_date: z.string().min(1, "กรุณาเลือกวันที่ชำระเงิน"),
  file_attachment: z.string().optional(),
});

// --- Component หลัก ---
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendar_id: "",
      company_id: "",
      amount: "",
      detail: "",
      payment_date: "",
      file_attachment: "",
    },
  });

  // --- Effect สำหรับโหลดข้อมูลเมื่อ Component ถูก mount หรือ ID เปลี่ยน ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch payment data
        const paymentResponse = await fetch(`/api/admin/payments?id=${id}`);
        const paymentData = await paymentResponse.json();

        // Fetch calendars
        const calendarResponse = await fetch("/api/calendar");
        const calendarData = await calendarResponse.json();

        // Fetch companies
        const companyResponse = await fetch("/api/company");
        const companyData = await companyResponse.json();

        if (paymentData.success && paymentData.data.length > 0) {
          const payment = paymentData.data[0];
          setValue("calendar_id", payment.calendar_id?.toString() || "");
          setValue("company_id", payment.company_id?.toString() || "");
          setValue("amount", payment.amount?.toString() || "");
          setValue("detail", payment.detail || "");
          setValue("payment_date", payment.payment_date || "");
          setValue("file_attachment", payment.file_attachment || "");

          // Set payment date for calendar component
          if (payment.payment_date) {
            setPaymentDate(new Date(payment.payment_date));
          }
        } else {
          toast({
            title: "ไม่พบข้อมูล",
            description: "ไม่พบข้อมูลการชำระเงิน",
            variant: "destructive",
          });
        }

        if (calendarData.success) {
          setCalendars(calendarData.data);
        }

        if (companyData.success) {
          setCompanies(companyData.data);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
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

  // Handle file attachment upload
  const handleFileUpload = async (file: File) => {
    // Check if file is an image or PDF
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "ไฟล์ไม่ถูกต้อง",
        description: "กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, GIF) หรือ PDF เท่านั้น",
        variant: "destructive",
      });
      return null;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "ไฟล์ใหญ่เกินไป",
        description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5 MB",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);

    try {
      const result = await callUploadApi(file, "payments", false);
      if (result.success) {
        toast({
          title: "อัพโหลดสำเร็จ",
          description: "อัพโหลดไฟล์แนบเรียบร้อยแล้ว",
          variant: "success",
        });
        return result.filePath;
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "อัพโหลดไม่สำเร็จ",
        description: "ไม่สามารถอัพโหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Remove file attachment
  const removeFileAttachment = async () => {
    const currentFile = getValues("file_attachment");
    if (currentFile) {
      try {
        // Delete file from server
        await callDeleteApi(currentFile);
        setValue("file_attachment", "");
        toast({
          title: "ลบไฟล์สำเร็จ",
          description: "ลบไฟล์แนบเรียบร้อยแล้ว",
          variant: "success",
        });
      } catch (error) {
        console.error("Error deleting file:", error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลบไฟล์จากเซิร์ฟเวอร์ได้",
          variant: "destructive",
        });
      }
    }
  };

  // --- Handler สำหรับการส่งฟอร์มหลัก ---
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      let fileAttachment = values.file_attachment;

      // เตรียมข้อมูลสำหรับส่ง
      const payload = {
        ...values,
        id: id,
      };

      // ส่งข้อมูลไปที่ API
      const response = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "ดำเนินการสำเร็จ",
          description: data.message || "แก้ไขข้อมูลการชำระเงินสำเร็จ",
          variant: "success",
        });
        router.push("/admin/payments");
      } else {
        toast({
          title: "ดำเนินการไม่สำเร็จ",
          description: data.message || "เกิดข้อผิดพลาด",
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
      <div className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="payments" userType="admin" />
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
                <a href="/admin/payments">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/payments" className="hover:text-gray-900">
                  การชำระเงิน
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">แก้ไขการชำระเงิน</span>
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
                              ข้อมูลการชำระเงิน
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label>ปีการศึกษา</label>
                            <select
                              id="calendar_id"
                              {...register("calendar_id")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.calendar_id
                                  ? "border-red-600 border-2"
                                  : "")
                              }
                            >
                              <option value="">เลือกปีการศึกษา</option>
                              {calendars.map((calendar: any) => (
                                <option key={calendar.id} value={calendar.id}>
                                  {calendar.name} ({calendar.semester}/
                                  {calendar.year})
                                </option>
                              ))}
                            </select>
                            {errors.calendar_id && (
                              <p className="text-sm text-red-600">
                                {errors.calendar_id.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-6">
                            <label>แหล่งฝึก</label>
                            <select
                              id="company_id"
                              {...register("company_id")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.company_id
                                  ? "border-red-600 border-2"
                                  : "")
                              }
                            >
                              <option value="">เลือกแหล่งฝึก</option>
                              {companies.map((company: any) => (
                                <option key={company.id} value={company.id}>
                                  {company.name}
                                </option>
                              ))}
                            </select>
                            {errors.company_id && (
                              <p className="text-sm text-red-600">
                                {errors.company_id.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-6">
                            <label>จำนวนเงิน (บาท)</label>
                            <input
                              id="amount"
                              type="number"
                              step="0.01"
                              min="0"
                              {...register("amount")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.amount ? "border-red-600 border-2" : "")
                              }
                              placeholder="0.00"
                            />
                            {errors.amount && (
                              <p className="text-sm text-red-600">
                                {errors.amount.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-6">
                            <label>วันที่ชำระเงิน</label>
                            <div>
                              <input
                                type="hidden"
                                {...register("payment_date")}
                                value={
                                  paymentDate
                                    ? format(paymentDate, "yyyy-MM-dd")
                                    : ""
                                }
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !paymentDate && "text-muted-foreground",
                                      errors.payment_date
                                        ? "border-red-600 border-2"
                                        : ""
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {paymentDate ? (
                                      format(paymentDate, "d MMMM yyyy", {
                                        locale: th,
                                      })
                                    ) : (
                                      <span>เลือกวันที่ชำระเงิน</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0 shadow-md rounded-md"
                                  align="start"
                                >
                                  <CalendarComponent
                                    selected={paymentDate || undefined}
                                    onSelect={(date: Date | null) => {
                                      setPaymentDate(date);
                                      if (date) {
                                        setValue(
                                          "payment_date",
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
                            {errors.payment_date && (
                              <p className="text-sm text-red-600">
                                {errors.payment_date.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <label>รายละเอียด</label>
                            <textarea
                              id="detail"
                              {...register("detail")}
                              rows={4}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.detail ? "border-red-600 border-2" : "")
                              }
                              placeholder="กรอกรายละเอียดเพิ่มเติม (ถ้ามี)"
                            />
                            {errors.detail && (
                              <p className="text-sm text-red-600">
                                {errors.detail.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <label className="text-sm font-medium text-gray-700">
                              ไฟล์แนบเอกสารหลักฐาน
                            </label>
                            <div className="text-xs text-blue-600 mb-2">
                              ** รองรับไฟล์รูปภาพ (JPG, PNG, GIF) และ PDF
                              เท่านั้น (ขนาดไม่เกิน 5 MB)
                            </div>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50/30">
                              {watch("file_attachment") ? (
                                /* Preview Area */
                                <div className="space-y-4">
                                  <div className="relative group">
                                    <div className="w-full mx-auto">
                                      {/* Check if it's PDF or Image */}
                                      {watch("file_attachment")
                                        ?.toLowerCase()
                                        .endsWith(".pdf") ? (
                                        <iframe
                                          src={watch("file_attachment")}
                                          className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                                          style={{ height: "600px" }}
                                          title="PDF Preview"
                                        />
                                      ) : (
                                        <img
                                          src={watch("file_attachment")}
                                          alt="Payment proof"
                                          className="w-full max-w-md mx-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                                        />
                                      )}
                                    </div>
                                    <div className="absolute top-2 right-2">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={removeFileAttachment}
                                        className="shadow-lg"
                                      >
                                        <svg
                                          className="h-4 w-4 mr-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                        ลบไฟล์
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm text-blue-600 font-medium">
                                      ✓ อัพโหลดไฟล์แนบเรียบร้อยแล้ว
                                    </p>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const input =
                                          document.createElement("input");
                                        input.type = "file";
                                        input.accept = "image/*,.pdf";
                                        input.onchange = async (e) => {
                                          const file = (
                                            e.target as HTMLInputElement
                                          ).files?.[0];
                                          if (file) {
                                            const filePath =
                                              await handleFileUpload(file);
                                            if (filePath) {
                                              setValue(
                                                "file_attachment",
                                                filePath
                                              );
                                            }
                                          }
                                        };
                                        input.click();
                                      }}
                                      className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                                      disabled={isUploading}
                                    >
                                      {isUploading
                                        ? "กำลังอัพโหลด..."
                                        : "เปลี่ยนไฟล์ใหม่"}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                /* Upload Button Area */
                                <div className="text-center">
                                  <div className="mb-4">
                                    <svg
                                      className="mx-auto h-12 w-12 text-blue-400"
                                      stroke="currentColor"
                                      fill="none"
                                      viewBox="0 0 48 48"
                                    >
                                      <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div className="mb-4">
                                    <h4 className="text-lg font-medium text-gray-900">
                                      อัพโหลดเอกสารหลักฐาน
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                      อัพโหลดไฟล์รูปภาพหรือ PDF หรือลากวางที่นี่
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      รองรับไฟล์: JPG, PNG, GIF, PDF
                                      (ขนาดไม่เกิน 5 MB)
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      const input =
                                        document.createElement("input");
                                      input.type = "file";
                                      input.accept = "image/*,.pdf";
                                      input.onchange = async (e) => {
                                        const file = (
                                          e.target as HTMLInputElement
                                        ).files?.[0];
                                        if (file) {
                                          const filePath =
                                            await handleFileUpload(file);
                                          if (filePath) {
                                            setValue(
                                              "file_attachment",
                                              filePath
                                            );
                                          }
                                        }
                                      };
                                      input.click();
                                    }}
                                    disabled={isUploading}
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                  >
                                    {isUploading
                                      ? "กำลังอัพโหลด..."
                                      : "เลือกไฟล์"}
                                  </Button>
                                </div>
                              )}
                            </div>
                            {errors.file_attachment && (
                              <p className="text-sm text-red-600 mt-1">
                                {errors.file_attachment.message}
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
                                แก้ไขการชำระเงิน
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
