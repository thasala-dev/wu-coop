"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PassFailRadioGroup } from "./PassFailRadioGroup";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ArrowLeft, Edit, ChevronRight, Save, Calendar } from "lucide-react";

const evaluationSchema = z.object({
  p1_main: z.object({
    p1_1: z.enum(["pass", "fail"], {
      required_error: "กรุณาเลือกผลการประเมิน",
    }),
    p1_2: z.enum(["pass", "fail"], {
      required_error: "กรุณาเลือกผลการประเมิน",
    }),
    p1_3: z.enum(["pass", "fail"], {
      required_error: "กรุณาเลือกผลการประเมิน",
    }),
    p1_4: z.enum(["pass", "fail"], {
      required_error: "กรุณาเลือกผลการประเมิน",
    }),
    p1_5: z.enum(["pass", "fail"], {
      required_error: "กรุณาเลือกผลการประเมิน",
    }),
    p1_6: z.enum(["pass", "fail"], {
      required_error: "กรุณาเลือกผลการประเมิน",
    }),
  }),
  p1_feedback: z.object({
    strengths: z.string().optional(),
    improvements: z.string().optional(),
  }),
  period: z.enum(["p1_w3", "p1_w6"], {
    required_error: "กรุณาเลือกครั้งที่ประเมิน",
  }),

  advisorName: z.string().min(1, { message: "กรุณาระบุชื่ออาจารย์" }),
  date: z.string().min(1, { message: "กรุณาเลือกวันที่" }),
  siteId: z.string().min(1, { message: "กรุณาระบุชื่อแหล่งฝึก" }),
  internshipType: z
    .string()
    .min(1, { message: "กรุณาระบุประเภทการปฏิบัติงาน" }),
});

