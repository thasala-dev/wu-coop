"use client";
import Sidebar from "@/components/sidebar";
import MedAmbu from "@/components/evaluations/medAmbu";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Loading from "@/components/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { th } from "date-fns/locale";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import CARE_p1_w3 from "@/components/evaluations/CARE/p1_w3";

export default function MentorEvaluations() {
  const { toast } = useToast();
  const params = useParams();
  const id = params?.id as string;
  const type = params?.type as string;
  const subtype = params?.subtype as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [formType, setFormType] = useState<any>(null);
  const [formValidated, setFormValidated] = useState(false);
  const [isSubmit, setIsSubmit] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const formSchema = z.object({
    result_id: z.string(),
    evaluator: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
    evaluation_date: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
    result: z.any().optional(),
  });

  const getErrorMessage = (error: any) => {
    if (!error) return "";
    if (typeof error.message === "string") return error.message;
    if (typeof error === "string") return error;
    return String(error.message || "Invalid input");
  };

  const FormEvaluation = (props: any) => {
    return <CARE_p1_w3 {...props} />;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      result_id: "0",
      evaluator: "",
      evaluation_date: "",
      result: null,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    console.log("Fetching data for MedAmbu evaluation...", id, subtype);
    const response = await fetch(
      `/api/evaluations_mentor/${id}/${type}/${subtype}`
    );
    if (!response.ok) {
      toast({
        title: "ไม่สามารถโหลดข้อมูลได้",
        description: "เกิดข้อผิดพลาดในการโหลดข้อมูลการประเมิน",
        variant: "destructive",
      });
      return;
    }
    const data = await response.json();
    if (data.success) {
      setStudent(data.data);
      setFormType(data.type);

      form.setValue("result_id", String(data.form?.id) || "0");
      form.setValue("evaluator", data.form?.evaluator || "");

      if (data.form) {
        const parsedStartDate = parse(
          data.form.evaluation_date,
          "yyyy-MM-dd",
          new Date()
        );
        setSelectedDate(parsedStartDate);
      } else {
        setSelectedDate(null);
      }

      form.setValue("evaluation_date", data.form?.evaluation_date || "");
      form.setValue("result", data.form?.result || null);
    }

    console.log("Fetched data:", data);
    setLoading(false);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit of pearent form");
    setLoading(true);
    try {
      // ตรวจสอบว่ามีการกรอกข้อมูลที่จำเป็นหรือไม่
      if (!formValidated) {
        setLoading(false);
        return;
      }

      const payload = values;
      console.log("Submitting form with values:", payload);
      const response = await fetch(
        `/api/evaluations_mentor/${id}/${type}/${subtype}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: "ดำเนินการสำเร็จ",
          description: data.message || "แก้ไขข้อมูลผู้ดูแลระบบสำเร็จ",
          variant: "success",
        });
        router.push(`/mentor/evaluations/${id}`);
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
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="evaluations" userType="mentor" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-blue-100"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span
                  className="hover:text-gray-900 cursor-pointer"
                  onClick={() => router.push(`/mentor/evaluations/${id}`)}
                >
                  การประเมิน
                </span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900 font-medium">
                  รายละเอียดการประเมิน
                </span>
              </div>
            </div>

            <Card className="border shadow-sm">
              <CardHeader className="bg-slate-50 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-sm">{formType?.name}</CardTitle>
                    <CardDescription className="text-sm">
                      สำหรับอาจารย์ประจำแหล่งฝึก ({formType?.short_name})
                    </CardDescription>
                  </div>
                  <div className="border border-gray-800 p-2">
                    <h3 className="font-semibold text-sm">
                      {formType?.short_name}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {student && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 border rounded-md p-4 bg-white">
                      <div className="md:col-span-2">
                        <label className="text-sm">ชื่อนิสิต/นักศึกษา</label>
                        <div>{student?.fullname}</div>
                      </div>{" "}
                      <div className="md:col-span-2">
                        <label className="text-sm">รหัสนักศึกษา</label>
                        <div>{student?.student_id}</div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm">ชื่อแหล่งฝึก</label>
                        <div>{student?.company_name}</div>
                      </div>{" "}
                      <div className="md:col-span-2">
                        <label className="text-sm">ผลัดการฝึก</label>
                        <div>
                          {student?.calendar_name}{" "}
                          {student?.semester && student?.year ? (
                            <>
                              ({student.semester} / {student.year})
                            </>
                          ) : null}{" "}
                          {student?.start_date && student?.end_date ? (
                            <div className="text-xs text-gray-500">
                              {format(
                                new Date(student.start_date),
                                "d MMMM yyyy",
                                {
                                  locale: th,
                                }
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(student.end_date),
                                "d MMMM yyyy",
                                {
                                  locale: th,
                                }
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormEvaluation
                          form={form}
                          isSubmit={form.formState.isSubmitted}
                          setFormValidated={setFormValidated}
                          isClick={isSubmit}
                        />

                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                          <div className="sm:col-span-6 ">
                            <label>ชื่ออาจารย์ประจำแหล่งฝึก</label>
                            <input
                              id="evaluator"
                              type="text"
                              {...form.register("evaluator")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (form.formState.errors.evaluator
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="ชื่ออาจารย์ประจำแหล่งฝึก"
                            />
                            {form.formState.errors.evaluator && (
                              <p className="text-xs text-red-600">
                                {getErrorMessage(
                                  form.formState.errors.evaluator
                                )}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>วันที่ประเมิน</label>
                            <div>
                              <input
                                type="hidden"
                                {...form.register("evaluation_date")}
                                value={
                                  selectedDate
                                    ? format(selectedDate, "yyyy-MM-dd")
                                    : ""
                                }
                              />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full p-2 justify-start text-left font-normal",
                                      !selectedDate && "text-muted-foreground",
                                      form.formState.errors.evaluation_date
                                        ? "border-red-600 border-2"
                                        : ""
                                    )}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {selectedDate ? (
                                      format(selectedDate, "d MMMM yyyy", {
                                        locale: th,
                                      })
                                    ) : (
                                      <span>เลือกวันที่สิ้นสุด</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0 shadow-md rounded-md"
                                  align="start"
                                >
                                  <CalendarComponent
                                    selected={selectedDate || undefined}
                                    onSelect={(date: Date | null) => {
                                      setSelectedDate(date);
                                      if (date) {
                                        form.setValue(
                                          "evaluation_date",
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
                            {form.formState.errors.evaluation_date && (
                              <p className="text-xs text-red-600">
                                {getErrorMessage(
                                  form.formState.errors.evaluation_date
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-center mt-8">
                          {/* {form.formState.isSubmitted &&
                        Object.keys(form.formState.errors).length > 0 && (
                          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 border border-red-200 text-sm">
                            กรุณากรอกข้อมูลให้ครบทุกช่องที่จำเป็น
                          </div>
                        )} */}
                          <Button
                            type="submit"
                            className="px-8 py-2 text-sm"
                            disabled={isSubmitting}
                            onClick={() => {
                              setIsSubmit(isSubmit + 1);
                            }}
                          >
                            {isSubmitting
                              ? "กำลังบันทึก..."
                              : "บันทึกผลการประเมิน"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </>
                )}
              </CardContent>
            </Card>

            {/* <MedAmbu id={id} subtype={subtype} studentId={id} /> */}
          </div>
        </div>
      </main>
    </div>
  );
}
