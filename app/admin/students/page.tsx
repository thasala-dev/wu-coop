"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  BarChart2,
  Users,
  GraduationCap,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import AdminSidebar from "@/components/admin-sidebar";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import CardList from "@/components/CardList";
import CustomAvatar from "@/components/avatar";
import TableList from "@/components/TableList";

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

// Stats data
let statsData = [
  {
    title: "นักศึกษาทั้งหมด",
    value: 0,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "กำลังฝึกงาน",
    value: 0,
    icon: GraduationCap,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "สถานประกอบการ",
    value: 0,
    icon: Building2,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "เสร็จสิ้นการฝึกงาน",
    value: 0,
    icon: CheckCircle,
    color: "bg-violet-50 text-violet-600",
  },
];

// Status distribution data
const statusDistribution = [
  { status: "active", count: 64, percentage: 50 },
  { status: "completed", count: 36, percentage: 28 },
  { status: "placed", count: 16, percentage: 13 },
  { status: "pending", count: 8, percentage: 6 },
  { status: "issue", count: 4, percentage: 3 },
];

export default function AdminStudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any>([]);
  useEffect(() => {
    fetchStudents();
    console.log("Admin Students Page Loaded");
  }, []);

  async function fetchStudents() {
    setLoading(true);
    const response = await fetch("/api/student", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      setStudents(data.data || []);
      statsData[0].value = data.data.length;
    }
    setLoading(false);
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedAdvisor, setSelectedAdvisor] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  // Filter students based on search and filters
  const filteredStudents = students.filter((student: any) => {
    // Search filter
    const matchesSearch =
      student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.company.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      selectedStatus === "all" || student.status === selectedStatus;

    // Year filter
    const matchesYear =
      selectedYear === "all" || student.year.toString() === selectedYear;

    // Faculty filter
    const matchesFaculty =
      selectedFaculty === "all" || student.faculty === selectedFaculty;

    // Advisor filter
    const matchesAdvisor =
      selectedAdvisor === "all" || student.advisor === selectedAdvisor;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesYear &&
      matchesFaculty &&
      matchesAdvisor
    );
  });

  // Handle delete confirmation
  const handleDeleteClick = (studentId: string) => {
    setStudentToDelete(studentId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // In a real app, you would delete the student here
    console.log(`Deleting student ${studentToDelete}`);
    setShowDeleteDialog(false);
    setStudentToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="students" userType="admin" />
          {loading && <Loading />}

          <div className="md:col-span-4 gap">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-light tracking-tight text-gray-900">
                  นักศึกษาทั้งหมด
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  จัดการข้อมูลนักศึกษาในระบบสหกิจศึกษา
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-1 h-9 px-3 rounded-md border-gray-200 bg-white"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">ส่งออก</span>
                </Button>
                <a href={`/admin/students/add`}>
                  <Button className="flex items-center gap-1 h-9 px-3 rounded-md bg-gray-900 hover:bg-gray-800">
                    <UserPlus className="h-4 w-4" />
                    <span className="text-sm">เพิ่มนักศึกษา</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {statsData.map((stat, index) => (
                <Card key={index} className="border-none shadow-sm bg-white">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <Card className="border-none shadow-sm bg-white lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      สถานะนักศึกษา
                    </CardTitle>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusDistribution.map((item) => (
                      <div key={item.status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {React.createElement(
                              statusMap[item.status as keyof typeof statusMap]
                                .icon,
                              {
                                className: `h-4 w-4 ${
                                  statusMap[
                                    item.status as keyof typeof statusMap
                                  ].color.split(" ")[1]
                                }`,
                              }
                            )}
                            <span className="text-sm font-medium">
                              {
                                statusMap[item.status as keyof typeof statusMap]
                                  .label
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {item.count}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({item.percentage}%)
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={item.percentage}
                          className="h-1.5 bg-gray-100"
                          indicatorClassName={`${
                            statusMap[
                              item.status as keyof typeof statusMap
                            ].color.split(" ")[1]
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      นักศึกษาล่าสุด
                    </CardTitle>
                    <Button variant="link" className="h-8 p-0 text-sm" asChild>
                      <a href="#" className="flex items-center gap-1">
                        ดูทั้งหมด
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {students.slice(0, 5).map((student: any) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3"
                      >
                        <CustomAvatar
                          id={`student${student.username}`}
                          image={student.image}
                          size="8"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {student.fullname}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {student.studentId}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            statusMap[
                              (student.status as keyof typeof statusMap) ||
                                "pending"
                            ].color
                          } text-xs px-2 py-0.5 border`}
                        >
                          {
                            statusMap[
                              (student.status as keyof typeof statusMap) ||
                                "pending"
                            ].label
                          }
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-base font-medium">
                    รายชื่อนักศึกษา
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="ค้นหานักศึกษา..."
                        className="pl-8 border-gray-200 h-9 text-sm rounded-md w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-1 h-9 px-3 rounded-md border-gray-200 bg-white"
                        >
                          <Filter className="h-4 w-4" />
                          <span className="text-sm">ตัวกรอง</span>
                          <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[220px] p-3"
                      >
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                              สถานะ
                            </label>
                            <Select
                              value={selectedStatus}
                              onValueChange={setSelectedStatus}
                            >
                              <SelectTrigger className="h-8 text-sm rounded-md border-gray-200">
                                <SelectValue placeholder="ทุกสถานะ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ทุกสถานะ</SelectItem>
                                <SelectItem value="pending">
                                  รอการจับคู่
                                </SelectItem>
                                <SelectItem value="placed">
                                  จับคู่แล้ว
                                </SelectItem>
                                <SelectItem value="active">
                                  กำลังฝึกงาน
                                </SelectItem>
                                <SelectItem value="issue">มีปัญหา</SelectItem>
                                <SelectItem value="completed">
                                  เสร็จสิ้น
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                              ชั้นปี
                            </label>
                            <Select
                              value={selectedYear}
                              onValueChange={setSelectedYear}
                            >
                              <SelectTrigger className="h-8 text-sm rounded-md border-gray-200">
                                <SelectValue placeholder="ทุกชั้นปี" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ทุกชั้นปี</SelectItem>
                                <SelectItem value="4">ปี 4</SelectItem>
                                <SelectItem value="5">ปี 5</SelectItem>
                                <SelectItem value="6">ปี 6</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                              คณะ
                            </label>
                            <Select
                              value={selectedFaculty}
                              onValueChange={setSelectedFaculty}
                            >
                              <SelectTrigger className="h-8 text-sm rounded-md border-gray-200">
                                <SelectValue placeholder="ทุกคณะ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ทุกคณะ</SelectItem>
                                <SelectItem value="คณะเภสัชศาสตร์">
                                  คณะเภสัชศาสตร์
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                              อาจารย์ที่ปรึกษา
                            </label>
                            <Select
                              value={selectedAdvisor}
                              onValueChange={setSelectedAdvisor}
                            >
                              <SelectTrigger className="h-8 text-sm rounded-md border-gray-200">
                                <SelectValue placeholder="ทุกอาจารย์" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ทุกอาจารย์</SelectItem>
                                <SelectItem value="ผศ.ดร.สมชาย ใจดี">
                                  ผศ.ดร.สมชาย ใจดี
                                </SelectItem>
                                <SelectItem value="รศ.ดร.วิมล ศรีสุข">
                                  รศ.ดร.วิมล ศรีสุข
                                </SelectItem>
                                <SelectItem value="ผศ.ดร.นภา ใจงาม">
                                  ผศ.ดร.นภา ใจงาม
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 h-9 rounded-md bg-gray-100 p-0.5">
                    <TabsTrigger
                      value="list"
                      className="rounded-sm text-sm data-[state=active]:bg-white data-[state=active]:shadow-none"
                    >
                      รายการ
                    </TabsTrigger>
                    <TabsTrigger
                      value="grid"
                      className="rounded-sm text-sm data-[state=active]:bg-white data-[state=active]:shadow-none"
                    >
                      ตาราง
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="list">
                    <CardList
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      data={filteredStudents}
                      pageLength={6}
                      render={(student: any) => (
                        <Card className="overflow-hidden border-gray-200 hover:border-gray-300 transition-colors bg-white">
                          <CardContent className="p-0">
                            <div className="p-5">
                              <div className="flex items-start gap-3">
                                <CustomAvatar
                                  id={`student${student.username}`}
                                  image={student.image}
                                  size="12"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-medium text-base truncate">
                                        {student.fullname}
                                      </h3>
                                      <p className="text-sm text-gray-500 mt-0.5">
                                        {student.student_id}
                                      </p>
                                    </div>
                                    <Badge
                                      className={`${
                                        statusMap[
                                          (student.status as keyof typeof statusMap) ||
                                            "pending"
                                        ].color
                                      } flex items-center gap-1 font-normal px-2 py-0.5 h-6 border whitespace-nowrap`}
                                    >
                                      {React.createElement(
                                        statusMap[
                                          (student.status as keyof typeof statusMap) ||
                                            "pending"
                                        ].icon,
                                        {
                                          className: "h-3 w-3",
                                        }
                                      )}
                                      {
                                        statusMap[
                                          (student.status as keyof typeof statusMap) ||
                                            "pending"
                                        ].label
                                      }
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 space-y-1 text-sm text-gray-600">
                                <p>
                                  <span className="text-gray-500">
                                    สาขาวิชา:
                                  </span>{" "}
                                  {student.major}
                                </p>
                                <p>
                                  <span className="text-gray-500">ชั้นปี:</span>{" "}
                                  {student.std_year}
                                </p>
                                <p>
                                  <span className="text-gray-500">
                                    เกรดเฉลี่ย:
                                  </span>{" "}
                                  {student.gpa}
                                </p>
                                <p>
                                  <span className="text-gray-500">
                                    สถานประกอบการ:
                                  </span>{" "}
                                  {student.company}
                                </p>
                                <p>
                                  <span className="text-gray-500">
                                    อาจารย์ที่ปรึกษา:
                                  </span>{" "}
                                  {student.advisor}
                                </p>
                              </div>
                            </div>

                            <div className="flex border-t border-gray-100">
                              <Button
                                variant="ghost"
                                className="flex-1 rounded-none py-2 h-auto text-sm text-gray-600"
                                asChild
                              >
                                <a href={`/admin/students/${student.id}`}>
                                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                                  ดูข้อมูล
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                className="flex-1 rounded-none py-2 h-auto text-sm text-gray-600 border-l border-gray-100  hover:text-blue-600 hover:bg-blue-50"
                                asChild
                              >
                                <a href={`/admin/students/edit/${student.id}`}>
                                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                                  แก้ไข
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                className="flex-1 rounded-none py-2 h-auto text-sm text-gray-600 border-l border-gray-100 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteClick(student.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                ลบ
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="grid">
                    <div className="rounded-md border border-gray-200 bg-white overflow-hidden">
                      <TableList
                        meta={[
                          {
                            key: "student_id",
                            content: "รหัสนักศึกษา",
                          },
                          {
                            key: "fullname",
                            content: "ชื่อ-นามสกุล",
                          },
                        ]}
                        data={filteredStudents}
                      />
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="text-xs font-medium text-gray-500">
                              รหัสนักศึกษา
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500">
                              ชื่อ-นามสกุล
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500">
                              คณะ
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500">
                              ชั้นปี
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500">
                              เกรดเฉลี่ย
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500">
                              สถานประกอบการ
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500">
                              สถานะ
                            </TableHead>
                            <TableHead className="text-xs font-medium text-gray-500">
                              การจัดการ
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStudents.map((student: any) => (
                            <TableRow
                              key={student.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="text-sm">
                                {student.student_id}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <CustomAvatar
                                    id={`student${student.username}`}
                                    image={student.image}
                                    size="12"
                                  />
                                  <span className="text-sm font-medium">
                                    {student.fullname}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                {student.faculty}
                              </TableCell>
                              <TableCell className="text-sm">
                                {student.major}
                              </TableCell>
                              <TableCell className="text-sm">
                                {student.gpa}
                              </TableCell>
                              <TableCell className="text-sm">
                                {student.company}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    statusMap[
                                      (student.status as keyof typeof statusMap) ||
                                        "pending"
                                    ].color
                                  } flex items-center gap-1 font-normal px-2 py-0.5 h-6 border`}
                                >
                                  {React.createElement(
                                    statusMap[
                                      (student.status as keyof typeof statusMap) ||
                                        "pending"
                                    ].icon,
                                    {
                                      className: "h-3 w-3",
                                    }
                                  )}
                                  {
                                    statusMap[
                                      (student.status as keyof typeof statusMap) ||
                                        "pending"
                                    ].label
                                  }
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <a href={`/admin/students/${student.id}`}>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-md"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  </a>
                                  <a
                                    href={`/admin/students/edit/${student.id}`}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-md hover:text-blue-600 hover:bg-blue-50"
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                  </a>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() =>
                                      handleDeleteClick(student.id)
                                    }
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md rounded-lg p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-medium">
              ยืนยันการลบข้อมูลนักศึกษา
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนักศึกษารายนี้?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 border-gray-200"
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              ลบข้อมูล
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
