"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Edit,
  PlusIcon,
  SearchIcon,
  Trash2,
  TrashIcon,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";

// Activity type definition
interface ActivityCategory {
  id: number;
  name: string;
  nameEn: string;
  color: string;
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
  createdAt: string;
  updatedAt: string;
}

export default function StudentActivities() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const [calendars, setCalendars] = useState<any>([]);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);

  useEffect(() => {
    fetchActivities();
  }, [calendarSelected]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      if (!user) return;
      let url = `/api/student-activities?studentId=${user.id}`;
      if (calendarSelected) {
        url += `&calendarId=${calendarSelected}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setCalendars(data.calendar);
        if (!calendarSelected) {
          let findActive = data.calendar.find(
            (cal: any) => cal.active_id === 1
          );
          if (findActive) {
            setCalendarSelected(findActive.id.toString());
          } else {
            setCalendarSelected(data.calendar[0]?.id.toString() || null);
          }
        }
        setActivities(data.data);
      } else {
        console.error("Error fetching activities:", data.message);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถดึงข้อมูลกิจกรรมได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete an activity
  const deleteActivity = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student-activities/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "ลบกิจกรรมสำเร็จ",
          description: "ลบข้อมูลกิจกรรมเรียบร้อยแล้ว",
        });
        // Refresh the activities list
        fetchActivities();
      } else {
        console.error("Error deleting activity:", data.message);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถลบกิจกรรมได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setActivityToDelete(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy", { locale: th });
    } catch (error) {
      return dateString;
    }
  };

  // Get badge style based on category
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {loading && <Loading />}

      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="activities" userType="student" />

          <div className="md:col-span-4">
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">
                    บันทึกกิจกรรมการปฏิบัติงาน
                  </CardTitle>
                  <CardDescription>
                    บันทึกกิจกรรมที่ทำในแต่ละวันระหว่างการฝึกงาน
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={calendarSelected ? calendarSelected.toString() : ""}
                    onValueChange={(value) => {
                      setCalendarSelected(value || null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกผลัดฝึกงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendars.map((cal: any) => (
                        <SelectItem key={cal.id} value={cal.id.toString()}>
                          {cal.name} ปีการศึกษา {cal.semester}/{cal.year} (
                          {new Date(cal.start_date).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          -{" "}
                          {new Date(cal.end_date).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Link href="/student/activities/new">
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      บันทึกกิจกรรมใหม่
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-lg font-medium">บันทึกประจำวัน</h3>
                  </div>

                  <div className="space-y-4">
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="border p-4 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <CalendarIcon className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">
                                  {formatDate(activity.activityDate)}
                                </span>
                                <Badge
                                  className={`ml-2 ${getCategoryBadgeStyle(
                                    activity.category.color
                                  )}`}
                                >
                                  {activity.category.name}
                                </Badge>
                              </div>
                              <h3 className="font-medium text-lg">
                                {activity.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-2">
                                {activity.description.length > 200
                                  ? `${activity.description.substring(
                                    0,
                                    200
                                  )}...`
                                  : activity.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {activity.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 justify-center self-start items-center">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() =>
                                      setActivityToDelete(activity.id)
                                    }
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      ยืนยันการลบกิจกรรม
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้?
                                      การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      ยกเลิก
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        deleteActivity(activity.id)
                                      }
                                    >
                                      ลบกิจกรรม
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <Link
                                href={`/student/activities/edit/${activity.id}`}
                              >
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 border rounded-lg">
                        <p className="text-gray-500">ไม่พบกิจกรรมที่ต้องการ</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {searchTerm || selectedMonth !== "all"
                            ? "ลองเปลี่ยนเงื่อนไขการค้นหา หรือล้างตัวกรอง"
                            : "เริ่มบันทึกกิจกรรมใหม่โดยคลิกที่ปุ่ม 'บันทึกกิจกรรมใหม่'"}
                        </p>
                      </div>
                    )}

                    {activities.length > 0 && activities.length % 10 === 0 && (
                      <div className="flex justify-center mt-6">
                        <Button variant="outline" onClick={fetchActivities}>
                          โหลดเพิ่มเติม
                        </Button>
                      </div>
                    )}
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
