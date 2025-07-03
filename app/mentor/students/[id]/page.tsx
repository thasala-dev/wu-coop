"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  UserCheck,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ArrowLeft,
  ChevronRight,
  PersonStanding,
  User,
} from "lucide-react";
import Link from "next/link";
import MentorSidebar from "@/components/mentor-sidebar";
import Sidebar from "@/components/sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";

// Mock data for a single student
const studentData = {
  id: "6401234",
  name: "นายธนกร มั่นคง",
  image: "/placeholder.svg?height=100&width=100",
  department: "วิศวกรรมซอฟต์แวร์",
  faculty: "วิศวกรรมศาสตร์",
  year: 3,
  position: "Software Developer Intern",
  startDate: "1 มิถุนายน 2566",
  endDate: "30 กันยายน 2566",
  status: "active",
  progress: 75,
  email: "thanakorn.m@example.com",
  phone: "062-XXX-XXXX",
  address:
    "แหล่งฝึกงาน เทคโนโลยี จำกัด 123 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
  advisor: {
    name: "ผศ.ดร.สมชาย ใจดี",
    email: "somchai.j@university.ac.th",
    phone: "081-XXX-XXXX",
  },
  company: {
    name: "แหล่งฝึกงาน เทคโนโลยี จำกัด",
    address: "123 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
    website: "www.techcompany.co.th",
  },
  skills: ["JavaScript", "React", "Node.js", "Git", "Agile"],
  tasks: [
    {
      name: "พัฒนาระบบหน้าบ้าน",
      status: "completed",
      description: "พัฒนาส่วนติดต่อผู้ใช้สำหรับระบบจัดการข้อมูลลูกค้า",
      dueDate: "15 กรกฎาคม 2566",
    },
    {
      name: "ทดสอบระบบ",
      status: "in-progress",
      description: "ทดสอบการทำงานของระบบและรายงานข้อผิดพลาด",
      dueDate: "20 สิงหาคม 2566",
    },
    {
      name: "จัดทำเอกสาร",
      status: "pending",
      description: "จัดทำเอกสารคู่มือการใช้งานระบบ",
      dueDate: "10 กันยายน 2566",
    },
  ],
  reports: [
    {
      id: "R001",
      title: "รายงานประจำสัปดาห์ที่ 1",
      date: "7 มิถุนายน 2566",
      status: "submitted",
      feedback: "รายงานละเอียดดี มีการอธิบายงานที่ทำได้ชัดเจน",
    },
    {
      id: "R002",
      title: "รายงานประจำสัปดาห์ที่ 2",
      date: "14 มิถุนายน 2566",
      status: "submitted",
      feedback: "ควรเพิ่มรายละเอียดของปัญหาที่พบและวิธีการแก้ไข",
    },
    {
      id: "R003",
      title: "รายงานความก้าวหน้า",
      date: "30 มิถุนายน 2566",
      status: "submitted",
      feedback: "รายงานมีคุณภาพดี มีการวิเคราะห์ปัญหาและแนวทางแก้ไขได้ดี",
    },
    {
      id: "R004",
      title: "รายงานประจำสัปดาห์ที่ 3",
      date: "21 มิถุนายน 2566",
      status: "submitted",
      feedback: "",
    },
    {
      id: "R005",
      title: "รายงานประจำสัปดาห์ที่ 4",
      date: "28 มิถุนายน 2566",
      status: "submitted",
      feedback: "",
    },
  ],
  evaluations: [
    {
      id: "E001",
      title: "การประเมินครั้งที่ 1",
      date: "30 มิถุนายน 2566",
      status: "completed",
      score: 85,
      feedback:
        "มีความรับผิดชอบดี ทำงานได้ตามเป้าหมาย ควรพัฒนาทักษะการสื่อสารเพิ่มเติม",
    },
    {
      id: "E002",
      title: "การประเมินครั้งที่ 2",
      date: "31 กรกฎาคม 2566",
      status: "completed",
      score: 90,
      feedback:
        "พัฒนาการดีขึ้น มีความคิดริเริ่มสร้างสรรค์ สามารถแก้ไขปัญหาได้ดี",
    },
    {
      id: "E003",
      title: "การประเมินครั้งที่ 3",
      date: "31 สิงหาคม 2566",
      status: "pending",
      score: null,
      feedback: "",
    },
  ],
  attendance: [
    { date: "1 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "2 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "5 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "6 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "7 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "8 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "7 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "8 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "9 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "12 มิถุนายน 2566", status: "late", hours: 7 },
    { date: "13 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "14 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "15 มิถุนายน 2566", status: "present", hours: 8 },
    { date: "16 มิถุนายน 2566", status: "absent", hours: 0 },
  ],
  notes: [
    {
      date: "5 มิถุนายน 2566",
      content: "นักศึกษาเริ่มงานได้ดี มีความกระตือรือร้น",
    },
    {
      date: "20 มิถุนายน 2566",
      content:
        "นักศึกษาสามารถเรียนรู้งานได้เร็ว แต่ควรระมัดระวังเรื่องความละเอียดรอบคอบ",
    },
    {
      date: "15 กรกฎาคม 2566",
      content: "นักศึกษามีพัฒนาการที่ดีขึ้น สามารถทำงานได้อย่างอิสระมากขึ้น",
    },
  ],
};

// Task status component
function TaskStatus({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span>เสร็จสิ้น</span>
      </div>
    );
  } else if (status === "in-progress") {
    return (
      <div className="flex items-center gap-1 text-yellow-600">
        <Clock className="h-4 w-4" />
        <span>กำลังดำเนินการ</span>
      </div>
    );
  } else if (status === "pending") {
    return (
      <div className="flex items-center gap-1 text-gray-600">
        <AlertCircle className="h-4 w-4" />
        <span>รอดำเนินการ</span>
      </div>
    );
  }
  return null;
}

