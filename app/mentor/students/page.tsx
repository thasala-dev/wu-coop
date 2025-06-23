"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserCheck,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import MentorSidebar from "@/components/mentor-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";

// Mock data for students
const students = [
  {
    id: "6401234",
    name: "นายธนกร มั่นคง",
    image: "https://i.pravatar.cc/150?u=student1",
    department: "วิศวกรรมซอฟต์แวร์",
    position: "Software Developer Intern",
    startDate: "1 มิถุนายน 2566",
    endDate: "30 กันยายน 2566",
    status: "active",
    progress: 75,
    email: "thanakorn.m@example.com",
    phone: "062-XXX-XXXX",
    lastReport: "25 สิงหาคม 2566",
    nextEvaluation: "1 กันยายน 2566",
    tasks: [
      { name: "พัฒนาระบบหน้าบ้าน", status: "completed" },
      { name: "ทดสอบระบบ", status: "in-progress" },
      { name: "จัดทำเอกสาร", status: "pending" },
    ],
  },
  {
    id: "6401235",
    name: "นางสาวพิมพ์ชนก รักเรียน",
    image: "https://i.pravatar.cc/150?u=student2",
    department: "วิศวกรรมซอฟต์แวร์",
    position: "UX/UI Designer Intern",
    startDate: "1 มิถุนายน 2566",
    endDate: "30 กันยายน 2566",
    status: "active",
    progress: 80,
    email: "pimchanok.r@example.com",
    phone: "095-XXX-XXXX",
    lastReport: "27 สิงหาคม 2566",
    nextEvaluation: "5 กันยายน 2566",
    tasks: [
      { name: "ออกแบบ UI หน้าหลัก", status: "completed" },
      { name: "ทดสอบ Usability", status: "completed" },
      { name: "ออกแบบโลโก้", status: "in-progress" },
    ],
  },
  {
    id: "6401236",
    name: "นายภาคิน ใจดี",
    image: "https://i.pravatar.cc/150?u=student3",
    department: "วิศวกรรมซอฟต์แวร์",
    position: "Backend Developer Intern",
    startDate: "1 มิถุนายน 2566",
    endDate: "30 กันยายน 2566",
    status: "warning",
    progress: 60,
    email: "pakin.j@example.com",
    phone: "084-XXX-XXXX",
    lastReport: "15 สิงหาคม 2566",
    nextEvaluation: "3 กันยายน 2566",
    tasks: [
      { name: "พัฒนา API", status: "in-progress" },
      { name: "ทดสอบระบบ", status: "pending" },
      { name: "แก้ไขบัค", status: "in-progress" },
    ],
  },
  {
    id: "6401237",
    name: "นางสาวกมลชนก วิชาดี",
    image: "https://i.pravatar.cc/150?u=student4",
    department: "วิศวกรรมซอฟต์แวร์",
    position: "QA Intern",
    startDate: "1 มิถุนายน 2566",
    endDate: "30 กันยายน 2566",
    status: "completed",
    progress: 100,
    email: "kamolchanok.w@example.com",
    phone: "091-XXX-XXXX",
    lastReport: "30 สิงหาคม 2566",
    nextEvaluation: "ประเมินเสร็จสิ้น",
    tasks: [
      { name: "ทดสอบระบบ", status: "completed" },
      { name: "เขียนเอกสารการทดสอบ", status: "completed" },
      { name: "ตรวจสอบคุณภาพ", status: "completed" },
    ],
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return <Badge className="bg-green-500">กำลังฝึกงาน</Badge>;
  } else if (status === "warning") {
    return <Badge className="bg-yellow-500">ต้องติดตาม</Badge>;
  } else if (status === "completed") {
    return <Badge className="bg-blue-500">เสร็จสิ้น</Badge>;
  }
  return <Badge className="bg-gray-500">ไม่ทราบสถานะ</Badge>;
}

// Task status icon component
function TaskStatusIcon({ status }: { status: string }) {
  if (status === "completed") {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  } else if (status === "in-progress") {
    return <Clock className="h-4 w-4 text-yellow-500" />;
  } else if (status === "pending") {
    return <HelpCircle className="h-4 w-4 text-gray-400" />;
  }
  return <AlertCircle className="h-4 w-4 text-red-500" />;
}

