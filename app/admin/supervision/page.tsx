"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  Calendar,
  Search,
  MoreHorizontal,
  Filter,
  RefreshCcw,
  CheckIcon,
  InfoIcon,
  Link2,
  Link2Off,
  LinkIcon,
  PlusIcon,
  UserIcon,
  XIcon,
  BuildingIcon,
  Save,
  CalendarIcon,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import TableList from "@/components/TableList";
import CardList from "@/components/CardList";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import CustomAvatar from "@/components/avatar";

// Interface สำหรับข้อมูลการนิเทศ
interface SupervisionItem {
  id: number;
  regist_intern_id: number;
  advisor_id: number;
  student_name: string;
  student_code: string;
  company_name: string;
  advisor_name: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  visit_type: string;
  comments: string;
  status: number;
}

export default function SupervisionPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);
  const [supervisions, setSupervisions] = useState<SupervisionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [students, setStudents] = useState<any[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);
  // Modal states
  const [addSupervisionModal, setAddSupervisionModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("12:00");
  const [visitType, setVisitType] = useState<string>("");
  const [comments, setComments] = useState<string>("");

  // Fetch calendars when page loads
  useEffect(() => {
    fetchCalendars();
    fetchAdvisors();
  }, []);

  // Fetch supervisions when calendar is selected
  useEffect(() => {
    if (calendarSelected) {
      fetchSupervisions();
      fetchStudents();
    }
  }, [calendarSelected]);

  // Fetch all calendars
  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/calendar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      if (res.success) {
        setCalendars(res.data);

        let findActive = res.data.find((cal: any) => cal.active_id === 1);
        if (findActive) {
          setCalendarSelected(findActive.id);
        } else {
          setCalendarSelected(res.data[0]?.id || null);
        }
      }
    } catch (error) {
      console.error("Error fetching calendars:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลปฏิทินฝึกงานได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch supervisions for the selected calendar
  const fetchSupervisions = async () => {
    if (!calendarSelected) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/supervision?calendarId=${calendarSelected}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setSupervisions(data.data);
      } else {
        console.error("API error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching supervisions:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลการนิเทศได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch students for the selected calendar
  const fetchStudents = async () => {
    if (!calendarSelected) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/calendar/${calendarSelected}/info`);
      const data = await response.json();

      if (data.success) {
        // Only use students that are matched with companies
        const matchedStudents = data.intern
          .filter((item: any) => item.company_id !== null)
          .map((item: any) => {
            const company = data.company.find(
              (c: any) => c.company_id === item.company_id
            );
            return {
              id: item.id, // regist_intern_id
              name: item.fullname,
              student_id: item.student_id,
              company: company ? company.name : "ไม่ระบุบริษัท",
            };
          });

        setStudents(matchedStudents);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลนักศึกษาได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch advisors
  const fetchAdvisors = async () => {
    try {
      const response = await fetch("/api/advisor");
      const data = await response.json();
      if (data.success) {
        const advisorsList = data.data.map((advisor: any) => ({
          id: advisor.id,
          name: advisor.fullname,
        }));
        setAdvisors(advisorsList);
      }
    } catch (error) {
      console.error("Error fetching advisors:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลอาจารย์นิเทศได้",
        variant: "destructive",
      });
    }
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  // Filter supervisions by search and status
  const filteredSupervisions = supervisions.filter(
    (supervision: SupervisionItem) => {
      const matchesSearch =
        supervision.student_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        supervision.student_code.includes(searchQuery) ||
        supervision.company_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        supervision.advisor_name
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

  // Render status badge
  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            รอดำเนินการ
          </Badge>
        );
      case 1:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            เสร็จสิ้น
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            ยกเลิก
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            ไม่ระบุ
          </Badge>
        );
    }
  };
  // Format date to Thai format
  const formatToThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: th });
  };
  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return "";

    // ถ้าเป็นรูปแบบ HH:MM:SS หรือ HH:MM ให้ใช้ได้เลย
    if (
      typeof timeString === "string" &&
      timeString.match(/^\d{1,2}:\d{2}(:\d{2})?$/)
    ) {
      return timeString.substring(0, 5); // เอาแค่ HH:MM
    }

    // ถ้าเป็น timestamp ให้แปลงเป็น time
    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }
    } catch (e) {
      console.error("Error formatting time:", e);
    }

    return timeString.toString().substring(0, 5) || "";
  };

  // Get calendar status badge
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            กำลังดำเนินการ
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            กำลังจะมาถึง
          </Badge>
        );
      case 4:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            เสร็จสิ้น
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            วางแผน
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            ไม่ระบุ
          </Badge>
        );
    }
  };
  // Reset add supervision form
  const resetAddSupervisionForm = () => {
    setSelectedStudent("");
    setSelectedAdvisor("");
    setScheduledDate(null);
    setStartTime("09:00");
    setEndTime("12:00");
    setVisitType("");
    setComments("");
  };

  // Open add supervision modal
  const handleOpenAddSupervisionModal = () => {
    resetAddSupervisionForm();
    setAddSupervisionModal(true);
  };
  // Handle add supervision form submission
  const handleAddSupervision = async () => {
    if (!selectedStudent) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาเลือกนักศึกษา",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAdvisor) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาเลือกอาจารย์นิเทศ",
        variant: "destructive",
      });
      return;
    }

    if (!scheduledDate) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาเลือกวันที่นิเทศ",
        variant: "destructive",
      });
      return;
    }

    if (!startTime) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาระบุเวลาเริ่มต้น",
        variant: "destructive",
      });
      return;
    }

    if (!endTime) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาระบุเวลาสิ้นสุด",
        variant: "destructive",
      });
      return;
    }

    // Validate that end time is after start time
    if (startTime >= endTime) {
      toast({
        title: "ข้อมูลไม่ถูกต้อง",
        description: "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const formattedDate = format(scheduledDate, "yyyy-MM-dd");

      const response = await fetch("/api/supervision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regist_intern_id: selectedStudent,
          advisor_id: selectedAdvisor,
          scheduled_date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          visit_type: visitType || null,
          comments: comments || null,
          status: 0,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const student = students.find((s) => s.id === selectedStudent);
        const advisor = advisors.find((a) => a.id === selectedAdvisor);

        // Log activity (you can implement your own logging system here)
        console.log(
          `เพิ่มการนิเทศสำหรับนักศึกษา ${
            student?.name || selectedStudent
          } โดยอาจารย์ ${
            advisor?.name || selectedAdvisor
          } วันที่ ${formatToThaiDate(
            formattedDate
          )} เวลา ${startTime}-${endTime} น.`
        );

        toast({
          title: "บันทึกข้อมูลสำเร็จ",
          description: "เพิ่มรายการนิเทศเรียบร้อยแล้ว",
          variant: "success",
        });

        setAddSupervisionModal(false);
        resetAddSupervisionForm();
        fetchSupervisions();
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถบันทึกข้อมูลได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding supervision:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="supervision" userType="admin" />
          {loading && <Loading />}

          <div className="md:col-span-4">
            {/* Calendar Selector */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">ผลัดฝึกงาน</CardTitle>
                    <CardDescription>
                      เลือกผลัดฝึกงานที่ต้องการจัดการการนิเทศ
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <CardList
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
                    data={calendars}
                    pageLength={4}
                    render={(cal: any) => (
                      <Card
                        className={`cursor-pointer hover:border-blue-300 transition-colors ${
                          cal.id === calendarSelected
                            ? "border-blue-500 bg-blue-50"
                            : ""
                        }`}
                        onClick={() => {
                          setCalendarSelected(cal.id);
                        }}
                      >
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-md">
                              {cal.semester}/{cal.year}
                            </CardTitle>
                            {getStatusBadge(cal.status_id || 1)}
                          </div>
                          <CardTitle className="text-lg">{cal.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">
                            {cal.start_date
                              ? new Date(cal.start_date).toLocaleDateString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : ""}{" "}
                            -{" "}
                            {cal.end_date
                              ? new Date(cal.end_date).toLocaleDateString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : ""}
                          </p>
                          <div className="flex justify-between mt-2 text-sm">
                            <span>นักศึกษา: {cal.total_intern || 0}</span>
                            <span>แหล่งฝึก: {cal.total_regist || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Students List and Supervision Management */}
            {calendarSelected && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle>การนิเทศนักศึกษา</CardTitle>
                      <CardDescription>
                        จัดการการนิเทศนักศึกษาที่ลงทะเบียนในผลัดฝึกงานที่เลือก
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative w-64">
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
                      <Button
                        onClick={handleOpenAddSupervisionModal}
                        className="gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        เพิ่มการนิเทศ
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <TableList
                      meta={[
                        {
                          key: "student_name",
                          content: "นักศึกษา",
                          width: "200px",
                          render: (item: any) => (
                            <div className="flex items-center gap-2">
                              <CustomAvatar
                                id={`student${item.student_code}`}
                                image={item.student_image}
                                size="8"
                              />
                              <div>
                                <div className="truncate">
                                  {item.student_name}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {item.student_code}
                                </p>
                              </div>
                            </div>
                          ),
                        },
                        {
                          key: "company_name",
                          content: "แหล่งฝึกงาน",
                        },
                        {
                          key: "advisor_name",
                          content: "อาจารย์นิเทศ",
                        },
                        {
                          key: "scheduled_date",
                          content: "วันที่นิเทศ",
                          width: "130px",
                          render: (item: any) => (
                            <div>
                              {formatToThaiDate(item.scheduled_date)}
                              <div className="text-xs text-gray-500">
                                {formatTime(item.start_time)} -{" "}
                                {formatTime(item.end_time)} น.
                              </div>
                            </div>
                          ),
                        },
                        {
                          key: "visit_type",
                          content: "รูปแบบนิเทศ",
                          width: "100px",
                          render: (item: any) => {
                            switch (item.visit_type) {
                              case "onsite":
                                return "ณ สถานประกอบการ";
                              case "online":
                                return "ออนไลน์";
                              case "hybrid":
                                return "ผสมผสาน";
                              default:
                                return "ไม่ระบุ";
                            }
                          },
                        },
                        {
                          key: "status",
                          content: "สถานะ",
                          width: "120px",
                          render: (item: any) => renderStatus(item.status),
                        },
                        {
                          key: "actions",
                          content: "จัดการ",
                          sort: false,
                          width: "100px",
                          render: (row: any) => {
                            if (row.status === 1) {
                              return (
                                <div className="flex justify-end gap-2">
                                  <Link
                                    href={`/admin/supervision/report/${row.id}`}
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      <Eye className="h-3.5 w-3.5" /> รายงาน
                                    </Button>
                                  </Link>
                                </div>
                              );
                            }
                            return (
                              <div className="flex justify-end gap-2">
                                <Link
                                  href={`/admin/supervision/edit/${row.id}`}
                                >
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  // onClick={() => confirmDelete(row.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            );
                          },
                        },
                      ]}
                      data={filteredSupervisions}
                      loading={loading}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Add Supervision Modal */}
      <Dialog open={addSupervisionModal} onOpenChange={setAddSupervisionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>เพิ่มการนิเทศ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">นักศึกษา</label>
                <Select
                  onValueChange={setSelectedStudent}
                  value={selectedStudent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกนักศึกษา" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        <div>
                          <div>
                            {student.name} ({student.student_id})
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.company}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">อาจารย์นิเทศ</label>
                <Select
                  onValueChange={setSelectedAdvisor}
                  value={selectedAdvisor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกอาจารย์นิเทศ" />
                  </SelectTrigger>
                  <SelectContent>
                    {advisors.map((advisor) => (
                      <SelectItem key={advisor.id} value={advisor.id}>
                        {advisor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">วันที่นิเทศ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? (
                        format(scheduledDate, "d MMMM yyyy", {
                          locale: th,
                        })
                      ) : (
                        <span>เลือกวันที่นิเทศ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 shadow-md rounded-md"
                    align="start"
                  >
                    <CalendarComponent
                      selected={scheduledDate || undefined}
                      onSelect={(date: Date | null) => {
                        setScheduledDate(date);
                      }}
                      locale={th}
                      className="rounded-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">เวลาเริ่มต้น</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">เวลาสิ้นสุด</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">รูปแบบการนิเทศ</label>
              <Select onValueChange={setVisitType} value={visitType}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกรูปแบบการนิเทศ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">นิเทศ ณ สถานประกอบการ</SelectItem>
                  <SelectItem value="online">นิเทศออนไลน์</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">หมายเหตุ</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border rounded-md h-24"
                placeholder="บันทึกรายละเอียดเพิ่มเติม (ถ้ามี)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddSupervisionModal(false)}
            >
              ยกเลิก
            </Button>
            <Button onClick={handleAddSupervision} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
