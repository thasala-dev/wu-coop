"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  MapPin,
  Building,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import AdvisorSidebar from "@/components/advisor-sidebar";
import Sidebar from "@/components/sidebar";

// Mock data for students
const students = [
  {
    id: "1",
    name: "นายสมชาย ใจดี",
    studentId: "6309681234",
    faculty: "คณะเภสัชศาสตร์",
    major: "เภสัชศาสตร์",
    year: 4,
    status: "active",
    company: "โรงพยาบาลศิริราช",
    position: "ผู้ช่วยเภสัชกร",
    location: "กรุงเทพมหานคร",
    startDate: "01/06/2023",
    endDate: "31/08/2023",
    mentor: "ภญ.สุดา รักษาดี",
    phone: "081-234-5678",
    email: "somchai.j@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "15/07/2023",
    nextVisit: "15/08/2023",
    reports: {
      submitted: 2,
      pending: 1,
      total: 4,
    },
  },
  {
    id: "2",
    name: "นางสาวสมหญิง มีสุข",
    studentId: "6309685678",
    faculty: "คณะเภสัชศาสตร์",
    major: "เภสัชศาสตร์",
    year: 4,
    status: "warning",
    company: "แหล่งฝึกงาน ยาไทย จำกัด",
    position: "ผู้ช่วยวิจัยและพัฒนา",
    location: "นนทบุรี",
    startDate: "01/06/2023",
    endDate: "31/08/2023",
    mentor: "ภก.วิชัย นวัตกรรม",
    phone: "089-876-5432",
    email: "somying.m@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "01/07/2023",
    nextVisit: "01/08/2023",
    reports: {
      submitted: 1,
      pending: 2,
      total: 4,
    },
  },
  {
    id: "3",
    name: "นายวิชัย เรียนดี",
    studentId: "6309689012",
    faculty: "คณะเภสัชศาสตร์",
    major: "เภสัชศาสตร์",
    year: 4,
    status: "issue",
    company: "ร้านยาคุณภาพ",
    position: "ผู้ช่วยเภสัชกรร้านยา",
    location: "เชียงใหม่",
    startDate: "01/06/2023",
    endDate: "31/08/2023",
    mentor: "ภญ.รัตนา ใส่ใจ",
    phone: "062-345-6789",
    email: "wichai.r@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "20/06/2023",
    nextVisit: "20/07/2023",
    reports: {
      submitted: 0,
      pending: 3,
      total: 4,
    },
  },
  {
    id: "4",
    name: "นางสาวนิภา ตั้งใจ",
    studentId: "6309683456",
    faculty: "คณะเภสัชศาสตร์",
    major: "เภสัชศาสตร์",
    year: 4,
    status: "active",
    company: "โรงพยาบาลมหาราช",
    position: "ผู้ช่วยเภสัชกร",
    location: "นครราชสีมา",
    startDate: "01/06/2023",
    endDate: "31/08/2023",
    mentor: "ภก.ประสิทธิ์ เชี่ยวชาญ",
    phone: "095-678-9012",
    email: "nipha.t@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "10/07/2023",
    nextVisit: "10/08/2023",
    reports: {
      submitted: 2,
      pending: 0,
      total: 4,
    },
  },
  {
    id: "5",
    name: "นายธนา มั่งมี",
    studentId: "6309687890",
    faculty: "คณะเภสัชศาสตร์",
    major: "เภสัชศาสตร์",
    year: 4,
    status: "active",
    company: "แหล่งฝึกงาน ผลิตยาสากล จำกัด",
    position: "ผู้ช่วยฝ่ายผลิต",
    location: "ระยอง",
    startDate: "01/06/2023",
    endDate: "31/08/2023",
    mentor: "ภก.สมศักดิ์ ผลิตเก่ง",
    phone: "087-890-1234",
    email: "thana.m@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "05/07/2023",
    nextVisit: "05/08/2023",
    reports: {
      submitted: 2,
      pending: 1,
      total: 4,
    },
  },
];

export default function AdvisorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter students based on search term and status filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm) ||
      student.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="dashboard" userType="advisor" />

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">นักศึกษาในที่ปรึกษา</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="ค้นหาด้วยชื่อ, รหัสนักศึกษา, หรือแหล่งฝึกงาน"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="กรองตามสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="active">ปกติ</SelectItem>
                      <SelectItem value="warning">ต้องติดตาม</SelectItem>
                      <SelectItem value="issue">มีปัญหา</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="list" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="list">รายการ</TabsTrigger>
                  <TabsTrigger value="grid">ตาราง</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                  <div className="space-y-4">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <Card key={student.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-4 md:p-6 flex-1">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage
                                    src={student.avatar}
                                    alt={student.name}
                                  />
                                  <AvatarFallback>
                                    {student.name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                    <div>
                                      <h3 className="text-lg font-semibold">
                                        {student.name}
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        รหัสนักศึกษา: {student.studentId}
                                      </p>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                      {renderStatusBadge(student.status)}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                                    <div className="flex items-center gap-2">
                                      <Building className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                        {student.company}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                        {student.location}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                        {student.phone}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                        {student.email}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                        นิเทศล่าสุด: {student.lastVisit}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                        นิเทศครั้งถัดไป: {student.nextVisit}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">
                                        รายงาน: {student.reports.submitted}/
                                        {student.reports.total}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex md:flex-col justify-center items-center p-4 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
                              <Link href={`/advisor/students/${student.id}`}>
                                <Button variant="outline" className="w-full">
                                  ดูข้อมูล
                                </Button>
                              </Link>
                              <Link
                                href={`/advisor/schedule?action=new&student=${student.id}`}
                                className="mt-2"
                              >
                                <Button variant="outline" className="w-full">
                                  วางแผนนิเทศ
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          ไม่พบนักศึกษาที่ตรงกับเงื่อนไขการค้นหา
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="grid">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <Card key={student.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={student.avatar}
                                  alt={student.name}
                                />
                                <AvatarFallback>
                                  {student.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              {renderStatusBadge(student.status)}
                            </div>

                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">
                              {student.studentId}
                            </p>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-gray-500" />
                                <span className="text-sm truncate">
                                  {student.company}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm truncate">
                                  {student.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  นิเทศครั้งถัดไป: {student.nextVisit}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  รายงาน: {student.reports.submitted}/
                                  {student.reports.total}
                                </span>
                              </div>
                              <Link href={`/advisor/students/${student.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0"
                                >
                                  <span className="mr-1">รายละเอียด</span>
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 col-span-full">
                        <p className="text-gray-500">
                          ไม่พบนักศึกษาที่ตรงกับเงื่อนไขการค้นหา
                        </p>
                      </div>
                    )}
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
