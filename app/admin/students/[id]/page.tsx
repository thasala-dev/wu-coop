"use client";

import React from "react";
import { useState } from "react";
import {
  ArrowLeft,
  Edit,
  Download,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  BarChart,
  History,
  MapPin,
  Briefcase,
  Star,
  Users,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Loading from "@/components/loading";
import UnifiedSidebar from "@/components/unified-sidebar";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Sidebar from "@/components/sidebar";
import CustomAvatar from "@/components/avatar";

// Status mapping for display
const statusMap = {
  pending: {
    label: "รอการจับคู่",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  placed: {
    label: "จับคู่แล้ว",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle,
  },
  active: {
    label: "กำลังฝึกงาน",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  issue: {
    label: "มีปัญหา",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertCircle,
  },
  completed: {
    label: "เสร็จสิ้น",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    icon: CheckCircle,
  },
};

// Mock student data
const student = {
  id: "STU001",
  name: "นายธนกร มั่นคง",
  studentId: "64XXXXX21",
  faculty: "คณะเภสัชศาสตร์",
  department: "สาขาเภสัชกรรมคลินิก",
  year: 4,
  gpa: 3.75,
  status: "active",
  company: "โรงพยาบาลศิริราช",
  companyAddress: "2 ถนนวังหลัง แขวงศิริราช เขตบางกอกน้อย กรุงเทพมหานคร 10700",
  position: "ผู้ช่วยเภสัชกร",
  startDate: "1 มิถุนายน 2566",
  endDate: "31 สิงหาคม 2566",
  advisor: "ผศ.ดร.สมชาย ใจดี",
  mentor: "ภก.วิชัย สุขภาพดี",
  phone: "081-234-5678",
  email: "thanakorn.m@example.com",
  address: "123 หมู่ 4 ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200",
  avatar: "/placeholder.svg?height=80&width=80",
  emergency: {
    name: "นางสมศรี มั่นคง",
    relation: "มารดา",
    phone: "089-765-4321",
  },
  skills: [
    "การบริบาลทางเภสัชกรรม",
    "การจ่ายยา",
    "การเตรียมยาเคมีบำบัด",
    "การให้คำปรึกษาด้านยา",
    "การคำนวณขนาดยา",
  ],
  interests: ["เภสัชกรรมโรงพยาบาล", "เภสัชกรรมชุมชน", "การวิจัยทางคลินิก"],
  reports: [
    {
      id: "REP001",
      title: "รายงานประจำเดือนที่ 1",
      status: "completed",
      date: "30 มิถุนายน 2566",
    },
    {
      id: "REP002",
      title: "รายงานประจำเดือนที่ 2",
      status: "completed",
      date: "31 กรกฎาคม 2566",
    },
    {
      id: "REP003",
      title: "รายงานประจำเดือนที่ 3",
      status: "pending",
      date: "31 สิงหาคม 2566",
    },
    {
      id: "REP004",
      title: "รายงานฉบับสมบูรณ์",
      status: "not_started",
      date: "15 กันยายน 2566",
    },
  ],
  evaluations: [
    {
      id: "EVA001",
      title: "การประเมินผลการปฏิบัติงานครั้งที่ 1",
      evaluator: "ภก.วิชัย สุขภาพดี",
      score: 85,
      status: "completed",
      date: "30 มิถุนายน 2566",
    },
    {
      id: "EVA002",
      title: "การประเมินผลการปฏิบัติงานครั้งที่ 2",
      evaluator: "ภก.วิชัย สุขภาพดี",
      score: 90,
      status: "completed",
      date: "31 กรกฎาคม 2566",
    },
    {
      id: "EVA003",
      title: "การประเมินผลการปฏิบัติงานครั้งที่ 3",
      evaluator: "ภก.วิชัย สุขภาพดี",
      score: null,
      status: "pending",
      date: "31 สิงหาคม 2566",
    },
  ],
  visits: [
    {
      id: "VIS001",
      date: "15 มิถุนายน 2566",
      advisor: "ผศ.ดร.สมชาย ใจดี",
      status: "completed",
      notes: "นักศึกษาปรับตัวได้ดี เริ่มเรียนรู้งานได้เร็ว",
    },
    {
      id: "VIS002",
      date: "15 กรกฎาคม 2566",
      advisor: "ผศ.ดร.สมชาย ใจดี",
      status: "completed",
      notes: "นักศึกษามีพัฒนาการที่ดี สามารถทำงานได้อย่างมีประสิทธิภาพ",
    },
    {
      id: "VIS003",
      date: "15 สิงหาคม 2566",
      advisor: "ผศ.ดร.สมชาย ใจดี",
      status: "scheduled",
      notes: "",
    },
  ],
  activities: [
    {
      id: "ACT001",
      title: "การอบรมการใช้ระบบจัดการยาในโรงพยาบาล",
      date: "10 มิถุนายน 2566",
      status: "completed",
    },
    {
      id: "ACT002",
      title: "การให้ความรู้เรื่องยาแก่ผู้ป่วยเบาหวาน",
      date: "5 กรกฎาคม 2566",
      status: "completed",
    },
    {
      id: "ACT003",
      title: "การจัดทำแผ่นพับให้ความรู้เรื่องยาปฏิชีวนะ",
      date: "20 กรกฎาคม 2566",
      status: "completed",
    },
  ],
  progressPercentage: 75,
};

// Quick stats
const quickStats = [
  {
    label: "รายงาน",
    value: "3/4",
    icon: FileText,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "การนิเทศ",
    value: "2/3",
    icon: Users,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "การประเมิน",
    value: "2/3",
    icon: Star,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "กิจกรรม",
    value: "3",
    icon: Calendar,
    color: "bg-violet-50 text-violet-600",
  },
];

export default function AdminStudentDetailPage() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  React.useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student/${params.id}`);

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get the response text first
      const responseText = await response.text();

      // Try to parse the JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        console.error("Response text:", responseText);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถอ่านข้อมูลจากเซิร์ฟเวอร์ได้",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data && data.success) {
        // Map database status to statusMap keys if needed
        const studentData = data.data || {};

        // If there's a status_id from database, map it to our status values
        // This ensures we have a valid status key for the statusMap
        if (studentData.status_id !== undefined) {
          switch (studentData.status_id) {
            case 0:
              studentData.status = "pending";
              break;
            case 1:
              studentData.status = "active";
              break;
            case 2:
              studentData.status = "completed";
              break;
            case 3:
              studentData.status = "issue";
              break;
            case 4:
              studentData.status = "placed";
              break;
            default:
              studentData.status = "pending";
          }
        }

        // Ensure studentData has default values for arrays to avoid rendering errors
        studentData.skills = studentData.skills || [];
        studentData.interests = studentData.interests || [];
        studentData.reports = studentData.reports || [];
        studentData.evaluations = studentData.evaluations || [];
        studentData.visits = studentData.visits || [];
        studentData.activities = studentData.activities || [];
        studentData.emergency = studentData.emergency || {};

        setStudent(studentData);
      } else {
        console.error(
          "Failed to fetch student data:",
          data?.message || "Unknown error"
        );
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลนักศึกษาได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/student/${params.id}`, {
        method: "DELETE",
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get the response text first
      const responseText = await response.text();

      // Try to parse the JSON
      let result;
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        console.error("Response text:", responseText);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถอ่านข้อมูลการตอบกลับจากเซิร์ฟเวอร์",
          variant: "destructive",
        });
        setLoading(false);
        setDeleteDialogOpen(false);
        return;
      }

      if (result && result.success) {
        toast({
          title: "ลบข้อมูลสำเร็จ",
          description: "ลบข้อมูลนักศึกษาเรียบร้อยแล้ว",
          variant: "success",
        });
        // Navigate back to students list
        router.push("/admin/students");
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: result?.message || "ไม่สามารถลบข้อมูลได้",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบข้อมูลได้ โปรดลองอีกครั้ง",
        variant: "destructive",
      });
      setLoading(false);
    }

    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <UnifiedSidebar activePage="students" userType="admin" />
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <UnifiedSidebar activePage="students" userType="admin" />
            <div className="md:col-span-4 text-center py-12">
              <p>ไม่พบข้อมูลนักศึกษา</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="students" userType="admin" />
          {loading && <Loading />}

          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <a href="/admin/students">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/students" className="hover:text-gray-900">
                  นักศึกษาทั้งหมด
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">ข้อมูลนักศึกษา</span>
              </div>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-700"></div>
              <CardContent className="p-0">
                <div className="px-6 pb-6 relative">
                  <div className="h-24 w-24 rounded shadow-sm absolute -top-12">
                    <CustomAvatar
                      id={`student${student.student_id}`}
                      image={student.image}
                      size="24"
                    />
                  </div>

                  <div className="pt-16 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-medium">
                        {student.fullname}
                      </h1>
                      <p className="text-gray-500 text-sm">
                        {student.student_id}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        className="h-9 px-3 rounded-md border-gray-200 text-sm bg-white"
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        <span>ดาวน์โหลดข้อมูล</span>
                      </Button>
                      <Button className="h-9 px-3 rounded-md bg-gray-900 hover:bg-gray-800 text-sm">
                        <Edit className="h-4 w-4 mr-1.5" />
                        <span>แก้ไขข้อมูล</span>
                      </Button>
                      <Button
                        onClick={handleDeleteClick}
                        variant="destructive"
                        className="h-9 px-3 rounded-md text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        <span>ลบข้อมูล</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${
                            student.status &&
                            statusMap[student.status as keyof typeof statusMap]
                              ? statusMap[
                                  student.status as keyof typeof statusMap
                                ].color
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          } flex items-center gap-1 px-2.5 py-1 text-sm border`}
                        >
                          {student.status &&
                          statusMap[student.status as keyof typeof statusMap]
                            ? React.createElement(
                                statusMap[
                                  student.status as keyof typeof statusMap
                                ].icon,
                                {
                                  className: "h-3.5 w-3.5",
                                }
                              )
                            : React.createElement(Clock, {
                                className: "h-3.5 w-3.5",
                              })}
                          {student.status &&
                          statusMap[student.status as keyof typeof statusMap]
                            ? statusMap[
                                student.status as keyof typeof statusMap
                              ].label
                            : "ไม่ระบุสถานะ"}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          ระยะเวลาฝึกงาน: {student.startDate} -{" "}
                          {student.endDate}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{student.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{student.faculty}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span>
                            ปีรหัสที่ {student.std_year} | เกรดเฉลี่ย{" "}
                            {student.gpa}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{student.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span>{student.company}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          ความคืบหน้าการฝึกฝึกงาน
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            ความคืบหน้า
                          </span>
                          <span className="text-sm font-medium">
                            {student.progressPercentage}%
                          </span>
                        </div>
                        <Progress
                          value={student.progressPercentage}
                          className="h-2 bg-gray-100"
                          indicatorClassName="bg-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        {quickStats.map((stat, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg border border-gray-200 p-3 text-center"
                          >
                            <div
                              className={`${stat.color} w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2`}
                            >
                              <stat.icon className="h-4 w-4" />
                            </div>
                            <div className="text-sm font-medium">
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-500">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white mt-6">
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent p-0">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      ภาพรวม
                    </TabsTrigger>
                    <TabsTrigger
                      value="coop"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      ข้อมูลฝึกงาน
                    </TabsTrigger>
                    <TabsTrigger
                      value="reports"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      รายงานและการประเมิน
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      ประวัติการดำเนินการ
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-gray-200 shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            ข้อมูลส่วนตัว
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2 text-sm">
                            <div className="flex flex-col">
                              <dt className="text-gray-500">ชื่อ-นามสกุล</dt>
                              <dd className="font-medium">{student.name}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">รหัสนักศึกษา</dt>
                              <dd>{student.studentId}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">คณะ/สาขา</dt>
                              <dd>
                                {student.faculty} / {student.department}
                              </dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">ปีรหัส</dt>
                              <dd>{student.year}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">เกรดเฉลี่ย</dt>
                              <dd>{student.gpa}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">อีเมล</dt>
                              <dd>{student.email}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">เบอร์โทรศัพท์</dt>
                              <dd>{student.phone}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">ที่อยู่</dt>
                              <dd>{student.address}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200 shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-500" />
                            ทักษะและความสนใจ
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm text-gray-500 mb-2">
                                ทักษะ
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {student.skills &&
                                  student.skills.map(
                                    (skill: string, index: number) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-gray-100 text-gray-800 hover:bg-gray-200 font-normal text-xs"
                                      >
                                        {skill}
                                      </Badge>
                                    )
                                  )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-500 mb-2">
                                ความสนใจ
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {student.interests &&
                                  student.interests.map(
                                    (interest: string, index: number) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-gray-700 font-normal text-xs border-gray-200"
                                      >
                                        {interest}
                                      </Badge>
                                    )
                                  )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200 shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            ข้อมูลแหล่งฝึกงาน
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2 text-sm">
                            <div className="flex flex-col">
                              <dt className="text-gray-500">แหล่งฝึกงาน</dt>
                              <dd className="font-medium">{student.company}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">ที่อยู่</dt>
                              <dd>{student.companyAddress}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">ตำแหน่ง</dt>
                              <dd>{student.position}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">
                                พนักงานที่ปรึกษา
                              </dt>
                              <dd>{student.mentor}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">ระยะเวลาฝึกงาน</dt>
                              <dd>
                                {student.startDate} - {student.endDate}
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200 shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            ข้อมูลฉุกเฉิน
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-2 text-sm">
                            <div className="flex flex-col">
                              <dt className="text-gray-500">
                                ชื่อผู้ติดต่อฉุกเฉิน
                              </dt>
                              <dd>{student.emergency_contact_name}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">ความสัมพันธ์</dt>
                              <dd>{student.emergency_contact_relation}</dd>
                            </div>
                            <div className="flex flex-col">
                              <dt className="text-gray-500">เบอร์โทรศัพท์</dt>
                              <dd>{student.emergency_contact_phone}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="coop" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="md:col-span-2 border-gray-200 shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <BarChart className="h-4 w-4 text-gray-500" />
                            ความคืบหน้าการฝึกฝึกงาน
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                ความคืบหน้า
                              </span>
                              <span className="text-sm font-medium">
                                {student.progressPercentage}%
                              </span>
                            </div>
                            <Progress
                              value={student.progressPercentage}
                              className="h-1.5 bg-gray-100"
                              indicatorClassName="bg-emerald-500"
                            />

                            <div className="pt-4">
                              <h4 className="text-sm text-gray-500 mb-2">
                                ระยะเวลาฝึกงาน
                              </h4>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {student.startDate}
                                </span>
                                <span className="text-gray-600">
                                  {student.endDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200 shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            การนิเทศนักศึกษา
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {student.visits.map((visit: any) => (
                              <div
                                key={visit.id}
                                className="border border-gray-200 rounded-lg p-3 bg-white"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{visit.date}</p>
                                    <p className="text-sm text-gray-500">
                                      อาจารย์: {visit.advisor}
                                    </p>
                                  </div>
                                  <Badge
                                    className={
                                      visit.status === "completed"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-blue-50 text-blue-700 border border-blue-200"
                                    }
                                  >
                                    {visit.status === "completed"
                                      ? "เสร็จสิ้น"
                                      : "กำหนดการ"}
                                  </Badge>
                                </div>
                                {visit.notes && (
                                  <p className="text-sm mt-2 text-gray-600">
                                    {visit.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200 shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            กิจกรรมระหว่างฝึกงาน
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {student.activities.map((activity: any) => (
                              <div
                                key={activity.id}
                                className="border border-gray-200 rounded-lg p-3 bg-white"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      {activity.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      วันที่: {activity.date}
                                    </p>
                                  </div>
                                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    เสร็จสิ้น
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="reports" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-gray-200 shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            รายงาน
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {student.reports.map((report: any) => (
                              <div
                                key={report.id}
                                className="border border-gray-200 rounded-lg p-3 bg-white"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      {report.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      กำหนดส่ง: {report.date}
                                    </p>
                                  </div>
                                  <Badge
                                    className={
                                      report.status === "completed"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : report.status === "pending"
                                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                    }
                                  >
                                    {report.status === "completed"
                                      ? "ส่งแล้ว"
                                      : report.status === "pending"
                                      ? "รอส่ง"
                                      : "ยังไม่ถึงกำหนด"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200 shadow-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-500" />
                            การประเมินผล
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {student.evaluations.map((evaluation: any) => (
                              <div
                                key={evaluation.id}
                                className="border border-gray-200 rounded-lg p-3 bg-white"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      {evaluation.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      ผู้ประเมิน: {evaluation.evaluator}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      วันที่: {evaluation.date}
                                    </p>
                                  </div>
                                  <Badge
                                    className={
                                      evaluation.status === "completed"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-amber-50 text-amber-700 border border-amber-200"
                                    }
                                  >
                                    {evaluation.status === "completed"
                                      ? "เสร็จสิ้น"
                                      : "รอดำเนินการ"}
                                  </Badge>
                                </div>
                                {evaluation.score !== null && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium">
                                      คะแนน: {evaluation.score}/100
                                    </p>
                                    <Progress
                                      value={evaluation.score}
                                      className="h-1.5 mt-1 bg-gray-100"
                                      indicatorClassName="bg-blue-500"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="p-6">
                    <Card className="border-gray-200 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <History className="h-4 w-4 text-gray-500" />
                          ประวัติการดำเนินการ
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent border-gray-100">
                              <TableHead className="text-xs font-medium text-gray-500">
                                วันที่
                              </TableHead>
                              <TableHead className="text-xs font-medium text-gray-500">
                                การดำเนินการ
                              </TableHead>
                              <TableHead className="text-xs font-medium text-gray-500">
                                ผู้ดำเนินการ
                              </TableHead>
                              <TableHead className="text-xs font-medium text-gray-500">
                                รายละเอียด
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="hover:bg-gray-50 border-gray-100">
                              <TableCell className="text-sm text-gray-600">
                                15 พ.ค. 2566
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                ลงทะเบียนฝึกงาน
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                นายธนกร มั่นคง
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                ลงทะเบียนเข้าร่วมโครงการฝึกงาน
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-gray-50 border-gray-100">
                              <TableCell className="text-sm text-gray-600">
                                20 พ.ค. 2566
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                จับคู่แหล่งฝึกงาน
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                ผศ.ดร.สมชาย ใจดี
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                จับคู่กับโรงพยาบาลศิริราช
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-gray-50 border-gray-100">
                              <TableCell className="text-sm text-gray-600">
                                25 พ.ค. 2566
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                ยืนยันการเข้าฝึกงาน
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                นายธนกร มั่นคง
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                ยืนยันการเข้าฝึกงานที่โรงพยาบาลศิริราช
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-gray-50 border-gray-100">
                              <TableCell className="text-sm text-gray-600">
                                1 มิ.ย. 2566
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                เริ่มฝึกงาน
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                ภก.วิชัย สุขภาพดี
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                เริ่มฝึกงานในตำแหน่งผู้ช่วยเภสัชกร
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบข้อมูล</DialogTitle>
            <DialogDescription>
              คุณแน่ใจหรือว่าต้องการลบข้อมูลนักศึกษานี้?
              การกระทำนี้ไม่สามารถย้อนคืนได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto"
            >
              ลบข้อมูล
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
