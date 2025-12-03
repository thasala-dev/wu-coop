"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { th } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  BuildingIcon,
  PlusIcon,
  SearchIcon,
  FileTextIcon,
  CheckCircleIcon,
  ClipboardIcon,
  ClockIcon,
  TrendingUpIcon,
  BarChart3Icon,
  EyeIcon,
  PhoneIcon,
  MailIcon,
  VideoIcon,
  CarIcon,
  Save,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Loading from "@/components/loading";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supervisionType } from "@/lib/global";
import CustomAvatar from "@/components/avatar";

// Type definitions
interface Student {
  id: number;
  name: string;
  studentId: string;
  major: string;
}

interface Company {
  id: number;
  name: string;
  address: string;
  location: string;
  contact: string;
  phone: string;
  email: string;
}

export default function AdvisorVisits() {
  const { data: session } = useSession();
  const user = session?.user;
  const { toast } = useToast();

  // State for visits data
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentLoading, setStudentLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for modal form data
  const [students, setStudents] = useState<any[]>([]);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);

  // Modal states
  const [addSupervisionModal, setAddSupervisionModal] = useState(false);
  const [editingVisitId, setEditingVisitId] = useState<number | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("12:00");
  const [visitType, setVisitType] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [comments, setComments] = useState<string>("");

  const handleAddNew = () => {
    resetAddSupervisionForm();
    setAddSupervisionModal(true);
  };
  const handleEditSupervision = async (visitId: number) => {
    const findVisit = visits.find((visit) => visit.id === visitId);
    if (!findVisit) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบข้อมูลการนิเทศที่ต้องการแก้ไข",
        variant: "destructive",
      });
      return;
    }

    console.log("Editing visit:", findVisit);

    // เก็บ ID ของการนิเทศที่กำลังแก้ไข
    setEditingVisitId(visitId);

    // ตั้งค่า calendar ก่อน เพื่อให้ดึงข้อมูลนักศึกษา
    setSelectedCalendar(findVisit.calendar_id || "");

    setSelectedStudent(findVisit.regist_intern_id || "");
    // จัดการวันที่
    try {
      const visitDate = new Date(findVisit.scheduled_date);
      setScheduledDate(visitDate);
    } catch (error) {
      console.error("Error parsing date:", error);
      setScheduledDate(null);
    }

    setStartTime(findVisit.start_time || "09:00");
    setEndTime(findVisit.end_time || "12:00");
    setVisitType(findVisit.visit_type || "");
    setType(findVisit.type || "");
    setComments(findVisit.comments || "");

    setAddSupervisionModal(true);
  };
  const handleAddSupervision = async () => {
    if (!selectedStudent) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาเลือกนักศึกษา",
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

    setIsLoading(true);
    try {
      const formattedDate = format(scheduledDate, "yyyy-MM-dd");

      // ตรวจสอบว่าเป็นการแก้ไขหรือเพิ่มใหม่
      const isEditing = editingVisitId !== null;
      const url = isEditing
        ? `/api/supervision/${editingVisitId}`
        : "/api/supervision";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regist_intern_id: selectedStudent,
          advisor_id: user?.id,
          scheduled_date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          visit_type: visitType || null,
          type: type || null,
          comments: comments || null,
          status: 0,
          calendar_id: selectedCalendar || null,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: isEditing ? "แก้ไขข้อมูลสำเร็จ" : "บันทึกข้อมูลสำเร็จ",
          description: isEditing
            ? "แก้ไขรายการนิเทศเรียบร้อยแล้ว"
            : "เพิ่มรายการนิเทศเรียบร้อยแล้ว",
          variant: "success",
        });

        setAddSupervisionModal(false);
        resetAddSupervisionForm();
        fetchVisits();
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message || "ไม่สามารถบันทึกข้อมูลได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding/updating supervision:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAddSupervisionForm = () => {
    setSelectedCalendar("");
    setSelectedStudent("");
    setScheduledDate(null);
    setStartTime("09:00");
    setEndTime("12:00");
    setVisitType("");
    setType("");
    setComments("");
    setEditingVisitId(null);
  };

  const fetchVisits = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/advisor/visits?advisorId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setVisits(data.data);
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.message,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    if (!selectedCalendar) return;
    fetchStudents(selectedCalendar);
  }, [selectedCalendar]);

  const fetchStudents = async (calendarId: string) => {
    console.log("Fetching students for calendar:", calendarId);
    setStudentLoading(true);
    try {
      const response = await fetch(`/api/calendar/${calendarId}/info`);
      const data = await response.json();
      if (data.success) {
        const matchedStudents = data.intern
          .filter((item: any) => item.company_id !== null)
          .map((item: any) => {
            const company = data.company.find(
              (c: any) => c.company_id === item.company_id
            );
            return {
              id: item.id,
              name: item.fullname,
              student_id: item.student_id,
              company: company ? company.name : "ไม่ระบุบริษัท",
            };
          });
        console.log("Fetched students:", matchedStudents);

        setStudents(matchedStudents);
        setStudentLoading(false);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchCalendars = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/calendar");
      const data = await response.json();
      if (data.success) {
        console.log("Fetched calendars:", data.data);
        setCalendars(data.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching advisors:", error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchMentors();
    fetchVisits();
    fetchCalendars();
  }, [user]);



  const fetchMentors = async () => {
    try {
      const response = await fetch(
        `/api/mentor`
      );
      const data = await response.json();
      if (data.success) {
        const mentorsList = data.data;
        setMentors(mentorsList);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลนักศึกษาได้",
        variant: "destructive",
      });
    }
  };


  const filteredVisits = visits.filter((visit: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const studentsMatch = visit.company_contact_name
      .toLowerCase()
      .includes(searchLower);
    const studentIdsMatch = visit.company_contact_phone.includes(searchLower);
    const companyMatch = visit.company_name.toLowerCase().includes(searchLower);

    return studentsMatch || studentIdsMatch || companyMatch;
  });

  // Calculate statistics for reports tab
  const totalVisits = visits.length;
  const completedVisits = visits.filter(
    (visit: any) => visit.status == "1"
  ).length;
  const upcomingVisits = visits.filter(
    (visit: any) => visit.status == "0"
  ).length;

  // Get next upcoming visit
  const nextVisit = visits
    .filter((visit: any) => visit.status == "0")
    .sort(
      (a: any, b: any) =>
        new Date(a.scheduled_date).getTime() -
        new Date(b.scheduled_date).getTime()
    )[0];

  const formatVisitTime = (
    date: string,
    startTime: string,
    endTime: string
  ) => {
    try {
      const visitDate = new Date(date);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = visitDate.toLocaleDateString("th-TH", options);
      return `${formattedDate} เวลา ${startTime.slice(0, 5)} - ${endTime.slice(
        0,
        5
      )} น.`;
    } catch (error) {
      return `${date} เวลา ${startTime.slice(0, 5)} - ${endTime.slice(
        0,
        5
      )} น.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar userType="advisor" activePage="visits" />
          {isLoading && <Loading />}
          <div className="md:col-span-4 space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  การนิเทศนักศึกษา
                </h1>
                <p className="text-gray-600 mt-1">
                  จัดการและติดตามการนิเทศนักศึกษา ณ แหล่งฝึกงาน
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => handleAddNew()}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  วางแผนการนิเทศ
                </Button>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">
                        การนิเทศทั้งหมด
                      </p>
                      <p className="text-2xl font-bold">{totalVisits}</p>
                    </div>
                    <BarChart3Icon className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">
                        เสร็จสิ้นแล้ว
                      </p>
                      <p className="text-2xl font-bold">{completedVisits}</p>
                    </div>
                    <CheckCircleIcon className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">
                        กำลังจะถึง
                      </p>
                      <p className="text-2xl font-bold">{upcomingVisits}</p>
                    </div>
                    <ClockIcon className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">
                        อัตราการเสร็จสิ้น
                      </p>
                      <p className="text-2xl font-bold">
                        {totalVisits > 0
                          ? Math.round((completedVisits / totalVisits) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                    <TrendingUpIcon className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Visit Card */}
            {nextVisit && (
              <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-900 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    การนิเทศถัดไป
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {nextVisit.company_name}
                        </h3>
                        <div className="text-sm text-gray-900">
                          {nextVisit.calendar_name} ภาคการศึกษา{" "}
                          {nextVisit.calendar_semester}/{nextVisit.calendar_year}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          <span>{nextVisit.company_contact_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{nextVisit.company_location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {formatVisitTime(
                              nextVisit.scheduled_date,
                              nextVisit.start_time,
                              nextVisit.end_time
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 justify-center">
                        {nextVisit.visit_type === "online"
                          ? "ออนไลน์"
                          : "เยี่ยมแหล่งฝึก"}
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleEditSupervision(nextVisit.id)}
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </div>
                  {nextVisit.student && nextVisit.student.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          นักศึกษาที่เข้าร่วม:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {nextVisit.student.map((student: any, index: number) => (
                          <div className="flex items-center gap-2" key={index}>
                            <CustomAvatar
                              id={`student${student.student_id}`}
                              image={student.image}
                              size="8"
                            />
                            <div>
                              <div className="truncate">
                                {student.fullname} ({student.student_id})
                              </div>
                              <p className="text-xs text-gray-500">
                                {student.mobile}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <Tabs defaultValue="upcoming">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <TabsList className="grid w-full lg:w-auto grid-cols-3 bg-gray-100">
                      <TabsTrigger
                        value="upcoming"
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        กำลังจะถึง ({upcomingVisits})
                      </TabsTrigger>
                      <TabsTrigger
                        value="completed"
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        เสร็จสิ้นแล้ว ({completedVisits})
                      </TabsTrigger>
                      <TabsTrigger
                        value="reports"
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        รายงานการนิเทศ
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full lg:w-auto">
                      <div className="relative flex-grow lg:w-80">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="ค้นหาชื่อบริษัท..."
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <TabsContent value="upcoming">
                    <div className="space-y-4">
                      {filteredVisits
                        .filter((visit: any) => visit.status == "0")
                        .map((visit: any) => (
                          <Card
                            key={visit.id}
                            className="border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 group"
                          >
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                    {visit.visit_type === "online" ? (
                                      <VideoIcon className="h-7 w-7 text-white" />
                                    ) : (
                                      <CarIcon className="h-7 w-7 text-white" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                          {visit.company_name}
                                        </h3>
                                        <div className="text-sm text-gray-900">
                                          {visit.calendar_name} ภาคการศึกษา{" "}
                                          {visit.calendar_semester}/{visit.calendar_year}
                                        </div>
                                      </div>
                                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                        {visit.visit_type === "online"
                                          ? "ออนไลน์"
                                          : "เยี่ยมแหล่งฝึก"}
                                      </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                      <div className="flex items-center gap-2">
                                        <UserIcon className="h-4 w-4 text-purple-500" />
                                        <span className="font-medium">
                                          {visit.company_contact_name}
                                        </span>
                                        <span className="text-gray-400">
                                          ({visit.company_contact_phone})
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-purple-500" />
                                        <span>
                                          {formatVisitTime(
                                            visit.scheduled_date,
                                            visit.start_time,
                                            visit.end_time
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPinIcon className="h-4 w-4 text-purple-500" />
                                        <span>{visit.company_location}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <PhoneIcon className="h-4 w-4 text-purple-500" />
                                        <span>
                                          {visit.company_contact_phone}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-3 lg:items-end">
                                  <div className="flex gap-2">
                                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 px-3 py-1">
                                      กำลังจะถึง
                                    </Badge>
                                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 px-3 py-1">
                                      {
                                        supervisionType.find(
                                          (type) =>
                                            String(type.id) ===
                                            String(visit.type)
                                        )?.name
                                      }
                                    </Badge>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        handleEditSupervision(visit.id)
                                      }
                                      size="sm"
                                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                                    >
                                      <EyeIcon className="h-4 w-4 mr-1" />
                                      รายละเอียด
                                    </Button>

                                    <Link
                                      href={`/advisor/visits/record/${visit.id}`}
                                    >
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                                      >
                                        <ClipboardIcon className="h-4 w-4 mr-1" />
                                        บันทึกการนิเทศ
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              {visit.student && visit.student.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <UserIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                      นักศึกษาที่เข้าร่วม:
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {visit.student.map((student: any, index: number) => (
                                      <div className="flex items-center gap-2" key={index}>
                                        <CustomAvatar
                                          id={`student${student.student_id}`}
                                          image={student.image}
                                          size="8"
                                        />
                                        <div>
                                          <div className="truncate">
                                            {student.fullname} ({student.student_id})
                                          </div>
                                          <p className="text-xs text-gray-500">
                                            {student.mobile}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                      {filteredVisits.filter(
                        (visit: any) => visit.status == "0"
                      ).length === 0 && (
                          <Card className="border-2 border-dashed border-gray-300">
                            <CardContent className="text-center py-12">
                              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <CalendarIcon className="h-8 w-8 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                ไม่พบการนิเทศที่กำลังจะถึง
                              </h3>
                              <p className="text-gray-500 mb-4">
                                คุณสามารถวางแผนการนิเทศใหม่ได้ที่นี่
                              </p>
                              <Button
                                onClick={handleAddNew}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                              >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                วางแผนการนิเทศ
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed">
                    <div className="space-y-4">
                      {filteredVisits
                        .filter((visit: any) => visit.status == "1")
                        .map((visit: any) => (
                          <Card
                            key={visit.id}
                            className="border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 group"
                          >
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                    <CheckCircleIcon className="h-7 w-7 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                          {visit.company_name}
                                        </h3>
                                        <div className="text-sm text-gray-900">
                                          {visit.calendar_name} ภาคการศึกษา{" "}
                                          {visit.calendar_semester}/{visit.calendar_year}
                                        </div>
                                      </div>


                                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                        {visit.visit_type === "online"
                                          ? "ออนไลน์"
                                          : "เยี่ยมแหล่งฝึก"}
                                      </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                      <div className="flex items-center gap-2">
                                        <UserIcon className="h-4 w-4 text-green-500" />
                                        <span className="font-medium">
                                          {visit.company_contact_name}
                                        </span>
                                        <span className="text-gray-400">
                                          ({visit.company_contact_phone})
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-green-500" />
                                        <span>
                                          {formatVisitTime(
                                            visit.scheduled_date,
                                            visit.start_time,
                                            visit.end_time
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPinIcon className="h-4 w-4 text-green-500" />
                                        <span>{visit.company_location}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <PhoneIcon className="h-4 w-4 text-green-500" />
                                        <span>
                                          {visit.company_contact_phone}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-3 lg:items-end">
                                  <div className="flex gap-2">
                                    <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 px-3 py-1">
                                      เสร็จสิ้นแล้ว
                                    </Badge>
                                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 px-3 py-1">
                                      {
                                        supervisionType.find(
                                          (type) =>
                                            String(type.id) ===
                                            String(visit.type)
                                        )?.name
                                      }
                                    </Badge>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleEditSupervision(visit.id)
                                      }
                                      className="border-green-300 text-green-600 hover:bg-green-50"
                                    >
                                      <EyeIcon className="h-4 w-4 mr-1" />
                                      รายละเอียด
                                    </Button>

                                    <Link
                                      href={`/advisor/visits/record/${visit.id}`}
                                    >
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                      >
                                        <FileTextIcon className="h-4 w-4 mr-1" />
                                        ดูรายงาน
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>

                              {visit.student && visit.student.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <UserIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                      นักศึกษาที่เข้าร่วม:
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {visit.student.map((student: any, index: number) => (
                                      <div className="flex items-center gap-2" key={index}>
                                        <CustomAvatar
                                          id={`student${student.student_id}`}
                                          image={student.image}
                                          size="8"
                                        />
                                        <div>
                                          <div className="truncate">
                                            {student.fullname} ({student.student_id})
                                          </div>
                                          <p className="text-xs text-gray-500">
                                            {student.mobile}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                      {filteredVisits.filter(
                        (visit: any) => visit.status == "1"
                      ).length === 0 && (
                          <Card className="border-2 border-dashed border-gray-300">
                            <CardContent className="text-center py-12">
                              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircleIcon className="h-8 w-8 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                ยังไม่มีการนิเทศที่เสร็จสิ้น
                              </h3>
                              <p className="text-gray-500">
                                เมื่อคุณบันทึกการนิเทศเสร็จสิ้น ข้อมูลจะแสดงที่นี่
                              </p>
                            </CardContent>
                          </Card>
                        )}
                    </div>
                  </TabsContent>

                  <TabsContent value="reports">
                    <div className="space-y-6">
                      {/* Enhanced Statistics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-purple-900 flex items-center gap-2">
                              <BarChart3Icon className="h-5 w-5" />
                              จำนวนการนิเทศ
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-purple-700 mb-2">
                              {totalVisits}
                            </div>
                            <p className="text-sm text-purple-600 mb-4">
                              จำนวนการนิเทศทั้งหมด
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  เสร็จสิ้นแล้ว
                                </span>
                                <span className="font-semibold text-green-600">
                                  {completedVisits}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  กำลังจะถึง
                                </span>
                                <span className="font-semibold text-orange-600">
                                  {upcomingVisits}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-green-900 flex items-center gap-2">
                              <FileTextIcon className="h-5 w-5" />
                              รายงานการประเมิน
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-green-700 mb-2">
                              {completedVisits}
                            </div>
                            <p className="text-sm text-green-600">
                              จำนวนรายงานที่บันทึกแล้ว
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                              <TrendingUpIcon className="h-5 w-5" />
                              อัตราความสำเร็จ
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-blue-700 mb-2">
                              {totalVisits > 0
                                ? Math.round(
                                  (completedVisits / totalVisits) * 100
                                )
                                : 0}
                              %
                            </div>
                            <p className="text-sm text-blue-600">
                              อัตราการเสร็จสิ้นการนิเทศ
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Enhanced Reports Table */}
                      <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <FileTextIcon className="h-6 w-6" />
                            รายงานการนิเทศทั้งหมด
                          </CardTitle>
                          <CardDescription className="text-purple-100">
                            สรุปผลการนิเทศนักศึกษาทั้งหมด
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead className="font-semibold">
                                    วันที่นิเทศ
                                  </TableHead>
                                  <TableHead className="font-semibold">
                                    ผู้ประสานงาน
                                  </TableHead>
                                  <TableHead className="font-semibold">
                                    แหล่งฝึกงาน
                                  </TableHead>
                                  <TableHead className="font-semibold">
                                    ประเภท
                                  </TableHead>
                                  <TableHead className="font-semibold">
                                    สถานะ
                                  </TableHead>
                                  <TableHead className="text-center font-semibold">
                                    การดำเนินการ
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredVisits
                                  .filter((visit: any) => visit.status == "1")
                                  .map((visit: any) => (
                                    <TableRow
                                      key={visit.id}
                                      className="hover:bg-gray-50"
                                    >
                                      <TableCell className="font-medium">
                                        {new Date(
                                          visit.scheduled_date
                                        ).toLocaleDateString("th-TH", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </TableCell>
                                      <TableCell>
                                        <div>
                                          <div className="font-medium">
                                            {visit.company_contact_name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {visit.company_contact_phone}
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div>
                                          <div className="font-medium">
                                            {visit.company_name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {visit.company_location}
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={`${visit.visit_type === "online"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-orange-100 text-orange-800"
                                            } hover:bg-current`}
                                        >
                                          {visit.visit_type === "online"
                                            ? "ออนไลน์"
                                            : "เยี่ยมแหล่งฝึก"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                          เสร็จสิ้น
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handleEditSupervision(visit.id)
                                            }
                                          >
                                            <EyeIcon className="h-4 w-4 mr-1" />
                                            ดู
                                          </Button>

                                          <Link
                                            href={`/advisor/visits/record/${visit.id}`}
                                          >
                                            <Button
                                              size="sm"
                                              className="bg-purple-600 hover:bg-purple-700"
                                            >
                                              <FileTextIcon className="h-4 w-4 mr-1" />
                                              รายงาน
                                            </Button>
                                          </Link>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>

                          {filteredVisits.filter(
                            (visit: any) => visit.status == "1"
                          ).length === 0 && (
                              <div className="text-center py-12">
                                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                  <FileTextIcon className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  ยังไม่มีรายงานการนิเทศ
                                </h3>
                                <p className="text-gray-500">
                                  รายงานการนิเทศจะแสดงที่นี่เมื่อคุณบันทึกการนิเทศ
                                </p>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Add Supervision Modal */}
            <Dialog
              open={addSupervisionModal}
              onOpenChange={setAddSupervisionModal}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingVisitId !== null
                      ? "แก้ไขการนิเทศ"
                      : "เพิ่มการนิเทศ"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ผลัดฝึกงาน</label>
                      <Select
                        onValueChange={setSelectedCalendar}
                        value={selectedCalendar}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกผลัดฝึกงาน" />
                        </SelectTrigger>
                        <SelectContent>
                          {calendars.map((cal) => (
                            <SelectItem key={cal.id} value={cal.id}>
                              <div>
                                <div>
                                  {cal.name} ปีการศึกษา {cal.semester}/
                                  {cal.year}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {cal.start_date
                                    ? new Date(
                                      cal.start_date
                                    ).toLocaleDateString("th-TH", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
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
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">แหล่งฝึก</label>

                      <Select
                        onValueChange={setSelectedStudent}
                        value={selectedStudent}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกแหล่งฝึก" />
                        </SelectTrigger>
                        <SelectContent>
                          {mentors.map((mentor) => (
                            <SelectItem key={mentor.id} value={mentor.id}>
                              <div>
                                <div>
                                  {mentor.name} ({mentor.location})
                                </div>
                                <div className="text-sm text-gray-500">
                                  {mentor.contact_name && mentor.contact_name !== "-" ? mentor.contact_name : ""} {mentor.contact_name && mentor.contact_name !== "-" && mentor.contact_phone && mentor.contact_phone !== "-" ? "-" : ""} {mentor.contact_phone && mentor.contact_phone !== "-" ? mentor.contact_phone : ""}
                                </div>
                              </div>
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
                      <label className="text-sm font-medium">
                        เวลาเริ่มต้น
                      </label>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        รูปแบบการนิเทศ
                      </label>
                      <Select onValueChange={setVisitType} value={visitType}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกรูปแบบการนิเทศ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onsite">
                            นิเทศ ณ แหล่งฝึก
                          </SelectItem>
                          <SelectItem value="online">นิเทศออนไลน์</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        รูปแบบการประเมิน
                      </label>
                      <Select onValueChange={setType} value={type}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกรูปแบบการประเมิน" />
                        </SelectTrigger>
                        <SelectContent>
                          {supervisionType.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                    onClick={() => {
                      setAddSupervisionModal(false);
                      resetAddSupervisionForm();
                    }}
                  >
                    ยกเลิก
                  </Button>
                  <Button onClick={handleAddSupervision} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  );
}
