"use client";
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  User,
  Briefcase,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit,
  Car,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdvisorSidebar from "@/components/advisor-sidebar";

// Mock data for a single student
const studentData = {
  id: "1",
  name: "นายสมชาย ใจดี",
  studentId: "6309681234",
  faculty: "คณะเภสัชศาสตร์",
  major: "เภสัชศาสตร์",
  year: 4,
  status: "active",
  company: "โรงพยาบาลศิริราช",
  position: "ผู้ช่วยเภสัชกร",
  department: "ฝ่ายเภสัชกรรม",
  location: "กรุงเทพมหานคร",
  startDate: "01/06/2023",
  endDate: "31/08/2023",
  mentor: {
    name: "ภญ.สุดา รักษาดี",
    position: "เภสัชกรชำนาญการ",
    phone: "02-123-4567",
    email: "suda.r@hospital.com",
  },
  phone: "081-234-5678",
  email: "somchai.j@example.com",
  avatar: "/placeholder.svg?height=128&width=128",
  address: "123 ถนนพระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330",
  emergencyContact: {
    name: "นางสมศรี ใจดี",
    relation: "มารดา",
    phone: "089-765-4321",
  },
  visits: [
    {
      id: "v1",
      date: "15/06/2023",
      type: "ออนไลน์",
      status: "completed",
      notes: "นักศึกษาปรับตัวได้ดี เริ่มเรียนรู้งานได้เร็ว",
    },
    {
      id: "v2",
      date: "15/07/2023",
      type: "ลงพื้นที่",
      status: "completed",
      notes: "นักศึกษามีความก้าวหน้าในการทำงาน สามารถทำงานได้ด้วยตนเองมากขึ้น",
    },
    {
      id: "v3",
      date: "15/08/2023",
      type: "ลงพื้นที่",
      status: "scheduled",
      notes: "",
    },
  ],
  reports: [
    {
      id: "r1",
      title: "รายงานความก้าวหน้าครั้งที่ 1",
      dueDate: "15/06/2023",
      submittedDate: "14/06/2023",
      status: "graded",
      grade: "A",
      feedback: "รายงานละเอียด ครบถ้วน มีการวิเคราะห์ที่ดี",
    },
    {
      id: "r2",
      title: "รายงานความก้าวหน้าครั้งที่ 2",
      dueDate: "15/07/2023",
      submittedDate: "15/07/2023",
      status: "graded",
      grade: "B+",
      feedback: "รายงานดี แต่ควรเพิ่มการวิเคราะห์ให้ลึกซึ้งกว่านี้",
    },
    {
      id: "r3",
      title: "รายงานความก้าวหน้าครั้งที่ 3",
      dueDate: "15/08/2023",
      submittedDate: "",
      status: "pending",
      grade: "",
      feedback: "",
    },
    {
      id: "r4",
      title: "รายงานฉบับสมบูรณ์",
      dueDate: "31/08/2023",
      submittedDate: "",
      status: "pending",
      grade: "",
      feedback: "",
    },
  ],
  issues: [
    {
      id: "i1",
      date: "20/06/2023",
      title: "ปัญหาการปรับตัว",
      description: "นักศึกษามีปัญหาในการปรับตัวกับสภาพแวดล้อมการทำงานในช่วงแรก",
      status: "resolved",
      resolution: "ได้พูดคุยกับพี่เลี้ยงและนักศึกษา ให้คำแนะนำในการปรับตัว",
    },
  ],
  evaluations: {
    midterm: {
      date: "15/07/2023",
      score: 85,
      maxScore: 100,
      feedback:
        "นักศึกษามีความตั้งใจในการทำงาน มีความรับผิดชอบดี แต่ควรพัฒนาทักษะการสื่อสารให้มากขึ้น",
    },
    final: {
      date: "",
      score: 0,
      maxScore: 100,
      feedback: "",
    },
  },
  progress: 65,
};

// Function to render status badge
const renderStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">ปกติ</Badge>;
    case "warning":
      return <Badge className="bg-yellow-500">ต้องติดตาม</Badge>;
    case "issue":
      return <Badge className="bg-red-500">มีปัญหา</Badge>;
    default:
      return <Badge>ไม่ระบุ</Badge>;
  }
};

// Function to render visit status
const renderVisitStatus = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">เสร็จสิ้น</Badge>;
    case "scheduled":
      return <Badge className="bg-blue-500">กำหนดการ</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500">ยกเลิก</Badge>;
    default:
      return <Badge>ไม่ระบุ</Badge>;
  }
};

// Function to render report status
const renderReportStatus = (status: string) => {
  switch (status) {
    case "graded":
      return <Badge className="bg-green-500">ตรวจแล้ว</Badge>;
    case "submitted":
      return <Badge className="bg-blue-500">ส่งแล้ว</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">รอส่ง</Badge>;
    case "late":
      return <Badge className="bg-red-500">เลยกำหนด</Badge>;
    default:
      return <Badge>ไม่ระบุ</Badge>;
  }
};

