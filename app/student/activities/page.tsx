"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Loading from "@/components/loading";

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  // Generate month options for the filter dropdown
  const months = [
    { value: "6-2024", label: "มิถุนายน 2567" },
    { value: "7-2024", label: "กรกฎาคม 2567" },
    { value: "8-2024", label: "สิงหาคม 2567" },
    { value: "9-2024", label: "กันยายน 2567" },
    { value: "10-2024", label: "ตุลาคม 2567" }
  ];

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      // In a real application, you would get the student ID from context or session
      const studentId = 1; // Temporary student ID for testing
      
      let url = `/api/student-activities?studentId=${studentId}`;
      
      // Add search term if provided
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      // Add month filter if selected
      if (selectedMonth !== "all") {
        const [month, year] = selectedMonth.split("-");
        url += `&month=${month}&year=${year}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
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

  // Effect to fetch activities when dependencies change
  useEffect(() => {
    fetchActivities();
  }, [searchTerm, selectedMonth]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {loading && <Loading />}
      
    

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Sidebar activePage="activities" userType="student" />

          <div className="md:col-span-3">
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">บันทึกกิจกรรมการปฏิบัติงาน</CardTitle>
                  <CardDescription>บันทึกกิจกรรมที่ทำในแต่ละวันระหว่างการฝึกงาน</CardDescription>
                </div>
                <Link href="/student/activities/new">
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    บันทึกกิจกรรมใหม่
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-lg font-medium">บันทึกประจำวัน</h3>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          placeholder="ค้นหากิจกรรม..." 
                          className="pl-10" 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select 
                        value={selectedMonth} 
                        onValueChange={setSelectedMonth}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="ทั้งหมด" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทั้งหมด</SelectItem>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <div key={activity.id} className="border p-4 rounded-lg hover:bg-gray-50">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <CalendarIcon className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">{formatDate(activity.activityDate)}</span>
                                <Badge className={`ml-2 ${getCategoryBadgeStyle(activity.category.color)}`}>
                                  {activity.category.name}
                                </Badge>
                              </div>
                              <h3 className="font-medium text-lg">{activity.title}</h3>
                              <p className="text-sm text-gray-600 mt-2">
                                {activity.description.length > 200
                                  ? `${activity.description.substring(0, 200)}...`
                                  : activity.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {activity.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 min-w-[120px] self-start">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setActivityToDelete(activity.id)}>
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>ยืนยันการลบกิจกรรม</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteActivity(activity.id)}>
                                      ลบกิจกรรม
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <Link href={`/student/activities/edit/${activity.id}`}>
                                <Button variant="outline" size="sm">
                                  แก้ไข
                                </Button>
                              </Link>
                              <Link href={`/student/activities/${activity.id}`}>
                                <Button size="sm">ดูรายละเอียด</Button>
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
                        <Button variant="outline" onClick={fetchActivities}>โหลดเพิ่มเติม</Button>
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
