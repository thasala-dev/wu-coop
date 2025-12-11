"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  InfoIcon,
  PaperclipIcon,
  SaveIcon,
  SendIcon,
  UploadIcon,
} from "lucide-react";
import StudentSidebar from "@/components/student-sidebar";

export default function NewReport() {
  const [reportType, setReportType] = useState("weekly");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for select options
  const weekOptions = [
    { value: "week1", label: "สัปดาห์ที่ 1 (1-7 มิถุนายน 2567)" },
    { value: "week2", label: "สัปดาห์ที่ 2 (8-14 มิถุนายน 2567)" },
    { value: "week3", label: "สัปดาห์ที่ 3 (15-21 มิถุนายน 2567)" },
    { value: "week4", label: "สัปดาห์ที่ 4 (22-28 มิถุนายน 2567)" },
    { value: "week5", label: "สัปดาห์ที่ 5 (29 มิถุนายน - 5 กรกฎาคม 2567)" },
    { value: "week6", label: "สัปดาห์ที่ 6 (6-12 กรกฎาคม 2567)" },
    { value: "week7", label: "สัปดาห์ที่ 7 (13-19 กรกฎาคม 2567)" },
    { value: "week8", label: "สัปดาห์ที่ 8 (20-26 กรกฎาคม 2567)" },
  ];

  const progressReportOptions = [
    {
      value: "progress1",
      label: "รายงานความก้าวหน้าครั้งที่ 1 (1 มิถุนายน - 15 กรกฎาคม 2567)",
    },
    {
      value: "progress2",
      label: "รายงานความก้าวหน้าครั้งที่ 2 (16 กรกฎาคม - 15 สิงหาคม 2567)",
    },
  ];

  const finalReportOptions = [
    { value: "final", label: "รายงานฉบับสมบูรณ์" },
    { value: "presentation", label: "สไลด์นำเสนอผลงาน" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to reports page after successful submission
      window.location.href = "/student/reports";
    }, 1500);
  };

  const handleSaveDraft = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message or redirect
      alert("บันทึกแบบร่างเรียบร้อยแล้ว");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StudentSidebar activePage="reports" />

          <div className="md:col-span-3">
            <div className="flex items-center mb-6">
              <Link
                href="/student/reports"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                <span>กลับไปหน้ารายงานทั้งหมด</span>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">สร้างรายงานใหม่</CardTitle>
                <CardDescription>
                  กรอกข้อมูลรายงานที่ต้องการสร้าง
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="report-type"
                          className="text-base font-medium"
                        >
                          ประเภทรายงาน
                        </Label>
                        <RadioGroup
                          id="report-type"
                          className="flex flex-col space-y-2 mt-2"
                          value={reportType}
                          onValueChange={setReportType}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="weekly" id="weekly" />
                            <Label
                              htmlFor="weekly"
                              className="font-normal cursor-pointer"
                            >
                              รายงานประจำสัปดาห์
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="progress" id="progress" />
                            <Label
                              htmlFor="progress"
                              className="font-normal cursor-pointer"
                            >
                              รายงานความก้าวหน้า
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="final" id="final" />
                            <Label
                              htmlFor="final"
                              className="font-normal cursor-pointer"
                            >
                              รายงานฉบับสมบูรณ์
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {reportType === "weekly" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="week-select">เลือกสัปดาห์</Label>
                            <Select>
                              <SelectTrigger
                                id="week-select"
                                className="mt-1.5"
                              >
                                <SelectValue placeholder="เลือกสัปดาห์ที่ต้องการรายงาน" />
                              </SelectTrigger>
                              <SelectContent>
                                {weekOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Tabs defaultValue="form" className="mt-6">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="form">
                                แบบฟอร์มกรอกข้อมูล
                              </TabsTrigger>
                              <TabsTrigger value="upload">
                                อัปโหลดไฟล์
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent
                              value="form"
                              className="space-y-6 pt-4"
                            >
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="weekly-summary">
                                    สรุปงานที่ได้รับมอบหมายในสัปดาห์นี้
                                  </Label>
                                  <Textarea
                                    id="weekly-summary"
                                    placeholder="สรุปภาพรวมของงานที่ได้รับมอบหมายและดำเนินการในสัปดาห์นี้"
                                    className="mt-1.5 min-h-[100px]"
                                  />
                                </div>

                                <div className="space-y-4">
                                  <Label>รายละเอียดของงานที่ทำในแต่ละวัน</Label>

                                  {[
                                    "จันทร์",
                                    "อังคาร",
                                    "พุธ",
                                    "พฤหัสบดี",
                                    "ศุกร์",
                                  ].map((day, index) => (
                                    <div
                                      key={index}
                                      className="space-y-2 p-3 border rounded-md"
                                    >
                                      <Label
                                        htmlFor={`day-${index}`}
                                        className="text-sm font-medium"
                                      >
                                        วัน{day}
                                      </Label>
                                      <Textarea
                                        id={`day-${index}`}
                                        placeholder={`รายละเอียดงานที่ทำในวัน${day}`}
                                        className="min-h-[80px]"
                                      />
                                    </div>
                                  ))}
                                </div>

                                <div>
                                  <Label htmlFor="problems">
                                    ปัญหาที่พบและวิธีการแก้ไข
                                  </Label>
                                  <Textarea
                                    id="problems"
                                    placeholder="อธิบายปัญหาที่พบในการทำงานและวิธีการแก้ไขปัญหาเหล่านั้น"
                                    className="mt-1.5 min-h-[100px]"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="learnings">
                                    สิ่งที่ได้เรียนรู้จากการทำงาน
                                  </Label>
                                  <Textarea
                                    id="learnings"
                                    placeholder="อธิบายความรู้และทักษะที่ได้รับจากการทำงานในสัปดาห์นี้"
                                    className="mt-1.5 min-h-[100px]"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="next-week-plan">
                                    แผนงานในสัปดาห์ถัดไป
                                  </Label>
                                  <Textarea
                                    id="next-week-plan"
                                    placeholder="อธิบายแผนงานและเป้าหมายที่ตั้งไว้สำหรับสัปดาห์ถัดไป"
                                    className="mt-1.5 min-h-[100px]"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="block mb-2">
                                  แนบไฟล์เพิ่มเติม (ถ้ามี)
                                </Label>
                                <div className="flex items-center justify-center w-full">
                                  <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                  >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
                                      <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">
                                          คลิกเพื่ออัปโหลดไฟล์
                                        </span>{" "}
                                        หรือลากและวางไฟล์
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        รองรับไฟล์ PDF, DOC, DOCX, PNG, JPG
                                        (ไม่เกิน 10MB)
                                      </p>
                                    </div>
                                    <input
                                      id="file-upload"
                                      type="file"
                                      className="hidden"
                                      multiple
                                    />
                                  </label>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="upload"
                              className="space-y-6 pt-4"
                            >
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="report-title">
                                    ชื่อรายงาน
                                  </Label>
                                  <Input
                                    id="report-title"
                                    placeholder="ระบุชื่อรายงาน เช่น รายงานประจำสัปดาห์ที่ 6"
                                    className="mt-1.5"
                                  />
                                </div>

                                <div>
                                  <Label className="block mb-2">
                                    อัปโหลดไฟล์รายงาน
                                  </Label>
                                  <div className="flex items-center justify-center w-full">
                                    <label
                                      htmlFor="report-file-upload"
                                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    >
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileTextIcon className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                          <span className="font-semibold">
                                            คลิกเพื่ออัปโหลดไฟล์รายงาน
                                          </span>{" "}
                                          หรือลากและวางไฟล์
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          รองรับไฟล์ PDF, DOC, DOCX (ไม่เกิน
                                          20MB)
                                        </p>
                                      </div>
                                      <input
                                        id="report-file-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                      />
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="report-description">
                                    คำอธิบายเพิ่มเติม (ถ้ามี)
                                  </Label>
                                  <Textarea
                                    id="report-description"
                                    placeholder="ระบุคำอธิบายหรือหมายเหตุเพิ่มเติมเกี่ยวกับรายงานที่ส่ง"
                                    className="mt-1.5"
                                  />
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}

                      {reportType === "progress" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="progress-report-select">
                              เลือกรายงานความก้าวหน้า
                            </Label>
                            <Select>
                              <SelectTrigger
                                id="progress-report-select"
                                className="mt-1.5"
                              >
                                <SelectValue placeholder="เลือกรายงานความก้าวหน้าที่ต้องการส่ง" />
                              </SelectTrigger>
                              <SelectContent>
                                {progressReportOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="p-4 bg-blue-50 rounded-md flex gap-3 mt-2">
                            <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-700">
                              <p className="font-medium">
                                คำแนะนำการเขียนรายงานความก้าวหน้า
                              </p>
                              <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>ความยาวประมาณ 5-10 หน้า</li>
                                <li>ควรมีหน้าปก สารบัญ และบทนำ</li>
                                <li>
                                  อธิบายความก้าวหน้าของงานเทียบกับแผนงานที่วางไว้
                                </li>
                                <li>
                                  ระบุปัญหาและอุปสรรคที่พบ พร้อมวิธีการแก้ไข
                                </li>
                                <li>
                                  แสดงผลงานที่สำคัญที่ได้ดำเนินการในช่วงที่ผ่านมา
                                </li>
                                <li>ระบุแผนการดำเนินงานในช่วงถัดไป</li>
                              </ul>
                            </div>
                          </div>

                          <Tabs defaultValue="upload" className="mt-6">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="upload">
                                อัปโหลดไฟล์รายงาน
                              </TabsTrigger>
                              <TabsTrigger value="online">
                                กรอกข้อมูลออนไลน์
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent
                              value="upload"
                              className="space-y-6 pt-4"
                            >
                              <div className="space-y-4">
                                <div>
                                  <Label className="block mb-2">
                                    อัปโหลดไฟล์รายงานความก้าวหน้า
                                  </Label>
                                  <div className="flex items-center justify-center w-full">
                                    <label
                                      htmlFor="progress-file-upload"
                                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    >
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileIcon className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                          <span className="font-semibold">
                                            คลิกเพื่ออัปโหลดไฟล์รายงาน
                                          </span>{" "}
                                          หรือลากและวางไฟล์
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          รองรับไฟล์ PDF, DOC, DOCX (ไม่เกิน
                                          20MB)
                                        </p>
                                      </div>
                                      <input
                                        id="progress-file-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                      />
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <Label className="block mb-2">
                                    อัปโหลดไฟล์เอกสารประกอบ (ถ้ามี)
                                  </Label>
                                  <div className="flex items-center justify-center w-full">
                                    <label
                                      htmlFor="supporting-files-upload"
                                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    >
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <PaperclipIcon className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                          <span className="font-semibold">
                                            คลิกเพื่ออัปโหลดไฟล์เพิ่มเติม
                                          </span>{" "}
                                          หรือลากและวางไฟล์
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          รองรับไฟล์ PDF, DOC, DOCX, PPT, PPTX,
                                          XLS, XLSX, ZIP (ไม่เกิน 50MB)
                                        </p>
                                      </div>
                                      <input
                                        id="supporting-files-upload"
                                        type="file"
                                        className="hidden"
                                        multiple
                                      />
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="progress-summary">
                                    สรุปความก้าวหน้าโดยย่อ
                                  </Label>
                                  <Textarea
                                    id="progress-summary"
                                    placeholder="สรุปความก้าวหน้าของการปฏิบัติงานโดยย่อ (จะแสดงในหน้ารายการรายงาน)"
                                    className="mt-1.5"
                                  />
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="online"
                              className="space-y-6 pt-4"
                            >
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="progress-title">
                                    ชื่อรายงานความก้าวหน้า
                                  </Label>
                                  <Input
                                    id="progress-title"
                                    placeholder="ระบุชื่อรายงานความก้าวหน้า"
                                    className="mt-1.5"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="progress-intro">บทนำ</Label>
                                  <Textarea
                                    id="progress-intro"
                                    placeholder="อธิบายที่มาและความสำคัญของงานที่ได้รับมอบหมาย"
                                    className="mt-1.5 min-h-[100px]"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="progress-details">
                                    รายละเอียดความก้าวหน้า
                                  </Label>
                                  <Textarea
                                    id="progress-details"
                                    placeholder="อธิบายรายละเอียดความก้าวหน้าของงานที่ได้รับมอบหมาย เทียบกับแผนงานที่วางไว้"
                                    className="mt-1.5 min-h-[150px]"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="progress-problems">
                                    ปัญหาและอุปสรรค
                                  </Label>
                                  <Textarea
                                    id="progress-problems"
                                    placeholder="อธิบายปัญหาและอุปสรรคที่พบในการปฏิบัติงาน พร้อมวิธีการแก้ไข"
                                    className="mt-1.5 min-h-[100px]"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="progress-next-plan">
                                    แผนการดำเนินงานในช่วงถัดไป
                                  </Label>
                                  <Textarea
                                    id="progress-next-plan"
                                    placeholder="อธิบายแผนการดำเนินงานในช่วงถัดไป"
                                    className="mt-1.5 min-h-[100px]"
                                  />
                                </div>

                                <div>
                                  <Label className="block mb-2">
                                    แนบรูปภาพหรือเอกสารประกอบ (ถ้ามี)
                                  </Label>
                                  <div className="flex items-center justify-center w-full">
                                    <label
                                      htmlFor="progress-images-upload"
                                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    >
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                          <span className="font-semibold">
                                            คลิกเพื่ออัปโหลดรูปภาพหรือเอกสาร
                                          </span>{" "}
                                          หรือลากและวางไฟล์
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          รองรับไฟล์ PNG, JPG, PDF (ไม่เกิน 10MB
                                          ต่อไฟล์)
                                        </p>
                                      </div>
                                      <input
                                        id="progress-images-upload"
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept=".png,.jpg,.jpeg,.pdf"
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}

                      {reportType === "final" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="final-report-select">
                              เลือกประเภทรายงานฉบับสมบูรณ์
                            </Label>
                            <Select>
                              <SelectTrigger
                                id="final-report-select"
                                className="mt-1.5"
                              >
                                <SelectValue placeholder="เลือกประเภทรายงานฉบับสมบูรณ์" />
                              </SelectTrigger>
                              <SelectContent>
                                {finalReportOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="p-4 bg-green-50 rounded-md flex gap-3 mt-2">
                            <InfoIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-green-700">
                              <p className="font-medium">
                                คำแนะนำการเขียนรายงานฉบับสมบูรณ์
                              </p>
                              <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>ควรมีความยาวประมาณ 30-50 หน้า</li>
                                <li>
                                  ประกอบด้วย 5 บท ได้แก่ บทนำ,
                                  รายละเอียดแหล่งฝึกงาน,
                                  รายละเอียดการปฏิบัติงาน, ปัญหาและวิธีแก้ไข,
                                  สรุปผลและข้อเสนอแนะ
                                </li>
                                <li>ใช้ภาษาทางวิชาการที่ถูกต้องและเหมาะสม</li>
                                <li>มีการอ้างอิงแหล่งข้อมูลตามหลักวิชาการ</li>
                                <li>ตรวจสอบความถูกต้องของเนื้อหาและการพิมพ์</li>
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-4 mt-4">
                            <div>
                              <Label className="block mb-2">
                                อัปโหลดไฟล์รายงานฉบับสมบูรณ์
                              </Label>
                              <div className="flex items-center justify-center w-full">
                                <label
                                  htmlFor="final-report-upload"
                                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileIcon className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                      <span className="font-semibold">
                                        คลิกเพื่ออัปโหลดไฟล์รายงานฉบับสมบูรณ์
                                      </span>{" "}
                                      หรือลากและวางไฟล์
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      รองรับไฟล์ PDF, DOC, DOCX (ไม่เกิน 50MB)
                                    </p>
                                  </div>
                                  <input
                                    id="final-report-upload"
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                  />
                                </label>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="final-report-abstract">
                                บทคัดย่อ
                              </Label>
                              <Textarea
                                id="final-report-abstract"
                                placeholder="เขียนบทคัดย่อของรายงานฉบับสมบูรณ์"
                                className="mt-1.5 min-h-[150px]"
                              />
                            </div>

                            <div>
                              <Label htmlFor="final-report-keywords">
                                คำสำคัญ
                              </Label>
                              <Input
                                id="final-report-keywords"
                                placeholder="ระบุคำสำคัญ เช่น ฝึกงาน, เภสัชกรรม, การผลิตยา (คั่นด้วยเครื่องหมายจุลภาค)"
                                className="mt-1.5"
                              />
                            </div>

                            <div>
                              <Label className="block mb-2">
                                อัปโหลดไฟล์เอกสารประกอบ (ถ้ามี)
                              </Label>
                              <div className="flex items-center justify-center w-full">
                                <label
                                  htmlFor="final-supporting-files"
                                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <PaperclipIcon className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                      <span className="font-semibold">
                                        คลิกเพื่ออัปโหลดไฟล์เพิ่มเติม
                                      </span>{" "}
                                      หรือลากและวางไฟล์
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      รองรับไฟล์ PDF, DOC, DOCX, PPT, PPTX, XLS,
                                      XLSX, ZIP (ไม่เกิน 100MB รวม)
                                    </p>
                                  </div>
                                  <input
                                    id="final-supporting-files"
                                    type="file"
                                    className="hidden"
                                    multiple
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md mt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircleIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            ข้อควรระวัง
                          </p>
                          <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                            <li>ตรวจสอบความถูกต้องของข้อมูลก่อนส่งรายงาน</li>
                            <li>
                              ไม่เปิดเผยข้อมูลที่เป็นความลับของแหล่งฝึกงาน
                            </li>
                            <li>ส่งรายงานตรงตามกำหนดเวลา</li>
                            <li>
                              หลังจากส่งรายงานแล้ว จะไม่สามารถแก้ไขได้
                              หากต้องการแก้ไขต้องติดต่ออาจารย์นิเทศ
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={isSubmitting}
                    >
                      <SaveIcon className="h-4 w-4 mr-2" />
                      บันทึกแบบร่าง
                    </Button>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          (window.location.href = "/student/reports")
                        }
                      >
                        ยกเลิก
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>กำลังส่งรายงาน...</>
                        ) : (
                          <>
                            <SendIcon className="h-4 w-4 mr-2" />
                            ส่งรายงาน
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>อัปเดตล่าสุด: 10 กรกฎาคม 2567</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">บันทึกอัตโนมัติ</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