// Function to render issue status
const renderIssueStatus = (status: string) => {
  switch (status) {
    case "resolved":
      return <Badge className="bg-green-500">แก้ไขแล้ว</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">อยู่ระหว่างดำเนินการ</Badge>;
    case "critical":
      return <Badge className="bg-red-500">วิกฤติ</Badge>;
    default:
      return <Badge>ไม่ระบุ</Badge>;
  }
};

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id;

  // In a real application, you would fetch the student data based on the ID
  const student = studentData;

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <AdvisorSidebar activePage="students" />

        <div className="md:col-span-3">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้ารายการนักศึกษา
            </Button>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>
                      {student.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <div>
                        <h1 className="text-2xl font-bold">{student.name}</h1>
                        <p className="text-gray-500">
                          รหัสนักศึกษา: {student.studentId}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center gap-2">
                        {renderStatusBadge(student.status)}
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไขสถานะ
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>
                          {student.faculty} ชั้นปีที่ {student.year}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{student.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{student.position}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{student.location}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          ความก้าวหน้าโดยรวม
                        </span>
                        <span className="text-sm font-medium">
                          {student.progress}%
                        </span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
              <TabsTrigger value="visits">การนิเทศ</TabsTrigger>
              <TabsTrigger value="reports">รายงาน</TabsTrigger>
              <TabsTrigger value="issues">ปัญหา/ติดตาม</TabsTrigger>
              <TabsTrigger value="evaluations">การประเมิน</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลนักศึกษา</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          ชื่อ-นามสกุล
                        </h3>
                        <p>{student.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          รหัสนักศึกษา
                        </h3>
                        <p>{student.studentId}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          คณะ/สาขา
                        </h3>
                        <p>
                          {student.faculty} / {student.major}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          ชั้นปี
                        </h3>
                        <p>{student.year}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          เบอร์โทรศัพท์
                        </h3>
                        <p>{student.phone}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          อีเมล
                        </h3>
                        <p>{student.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          ที่อยู่
                        </h3>
                        <p>{student.address}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          ผู้ติดต่อฉุกเฉิน
                        </h3>
                        <p>
                          {student.emergencyContact.name} (
                          {student.emergencyContact.relation})
                        </p>
                        <p>{student.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลสถานประกอบการ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          ชื่อสถานประกอบการ
                        </h3>
                        <p>{student.company}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          ตำแหน่ง
                        </h3>
                        <p>{student.position}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          แผนก/ฝ่าย
                        </h3>
                        <p>{student.department}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          สถานที่ตั้ง
                        </h3>
                        <p>{student.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          ระยะเวลาฝึกงาน
                        </h3>
                        <p>
                          {student.startDate} - {student.endDate}
                        </p>
                      </div>
                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          ข้อมูลพี่เลี้ยง
                        </h3>
                        <p className="font-medium">{student.mentor.name}</p>
                        <p className="text-sm text-gray-500">
                          {student.mentor.position}
                        </p>
                        <p className="text-sm mt-1">
                          โทร: {student.mentor.phone}
                        </p>
                        <p className="text-sm">อีเมล: {student.mentor.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>การนิเทศล่าสุด</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {student.visits.length > 0 ? (
                      <div>
                        {student.visits
                          .filter((visit) => visit.status === "completed")
                          .slice(-1)
                          .map((visit) => (
                            <div
                              key={visit.id}
                              className="flex flex-col md:flex-row md:items-center justify-between"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">
                                    วันที่: {visit.date}
                                  </span>
                                  <Badge variant="outline">{visit.type}</Badge>
                                </div>
                                <p className="text-gray-700">{visit.notes}</p>
                              </div>
                              <div className="mt-4 md:mt-0">
                                <Link href={`/advisor/visits/${visit.id}`}>
                                  <Button variant="outline" size="sm">
                                    ดูรายละเอียด
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">การนิเทศครั้งถัดไป</h3>
                            {student.visits
                              .filter((visit) => visit.status === "scheduled")
                              .slice(0, 1)
                              .map((visit) => (
                                <div
                                  key={visit.id}
                                  className="flex items-center gap-2"
                                >
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span>{visit.date}</span>
                                  <Badge variant="outline">{visit.type}</Badge>
                                </div>
                              ))}
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Link
                              href={`/advisor/schedule?action=new&student=${student.id}`}
                            >
                              <Button>
                                <Car className="mr-2 h-4 w-4" />
                                วางแผนนิเทศ
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-4">ยังไม่มีการนิเทศ</p>
                        <Link
                          href={`/advisor/schedule?action=new&student=${student.id}`}
                        >
                          <Button>
                            <Car className="mr-2 h-4 w-4" />
                            วางแผนนิเทศ
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="visits">
              <Card>
                <CardHeader>
                  <CardTitle>ประวัติการนิเทศ</CardTitle>
                  <CardDescription>
                    รายการนิเทศทั้งหมดของนักศึกษา
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end mb-4">
                    <Link
                      href={`/advisor/schedule?action=new&student=${student.id}`}
                    >
                      <Button>
                        <Car className="mr-2 h-4 w-4" />
                        วางแผนนิเทศ
                      </Button>
                    </Link>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>วันที่</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>บันทึก</TableHead>
                        <TableHead className="text-right">การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.visits.map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell>{visit.date}</TableCell>
                          <TableCell>{visit.type}</TableCell>
                          <TableCell>
                            {renderVisitStatus(visit.status)}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {visit.notes || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/advisor/visits/${visit.id}`}>
                                <Button variant="outline" size="sm">
                                  ดูรายละเอียด
                                </Button>
                              </Link>
                              {visit.status === "scheduled" && (
                                <Link
                                  href={`/advisor/visits/record/${visit.id}`}
                                >
                                  <Button size="sm">บันทึกการนิเทศ</Button>
                                </Link>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>รายงานของนักศึกษา</CardTitle>
                  <CardDescription>
                    รายงานทั้งหมดที่นักศึกษาต้องส่ง
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อรายงาน</TableHead>
                        <TableHead>กำหนดส่ง</TableHead>
                        <TableHead>วันที่ส่ง</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>เกรด</TableHead>
                        <TableHead className="text-right">การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.dueDate}</TableCell>
                          <TableCell>{report.submittedDate || "-"}</TableCell>
                          <TableCell>
                            {renderReportStatus(report.status)}
                          </TableCell>
                          <TableCell>{report.grade || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {report.status === "submitted" && (
                                <Button size="sm">ตรวจรายงาน</Button>
                              )}
                              {report.status === "graded" && (
                                <Button variant="outline" size="sm">
                                  ดูรายละเอียด
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <CardTitle>ปัญหาและการติดตาม</CardTitle>
                  <CardDescription>
                    ปัญหาและประเด็นที่ต้องติดตามของนักศึกษา
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end mb-4">
                    <Button>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      บันทึกปัญหาใหม่
                    </Button>
                  </div>

                  {student.issues.length > 0 ? (
                    <div className="space-y-4">
                      {student.issues.map((issue) => (
                        <Card key={issue.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{issue.title}</h3>
                                  {renderIssueStatus(issue.status)}
                                </div>
                                <p className="text-sm text-gray-500">
                                  บันทึกเมื่อ: {issue.date}
                                </p>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <Button variant="outline" size="sm">
                                  แก้ไข
                                </Button>
                              </div>
                            </div>

                            <div className="mt-2">
                              <h4 className="text-sm font-medium text-gray-500">
                                รายละเอียด
                              </h4>
                              <p className="mt-1">{issue.description}</p>
                            </div>

                            {issue.resolution && (
                              <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-medium text-gray-500">
                                  การแก้ไข
                                </h4>
                                <p className="mt-1">{issue.resolution}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">ไม่พบปัญหา</h3>
                      <p className="text-gray-500">
                        นักศึกษาไม่มีปัญหาหรือประเด็นที่ต้องติดตามในขณะนี้
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluations">
              <Card>
                <CardHeader>
                  <CardTitle>การประเมินผล</CardTitle>
                  <CardDescription>
                    ผลการประเมินนักศึกษาระหว่างการฝึกงาน
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        การประเมินกลางภาค
                      </h3>
                      {student.evaluations.midterm.date ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">
                              วันที่ประเมิน: {student.evaluations.midterm.date}
                            </span>
                            <span className="font-medium">
                              {student.evaluations.midterm.score}/
                              {student.evaluations.midterm.maxScore} คะแนน
                            </span>
                          </div>
                          <Progress
                            value={
                              (student.evaluations.midterm.score /
                                student.evaluations.midterm.maxScore) *
                              100
                            }
                            className="h-2 mb-4"
                          />
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">
                              ข้อเสนอแนะ
                            </h4>
                            <p>{student.evaluations.midterm.feedback}</p>
                          </div>
                          <div className="mt-4">
                            <Button variant="outline">
                              ดูรายละเอียดการประเมิน
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500">
                            ยังไม่มีการประเมินกลางภาค
                          </p>
                          <Button className="mt-4">ทำการประเมิน</Button>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">
                        การประเมินปลายภาค
                      </h3>
                      {student.evaluations.final.date ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">
                              วันที่ประเมิน: {student.evaluations.final.date}
                            </span>
                            <span className="font-medium">
                              {student.evaluations.final.score}/
                              {student.evaluations.final.maxScore} คะแนน
                            </span>
                          </div>
                          <Progress
                            value={
                              (student.evaluations.final.score /
                                student.evaluations.final.maxScore) *
                              100
                            }
                            className="h-2 mb-4"
                          />
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">
                              ข้อเสนอแนะ
                            </h4>
                            <p>{student.evaluations.final.feedback}</p>
                          </div>
                          <div className="mt-4">
                            <Button variant="outline">
                              ดูรายละเอียดการประเมิน
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500">
                            ยังไม่มีการประเมินปลายภาค
                          </p>
                          <Button
                            className="mt-4"
                            disabled={!student.evaluations.midterm.date}
                          >
                            ทำการประเมิน
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