export default function MentorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter students based on search term and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.includes(searchTerm) ||
      student.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="students" userType="mentor" />
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      นักศึกษาในความดูแล
                    </CardTitle>
                    <CardDescription>
                      ดูรายชื่อและติดตามความคืบหน้าของนักศึกษาที่อยู่ในความดูแลของคุณ
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      นักศึกษาทั้งหมด: {students.length}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      กำลังฝึกงาน:{" "}
                      {students.filter((s) => s.status === "active").length}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="list" className="w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <TabsList>
                      <TabsTrigger value="list">รายชื่อ</TabsTrigger>
                      <TabsTrigger value="cards">การ์ด</TabsTrigger>
                    </TabsList>

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="ค้นหาชื่อ, รหัส, ตำแหน่ง..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-full md:w-40">
                          <SelectValue placeholder="สถานะทั้งหมด" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                          <SelectItem value="active">กำลังฝึกงาน</SelectItem>
                          <SelectItem value="warning">ต้องติดตาม</SelectItem>
                          <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <TabsContent value="list" className="mt-0">
                    <div className="rounded-md border">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                          <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                รหัสนักศึกษา
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                ชื่อ-นามสกุล
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                ตำแหน่ง
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                ระยะเวลา
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                สถานะ
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                การประเมิน
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium"></th>
                            </tr>
                          </thead>
                          <tbody className="[&_tr:last-child]:border-0">
                            {filteredStudents.length > 0 ? (
                              filteredStudents.map((student) => (
                                <tr
                                  key={student.id}
                                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                  <td className="p-4 align-middle">
                                    {student.id}
                                  </td>
                                  <td className="p-4 align-middle">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-10 w-10 overflow-hidden">
                                        <AvatarImage
                                          src={student.image}
                                          alt={student.name}
                                        />
                                        <AvatarFallback>
                                          {student.name.substring(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">
                                          {student.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {student.department}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 align-middle">
                                    {student.position}
                                  </td>
                                  <td className="p-4 align-middle">
                                    <div className="text-xs">
                                      <div>เริ่ม: {student.startDate}</div>
                                      <div>สิ้นสุด: {student.endDate}</div>
                                    </div>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <StatusBadge status={student.status} />
                                  </td>
                                  <td className="p-4 align-middle">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{
                                          width: `${student.progress}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <div className="text-xs mt-1 text-muted-foreground">
                                      {student.progress}% เสร็จสิ้น
                                    </div>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <div className="flex justify-end">
                                      <Link
                                        href={`/mentor/students/${student.id}`}
                                      >
                                        <Button variant="outline" size="sm">
                                          ดูข้อมูล
                                          <ChevronRight className="ml-1 h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="p-4 text-center">
                                  ไม่พบข้อมูลนักศึกษาที่ตรงกับเงื่อนไขการค้นหา
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cards" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <Card key={student.id} className="overflow-hidden">
                            <CardHeader className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12 overflow-hidden">
                                    <AvatarImage
                                      src={student.image}
                                      alt={student.name}
                                    />
                                    <AvatarFallback>
                                      {student.name.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="text-base">
                                      {student.name}
                                    </CardTitle>
                                    <CardDescription>
                                      {student.id} • {student.department}
                                    </CardDescription>
                                  </div>
                                </div>
                                <StatusBadge status={student.status} />
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="space-y-3">
                                <div>
                                  <div className="text-sm font-medium">
                                    ตำแหน่ง
                                  </div>
                                  <div className="text-sm">
                                    {student.position}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {student.email}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {student.phone}
                                  </span>
                                </div>

                                <div>
                                  <div className="text-sm font-medium mb-1">
                                    งานที่ได้รับมอบหมาย
                                  </div>
                                  <div className="space-y-1">
                                    {student.tasks.map((task, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 text-sm"
                                      >
                                        <TaskStatusIcon status={task.status} />
                                        <span>{task.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="pt-2">
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>ความคืบหน้า</span>
                                    <span>{student.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full"
                                      style={{ width: `${student.progress}%` }}
                                    ></div>
                                  </div>
                                </div>

                                <div className="flex justify-between pt-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link
                                      href={`/mentor/evaluations/${student.id}`}
                                    >
                                      <UserCheck className="mr-1 h-4 w-4" />
                                      ประเมินผล
                                    </Link>
                                  </Button>
                                  <Button variant="default" size="sm" asChild>
                                    <Link
                                      href={`/mentor/students/${student.id}`}
                                    >
                                      ดูข้อมูล
                                      <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          ไม่พบข้อมูลนักศึกษาที่ตรงกับเงื่อนไขการค้นหา
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
