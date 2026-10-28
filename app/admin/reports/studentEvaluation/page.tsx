"use client";

import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, FileText, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const currentYear = new Date().getFullYear() + 543;
const years = Array.from({ length: currentYear - 2567 + 1 }, (_, i) =>
  (currentYear - i).toString(),
);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// สถานะการประเมินจากจำนวนแบบประเมินที่ส่งแล้วเทียบกับทั้งหมด
const getStatus = (item: any) => {
  const total = Number(item.total_forms);
  const submitted = Number(item.total_submitted);
  if (total === 0) {
    return {
      key: "none",
      label: "ไม่มีแบบประเมิน",
      className: "bg-gray-50 text-gray-500 hover:bg-gray-50",
    };
  }
  if (submitted >= total) {
    return {
      key: "complete",
      label: "ประเมินครบ",
      className: "bg-green-50 text-green-700 hover:bg-green-50",
    };
  }
  if (submitted > 0) {
    return {
      key: "partial",
      label: "ประเมินบางส่วน",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    };
  }
  return {
    key: "pending",
    label: "ยังไม่ประเมิน",
    className: "bg-red-50 text-red-700 hover:bg-red-50",
  };
};

const statusFilters = [
  { value: "all", label: "ทั้งหมด" },
  { value: "complete", label: "ประเมินครบ" },
  { value: "partial", label: "ประเมินบางส่วน" },
  { value: "pending", label: "ยังไม่ประเมิน" },
];

export default function StudentEvaluationReportPage() {
  const { toast } = useToast();
  const [calendar, setCalendar] = useState<any[]>([]);
  const [yearSelected, setYearSelected] = useState<string>(
    currentYear.toString(),
  );
  const [calendarSelected, setCalendarSelected] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCalendar();
  }, []);

  useEffect(() => {
    if (calendarSelected) {
      fetchStudents(calendarSelected);
    } else {
      setStudents([]);
    }
  }, [calendarSelected]);

  async function fetchCalendar() {
    try {
      const response = await fetch("/api/calendar");
      const res = await response.json();
      if (res.success) {
        setCalendar(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching calendar:", error);
    }
  }

  async function fetchStudents(calendarId: string) {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/report/studentEvaluation?calendarId=${calendarId}`,
      );
      const res = await response.json();
      if (res.success) {
        setStudents(res.data || []);
      } else {
        setStudents([]);
        toast({
          title: "ไม่สามารถโหลดข้อมูลได้",
          description: res.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
    setLoading(false);
  }

  const calendarOfYear = calendar.filter(
    (item: any) => item.year == yearSelected,
  );

  const keyword = search.trim().toLowerCase();
  const filteredStudents = students.filter((item: any) => {
    if (statusFilter !== "all" && getStatus(item).key !== statusFilter) {
      return false;
    }
    if (!keyword) return true;
    return [item.fullname, item.student_id, item.company_name]
      .filter(Boolean)
      .some((text: string) => text.toLowerCase().includes(keyword));
  });

  const countByStatus = (key: string) =>
    key === "all"
      ? students.length
      : students.filter((item: any) => getStatus(item).key === key).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="reports" userType="admin" />

          <div className="md:col-span-4 space-y-4 min-w-0">
            <div className="flex items-center gap-3">
              <Link href="/admin/reports">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-blue-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Link href="/admin/reports" className="hover:text-gray-900">
                  รายงาน
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900 font-medium">
                  รายงานการประเมินรายบุคคล
                </span>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-gray-800">
                  รายงานการประเมินรายบุคคล
                </CardTitle>
                <CardDescription>
                  เลือกปีการศึกษาและผลัดการฝึก
                  เพื่อดูสถานะการประเมินและพิมพ์รายงานผลการประเมินของนักศึกษาแต่ละคน
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      ปีการศึกษา
                    </label>
                    <Select
                      value={yearSelected}
                      onValueChange={(value) => {
                        setYearSelected(value);
                        setCalendarSelected("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกปีการศึกษา" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      ผลัดการฝึก
                    </label>
                    <Select
                      value={calendarSelected}
                      onValueChange={(value) => setCalendarSelected(value)}
                      disabled={calendarOfYear.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            calendarOfYear.length === 0
                              ? "ไม่มีผลัดการฝึกในปีการศึกษานี้"
                              : "เลือกผลัดการฝึก"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {calendarOfYear.map((item: any) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name} ({item.semester}/{item.year}) ·{" "}
                            {formatDate(item.start_date)} -{" "}
                            {formatDate(item.end_date)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {calendarSelected && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      {statusFilters.map((filter) => (
                        <Button
                          key={filter.value}
                          variant={
                            statusFilter === filter.value
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setStatusFilter(filter.value)}
                        >
                          {filter.label}
                          <span className="ml-1.5 text-xs opacity-80">
                            {countByStatus(filter.value)}
                          </span>
                        </Button>
                      ))}
                    </div>
                    <div className="relative md:ml-auto md:w-72">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="ค้นหาชื่อ รหัส หรือแหล่งฝึก"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                      ไม่พบนักศึกษา
                    </div>
                  ) : (
                    <div className="overflow-x-auto border rounded-md">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-gray-600">
                          <tr>
                            <th className="p-2 text-left w-10">#</th>
                            <th className="p-2 text-left">รหัสนักศึกษา</th>
                            <th className="p-2 text-left">ชื่อ-นามสกุล</th>
                            <th className="p-2 text-left">แหล่งฝึก</th>
                            <th className="p-2 text-left">สถานะการประเมิน</th>
                            <th className="p-2 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredStudents.map((item: any, index: number) => {
                            const status = getStatus(item);
                            return (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-2 text-gray-400">
                                  {index + 1}
                                </td>
                                <td className="p-2 tabular-nums">
                                  {item.student_id}
                                </td>
                                <td className="p-2 font-medium">
                                  {item.fullname}
                                </td>
                                <td className="p-2 text-gray-600">
                                  {item.company_name}
                                </td>
                                <td className="p-2">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={status.className}
                                    >
                                      {status.label}
                                    </Badge>
                                    {Number(item.total_forms) > 0 && (
                                      <span className="text-xs text-gray-500 tabular-nums">
                                        {item.total_submitted}/
                                        {item.total_forms}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-2 text-right">
                                  {Number(item.total_forms) === 0 ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled
                                    >
                                      <FileText className="h-4 w-4 mr-1" />
                                      รายงาน
                                    </Button>
                                  ) : (
                                    <Link
                                      href={`/admin/reports/studentEvaluation/${item.id}`}
                                      target="_blank"
                                    >
                                      <Button variant="outline" size="sm">
                                        <FileText className="h-4 w-4 mr-1" />
                                        รายงาน
                                      </Button>
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
