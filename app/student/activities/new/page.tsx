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
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

// Define types for categories
interface Category {
  id: number;
  name: string;
  name_en: string;
  color: string;
  created_at: string;
}

export default function NewActivity() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    activityDate: new Date().toISOString().split("T")[0],
    categoryId: "",
    title: "",
    description: "",
    learning: "",
    problems: "",
    solutions: "",
    tags: "",
    files: [] as File[],
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("activity-", "")]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/student-activities/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
        // Set default category if available
        if (data.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: data.data[0].id.toString(),
          }));
        }
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
    if (
      !formData.activityDate ||
      !formData.categoryId ||
      !formData.title ||
      !formData.description
    ) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description:
          "กรุณากรอกข้อมูลที่จำเป็น: วันที่, ประเภทกิจกรรม, หัวข้อ และรายละเอียด",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Process tags
      const processedTags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // In a real application, you would get the student ID from context or session
      const studentId = 1; // Temporary student ID for testing

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
        });

        // Redirect to activity details
        router.push(`/student/activities/${data.data.id}`);
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {isLoading && <Loading />}

      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StudentSidebar activePage="activities" />

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">บันทึกกิจกรรมใหม่</CardTitle>
                <CardDescription>บันทึกกิจกรรมที่ทำในวันนี้</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="activity-activityDate">
                        วันที่ทำกิจกรรม
                      </Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="activity-activityDate"
                          type="date"
                          className="pl-10"
                          value={formData.activityDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity-categoryId">ประเภทกิจกรรม</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          handleSelectChange(value, "categoryId")
                        }
                      >
                        <SelectTrigger id="activity-categoryId">
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-title">หัวข้อกิจกรรม</Label>
                    <Input
                      id="activity-title"
                      placeholder="ระบุหัวข้อกิจกรรมที่ทำ"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-description">
                      รายละเอียดกิจกรรม
                    </Label>
                    <Textarea
                      id="activity-description"
                      placeholder="อธิบายรายละเอียดของกิจกรรมที่ทำ"
                      className="min-h-[150px]"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

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
