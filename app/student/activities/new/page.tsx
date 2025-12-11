"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader2 } from "lucide-react";
import StudentSidebar from "@/components/student-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";

export default function NewActivity() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    activityDate: new Date().toISOString().split("T")[0],
    calendarId: "",
    categoryId: "",
    title: "",
    description: "",
    learning: "",
    problems: "",
    solutions: "",
    tags: "",
    files: [] as File[],
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const fieldName = id.replace("activity-", "");

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user selects a value
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to array and add to existing files
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        files: [...newFiles],
      }));
    }
  };

  const fetchCalendar = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "/api/student-activities/calendar?studentId=" + user?.id
      );
      const data = await response.json();
      if (data.success) {
        setCalendars(data.calendar);
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/student-activities/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        console.error("Error fetching categories:", data.message);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถดึงข้อมูลประเภทกิจกรรมได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload files for an activity
  const uploadFiles = async (activityId: number, files: File[]) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `/api/student-activities/${activityId}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          console.error(`Error uploading file ${file.name}`);
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
      }
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.activityDate) {
      newErrors.activityDate = "กรุณาเลือกวันที่";
    }
    if (!formData.calendarId) {
      newErrors.calendarId = "กรุณาเลือกปีการศึกษา";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "กรุณาเลือกประเภทกิจกรรม";
    }
    if (!formData.title.trim()) {
      newErrors.title = "กรุณากรอกหัวข้อกิจกรรม";
    }
    if (!formData.description.trim()) {
      newErrors.description = "กรุณากรอกรายละเอียดกิจกรรม";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    try {
      if (!user) return;
      // Process tags
      const processedTags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      const studentId = user.id;

      // Submit activity data
      const response = await fetch("/api/student-activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          activityDate: formData.activityDate,
          categoryId: parseInt(formData.categoryId),
          title: formData.title,
          description: formData.description,
          learning: formData.learning,
          problems: formData.problems,
          solutions: formData.solutions,
          tags: processedTags,
          calendarId: parseInt(formData.calendarId),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // If there are files, upload them
        if (formData.files.length > 0) {
          await uploadFiles(data.data.id, formData.files);
        }

        toast({
          title: "บันทึกกิจกรรมสำเร็จ",
          description: "ข้อมูลกิจกรรมถูกบันทึกเรียบร้อยแล้ว",
          variant: "success",
        });

        router.push(`/student/activities`);
      } else {
        console.error("Error creating activity:", data.message);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถบันทึกกิจกรรมได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchCalendar();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {isLoading && <Loading />}

      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StudentSidebar activePage="activities" />

          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">บันทึกกิจกรรมใหม่</CardTitle>
                <CardDescription>บันทึกกิจกรรมที่ทำในวันนี้</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(errors).length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          กรุณาแก้ไขข้อมูลที่ผิดพลาด
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="list-disc pl-5 space-y-1">
                            {Object.entries(errors).map(([field, message]) => (
                              <li key={field}>{message}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="activity-activityDate">
                        วันที่ทำกิจกรรม
                      </Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="activity-activityDate"
                          type="date"
                          className={`pl-10 ${errors.activityDate
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                            }`}
                          value={formData.activityDate}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.activityDate && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.activityDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity-calendarId">รอบการฝึกงาน</Label>
                      <Select
                        value={formData.calendarId}
                        onValueChange={(value) =>
                          handleSelectChange(value, "calendarId")
                        }
                      >
                        <SelectTrigger
                          id="activity-calendarId"
                          className={
                            errors.calendarId
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="เลือกรอบการฝึกงาน" />
                        </SelectTrigger>
                        <SelectContent>
                          {calendars.map((cal) => (
                            <SelectItem key={cal.id} value={cal.id.toString()}>
                              {cal.name} {cal.semester}/{cal.year} (
                              {new Date(cal.start_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}{" "}
                              -{" "}
                              {new Date(cal.end_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                              )
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.calendarId && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.calendarId}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity-categoryId">ประเภทกิจกรรม</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          handleSelectChange(value, "categoryId")
                        }
                      >
                        <SelectTrigger
                          id="activity-categoryId"
                          className={
                            errors.categoryId
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="เลือกประเภทกิจกรรม" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categoryId && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.categoryId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-title">หัวข้อกิจกรรม</Label>
                    <Input
                      id="activity-title"
                      placeholder="ระบุหัวข้อกิจกรรมที่ทำ"
                      className={
                        errors.title
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }
                      value={formData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-description">
                      รายละเอียดกิจกรรม
                    </Label>
                    <Textarea
                      id="activity-description"
                      placeholder="อธิบายรายละเอียดของกิจกรรมที่ทำ"
                      className={`min-h-[150px] ${errors.description
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                        }`}
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="activity-learning">
                        สิ่งที่ได้เรียนรู้
                      </Label>
                      <Textarea
                        id="activity-learning"
                        placeholder="อธิบายสิ่งที่ได้เรียนรู้จากกิจกรรมนี้"
                        className="min-h-[100px]"
                        value={formData.learning}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity-problems">
                        ปัญหาและอุปสรรค (ถ้ามี)
                      </Label>
                      <Textarea
                        id="activity-problems"
                        placeholder="อธิบายปัญหาและอุปสรรคที่พบ (ถ้ามี)"
                        className="min-h-[100px]"
                        value={formData.problems}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity-solutions">
                        แนวทางการแก้ไขปัญหา (ถ้ามี)
                      </Label>
                      <Textarea
                        id="activity-solutions"
                        placeholder="อธิบายแนวทางการแก้ไขปัญหา (ถ้ามี)"
                        className="min-h-[100px]"
                        value={formData.solutions}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="activity-tags">
                        แท็ก (คั่นด้วยเครื่องหมายคอมม่า)
                      </Label>
                      <Input
                        id="activity-tags"
                        placeholder="เช่น React, Next.js, Web Development"
                        value={formData.tags}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity-files">แนบไฟล์ (ถ้ามี)</Label>
                      <Input
                        id="activity-files"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        สามารถแนบไฟล์ได้สูงสุด 5 ไฟล์ ขนาดไม่เกิน 10MB ต่อไฟล์
                        (รองรับไฟล์ .pdf, .doc, .docx, .jpg, .png)
                      </p>
                    </div>
                  </div>

                  {formData.files.length > 0 && (
                    <div className="space-y-2">
                      <Label>ไฟล์ที่เลือก</Label>
                      <div className="space-y-2">
                        {Array.from(formData.files).map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded-md"
                          >
                            <span>
                              {file.name} (
                              {(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  files: prev.files.filter(
                                    (_, i) => i !== index
                                  ),
                                }));
                              }}
                            >
                              ลบ
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Link href="/student/activities">
                      <Button variant="outline" type="button">
                        ยกเลิก
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      บันทึกกิจกรรม
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
