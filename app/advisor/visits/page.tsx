"use client";

import { useState, useEffect } from "react";
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
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  MapPinIcon,
  CarIcon,
  UserIcon,
  BuildingIcon,
  PlusIcon,
  SearchIcon,
  FileTextIcon,
  CheckCircleIcon,
  ClipboardIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import AdvisorSidebar from "@/components/advisor-sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  formatVisitDateTime,
  getVisitStatusInfo,
  getVisitTypeText,
} from "@/lib/advisor-visits";

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

interface Visit {
  id: number;
  advisor_id: number;
  visit_date: string;
  visit_time_start: string;
  visit_time_end: string;
  calendar_id: number;
  company_id: number;
  visit_type: "onsite" | "online";
  status: "upcoming" | "completed" | "cancelled";
  transportation?: string;
  distance?: number;
  students: Student[];
  company: Company;
  reports?: any[];
}

interface Calendar {
  id: number;
  semester: string;
  year: string;
  active_id: number;
}

export default function AdvisorVisits() {
  const { user } = useAuth();
  const { toast } = useToast();

  // State for visits data
  const [visits, setVisits] = useState<Visit[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Get current date and month/year for calendar
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // State for calendar navigation
  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  const [displayYear, setDisplayYear] = useState(currentYear);

  // Format the month and year in Thai
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const displayMonthYear = `${thaiMonths[displayMonth]} ${displayYear + 543}`;

  // Calendar days
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  // Calculate calendar days
  const getCalendarDays = () => {
    const firstDay = new Date(displayYear, displayMonth, 1);
    const lastDay = new Date(displayYear, displayMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the starting day of the week (0 = Sunday, 1 = Monday, etc.)
    const startingDay = firstDay.getDay();

    // Create an array of day objects
    const days = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, visits: [] });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayVisits = visits.filter((visit) => {
        const visitDate = new Date(visit.visit_date);
        return (
          visitDate.getDate() === i &&
          visitDate.getMonth() === displayMonth &&
          visitDate.getFullYear() === displayYear
        );
      });

      days.push({ day: i, visits: dayVisits });
    }

    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  // Fetch calendars
  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch("/api/calendar");
        const data = await response.json();

        if (data.success) {
          setCalendars(data.data);
          // Set the active calendar as the default selected calendar
          const activeCalendar = data.data.find((cal) => cal.active_id === 1);
          if (activeCalendar) {
            setSelectedCalendarId(activeCalendar.id.toString()); // แก้ไขให้เป็น string
          } else if (data.data.length > 0) {
            setSelectedCalendarId(data.data[0].id.toString()); // แก้ไขให้เป็น string
          }
        } else {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching calendars:", error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลรอบสหกิจได้",
          variant: "destructive",
        });
      }
    };

    fetchCalendars();
  }, [toast]);

  // Fetch visits when advisor ID or calendar ID changes
  useEffect(() => {
    const fetchVisits = async () => {
      if (!user?.id || !selectedCalendarId) return;

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/advisor/visits?advisorId=${user.id}&calendarId=${selectedCalendarId}`
        );
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
      } catch (error) {
        console.error("Error fetching visits:", error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลการนิเทศได้",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisits();
  }, [user?.id, selectedCalendarId, toast]);

  // Filter visits based on search term
  const filteredVisits = visits.filter((visit) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // Search in student names
    const studentsMatch = visit.students.some(
      (student) =>
        student.name.toLowerCase().includes(searchLower) ||
        student.studentId.includes(searchLower)
    );

    // Search in company name
    const companyMatch = visit.company.name.toLowerCase().includes(searchLower);

    return studentsMatch || companyMatch;
  });

  // Calculate statistics for reports tab
  const totalVisits = visits.length;
  const completedVisits = visits.filter(
    (visit) => visit.status === "completed"
  ).length;
  const upcomingVisits = visits.filter(
    (visit) => visit.status === "upcoming"
  ).length;

  // Calculate total distance
  const totalDistance = visits.reduce((total, visit) => {
    return total + (visit.distance || 0);
  }, 0);

  const completedDistance = visits
    .filter((visit) => visit.status === "completed")
    .reduce((total, visit) => {
      return total + (visit.distance || 0);
    }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <AdvisorSidebar activePage="visits" />

          <div className="md:col-span-4">
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">การนิเทศนักศึกษา</CardTitle>
                  <CardDescription>
                    จัดการการนิเทศนักศึกษา ณ แหล่งฝึกงาน
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedCalendarId}
                    onValueChange={setSelectedCalendarId}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="เลือกรอบสหกิจ" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendars.map((calendar) => (
                        <SelectItem
                          key={calendar.id}
                          value={calendar.id.toString()}
                        >
                          สหกิจ {calendar.semester}/{calendar.year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Link href="/advisor/visits/plan">
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      วางแผนการนิเทศ
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <TabsList>
                      <TabsTrigger value="upcoming">กำลังจะถึง</TabsTrigger>
                      <TabsTrigger value="completed">เสร็จสิ้นแล้ว</TabsTrigger>
                      <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
                      <TabsTrigger value="reports">รายงานการนิเทศ</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="ค้นหานักศึกษา..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <FilterIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="upcoming">
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {filteredVisits
                          .filter((visit) => visit.status === "upcoming")
                          .map((visit) => (
                            <div
                              key={visit.id}
                              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                                    <CalendarIcon className="h-6 w-6 text-purple-600" />
                                  </div>
                                  <div>
                                    <div className="flex items-center text-sm text-purple-600 font-medium mb-1">
                                      <CalendarIcon className="h-4 w-4 mr-1" />
                                      {formatVisitDateTime(
                                        visit.visit_date,
                                        visit.visit_time_start.slice(0, 5),
                                        visit.visit_time_end.slice(0, 5)
                                      )}
                                    </div>
                                    <h3 className="text-lg font-medium">
                                      นิเทศนักศึกษา - {visit.company.name}
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                      <div className="flex items-center text-sm text-gray-600">
                                        <UserIcon className="h-4 w-4 mr-1" />
                                        <span>
                                          {visit.students
                                            .map((s) => s.name)
                                            .join(", ")}
                                          {visit.students.length > 1 &&
                                            `(${visit.students.length} คน)`}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <BuildingIcon className="h-4 w-4 mr-1" />
                                        {visit.company.name}
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <MapPinIcon className="h-4 w-4 mr-1" />
                                        {visit.company.location}
                                      </div>
                                      {visit.distance && (
                                        <div className="flex items-center text-sm text-gray-600">
                                          <CarIcon className="h-4 w-4 mr-1" />
                                          ระยะทาง {visit.distance} กม. (
                                          {visit.transportation || "ไม่ระบุ"})
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 md:items-end">
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    กำลังจะถึง
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Link href={`/advisor/visits/${visit.id}`}>
                                      <Button variant="outline" size="sm">
                                        รายละเอียด
                                      </Button>
                                    </Link>
                                    <Link
                                      href={`/advisor/visits/report/${visit.id}`}
                                    >
                                      <Button size="sm">
                                        <ClipboardIcon className="h-4 w-4 mr-1" />
                                        บันทึกการนิเทศ
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                        {filteredVisits.filter(
                          (visit) => visit.status === "upcoming"
                        ).length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">
                              ไม่พบข้อมูลการนิเทศที่กำลังจะถึง
                            </p>
                            <p className="text-sm">
                              คุณสามารถวางแผนการนิเทศโดยคลิกที่ปุ่ม
                              "วางแผนการนิเทศ"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed">
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {filteredVisits
                          .filter((visit) => visit.status === "completed")
                          .map((visit) => (
                            <div
                              key={visit.id}
                              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-md flex items-center justify-center">
                                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                  </div>
                                  <div>
                                    <div className="flex items-center text-sm text-green-600 font-medium mb-1">
                                      <CalendarIcon className="h-4 w-4 mr-1" />
                                      {formatVisitDateTime(
                                        visit.visit_date,
                                        visit.visit_time_start.slice(0, 5),
                                        visit.visit_time_end.slice(0, 5)
                                      )}
                                    </div>
                                    <h3 className="text-lg font-medium">
                                      นิเทศนักศึกษา - {visit.company.name}
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                      <div className="flex items-center text-sm text-gray-600">
                                        <UserIcon className="h-4 w-4 mr-1" />
                                        <span>
                                          {visit.students
                                            .map((s) => s.name)
                                            .join(", ")}
                                          {visit.students.length > 1 &&
                                            `(${visit.students.length} คน)`}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <BuildingIcon className="h-4 w-4 mr-1" />
                                        {visit.company.name}
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <MapPinIcon className="h-4 w-4 mr-1" />
                                        {visit.company.location}
                                      </div>
                                      {visit.distance && (
                                        <div className="flex items-center text-sm text-gray-600">
                                          <CarIcon className="h-4 w-4 mr-1" />
                                          ระยะทาง {visit.distance} กม. (
                                          {visit.transportation || "ไม่ระบุ"})
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 md:items-end">
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    เสร็จสิ้นแล้ว
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Link href={`/advisor/visits/${visit.id}`}>
                                      <Button variant="outline" size="sm">
                                        รายละเอียด
                                      </Button>
                                    </Link>
                                    <Link
                                      href={`/advisor/visits/report/${visit.id}`}
                                    >
                                      <Button size="sm">
                                        <FileTextIcon className="h-4 w-4 mr-1" />
                                        ดูรายงาน
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                        {filteredVisits.filter(
                          (visit) => visit.status === "completed"
                        ).length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <CheckCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">
                              ไม่พบข้อมูลการนิเทศที่เสร็จสิ้นแล้ว
                            </p>
                            <p className="text-sm">
                              เมื่อคุณบันทึกการนิเทศเสร็จสิ้น
                              ข้อมูลจะปรากฏที่นี่
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="calendar">
                    <div className="space-y-6">
                      <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={goToPreviousMonth}
                          >
                            <ChevronLeftIcon className="h-4 w-4" />
                          </Button>
                          <h3 className="text-lg font-medium">
                            {displayMonthYear}
                          </h3>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={goToNextMonth}
                          >
                            <ChevronRightIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-7 border-b">
                          {daysOfWeek.map((day, index) => (
                            <div
                              key={index}
                              className="p-2 text-center text-sm font-medium border-r last:border-r-0"
                            >
                              {day}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 h-[600px]">
                          {getCalendarDays().map((dayObj, index) => (
                            <div
                              key={index}
                              className={`border-r border-b last:border-r-0 p-1 ${
                                dayObj.day ? "bg-white" : "bg-gray-50"
                              } relative`}
                            >
                              {dayObj.day && (
                                <div className="h-full">
                                  <div
                                    className={`text-sm p-1 ${
                                      dayObj.day === new Date().getDate() &&
                                      displayMonth === new Date().getMonth() &&
                                      displayYear === new Date().getFullYear()
                                        ? "bg-purple-100 text-purple-800 rounded-full w-7 h-7 flex items-center justify-center"
                                        : ""
                                    }`}
                                  >
                                    {dayObj.day}
                                  </div>

                                  <div className="mt-1 space-y-1 max-h-[90%] overflow-y-auto">
                                    {dayObj.visits.map((visit) => (
                                      <Link
                                        key={visit.id}
                                        href={`/advisor/visits/${visit.id}`}
                                        className={`block p-1 text-xs rounded truncate ${
                                          visit.status === "completed"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-purple-100 text-purple-800"
                                        }`}
                                      >
                                        {visit.visit_time_start.slice(0, 5)} -{" "}
                                        {visit.company.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reports">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              จำนวนการนิเทศ
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-purple-600">
                              {totalVisits}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              จำนวนการนิเทศทั้งหมด
                            </p>
                            <div className="mt-4 pt-4 border-t flex flex-col gap-1 text-sm">
                              <div className="flex justify-between">
                                <span>นิเทศแล้ว</span>
                                <span className="font-medium">
                                  {completedVisits}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>รอนิเทศ</span>
                                <span className="font-medium">
                                  {upcomingVisits}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              ระยะทางรวม
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-purple-600">
                              {totalDistance} กม.
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              ระยะทางการนิเทศทั้งหมด
                            </p>
                            <div className="mt-4 pt-4 border-t flex flex-col gap-1 text-sm">
                              <div className="flex justify-between">
                                <span>เดินทางแล้ว</span>
                                <span className="font-medium">
                                  {completedDistance} กม.
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>รอเดินทาง</span>
                                <span className="font-medium">
                                  {totalDistance - completedDistance} กม.
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              รายงานการประเมิน
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-purple-600">
                              {completedVisits}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              จำนวนรายงานที่บันทึกแล้ว
                            </p>
                            <div className="mt-4 pt-4 border-t">
                              <Link href="/advisor/visits/reports">
                                <Button variant="outline" className="w-full">
                                  <FileTextIcon className="h-4 w-4 mr-2" />
                                  ดูรายงานทั้งหมด
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            รายงานการนิเทศ
                          </CardTitle>
                          <CardDescription>
                            สรุปผลการนิเทศนักศึกษา
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {isLoading ? (
                            <div className="flex justify-center py-12">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                            </div>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>วันที่</TableHead>
                                  <TableHead>นักศึกษา</TableHead>
                                  <TableHead>แหล่งฝึกงาน</TableHead>
                                  <TableHead>ผลการประเมิน</TableHead>
                                  <TableHead>สถานะ</TableHead>
                                  <TableHead className="text-right">
                                    การดำเนินการ
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredVisits
                                  .filter(
                                    (visit) => visit.status === "completed"
                                  )
                                  .map((visit) => (
                                    <TableRow key={visit.id}>
                                      <TableCell>
                                        {new Date(
                                          visit.visit_date
                                        ).toLocaleDateString("th-TH", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </TableCell>
                                      <TableCell>
                                        {visit.students
                                          .map((s) => s.name)
                                          .join(", ")}
                                      </TableCell>
                                      <TableCell>
                                        {visit.company.name}
                                      </TableCell>
                                      <TableCell>
                                        {visit.reports &&
                                        Array.isArray(visit.reports) &&
                                        visit.reports.length > 0 ? (
                                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                            ดี
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                            ไม่มีข้อมูล
                                          </Badge>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                          เสร็จสิ้น
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                          <Link
                                            href={`/advisor/visits/report/${visit.id}`}
                                          >
                                            <Button size="sm">
                                              <FileTextIcon className="h-4 w-4 mr-1" />
                                              ดูรายงาน
                                            </Button>
                                          </Link>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          )}

                          {!isLoading &&
                            filteredVisits.filter(
                              (visit) => visit.status === "completed"
                            ).length === 0 && (
                              <div className="text-center py-12 text-gray-500">
                                <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium">
                                  ยังไม่มีรายงานการนิเทศ
                                </p>
                                <p className="text-sm">
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
          </div>
        </div>
      </main>
    </div>
  );
}
