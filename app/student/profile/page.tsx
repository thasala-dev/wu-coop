"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, User, Camera, CalendarIcon, Upload } from "lucide-react";
import { callUploadApi, callDeleteApi } from "@/lib/file-api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import AvatarDesign from "@/components/AvatarDesign";
import CustomAvatar from "@/components/avatar";
import Loading from "@/components/loading";

const currentYear = new Date().getFullYear() + 543;
const years = Array.from({ length: currentYear - 2562 + 1 }, (_, i) =>
  (currentYear - i).toString().slice(-2)
);

export default function StudentProfile() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingTranscript, setIsUploadingTranscript] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcriptFileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<any>({
    fullname: "",
    student_id: "",
    email: "",
    mobile: "",
    faculty: "",
    major: "",
    std_year: "",
    address: "",
    gpa: "",
    transcript: "",
    image: "",
    // Additional fields
    nickname: "",
    date_of_birth: "",
    id_card: "",
    nationality: "",
    religion: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
    parent_name: "",
    parent_occupation: "",
    parent_phone: "",
    scholarship: "",
    medical_condition: "",
    skills: "",

    password: "",
  });
  // Fetch student profile data
  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/student/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setProfileData(data.data);
        setFormData({
          fullname: data.data.fullname || "",
          student_id: data.data.student_id || "",
          email: data.data.email || "",
          mobile: data.data.mobile || "",
          faculty: data.data.faculty || "",
          major: data.data.major || "",
          std_year: data.data.std_year || "",
          address: data.data.address || "",
          gpa: data.data.gpa || "",
          transcript: data.data.transcript || "",
          image: data.data.image || "",
          // Additional fields
          nickname: data.data.nickname || "",
          date_of_birth: data.data.date_of_birth || "",
          id_card: data.data.id_card || "",
          nationality: data.data.nationality || "ไทย",
          religion: data.data.religion || "",
          emergency_contact_name: data.data.emergency_contact_name || "",
          emergency_contact_phone: data.data.emergency_contact_phone || "",
          emergency_contact_relation:
            data.data.emergency_contact_relation || "",
          parent_name: data.data.parent_name || "",
          parent_occupation: data.data.parent_occupation || "",
          parent_phone: data.data.parent_phone || "",
          scholarship: data.data.scholarship || "",
          medical_condition: data.data.medical_condition || "",
          skills: data.data.skills || "",

          password: "", // Reset password field
        });
      } else {
        toast({
          title: "ไม่สามารถโหลดข้อมูลได้",
          description: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setFormData((prev: any) => ({
        ...prev,
        date_of_birth: formattedDate,
      }));
      setIsCalendarOpen(false);
    }
  };

  const handleTranscriptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a PDF
    if (file.type !== "application/pdf") {
      toast({
        title: "ไฟล์ไม่ถูกต้อง",
        description: "กรุณาเลือกไฟล์ PDF เท่านั้น",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "ไฟล์ใหญ่เกินไป",
        description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5 MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingTranscript(true);

    try {
      const result = await callUploadApi(file, `student/${user?.id}`, false);
      if (result.success) {
        setFormData((prev: any) => ({
          ...prev,
          transcript: result.filePath,
        }));
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading transcript:", error);
      toast({
        title: "อัพโหลดไม่สำเร็จ",
        description: "ไม่สามารถอัพโหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsUploadingTranscript(false);
    }
  };

  const removeTranscript = async () => {
    if (formData.transcript) {
      try {
        // ลบไฟล์จากเซิร์ฟเวอร์
        await callDeleteApi(formData.transcript);
      } catch (error) {
        console.error("Error deleting transcript file:", error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลบไฟล์จากเซิร์ฟเวอร์ได้",
          variant: "destructive",
        });
        return; // หยุดการทำงานหากลบไฟล์ไม่สำเร็จ
      }
    }

    // ลบข้อมูลจาก state
    setFormData((prev: any) => ({
      ...prev,
      transcript: "",
    }));

    // รีเซ็ต file input
    if (transcriptFileInputRef.current) {
      transcriptFileInputRef.current.value = "";
    }
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "เลือกวันเกิด";
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy", { locale: th });
    } catch {
      return "เลือกวันเกิด";
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast({
        title: "ไม่สามารถบันทึกข้อมูลได้",
        description: "กรุณาเข้าสู่ระบบอีกครั้ง",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    let payload = { ...formData };
    if (payload.password === "") {
      delete payload.password;
    }

    try {
      const response = await fetch(`/api/student/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "บันทึกข้อมูลสำเร็จ",
          description: "อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว",
          variant: "success",
        });
        setProfileData(data.data);
        // Update formData with the latest data
        setFormData({
          fullname: data.data.fullname || "",
          student_id: data.data.student_id || "",
          email: data.data.email || "",
          mobile: data.data.mobile || "",
          faculty: data.data.faculty || "",
          major: data.data.major || "",
          std_year: data.data.std_year || "",
          address: data.data.address || "",
          gpa: data.data.gpa || "",
          transcript: data.data.transcript || "",
          image: data.data.image || "",
          // Additional fields
          nickname: data.data.nickname || "",
          date_of_birth: data.data.date_of_birth || "",
          id_card: data.data.id_card || "",
          nationality: data.data.nationality || "ไทย",
          religion: data.data.religion || "",
          emergency_contact_name: data.data.emergency_contact_name || "",
          emergency_contact_phone: data.data.emergency_contact_phone || "",
          emergency_contact_relation:
            data.data.emergency_contact_relation || "",
          parent_name: data.data.parent_name || "",
          parent_occupation: data.data.parent_occupation || "",
          parent_phone: data.data.parent_phone || "",
          scholarship: data.data.scholarship || "",
          medical_condition: data.data.medical_condition || "",
          skills: data.data.skills || "",
        });
      } else {
        toast({
          title: "บันทึกข้อมูลไม่สำเร็จ",
          description:
            data.message ||
            "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profileData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Sidebar activePage="profile" userType="student" />

          <div className="lg:col-span-4 space-y-6">
            {/* Header Card */}
            <Card className="shadow-xl border-0 bg-white overflow-hidden">
              <CardHeader className="py-6 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                      ข้อมูลส่วนตัว
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-base font-medium mt-1">
                      จัดการและแก้ไขข้อมูลส่วนตัวของคุณ
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Profile Image Section */}

                    {/* Profile Information Section */}
                    <div className="flex-1">
                      <div className="flex flex-col items-center space-y-4 mb-4 gap-4">
                        <div className="relative">
                          <AvatarDesign
                            value={formData.image}
                            setValue={(val: any) => {
                              setFormData((prev: any) => ({
                                ...prev,
                                image: val,
                              }));
                            }}
                            size="32"
                          />
                        </div>

                        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 w-full border border-blue-200/50">
                          <h3 className="font-bold text-xl text-gray-900 mb-1">
                            {formData.fullname || "ไม่ได้ระบุชื่อ"}
                          </h3>
                          <p className="text-blue-700 font-mono font-medium">
                            {formData.student_id || "ไม่ได้ระบุรหัส"}
                          </p>
                          <div className="mt-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                              <User className="h-3 w-3 mr-1" />
                              นักศึกษาฝึกงาน
                            </span>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            ข้อมูลส่วนตัว
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="fullname"
                                className="text-sm font-medium text-gray-700"
                              >
                                ชื่อ-สกุล
                              </label>
                              <Input
                                id="fullname"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="ชื่อ-นามสกุล"
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="nickname"
                                className="text-sm font-medium text-gray-700"
                              >
                                ชื่อเล่น
                              </label>
                              <Input
                                id="nickname"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="ชื่อเล่น"
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="student_id"
                                className="text-sm font-medium text-gray-700"
                              >
                                รหัสนักศึกษา
                              </label>
                              <Input
                                id="student_id"
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleChange}
                                placeholder="รหัสนักศึกษา"
                                className="bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="id_card"
                                className="text-sm font-medium text-gray-700"
                              >
                                เลขบัตรประชาชน
                              </label>
                              <Input
                                id="id_card"
                                name="id_card"
                                value={formData.id_card}
                                onChange={handleChange}
                                placeholder="เลขบัตรประชาชน 13 หลัก"
                                maxLength={13}
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="date_of_birth"
                                className="text-sm font-medium text-gray-700"
                              >
                                วันเกิด
                              </label>
                              <Popover
                                open={isCalendarOpen}
                                onOpenChange={setIsCalendarOpen}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal bg-white/80 border-blue-200 hover:bg-blue-50",
                                      !formData.date_of_birth &&
                                      "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formatDateDisplay(formData.date_of_birth)}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <CalendarComponent
                                    mode="single"
                                    selected={
                                      formData.date_of_birth
                                        ? new Date(formData.date_of_birth)
                                        : undefined
                                    }
                                    onSelect={handleDateSelect}
                                    initialFocus
                                    className="rounded-md border"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="nationality"
                                className="text-sm font-medium text-gray-700"
                              >
                                สัญชาติ
                              </label>
                              <Select
                                value={formData.nationality}
                                onValueChange={(value) =>
                                  handleSelectChange("nationality", value)
                                }
                              >
                                <SelectTrigger className="bg-white/80 border-blue-200 focus:border-blue-500">
                                  <SelectValue placeholder="เลือกสัญชาติ" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ไทย">ไทย</SelectItem>
                                  <SelectItem value="ลาว">ลาว</SelectItem>
                                  <SelectItem value="พม่า">พม่า</SelectItem>
                                  <SelectItem value="กัมพูชา">
                                    กัมพูชา
                                  </SelectItem>
                                  <SelectItem value="เวียดนาม">
                                    เวียดนาม
                                  </SelectItem>
                                  <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="religion"
                                className="text-sm font-medium text-gray-700"
                              >
                                ศาสนา
                              </label>
                              <Select
                                value={formData.religion}
                                onValueChange={(value) =>
                                  handleSelectChange("religion", value)
                                }
                              >
                                <SelectTrigger className="bg-white/80 border-blue-200 focus:border-blue-500">
                                  <SelectValue placeholder="เลือกศาสนา" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="พุทธ">พุทธ</SelectItem>
                                  <SelectItem value="คริสต์">คริสต์</SelectItem>
                                  <SelectItem value="อิสลาม">อิสลาม</SelectItem>
                                  <SelectItem value="ฮินดู">ฮินดู</SelectItem>
                                  <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                              >
                                อีเมล
                              </label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="อีเมล"
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="mobile"
                                className="text-sm font-medium text-gray-700"
                              >
                                เบอร์โทรศัพท์
                              </label>
                              <Input
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="เบอร์โทรศัพท์"
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label
                                htmlFor="address"
                                className="text-sm font-medium text-gray-700"
                              >
                                ที่อยู่
                              </label>
                              <Textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="ที่อยู่"
                                rows={3}
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Academic Information */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200/50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-emerald-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            ข้อมูลการศึกษา
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="major"
                                className="text-sm font-medium text-gray-700"
                              >
                                สาขาวิชา
                              </label>
                              <Select
                                value={formData.major}
                                onValueChange={(value) =>
                                  handleSelectChange("major", value)
                                }
                              >
                                <SelectTrigger className="bg-white/80 border-emerald-200 focus:border-emerald-500">
                                  <SelectValue placeholder="เลือกสาขาวิชา" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SCI">SCI</SelectItem>
                                  <SelectItem value="CARE">CARE</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="std_year"
                                className="text-sm font-medium text-gray-700"
                              >
                                ปีรหัส
                              </label>
                              <Select
                                value={formData.std_year.toString()}
                                onValueChange={(value) =>
                                  handleSelectChange("std_year", value)
                                }
                              >
                                <SelectTrigger className="bg-white/80 border-emerald-200 focus:border-emerald-500">
                                  <SelectValue placeholder="เลือกปีรหัส" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((y) => (
                                    <SelectItem key={y} value={y}>
                                      รหัส {y}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="gpa"
                                className="text-sm font-medium text-gray-700"
                              >
                                เกรดเฉลี่ย
                              </label>
                              <Input
                                id="gpa"
                                name="gpa"
                                value={formData.gpa}
                                onChange={handleChange}
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                min="0"
                                max="4.00"
                                className="bg-white/80 border-emerald-200 focus:border-emerald-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4 mt-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="transcript"
                                className="text-sm font-medium text-gray-700"
                              >
                                Transcript (ไฟล์ PDF เท่านั้น)
                              </label>
                              <div className="text-xs text-red-500">
                                ** แนะนำให้ Capture
                                หน้าจอแสดงเกรดติดกับรูปนักศึกษาด้วย
                              </div>

                              {/* Upload Area */}
                              <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 bg-emerald-50/30">
                                {formData.transcript ? (
                                  /* Preview Area */
                                  <div className="space-y-4">
                                    <div className="relative group">
                                      <div className="w-full mx-auto">
                                        <iframe
                                          src={formData.transcript}
                                          className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                                          style={{
                                            height: "800px",
                                          }}
                                          title="Transcript PDF Preview"
                                        />
                                      </div>
                                      <div className="absolute top-2 right-2">
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={removeTranscript}
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
                                      <p className="text-sm text-emerald-600 font-medium">
                                        ✓ อัพโหลด Transcript เรียบร้อยแล้ว
                                      </p>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          transcriptFileInputRef.current?.click()
                                        }
                                        className="mt-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                      >
                                        เปลี่ยนไฟล์ใหม่
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  /* Upload Button Area */
                                  <div className="text-center">
                                    <div className="mb-4">
                                      <svg
                                        className="mx-auto h-12 w-12 text-emerald-400"
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
                                        อัพโหลด Transcript
                                      </h4>
                                      <p className="text-sm text-gray-500 mt-1">
                                        อัพโหลดไฟล์ PDF
                                        หรือลากวางที่นี่
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        รองรับไฟล์: PDF (ขนาดไม่เกิน 5 MB)
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        transcriptFileInputRef.current?.click()
                                      }
                                      disabled={isUploadingTranscript}
                                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                    >
                                      {isUploadingTranscript ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          กำลังอัพโหลด...
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="mr-2 h-4 w-4" />
                                          เลือกไฟล์
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                )}

                                {/* Hidden File Input */}
                                <input
                                  ref={transcriptFileInputRef}
                                  type="file"
                                  accept="application/pdf"
                                  onChange={handleTranscriptUpload}
                                  className="hidden"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Parent & Emergency Contact Information */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200/50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            ข้อมูลผู้ปกครอง & ผู้ติดต่อฉุกเฉิน
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Parent Information */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-orange-700 border-b border-orange-200 pb-2">
                                ข้อมูลผู้ปกครอง
                              </h4>
                              <div className="space-y-2">
                                <label
                                  htmlFor="parent_name"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  ชื่อผู้ปกครอง
                                </label>
                                <Input
                                  id="parent_name"
                                  name="parent_name"
                                  value={formData.parent_name}
                                  onChange={handleChange}
                                  placeholder="ชื่อ-นามสกุลผู้ปกครอง"
                                  className="bg-white/80 border-orange-200 focus:border-orange-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="parent_occupation"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  อาชีพผู้ปกครอง
                                </label>
                                <Input
                                  id="parent_occupation"
                                  name="parent_occupation"
                                  value={formData.parent_occupation}
                                  onChange={handleChange}
                                  placeholder="อาชีพผู้ปกครอง"
                                  className="bg-white/80 border-orange-200 focus:border-orange-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="parent_phone"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  เบอร์โทรผู้ปกครอง
                                </label>
                                <Input
                                  id="parent_phone"
                                  name="parent_phone"
                                  value={formData.parent_phone}
                                  onChange={handleChange}
                                  placeholder="เบอร์โทรศัพท์ผู้ปกครอง"
                                  className="bg-white/80 border-orange-200 focus:border-orange-500"
                                />
                              </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-orange-700 border-b border-orange-200 pb-2">
                                ผู้ติดต่อฉุกเฉิน
                              </h4>
                              <div className="space-y-2">
                                <label
                                  htmlFor="emergency_contact_name"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  ชื่อผู้ติดต่อฉุกเฉิน
                                </label>
                                <Input
                                  id="emergency_contact_name"
                                  name="emergency_contact_name"
                                  value={formData.emergency_contact_name}
                                  onChange={handleChange}
                                  placeholder="ชื่อ-นามสกุลผู้ติดต่อฉุกเฉิน"
                                  className="bg-white/80 border-orange-200 focus:border-orange-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="emergency_contact_relation"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  ความเกี่ยวข้อง
                                </label>
                                <Select
                                  value={formData.emergency_contact_relation}
                                  onValueChange={(value) =>
                                    handleSelectChange(
                                      "emergency_contact_relation",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="bg-white/80 border-orange-200 focus:border-orange-500">
                                    <SelectValue placeholder="เลือกความเกี่ยวข้อง" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="บิดา">บิดา</SelectItem>
                                    <SelectItem value="มารดา">มารดา</SelectItem>
                                    <SelectItem value="ผู้ปกครอง">
                                      ผู้ปกครอง
                                    </SelectItem>
                                    <SelectItem value="พี่ชาย">
                                      พี่ชาย
                                    </SelectItem>
                                    <SelectItem value="พี่สาว">
                                      พี่สาว
                                    </SelectItem>
                                    <SelectItem value="น้องชาย">
                                      น้องชาย
                                    </SelectItem>
                                    <SelectItem value="น้องสาว">
                                      น้องสาว
                                    </SelectItem>
                                    <SelectItem value="ญาติ">ญาติ</SelectItem>
                                    <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="emergency_contact_phone"
                                  className="text-sm font-medium text-gray-700"
                                >
                                  เบอร์โทรฉุกเฉิน
                                </label>
                                <Input
                                  id="emergency_contact_phone"
                                  name="emergency_contact_phone"
                                  value={formData.emergency_contact_phone}
                                  onChange={handleChange}
                                  placeholder="เบอร์โทรศัพท์ฉุกเฉิน"
                                  className="bg-white/80 border-orange-200 focus:border-orange-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            ข้อมูลเพิ่มเติม
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="scholarship"
                                className="text-sm font-medium text-gray-700"
                              >
                                ทุนการศึกษา
                              </label>
                              <Input
                                id="scholarship"
                                name="scholarship"
                                value={formData.scholarship}
                                onChange={handleChange}
                                placeholder="เช่น ทุนการศึกษา, ทุนรัฐบาล, ทุนส่วนตัว"
                                className="bg-white/80 border-purple-200 focus:border-purple-500"
                              />

                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="skills"
                                className="text-sm font-medium text-gray-700"
                              >
                                ทักษะพิเศษ
                              </label>
                              <Input
                                id="skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="เช่น ภาษาอังกฤษ, คอมพิวเตอร์, ดนตรี"
                                className="bg-white/80 border-purple-200 focus:border-purple-500"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label
                                htmlFor="medical_condition"
                                className="text-sm font-medium text-gray-700"
                              >
                                ประวัติสุขภาพ/โรคประจำตัว
                              </label>
                              <Textarea
                                id="medical_condition"
                                name="medical_condition"
                                value={formData.medical_condition}
                                onChange={handleChange}
                                placeholder="ระบุโรคประจำตัว, การแพ้ยา, หรือข้อมูลสุขภาพที่สำคัญ (หากไม่มีให้ระบุ 'ไม่มี')"
                                rows={3}
                                className="bg-white/80 border-purple-200 focus:border-purple-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-red-50 rounded-xl p-6 border border-red-200/50">
                          <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 11v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            เปลี่ยนรหัสผ่าน
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                              >
                                รหัสผ่านใหม่ (ไม่ต้องกรอกหากไม่ต้องการเปลี่ยน)
                              </label>
                              <Input
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="รหัสผ่านใหม่"
                                className="bg-white/80 border-purple-200 focus:border-purple-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-2"
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังบันทึก...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                บันทึกข้อมูล
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
