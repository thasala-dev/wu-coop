"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  RefreshCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";

// Interface สำหรับข้อมูลการนิเทศ
interface SupervisionItem {
  id: number;
  student: {
    id: number;
    name: string;
    student_id: string;
  };
  company: {
    id: number;
    name: string;
  };
  advisor: {
    id: number;
    name: string;
  };
  scheduled_date: string;
  status: number;
}

// ข้อมูลเริ่มต้นสำหรับการแสดงผล - จะถูกแทนที่ด้วยข้อมูลจาก API
const initialSupervisions: SupervisionItem[] = [];

export default function SupervisionPage() {
  const [supervisions, setSupervisions] =
    useState<SupervisionItem[]>(initialSupervisions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // โหลดข้อมูลการนิเทศเมื่อโหลดหน้า
  useEffect(() => {
    fetchSupervisions();
  }, []);

  // ฟังก์ชั่นสำหรับดึงข้อมูลการนิเทศทั้งหมดจาก API
  const fetchSupervisions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/supervision");
      const data = await response.json();

      if (data.success) {
        setSupervisions(data.data);
      } else {
        console.error("API error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching supervisions:", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชั่นการค้นหา
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // ฟังก์ชั่นการกรองข้อมูลตามสถานะ
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };
  // กรองข้อมูลตามการค้นหาและสถานะ
  const filteredSupervisions = supervisions.filter(
    (supervision: SupervisionItem) => {
      const matchesSearch =
        supervision.student.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        supervision.student.student_id.includes(searchQuery) ||
        supervision.company.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        supervision.advisor.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && supervision.status === 1) ||
        (statusFilter === "completed" && supervision.status === 2) ||
        (statusFilter === "cancelled" && supervision.status === 3);

      return matchesSearch && matchesStatus;
    }
  );

  // ฟังก์ชั่นแสดงสถานะการนิเทศ
  const renderStatus = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-yellow-500">รอดำเนินการ</Badge>;
      case 2:
        return <Badge className="bg-green-500">เสร็จสิ้น</Badge>;
      case 3:
        return <Badge className="bg-red-500">ยกเลิก</Badge>;
      default:
        return <Badge className="bg-gray-500">ไม่ระบุ</Badge>;
    }
  };

  // ฟังก์ชั่นแปลง Date เป็น String ในรูปแบบไทย
  const formatToThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: th });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-0 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="supervision" userType="admin" />

          <div className="md:col-span-4">
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                <h1 className="text-2xl font-bold mb-2 md:mb-0">การนิเทศ</h1>

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ค้นหาชื่อ รหัสนักศึกษา บริษัท..."
                      className="pl-8 w-full"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <Filter className="h-4 w-4" />
                        สถานะ
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleStatusFilter("all")}
                      >
                        ทั้งหมด
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusFilter("pending")}
                      >
                        รอดำเนินการ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusFilter("completed")}
                      >
                        เสร็จสิ้น
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusFilter("cancelled")}
                      >
                        ยกเลิก
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    onClick={fetchSupervisions}
                    variant="outline"
                    className="gap-1"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    รีเฟรช
                  </Button>

                  <Link href="/admin/supervision/add" passHref>
                    <Button className="gap-1">
                      <Plus className="h-4 w-4" />
                      เพิ่มการนิเทศ
                    </Button>
                  </Link>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>รายการการนิเทศ</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>นักศึกษา</TableHead>
                            <TableHead>สถานประกอบการ</TableHead>
                            <TableHead>อาจารย์นิเทศ</TableHead>
                            <TableHead>วันที่นิเทศ</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead className="w-24">จัดการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {" "}
                          {filteredSupervisions.length > 0 ? (
                            filteredSupervisions.map(
                              (supervision: SupervisionItem, index: number) => (
                                <TableRow key={supervision.id}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                    <div className="font-medium">
                                      {supervision.student.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {supervision.student.student_id}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {supervision.company.name}
                                  </TableCell>
                                  <TableCell>
                                    {supervision.advisor.name}
                                  </TableCell>
                                  <TableCell>
                                    {formatToThaiDate(
                                      supervision.scheduled_date
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {renderStatus(supervision.status)}
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <Link
                                          href={`/admin/supervision/${supervision.id}`}
                                          passHref
                                        >
                                          <DropdownMenuItem>
                                            <FileText className="mr-2 h-4 w-4" />
                                            ดูรายละเอียด
                                          </DropdownMenuItem>
                                        </Link>
                                        <Link
                                          href={`/admin/supervision/edit/${supervision.id}`}
                                          passHref
                                        >
                                          <DropdownMenuItem>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            แก้ไข
                                          </DropdownMenuItem>
                                        </Link>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              )
                            )
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center py-4"
                              >
                                ไม่พบข้อมูลการนิเทศ
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
