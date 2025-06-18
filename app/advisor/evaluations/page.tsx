"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  ClipboardCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  BarChart4,
  Building2,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvisorSidebar from "@/components/advisor-sidebar";

// Mock data for evaluations
const evaluations = [
  {
    id: "1",
    studentId: "ST001",
    studentName: "นายธนกร มั่นคง",
    studentImage: "https://randomuser.me/api/portraits/men/1.jpg",
    companyName: "บริษัท เทคโนโลยี จำกัด",
    evaluationType: "ประเมินกลางภาค",
    dueDate: "15 มิ.ย. 2566",
    status: "completed",
    score: 85,
    submittedDate: "10 มิ.ย. 2566",
  },
  {
    id: "2",
    studentId: "ST002",
    studentName: "นางสาวพิมพ์ชนก สุขใจ",
    studentImage: "https://randomuser.me/api/portraits/women/2.jpg",
    companyName: "บริษัท ดิจิทัล โซลูชั่น จำกัด",
    evaluationType: "ประเมินปลายภาค",
    dueDate: "30 ก.ค. 2566",
    status: "pending",
    score: null,
    submittedDate: null,
  },
  {
    id: "3",
    studentId: "ST003",
    studentName: "นายภาณุพงศ์ วงศ์ประเสริฐ",
    studentImage: "https://randomuser.me/api/portraits/men/3.jpg",
    companyName: "บริษัท เภสัชกรรม ไทย จำกัด",
    evaluationType: "ประเมินกลางภาค",
    dueDate: "15 มิ.ย. 2566",
    status: "completed",
    score: 92,
    submittedDate: "12 มิ.ย. 2566",
  },
  {
    id: "4",
    studentId: "ST004",
    studentName: "นางสาวกมลชนก รักเรียน",
    studentImage: "https://randomuser.me/api/portraits/women/4.jpg",
    companyName: "โรงพยาบาลศิริราช",
    evaluationType: "ประเมินปลายภาค",
    dueDate: "30 ก.ค. 2566",
    status: "overdue",
    score: null,
    submittedDate: null,
  },
  {
    id: "5",
    studentId: "ST005",
    studentName: "นายวรเมธ คงคาใส",
    studentImage: "https://randomuser.me/api/portraits/men/5.jpg",
    companyName: "ร้านยาคุณภาพ ดีเภสัช",
    evaluationType: "ประเมินกลางภาค",
    dueDate: "15 มิ.ย. 2566",
    status: "in_progress",
    score: null,
    submittedDate: null,
  },
  {
    id: "6",
    studentId: "ST006",
    studentName: "นางสาวศิริพร แก้วมณี",
    studentImage: "https://randomuser.me/api/portraits/women/6.jpg",
    companyName: "บริษัท ยาและเวชภัณฑ์ จำกัด",
    evaluationType: "ประเมินปลายภาค",
    dueDate: "30 ก.ค. 2566",
    status: "pending",
    score: null,
    submittedDate: null,
  },
  {
    id: "7",
    studentId: "ST007",
    studentName: "นายอนุชา สมบูรณ์ดี",
    studentImage: "https://randomuser.me/api/portraits/men/7.jpg",
    companyName: "โรงพยาบาลจุฬาลงกรณ์",
    evaluationType: "ประเมินกลางภาค",
    dueDate: "15 มิ.ย. 2566",
    status: "completed",
    score: 78,
    submittedDate: "14 มิ.ย. 2566",
  },
  {
    id: "8",
    studentId: "ST008",
    studentName: "นางสาวปิยะดา นวลจันทร์",
    studentImage: "https://randomuser.me/api/portraits/women/8.jpg",
    companyName: "บริษัท เภสัชภัณฑ์ จำกัด",
    evaluationType: "ประเมินปลายภาค",
    dueDate: "30 ก.ค. 2566",
    status: "in_progress",
    score: null,
    submittedDate: null,
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    completed: {
      label: "เสร็จสิ้น",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    pending: {
      label: "รอดำเนินการ",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    in_progress: {
      label: "กำลังดำเนินการ",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    overdue: {
      label: "เลยกำหนด",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <Badge variant="outline" className={`${config.color} border`}>
      {config.label}
    </Badge>
  );
};

export default function EvaluationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filter evaluations based on search term and filters
  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || evaluation.status === statusFilter;
    const matchesType =
      typeFilter === "all" || evaluation.evaluationType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const totalEvaluations = evaluations.length;
  const completedEvaluations = evaluations.filter(
    (e) => e.status === "completed"
  ).length;
  const pendingEvaluations = evaluations.filter(
    (e) => e.status === "pending"
  ).length;
  const inProgressEvaluations = evaluations.filter(
    (e) => e.status === "in_progress"
  ).length;
  const overdueEvaluations = evaluations.filter(
    (e) => e.status === "overdue"
  ).length;

  // Calculate average score
  const scores = evaluations
    .filter((e) => e.score !== null)
    .map((e) => e.score as number);
  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <AdvisorSidebar activePage="evaluations" />

          <div className="md:col-span-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                การประเมินนักศึกษา
              </h1>
              <p className="text-muted-foreground">
                จัดการและติดตามการประเมินผลการฝึกงานของนักศึกษาในความดูแลของท่าน
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-sm border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    การประเมินทั้งหมด
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{totalEvaluations}</div>
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    คะแนนเฉลี่ย
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{averageScore}/100</div>
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full">
                      <BarChart4 className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    เสร็จสิ้นแล้ว
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {completedEvaluations}
                    </div>
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    รอดำเนินการ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {pendingEvaluations + inProgressEvaluations}
                    </div>
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-full">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>
                  {overdueEvaluations > 0 && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{overdueEvaluations} เลยกำหนด</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Status Distribution */}
            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle>สถานะการประเมิน</CardTitle>
                <CardDescription>
                  การกระจายของสถานะการประเมินทั้งหมด
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                        <span>เสร็จสิ้น</span>
                      </div>
                      <span>
                        {completedEvaluations} (
                        {Math.round(
                          (completedEvaluations / totalEvaluations) * 100
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(completedEvaluations / totalEvaluations) * 100}
                      className="h-2 bg-gray-100"
                      indicatorClassName="bg-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>รอดำเนินการ</span>
                      </div>
                      <span>
                        {pendingEvaluations} (
                        {Math.round(
                          (pendingEvaluations / totalEvaluations) * 100
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(pendingEvaluations / totalEvaluations) * 100}
                      className="h-2 bg-gray-100"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                        <span>กำลังดำเนินการ</span>
                      </div>
                      <span>
                        {inProgressEvaluations} (
                        {Math.round(
                          (inProgressEvaluations / totalEvaluations) * 100
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(inProgressEvaluations / totalEvaluations) * 100}
                      className="h-2 bg-gray-100"
                      indicatorClassName="bg-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        <span>เลยกำหนด</span>
                      </div>
                      <span>
                        {overdueEvaluations} (
                        {Math.round(
                          (overdueEvaluations / totalEvaluations) * 100
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(overdueEvaluations / totalEvaluations) * 100}
                      className="h-2 bg-gray-100"
                      indicatorClassName="bg-red-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาตามชื่อนักศึกษา, รหัส หรือบริษัท..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>สถานะ</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                    <SelectItem value="pending">รอดำเนินการ</SelectItem>
                    <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
                    <SelectItem value="overdue">เลยกำหนด</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>ประเภท</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="ประเมินกลางภาค">กลางภาค</SelectItem>
                    <SelectItem value="ประเมินปลายภาค">ปลายภาค</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Evaluations Table */}
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="table">ตาราง</TabsTrigger>
                <TabsTrigger value="cards">การ์ด</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="space-y-4">
                <Card className="shadow-sm border-none">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>นักศึกษา</TableHead>
                          <TableHead>สถานประกอบการ</TableHead>
                          <TableHead>ประเภท</TableHead>
                          <TableHead>กำหนดส่ง</TableHead>
                          <TableHead>สถานะ</TableHead>
                          <TableHead>คะแนน</TableHead>
                          <TableHead className="text-right">
                            การจัดการ
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEvaluations.map((evaluation) => (
                          <TableRow key={evaluation.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={evaluation.studentImage}
                                    alt={evaluation.studentName}
                                  />
                                  <AvatarFallback>
                                    {evaluation.studentName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {evaluation.studentName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {evaluation.studentId}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{evaluation.companyName}</TableCell>
                            <TableCell>{evaluation.evaluationType}</TableCell>
                            <TableCell>{evaluation.dueDate}</TableCell>
                            <TableCell>
                              <StatusBadge status={evaluation.status} />
                            </TableCell>
                            <TableCell>
                              {evaluation.score !== null ? (
                                <span className="font-medium">
                                  {evaluation.score}/100
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={`/advisor/evaluations/${evaluation.id}`}
                                >
                                  {evaluation.status === "completed"
                                    ? "ดูรายละเอียด"
                                    : "ประเมิน"}
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-sm text-muted-foreground">
                      แสดง {filteredEvaluations.length} จาก {evaluations.length}{" "}
                      รายการ
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        ก่อนหน้า
                      </Button>
                      <Button variant="outline" size="sm">
                        ถัดไป
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="cards" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvaluations.map((evaluation) => (
                    <Card key={evaluation.id} className="shadow-sm border-none">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={evaluation.studentImage}
                                alt={evaluation.studentName}
                              />
                              <AvatarFallback>
                                {evaluation.studentName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">
                                {evaluation.studentName}
                              </CardTitle>
                              <CardDescription>
                                {evaluation.studentId}
                              </CardDescription>
                            </div>
                          </div>
                          <StatusBadge status={evaluation.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{evaluation.companyName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                            <span>{evaluation.evaluationType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>กำหนดส่ง: {evaluation.dueDate}</span>
                          </div>
                          {evaluation.score !== null && (
                            <div className="flex items-center gap-2 text-sm">
                              <BarChart4 className="h-4 w-4 text-muted-foreground" />
                              <span>
                                คะแนน:{" "}
                                <span className="font-medium">
                                  {evaluation.score}/100
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`/advisor/evaluations/${evaluation.id}`}>
                            {evaluation.status === "completed"
                              ? "ดูรายละเอียด"
                              : "ประเมิน"}
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