export default function MedAmbu({
  id,
  subtype,
  studentId,
  studentName,
  internshipId,
}: {
  id: string;
  subtype: string;
  studentId?: string;
  studentName?: string;
  internshipId?: number;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const form = useForm<z.infer<typeof evaluationSchema>>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      p1_main: {
        p1_1: undefined,
        p1_2: undefined,
        p1_3: undefined,
        p1_4: undefined,
        p1_5: undefined,
        p1_6: undefined,
      } as any,
      p1_feedback: {
        strengths: "",
        improvements: "",
      },
      period: subtype as "p1_w3" | "p1_w6",
      advisorName: "",
      date: new Date().toISOString().split("T")[0],
      siteId: "",
      internshipType: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof evaluationSchema>) {
    setIsSubmitting(true);

    const hasUndefinedValues = Object.values(values.p1_main).some(
      (value) => value === undefined
    );

    if (hasUndefinedValues) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณาเลือกผลการประเมินให้ครบทุกหัวข้อ",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Example saving to API
    try {
      // Implement API call to save evaluation
      // await fetch("/api/evaluations/medambu", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     ...values,
      //     studentId,
      //     internshipId,
      //   }),
      // });

      // Success message
      toast({
        title: "บันทึกการประเมินสำเร็จ",
        description: "ข้อมูลการประเมินถูกบันทึกเรียบร้อยแล้ว",
        variant: "success",
      });
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการประเมินได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  const criteriaData = {
    p1_1: {
      title: "1. ความสนใจและเอาใจใส่ต่อการฝึกปฏิบัติงานวิชาชีพ",
      description:
        "นิสิต/นักศึกษามีความสนใจและมุ่งมั่นในการฝึกปฏิบัติงานวิชาชีพ มีความเอาใจใส่ในการรับฟังคำแนะนำผู้สอนเป็นสำคัญ ปฏิบัติตัวอยู่ในสถานที่ที่กำหนดให้และเขียนรายงานตรงเวลามากกว่าร้อยละ 80 ของช่วงเวลาของการฝึกปฏิบัติงานวิชาชีพทั้งหมด",
    },
    p1_2: {
      title: "2. ความซื่อสัตย์และจรรยาบรรณวิชาชีพ",
      description:
        "นิสิต/นักศึกษามีความซื่อสัตย์ โดยปฏิบัติตามหลักจรรยาบรรณดังนี้\n- ไม่เปิดเผยความลับของผู้ป่วยในวงกว้าง ๆ\n- ปฏิบัติตามคำสั่งและเชื่อฟังอย่าง ๆ ขององค์กรประจำแหล่งฝึกอย่างเคร่งครัด\n- ไม่กระทำผิดวิชาชีพตามจรรยาบรรณวิชาชีพ\n- กรอกยาให้แก่ผู้ป่วยตรงกับชนิด ขนาด จำนวน และฉลากยา\n- ไม่คัดลอกผลงานของผู้อื่นมาเป็นของตนเองรวมทั้งความบกพร่องในการอ้างอิง",
    },
    p1_3: {
      title: "3. ความเคารพผู้อื่น",
      description:
        "นิสิต/นักศึกษามีความประพฤติอ่อนน้อม เหมาะสมกับความเคารพที่พึงมีต่อผู้ป่วย อาจารย์ประจำแหล่งฝึกและสหสาขาวิชาชีพ โดยพฤติกรรมดังนี้\n- ต้องแสดงกิริยา มารยาท ความสุภาพ ความคิด ความเห็นและความรักเกียรติหรือศักดิ์ศรีของตนเองที่พึงมี\n- เป็นผู้รับฟังที่ดีตั้งใจฟังผู้ป่วย อาจารย์ประจำแหล่งฝึกและสหสาขาวิชาชีพและสามารถเรียบเรียงคำถามที่ชัดเจน เข้าใจง่ายง่าย มีเหตุผลที่ถูกกาละเทศะ อาจารย์ประจำแหล่งฝึกและสหสาขาวิชาชีพพึงสอบถาม\n- ใช้ถ้อยคำเหมาะสม สุภาพ อุดมสภาพดี",
    },
    p1_4: {
      title: "4. ความเป็นวิชาชีพ มนุษยธรรม",
      description:
        "นิสิต/นักศึกษาแสดงให้เห็นถึงความเห็นอกเห็นใจและความรับผิดชอบ ตุ่นตัวที่ดีในการสะท้อนให้เห็นถึงความเป็นวิชาชีพและจริยธรรมในการปฏิบัติอย่างเหมาะสม และศึกษาหาความรู้ตลอดเวลาเพื่อการพัฒนาทางวิชาชีพ",
    },
    p1_5: {
      title: "5. ความใฝ่รู้และความพยายามในการฝีกปฏิบัติงานวิชาชีพ",
      description:
        "นิสิต/นักศึกษามีความใฝ่รู้ ความพยายามในการพัฒนาตนเองให้ได้ตามวัตถุประสงค์ของการฝึก โดยครบถ้วนดังนี้\n- มีการเตรียมตัวให้พร้อมสำหรับการฝึกปฏิบัติงานวิชาชีพ\n- มีการขอคำแนะนำปรึกษากับอาจารย์ประจำแหล่งฝึกเมื่อพบปัญหาหรือข้อสงสัยในระหว่างการฝึกปฏิบัติงานวิชาชีพอย่างเหมาะสมกับระดับของนิสิต/นักศึกษา",
    },
    p1_6: {
      title: "6. ความรับผิดชอบในการฝึกปฏิบัติงานวิชาชีพ",
      description:
        "นิสิต/นักศึกษามีความรับผิดชอบต่องานที่ได้รับมอบหมาย โดยครบถ้วนดังนี้\n- มาถึงปฏิบัติงานตรงตามเวลา ไม่ขาดการฝึกปฏิบัติงานโดยไม่มีเหตุผลหรือไม่แจ้งล่วงหน้า\n- มีความรับผิดชอบต่องานที่ได้รับมอบหมาย",
    },
  };

  return (
    <div className="mx-auto">
      <Card className="border shadow-sm">
        <CardHeader className="bg-slate-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm">
                แบบประเมินความประพฤติและทัศนคติของนิสิต/นักศึกษา
              </CardTitle>
              <CardDescription className="text-sm">
                สำหรับอาจารย์ประจำแหล่งฝึก (แบบ-ป-1)
              </CardDescription>
            </div>
            <div className="border border-gray-800 p-2">
              <h3 className="font-semibold text-sm">แบบ-ป-1</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="">
                  <p className="text-sm">
                    ให้อาจารย์ประจำแหล่งฝึกประเมินผลโดยสังเกตจากพฤติกรรม
                    ผลการปฏิบัติงานและ/หรือจากการ อภิปรายสอบถาม การสื่อสาร
                    ทั้งโดยวาจา หรือลายลักษณ์อักษร และให้ประเมิน 2 ครั้ง
                    คือในสัปดาห์ที่ 3 และ 6 ของการฝึกปฏิบัติงาน
                    ผลการประเมินในสัปดาห์ที่ 3
                    ควรมีการแจ้งให้นิสิต/นักศึกษาทราบเพื่อให้เกิดการพัฒนา
                    <u className="font-medium italic">
                      การประเมินผลการฝึกปฏิบัติงานจะถือจากผลการประเมินในสัปดาห์ที่
                      6
                    </u>
                  </p>
                </div>
                <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                  <p className="text-sm mb-2">
                    <strong>คำชี้แจง</strong>
                  </p>
                  <p className="text-xs sm:text-sm mb-4">
                    ให้ทำเครื่องหมายกากบาท (✗)
                    ในช่องผลการประเมินที่ตรงกับทักษะและความสามารถของนิสิต/
                    นักศึกษาที่ท่านดูแลมากที่สุด
                    (ประเมินทั้งในและนอกเวลาการฝึกปฏิบัติงานฯ)
                  </p>
                  <p className="text-xs sm:text-sm mb-2">
                    ทั้งนี้ เมื่อสิ้นสุดการศึกษา{" "}
                    <u className="font-bold">
                      นิสิต/นักศึกษาจะต้องผ่านทั้ง 6
                      หัวข้อการประเมินพฤติกรรมและความเป็นวิชาชีพ
                    </u>{" "}
                    จึงจะผ่านการฝึกปฏิบัติงานวิชาชีพในสถานนั้น ๆ
                    และการประเมินในส่วนนี้จะไม่ถูกนำมาคิดเป็น
                    คะแนนในการประเมินผลการเรียนของนิสิต/นักศึกษา (เกรด A-F)
                  </p>
                  <p className="text-xs sm:text-sm mt-4">
                    หากนิสิต/นักศึกษาได้รับการประเมิน{" "}
                    <u className="font-bold">"ไม่ผ่าน"</u>{" "}
                    ในหัวข้อการประเมินพฤติกรรมและความเป็นวิชาชีพ
                    <u className="font-bold"> ข้อใดข้อหนึ่ง</u>{" "}
                    ในการประเมินเมื่อสิ้นสุดการฝึกปฏิบัติงานวิชาชีพ{" "}
                    <u className="font-bold">
                      จะถือว่านิสิต/นักศึกษา "ไม่ผ่าน"
                    </u>{" "}
                    การฝึกปฏิบัติงานวิชาชีพในสถานนั้น ๆ
                  </p>
                </div>
                <div className="rounded-md bg-blue-50 p-4 border border-blue-200 mb-4">
                  <p className="text-sm mb-2">
                    <strong>หมายเหตุ</strong>
                  </p>
                  <p className="text-xs sm:text-sm mb-4">
                    - ในสัปดาห์ที่ 3 การประเมิน{" "}
                    <u className="font-bold">"ไม่ผ่าน"</u> ในหัวข้อใด
                    ให้อาจารย์ประจําแหล่งฝากแจ้งนิสิต/นักศึกษาให้ปรับปรุง ตัว
                    และทําการประเมินอีกครั้งในสัปดาห์ที่ 6
                  </p>
                  <p className="text-xs sm:text-sm">
                    - การประเมิน <u className="font-bold">"ไม่ผ่าน"</u>{" "}
                    ในหัวข้อใดหัวข้อหนึ่ง เมื่อสิ้นสุดการฝึกปฏิบัติงานวิชาชีพ
                    (สัปดาห์ที่ 6) นิสิต/ นักศึกษาจะได้รับการประเมิน{" "}
                    <u className="font-bold">"ไม่ผ่าน"</u>
                    ในการฝึกปฏิบัติงานวิชาชีพในผลัดนั้น ๆ
                  </p>
                </div>

                {/* Internship Information */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {" "}
                  <div className="md:col-span-2">
                    <Label className="text-sm">ครั้งที่ประเมิน</Label>
                    <Input
                      value={
                        subtype === "p1_w3"
                          ? "ครั้งที่ 1 (สัปดาห์ที่ 3)"
                          : "ครั้งที่ 2 (สัปดาห์ที่ 6)"
                      }
                      disabled
                      className="bg-gray-100 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2"></div>
                  <div className="md:col-span-2">
                    <Label className="text-sm">ชื่อนิสิต/นักศึกษา</Label>
                    <Input
                      value={studentName || ""}
                      disabled
                      className="bg-gray-100 text-sm"
                    />
                  </div>{" "}
                  <div className="md:col-span-2">
                    <Label className="text-sm">รหัสนักศึกษา</Label>
                    <Input
                      value={studentId || ""}
                      disabled
                      className="bg-gray-100 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm">ปฏิบัติงาน</Label>
                    <Input
                      placeholder="ระบุชื่อสถานที่ฝึกงาน"
                      className="text-sm"
                      {...form.register("internshipType")}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label className="text-sm">ชื่อแหล่งฝึก</Label>
                    <Input
                      placeholder="สถานที่ฝึก"
                      className="text-sm"
                      {...form.register("siteId")}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label className="text-sm">ครั้งที่</Label>
                    <Input
                      placeholder="ระบุครั้งที่"
                      className="text-sm"
                      disabled
                    />
                  </div>
                </div>
                {/* Evaluation Table */}
                <div className="border rounded-md mt-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-2 border text-left text-sm">
                          หัวข้อการประเมิน
                        </th>
                        <th
                          className="hidden sm:block p-2 border text-left text-sm"
                          style={{ width: "50%" }}
                        >
                          คำอธิบาย
                        </th>
                        <th
                          className="p-2 border text-center text-sm"
                          style={{ width: "60px" }}
                        >
                          ผ่าน
                        </th>
                        <th
                          className="p-2 border text-center  text-sm"
                          style={{ width: "60px" }}
                        >
                          ไม่ผ่าน
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(criteriaData).map(([key, data]) => (
                        <tr key={key} className="border-b">
                          <td className="p-3 border font-medium align-top text-sm">
                            <div className="mb-2">{data.title}</div>
                            <div
                              className="flex sm:hidden text-xs text-gray-500"
                              dangerouslySetInnerHTML={{
                                __html: data.description.replace(
                                  /\n/g,
                                  "<br/>"
                                ),
                              }}
                            />
                          </td>
                          <td className="hidden sm:block p-3 border text-sm">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: data.description.replace(
                                  /\n/g,
                                  "<br/>"
                                ),
                              }}
                            />
                          </td>
                          <td className="p-2 border">
                            <div className="flex flex-col gap-2 items-center justify-center h-full">
                              <FormField
                                control={form.control}
                                name={`p1_main.${key}` as any}
                                render={({ field }) => (
                                  <FormItem className="space-y-0">
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className={`flex flex-col items-center gap-3 `}
                                      >
                                        <RadioGroupItem
                                          value="pass"
                                          id={`${key}-pass`}
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                    {form.formState.errors.p1_main?.[
                                      key as keyof typeof form.formState.errors.p1_main
                                    ] &&
                                      (form.watch("period") === "p1_w3" ||
                                        form.watch("period") === "p1_w6") && (
                                        <p className="text-xs text-red-500 mt-1">
                                          กรุณาเลือก
                                        </p>
                                      )}
                                  </FormItem>
                                )}
                              />
                            </div>
                          </td>
                          <td className="p-2 border">
                            <div className="flex flex-col gap-2 items-center justify-center h-full">
                              <FormField
                                control={form.control}
                                name={`p1_main.${key}` as any}
                                render={({ field }) => (
                                  <FormItem className="space-y-0">
                                    {" "}
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className={`flex flex-col items-center gap-3 `}
                                      >
                                        <RadioGroupItem
                                          value="fail"
                                          id={`${key}-fail`}
                                        />
                                      </RadioGroup>
                                    </FormControl>{" "}
                                    {form.formState.errors.p1_main?.[
                                      key as keyof typeof form.formState.errors.p1_main
                                    ] && (
                                      <div className="text-xs text-red-500 mt-1">
                                        กรุณาเลือก
                                      </div>
                                    )}
                                  </FormItem>
                                )}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Feedback Table */}
                <div className="pt-4 pb-4">
                  <h3 className="font-semibold mb-3 text-sm">
                    การสะท้อน (Feedback) ให้แก่นิสิต/นักศึกษา
                  </h3>
                  <div className="border rounded-md">
                    <table className="w-full border-collapse">
                      {/* <thead>
                        <tr className="bg-slate-100">
                          <th
                            className="p-2 border text-center text-sm"
                            style={{ width: "42.5%" }}
                          >
                            จุดแข็ง
                          </th>
                          <th
                            className="p-2 border text-center text-sm"
                            style={{ width: "42.5%" }}
                          >
                            จุดที่ควรปรับปรุง
                          </th>
                        </tr>
                      </thead> */}
                      <tbody>
                        <tr className="border-b">
                          <td
                            className="p-2 border text-center text-sm"
                            width="100px"
                          >
                            จุดแข็ง
                          </td>
                          <td className="p-2 border">
                            <FormField
                              control={form.control}
                              name="p1_feedback.strengths"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder="จุดแข็งของนิสิต/นักศึกษา"
                                      className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border text-center text-sm">
                            จุดที่ควรปรับปรุง
                          </td>
                          <td className="p-2 border">
                            <FormField
                              control={form.control}
                              name="p1_feedback.improvements"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder="จุดที่ควรปรับปรุงของนิสิต/นักศึกษา"
                                      className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Advisor Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 mt-4 border-t">
                  <FormField
                    control={form.control}
                    name="advisorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          ชื่ออาจารย์ประจำแหล่งฝึก
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="กรุณาระบุชื่ออาจารย์"
                            className="text-sm"
                            {...field}
                          />
                        </FormControl>{" "}
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm">วันที่ประเมิน</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Popover>
                              <PopoverTrigger>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  className={cn(
                                    "mt-1 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
                                    "w-full justify-start text-left font-normal cursor-pointer",
                                    !field.value && "text-muted-foreground",
                                    form.formState.errors.date
                                      ? "border-red-600 border-2"
                                      : ""
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(
                                      new Date(field.value),
                                      "d MMMM yyyy",
                                      {
                                        locale: th,
                                      }
                                    )
                                  ) : (
                                    <span>เลือกวันที่</span>
                                  )}
                                </div>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0 shadow-md rounded-md"
                                align="start"
                              >
                                <CalendarComponent
                                  selected={
                                    selectedDate ||
                                    (field.value
                                      ? new Date(field.value)
                                      : undefined)
                                  }
                                  onSelect={(date: Date | null) => {
                                    setSelectedDate(date);
                                    if (date) {
                                      field.onChange(
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
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center mt-8">
                {form.formState.isSubmitted &&
                  Object.keys(form.formState.errors).length > 0 && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 border border-red-200 text-sm">
                      กรุณากรอกข้อมูลให้ครบทุกช่องที่จำเป็น
                    </div>
                  )}
                <Button
                  type="submit"
                  className="px-8 py-2 text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกผลการประเมิน"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
