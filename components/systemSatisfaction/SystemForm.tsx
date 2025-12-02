"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";

export default function SystemForm({ user, role }: { user: any, role: any }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);


    const formSchema = z.object({
        p1: z.string().min(1, "กรุณาเลือกระดับความพึงพอใจ"),
        p2: z.string().min(1, "กรุณาเลือกระดับความพึงพอใจ"),
        p3: z.string().min(1, "กรุณาเลือกระดับความพึงพอใจ"),
        p4: z.string().min(1, "กรุณาเลือกระดับความพึงพอใจ"),
        p5: z.string().min(1, "กรุณาเลือกระดับความพึงพอใจ"),
        p6: z.string().min(1, "กรุณาเลือกระดับความพึงพอใจ"),
        p7: z.string().min(1, "กรุณาเลือกระดับความพึงพอใจ"),
        advice: z.string().optional(),
        created_at: z.string().optional(),
        company_id: z.number().optional(),
    });

    const getErrorMessage = (error: any) => {
        if (!error) return "";
        if (typeof error.message === "string") return error.message;
        if (typeof error === "string") return error;
        return String(error.message || "Invalid input");
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            p1: "",
            p2: "",
            p3: "",
            p4: "",
            p5: "",
            p6: "",
            p7: "",
            advice: "",
            created_at: new Date().toISOString().split("T")[0],
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) return;
        setIsSubmitting(true);
        try {
            // แปลง string เป็น number สำหรับ API
            const payload = {
                p1: parseInt(values.p1),
                p2: parseInt(values.p2),
                p3: parseInt(values.p3),
                p4: parseInt(values.p4),
                p5: parseInt(values.p5),
                p6: parseInt(values.p6),
                p7: parseInt(values.p7),
                advice: values.advice || "",
                company_id: user.id,
                role: role,
            };

            const response = await fetch(`/api/system-satisfaction`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                toast({
                    title: "ขอขอบคุณสำหรับการประเมิน",
                    description: "บันทึกแบบประเมินความพึงพอใจสำเร็จ",
                    variant: "success",
                });
                // Reset form after success
                form.reset();
                router.push(`/${role}/dashboard`);
            } else {
                toast({
                    title: "ดำเนินการไม่สำเร็จ",
                    description: data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
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
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <CardHeader className="relative z-10 p-8">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm">
                            <div className="text-2xl">⭐</div>
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold text-white drop-shadow-sm">
                                ประเมินความพึงพอใจระบบ
                            </CardTitle>
                            <CardDescription className="text-blue-100 text-lg mt-2">
                                แบ่งปันความคิดเห็นของคุณเพื่อพัฒนาระบบให้ดีขึ้น
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>


            <Card
                className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg"
                id="evaluation-content"
            >
                <CardContent className="p-8">
                    <div className="form-content">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                {/* Questions Table */}
                                <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50 shadow-lg">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                            ?
                                        </div>
                                        แบบประเมินความพึงพอใจ
                                    </h3>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                data: "p1" as const,
                                                label: "คำอธิบาย คำแนะนำต่างๆ ชัดเจน",
                                                icon: "📖",
                                            },
                                            {
                                                data: "p2" as const,
                                                label:
                                                    "ประสิทธิภาพ และความรวดเร็วในการเข้าถึงข้อมูล",
                                                icon: "⚡",
                                            },
                                            {
                                                data: "p3" as const,
                                                label: "ระบบสารสนเทศครอบคลุมทุกภารกิจ",
                                                icon: "🎯",
                                            },
                                            {
                                                data: "p4" as const,
                                                label: "ระบบประเมินช่วยลดขั้นตอนในการทำงาน",
                                                icon: "⚙️",
                                            },
                                            {
                                                data: "p5" as const,
                                                label: "การใช้งานง่าย ไม่ซับซ้อน",
                                                icon: "👍",
                                            },
                                            {
                                                data: "p6" as const,
                                                label: "ระบบมีประโยชน์",
                                                icon: "💎",
                                            },
                                            {
                                                data: "p7" as const,
                                                label: "ลดการพิมพ์เอกสาร",
                                                icon: "🌱",
                                            },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-2xl p-8 shadow-md border border-gray-100/50 hover:shadow-xl hover:border-blue-200/50 transition-all duration-300 transform hover:-translate-y-1"
                                            >
                                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl shadow-sm">
                                                                {item.icon}
                                                            </div>
                                                            <span className="text-xl font-semibold text-gray-800 leading-relaxed">
                                                                {index + 1}. {item.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="lg:w-96">
                                                        <div className="text-base font-medium text-gray-700 mb-4 text-center">
                                                            ระดับความพึงพอใจ (1-5)
                                                        </div>
                                                        <RadioGroup
                                                            onValueChange={(value) =>
                                                                form.setValue(item.data, value)
                                                            }
                                                            value={form.watch(item.data)}
                                                            className="flex flex-row items-center gap-6 justify-center"
                                                        >
                                                            {[
                                                                {
                                                                    value: "1",
                                                                    label: "1",
                                                                    color: "from-red-400 to-red-500",
                                                                },
                                                                {
                                                                    value: "2",
                                                                    label: "2",
                                                                    color: "from-orange-400 to-orange-500",
                                                                },
                                                                {
                                                                    value: "3",
                                                                    label: "3",
                                                                    color: "from-yellow-400 to-yellow-500",
                                                                },
                                                                {
                                                                    value: "4",
                                                                    label: "4",
                                                                    color: "from-blue-400 to-blue-500",
                                                                },
                                                                {
                                                                    value: "5",
                                                                    label: "5",
                                                                    color: "from-green-400 to-green-500",
                                                                },
                                                            ].map((radio: any) => (
                                                                <div
                                                                    className="flex flex-col gap-3 items-center group"
                                                                    key={radio.value}
                                                                >
                                                                    <div
                                                                        className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${radio.color
                                                                            } flex items-center justify-center shadow-lg transform transition-all duration-200 group-hover:scale-110 ${form.watch(item.data) ===
                                                                                radio.value
                                                                                ? "ring-4 ring-blue-500 ring-offset-2"
                                                                                : ""
                                                                            }`}
                                                                    >
                                                                        <RadioGroupItem
                                                                            value={radio.value}
                                                                            className="w-6 h-6 text-white border-2 border-white"
                                                                        />
                                                                    </div>
                                                                    <label className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors cursor-pointer">
                                                                        {radio.label}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                        {form.formState.errors[item.data] && (
                                                            <p className="text-sm text-red-600 mt-3 text-center bg-red-50 p-3 rounded-xl border border-red-200">
                                                                {getErrorMessage(
                                                                    form.formState.errors[item.data]
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Advice Section */}
                                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-8 border border-emerald-200/50 shadow-lg">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                                            💭
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            คำแนะนำเพิ่มเติม
                                        </h3>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
                                        <textarea
                                            {...form.register("advice")}
                                            className={cn(
                                                "w-full p-6 border-0 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 resize-none text-base leading-relaxed",
                                                form.formState.errors.advice
                                                    ? "ring-4 ring-red-500/20"
                                                    : ""
                                            )}
                                            rows={6}
                                            placeholder="เขียนคำแนะนำ ข้อเสนอแนะ หรือความคิดเห็นเพิ่มเติมเกี่ยวกับระบบ..."
                                        />
                                        {form.formState.errors.advice && (
                                            <p className="text-sm text-red-600 mt-3 bg-red-50 p-3 rounded-xl border border-red-200">
                                                {getErrorMessage(form.formState.errors.advice)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Date Section */}
                                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border border-indigo-200/50 shadow-lg">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                                            📅
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            วันที่ประเมิน
                                        </h3>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 border border-indigo-200/50 shadow-sm">
                                        <div className="text-xl font-semibold text-gray-800">
                                            {new Date().toLocaleDateString("th-TH", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex flex-col items-center pt-12">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="px-16 py-6 text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                กำลังบันทึก...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl">✨</span>
                                                บันทึกผลการประเมิน
                                                <span className="text-2xl">✨</span>
                                            </div>
                                        )}
                                    </Button>
                                    <p className="text-base text-gray-600 mt-6 text-center max-w-md leading-relaxed">
                                        ขอขอบคุณที่สละเวลาให้ข้อมูลป้อนกลับเพื่อพัฒนาระบบให้ดีขึ้น
                                    </p>
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
