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
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  TagIcon,
  FileIcon,
  ArrowLeftIcon,
  PencilIcon,
  AlertTriangle,
} from "lucide-react";
import StudentSidebar from "@/components/student-sidebar";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import Loading from "@/components/loading";

// Define types
interface ActivityCategory {
  id: number;
  name: string;
  nameEn: string;
  color: string;
}

interface ActivityFile {
  id: number;
  filename: string;
  originalFilename: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
}

interface Activity {
  id: number;
  studentId: number;
  title: string;
  activityDate: string;
  category: ActivityCategory;
  description: string;
  learning: string;
  problems: string;
  solutions: string;
  tags: string[];
  files: ActivityFile[];
  createdAt: string;
  updatedAt: string;
}

export default function ActivityDetail({ params }: { params: { id: string } }) {
  const activityId = params.id;
  const { toast } = useToast();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Format date
  const formatDate = (
    dateString: string,
    formatStr: string = "d MMMM yyyy"
  ): string => {
    try {
      const date =
        typeof dateString === "string"
          ? parseISO(dateString)
          : new Date(dateString);
      return format(date, formatStr, { locale: th });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  // Format datetime
  const formatDateTime = (dateString: string): string => {
    return formatDate(dateString, "d MMMM yyyy HH:mm");
  };

  // Get badge style for category
  const getCategoryBadgeStyle = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "green":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "purple":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "orange":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "red":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Fetch activity data
  const fetchActivity = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/student-activities/${activityId}`);
      const data = await response.json();

      if (data.success) {
        setActivity(data.data);
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
      setLoading(false);
    }
  };

  // Download file
  const handleDownloadFile = (file: ActivityFile) => {
    const fileUrl = `/uploads/activities/${activityId}/${file.filename}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.originalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch activity on component mount
  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {loading && <Loading />}

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              ระบบฝึกงาน (นักศึกษา)
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">นายสมชาย ใจดี</span>
              <Link href="/">
                <Button variant="outline" size="sm">
                  ออกจากระบบ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StudentSidebar activePage="activities" />

          <div className="md:col-span-3">
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
              ) : activity ? (
                <>
                  <CardHeader className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Link href="/student/activities">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ArrowLeftIcon className="h-4 w-4" />
                            กลับ
                          </Button>
                        </Link>
                      </div>
                      <CardTitle className="text-xl">
                        {activity.title}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <span>{formatDate(activity.activityDate)}</span>
                          </div>
                          <Badge
                            className={getCategoryBadgeStyle(
                              activity.category.color
                            )}
                          >
                            {activity.category.name}
                          </Badge>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/student/activities/edit/${activity.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <PencilIcon className="h-4 w-4" />
                          แก้ไข
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          รายละเอียดกิจกรรม
                        </h3>
                        <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded-md border">
                          {activity.description}
                        </div>
                      </div>

                      {activity.learning && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            สิ่งที่ได้เรียนรู้
                          </h3>
                          <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded-md border">
                            {activity.learning}
                          </div>
                        </div>
                      )}

                      {activity.problems && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            ปัญหาและอุปสรรค
                          </h3>
                          <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded-md border">
                            {activity.problems}
                          </div>
                        </div>
                      )}

                      {activity.solutions && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            แนวทางการแก้ไขปัญหา
                          </h3>
                          <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded-md border">
                            {activity.solutions}
                          </div>
                        </div>
                      )}

                      {activity.tags && activity.tags.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">แท็ก</h3>
                          <div className="flex flex-wrap gap-2">
                            {activity.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <TagIcon className="h-3 w-3" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {activity.files && activity.files.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">ไฟล์แนบ</h3>
                          <div className="space-y-2">
                            {activity.files.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center gap-2 p-2 border rounded-md bg-gray-50"
                              >
                                <FileIcon className="h-4 w-4 text-blue-500" />
                                <span className="flex-grow">
                                  {file.originalFilename}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatFileSize(file.fileSize)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadFile(file)}
                                >
                                  ดาวน์โหลด
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            สร้างเมื่อ: {formatDateTime(activity.createdAt)}
                          </span>
                        </div>
                        {activity.updatedAt && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>
                              แก้ไขล่าสุด: {formatDateTime(activity.updatedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="/student/activities">
                      <Button variant="outline">กลับไปหน้ากิจกรรม</Button>
                    </Link>
                    <div className="flex gap-2">
                      <Button variant="outline">พิมพ์</Button>
                      <Button variant="outline">ส่งออก PDF</Button>
                    </div>
                  </CardFooter>
                </>
              ) : null}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
