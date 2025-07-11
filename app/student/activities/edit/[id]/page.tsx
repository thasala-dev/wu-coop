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
import { CalendarIcon, Loader2, AlertTriangle } from "lucide-react";
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
import { useRouter, useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loading from "@/components/loading";

import { useSession } from "next-auth/react";

export default function EditActivity() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const params = useParams();
  const activityId = params?.id as string;

  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    activityDate: "",
    calendarId: "",
    categoryId: "",
    title: "",
    description: "",
    learning: "",
    problems: "",
    solutions: "",
    tags: "",
    newFiles: [] as File[],
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
        newFiles: [...prev.newFiles, ...newFiles],
      }));
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
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
    }
  };

  // Fetch activity data
  const fetchActivity = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/student-activities/${activityId}`);
      const data = await response.json();

      if (data.success) {
        const activity = data.data;

        // Set form data
        setFormData({
          activityDate: new Date(activity.activityDate)
            .toISOString()
            .split("T")[0],
          calendarId: activity.calendarId || "",
          categoryId: activity.category.id.toString(),
          title: activity.title,
          description: activity.description,
          learning: activity.learning || "",
          problems: activity.problems || "",
          solutions: activity.solutions || "",
          tags: activity.tags.join(", "),
          newFiles: [],
        });

        // Set files
        setFiles(activity.files || []);
      } else {
        setError(data.message || "ไม่สามารถดึงข้อมูลกิจกรรมได้");
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถดึงข้อมูลกิจกรรมได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete file
  const deleteFile = async (fileId: number) => {
    try {
      const response = await fetch(
        `/api/student-activities/${activityId}/files/${fileId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove file from state
        setFiles(files.filter((file) => file.id !== fileId));
        toast({
          title: "ลบไฟล์สำเร็จ",
          description: "ไฟล์ถูกลบเรียบร้อยแล้ว",
          variant: "success",
        });
      } else {
        console.error("Error deleting file:", data.message);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถลบไฟล์ได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        variant: "destructive",
      });
    } finally {
      setFileToDelete(null);
    }
  };

  // Upload files for an activity
  const uploadFiles = async (files: File[]) => {
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
      // Process tags
      const processedTags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Submit activity data
      const response = await fetch(`/api/student-activities/${activityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityDate: formData.activityDate,
          categoryId: parseInt(formData.categoryId),
          title: formData.title,
          description: formData.description,
          learning: formData.learning,
          problems: formData.problems,
          solutions: formData.solutions,
          tags: processedTags,
          calendarId: formData.calendarId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // If there are new files, upload them
        if (formData.newFiles.length > 0) {
          await uploadFiles(formData.newFiles);
        }

        toast({
          title: "แก้ไขกิจกรรมสำเร็จ",
          description: "ข้อมูลกิจกรรมถูกบันทึกเรียบร้อยแล้ว",
          variant: "success",
        });

        // Redirect to activity details
        router.push(`/student/activities`);
      } else {
        console.error("Error updating activity:", data.message);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถแก้ไขกิจกรรมได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCategories(), fetchCalendar(), fetchActivity()]);
    };

    fetchData();
  }, [activityId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {isLoading && <Loading />}

      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StudentSidebar activePage="activities" />

          <div className="md:col-span-4">
            <Card>
              {error ? (
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">
                    ไม่พบข้อมูลกิจกรรม
                  </h2>
                  <p className="text-gray-500 mb-6">{error}</p>
                  <Link href="/student/activities">
                    <Button>กลับไปหน้ากิจกรรม</Button>
                  </Link>
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="text-xl">แก้ไขกิจกรรม</CardTitle>
                    <CardDescription>
                      แก้ไขรายละเอียดกิจกรรมที่บันทึกไว้
                    </CardDescription>
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
                                {Object.entries(errors).map(
                                  ([field, message]) => (
                                    <li key={field}>{message}</li>
                                  )
                                )}
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
                              className={`pl-10 ${
                                errors.activityDate
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
                          <Label htmlFor="activity-calendarId">
                            รอบการฝึกงาน
                          </Label>
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
                                <SelectItem
                                  key={cal.id}
                                  value={cal.id.toString()}
                                >
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
                          <Label htmlFor="activity-categoryId">
                            ประเภทกิจกรรม
                          </Label>
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
                          className={`min-h-[150px] ${
                            errors.description
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
                            placeholder="อธิบายปัญหาและอุปสรรคที่พบในขณะทำกิจกรรม"
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
                            placeholder="อธิบายวิธีการที่ใช้ในการแก้ไขปัญหาหรือข้อเสนอแนะ"
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
                            placeholder="เช่น หัวใจ, ลิง, ประสบการณ์"
                            value={formData.tags}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="activity-files">
                            แนบไฟล์เพิ่มเติม (ถ้ามี)
                          </Label>
                          <Input
                            id="activity-files"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            สามารถแนบไฟล์ได้สูงสุด 5 ไฟล์ ขนาดไม่เกิน 10MB
                            ต่อไฟล์ (รองรับไฟล์ .pdf, .doc, .docx, .jpg, .png)
                          </p>
                        </div>
                      </div>

                      {formData.newFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label>ไฟล์ที่เลือกใหม่</Label>
                          <div className="space-y-2">
                            {Array.from(formData.newFiles).map(
                              (file, index) => (
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
                                        newFiles: prev.newFiles.filter(
                                          (_, i) => i !== index
                                        ),
                                      }));
                                    }}
                                  >
                                    ลบ
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {files.length > 0 && (
                        <div className="space-y-2">
                          <Label>ไฟล์ที่แนบไว้แล้ว</Label>
                          <div className="space-y-2">
                            {files.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-2 border rounded-md"
                              >
                                <span>
                                  {file.originalFilename} (
                                  {formatFileSize(file.fileSize)})
                                </span>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      type="button"
                                      onClick={() => setFileToDelete(file.id)}
                                    >
                                      ลบ
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        ยืนยันการลบไฟล์
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์นี้?
                                        การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        ยกเลิก
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteFile(file.id)}
                                      >
                                        ลบไฟล์
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-4">
                        <Link href={`/student/activities/${activityId}`}>
                          <Button variant="outline" type="button">
                            ยกเลิก
                          </Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          บันทึกการแก้ไข
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