// Report status badge component
function ReportStatusBadge({ status }: { status: string }) {
  if (status === "submitted") {
    return <Badge className="bg-green-500">ส่งแล้ว</Badge>;
  } else if (status === "pending") {
    return <Badge className="bg-yellow-500">รอส่ง</Badge>;
  } else if (status === "late") {
    return <Badge className="bg-red-500">ส่งล่าช้า</Badge>;
  }
  return <Badge className="bg-gray-500">ไม่ทราบสถานะ</Badge>;
}

// Attendance status component
function AttendanceStatus({ status }: { status: string }) {
  if (status === "present") {
    return <Badge className="bg-green-500">มา</Badge>;
  } else if (status === "late") {
    return <Badge className="bg-yellow-500">มาสาย</Badge>;
  } else if (status === "absent") {
    return <Badge className="bg-red-500">ขาด</Badge>;
  }
  return <Badge className="bg-gray-500">ไม่ทราบสถานะ</Badge>;
}

const studentSchema = z.object({
  position: z.string(),
  job_description: z.string(),
});

export default function StudentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  // In a real application, you would fetch the student data based on the ID
  // For this example, we're using the mock data
  const student = studentData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
  } = useForm<any>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      position: "",
      job_description: "",
    },
  });

  async function onSubmit(values: any) {
    console.log("Form submitted with values:", values);
    setLoading(true);
    try {
      const payload = { ...values };
      console.log("Payload before processing:", payload);

      if (payload.password === "") {
        delete payload.password; // ลบ password ออกจาก payload หากเป็นค่าว่าง
      }

      // ตรวจสอบและจัดการค่า image ก่อนส่งไปยังเซิร์ฟเวอร์
      if (payload.image && typeof payload.image === "object") {
        try {
          // แปลงออบเจ็กต์เป็น JSON string
          payload.image = JSON.stringify(payload.image);
        } catch (error) {
          console.error("Error processing avatar image:", error);
          // กรณีแปลงไม่ได้ ให้ใช้ค่าว่าง
          payload.image = "";
        }
      }

      console.log("Final payload:", payload);

      // 4. Submit main form data
      const response = await fetch(`/api/student/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok && data.success) {
        toast({
          title: "ดำเนินการสำเร็จ",
          description: data.message || "แก้ไขข้อมูลผู้ดูแลระบบสำเร็จ",
          variant: "success",
        });
        router.push("/admin/students");
      } else {
        toast({
          title: "ดำเนินการไม่สำเร็จ",
          description: data.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
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
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      console.log("Fetching student data for ID:", id);
      const response = await fetch(`/api/evaluations/${id}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        toast({
          title: "ไม่สามารถโหลดข้อมูลนักศึกษาได้",
          description: "เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา",
          variant: "destructive",
        });
        return;
      }
      const data = await response.json();
      if (data.success) {
        setData(data.data);
        console.log("Setting form values with data:", data.data);
        setValue("fullname", data.data.fullname);
        setValue("student_id", data.data.student_id);
      } else {
        toast({
          title: "ไม่พบข้อมูลนักศึกษา",
          description: data.message || "เกิดข้อผิดพลาด",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลนักศึกษาได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Sidebar activePage="students" userType="mentor" />
        {loading && <Loading />}
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              asChild
            >
              <a href="/mentor/students">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <a href="/mentor/students" className="hover:text-gray-900">
                นักศึกษาทั้งหมด
              </a>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900">รายละเอียดนักศึกษา</span>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <CustomAvatar
                    id={`student${data?.student_id}`}
                    image={data?.image}
                    size="16"
                  />
                  <div>
                    <CardTitle className="text-xl">{data?.fullname}</CardTitle>
                    <CardDescription className="text-base">
                      {data?.student_id} • {data?.position}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    ปีรหัสที่ {student.year}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">อีเมล</div>
                      <div>{data?.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">เบอร์โทรศัพท์</div>
                      <div>{data?.mobile}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">อาจารย์ที่ปรึกษา</div>
                      <div>{data?.advisor_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {data?.advisor_email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {data?.advisor_mobile}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">ผู้ติดต่อฉุกเฉิน</div>
                      <div>{data?.emergency_contact_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {data?.emergency_contact_relation}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {data?.emergency_contact_phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">ผลัดการฝึก</div>
                      <div>
                        {data?.calendar_name} ปีการศึกษา {data?.semester}/
                        {data?.year}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(data?.start_date).toLocaleDateString(
                          "th-TH",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(data?.end_date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">ที่อยู่</div>
                      <div className="text-sm">{student.company.address}</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">ทักษะ</div>
                    <div className="flex flex-wrap gap-2">
                      {student.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">ความคืบหน้าโดยรวม</div>
                    <Progress value={student.progress} className="h-2" />
                    <div className="text-sm text-right mt-1">
                      {student.progress}%
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="notes">
                <TabsList className="grid w-full grid-cols-4 mb-6 h-9 rounded-md bg-gray-100 p-0.5">
                  <TabsTrigger value="notes">รายละเอียดการฝึกงาน</TabsTrigger>
                  <TabsTrigger value="tasks">งานที่ได้รับมอบหมาย</TabsTrigger>
                  <TabsTrigger value="reports">รายงาน</TabsTrigger>
                  <TabsTrigger value="attendance">การเข้างาน</TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">
                        เพิ่มบันทึกใหม่
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <Textarea
                          placeholder="เพิ่มบันทึกหรือข้อสังเกตเกี่ยวกับนักศึกษา..."
                          className="mb-2"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <div className="flex justify-end">
                          <Button disabled={!newNote.trim()}>บันทึก</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  {student.tasks.map((task, index) => (
                    <Card key={index}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {task.name}
                          </CardTitle>
                          <TaskStatus status={task.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm mb-2">{task.description}</p>
                        <div className="text-sm text-muted-foreground">
                          กำหนดส่ง: {task.dueDate}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button className="w-full">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    เพิ่มงานใหม่
                  </Button>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              รหัสรายงาน
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              ชื่อรายงาน
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              วันที่ส่ง
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              สถานะ
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              การให้ข้อเสนอแนะ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {student.reports.map((report) => (
                            <tr
                              key={report.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle">{report.id}</td>
                              <td className="p-4 align-middle font-medium">
                                {report.title}
                              </td>
                              <td className="p-4 align-middle">
                                {report.date}
                              </td>
                              <td className="p-4 align-middle">
                                <ReportStatusBadge status={report.status} />
                              </td>
                              <td className="p-4 align-middle">
                                {report.feedback ? (
                                  <div className="text-sm">
                                    {report.feedback}
                                  </div>
                                ) : (
                                  <Button size="sm" variant="outline">
                                    <FileText className="mr-2 h-4 w-4" />
                                    ให้ข้อเสนอแนะ
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              วันที่
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              สถานะ
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              จำนวนชั่วโมง
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {student.attendance.map((record, index) => (
                            <tr
                              key={index}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle">
                                {record.date}
                              </td>
                              <td className="p-4 align-middle">
                                <AttendanceStatus status={record.status} />
                              </td>
                              <td className="p-4 align-middle">
                                {record.hours}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
