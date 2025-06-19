"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import Link from "next/link";
import MentorSidebar from "@/components/mentor-sidebar";

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

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [newNote, setNewNote] = useState("");

  // In a real application, you would fetch the student data based on the ID
  // For this example, we're using the mock data
  const student = studentData;

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MentorSidebar activePage="students" />

        <div className="md:col-span-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/mentor/students">
                <ChevronLeft className="h-4 w-4 mr-1" />
                กลับไปยังรายชื่อนักศึกษา
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={student.image} alt={student.name} />
                    <AvatarFallback>
                      {student.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{student.name}</CardTitle>
                    <CardDescription className="text-base">
                      {student.id} • {student.department} • {student.position}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    ชั้นปีที่ {student.year}
                  </Badge>
                  {student.status === "active" && (
                    <Badge className="bg-green-500">กำลังฝึกงาน</Badge>
                  )}
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
                      <div>{student.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">เบอร์โทรศัพท์</div>
                      <div>{student.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">ระยะเวลาฝึกงาน</div>
                      <div>
                        {student.startDate} - {student.endDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">อาจารย์ที่ปรึกษา</div>
                      <div>{student.advisor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.advisor.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.advisor.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">แหล่งฝึกงาน</div>
                      <div>{student.company.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.company.website}
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

              <Tabs defaultValue="tasks">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
                  <TabsTrigger value="tasks">งานที่ได้รับมอบหมาย</TabsTrigger>
                  <TabsTrigger value="reports">รายงาน</TabsTrigger>
                  <TabsTrigger value="evaluations">การประเมินผล</TabsTrigger>
                  <TabsTrigger value="attendance">การเข้างาน</TabsTrigger>
                  <TabsTrigger value="notes">บันทึก</TabsTrigger>
                </TabsList>

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

                <TabsContent value="evaluations" className="space-y-4">
                  {student.evaluations.map((evaluation) => (
                    <Card key={evaluation.id}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {evaluation.title}
                            </CardTitle>
                            <CardDescription>{evaluation.date}</CardDescription>
                          </div>
                          {evaluation.status === "completed" ? (
                            <Badge className="bg-green-500">ประเมินแล้ว</Badge>
                          ) : (
                            <Badge className="bg-yellow-500">รอประเมิน</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {evaluation.status === "completed" ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">คะแนน:</span>
                              <span className="font-bold text-lg">
                                {evaluation.score}/100
                              </span>
                            </div>
                            <div>
                              <div className="font-medium mb-1">
                                ข้อเสนอแนะ:
                              </div>
                              <p className="text-sm">{evaluation.feedback}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <Button asChild>
                              <Link
                                href={`/mentor/evaluations/${student.id}/${evaluation.id}`}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                ทำการประเมิน
                              </Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
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

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">
                        เพิ่มบันทึกใหม่
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Textarea
                        placeholder="เพิ่มบันทึกหรือข้อสังเกตเกี่ยวกับนักศึกษา..."
                        className="mb-2"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button disabled={!newNote.trim()}>บันทึก</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {student.notes.map((note, index) => (
                    <Card key={index}>
                      <CardHeader className="p-4 pb-2">
                        <CardDescription>{note.date}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
