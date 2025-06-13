"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  PlusIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ClockIcon,
  CalendarIcon,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function AdminCalendar() {
  const [calendars, setCalendars] = useState<any>([]);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);

  // Mock data for current month
  const currentMonth = "มิถุนายน 2567";

  // Mock data for calendar events
  const events = [
    {
      id: 1,
      date: "1 มิ.ย. 2567",
      title: "เริ่มปฏิบัติงานสหกิจศึกษา",
      description: "นักศึกษาเริ่มปฏิบัติงาน ณ สถานประกอบการ",
      category: "สำคัญ",
      status: "active",
      term: "1/2567",
    },
    {
      id: 2,
      date: "15 ก.ค. 2567",
      title: "กำหนดส่งรายงานความก้าวหน้าครั้งที่ 1",
      description: "นักศึกษาส่งรายงานความก้าวหน้าครั้งที่ 1 ผ่านระบบ",
      category: "กำหนดส่ง",
      status: "upcoming",
      term: "1/2567",
    },
    {
      id: 3,
      date: "15-25 ก.ค. 2567",
      title: "การนิเทศครั้งที่ 1",
      description: "อาจารย์นิเทศเข้าเยี่ยมนักศึกษา ณ สถานประกอบการ",
      category: "การนิเทศ",
      status: "upcoming",
      term: "1/2567",
    },
    {
      id: 4,
      date: "15 ส.ค. 2567",
      title: "กำหนดส่งรายงานความก้าวหน้าครั้งที่ 2",
      description: "นักศึกษาส่งรายงานความก้าวหน้าครั้งที่ 2 ผ่านระบบ",
      category: "กำหนดส่ง",
      status: "upcoming",
      term: "1/2567",
    },
    {
      id: 5,
      date: "15-25 ส.ค. 2567",
      title: "การนิเทศครั้งที่ 2",
      description: "อาจารย์นิเทศเข้าเยี่ยมนักศึกษา ณ สถานประกอบการ (ถ้ามี)",
      category: "การนิเทศ",
      status: "upcoming",
      term: "1/2567",
    },
    {
      id: 6,
      date: "15 ก.ย. 2567",
      title: "กำหนดส่งรายงานฉบับสมบูรณ์",
      description: "นักศึกษาส่งรายงานฉบับสมบูรณ์ผ่านระบบ",
      category: "กำหนดส่ง",
      status: "upcoming",
      term: "1/2567",
    },
    {
      id: 7,
      date: "30 ก.ย. 2567",
      title: "สิ้นสุดการปฏิบัติงานสหกิจศึกษา",
      description: "วันสุดท้ายของการปฏิบัติงาน ณ สถานประกอบการ",
      category: "สำคัญ",
      status: "upcoming",
      term: "1/2567",
    },
    {
      id: 8,
      date: "15 ต.ค. 2567",
      title: "นำเสนอผลการปฏิบัติงานสหกิจศึกษา",
      description: "นักศึกษานำเสนอผลการปฏิบัติงานสหกิจศึกษาต่อคณะกรรมการ",
      category: "การนำเสนอ",
      status: "upcoming",
      term: "1/2567",
    },
    // Events for term 2/2567
    {
      id: 9,
      date: "1 พ.ย. 2567",
      title: "เริ่มปฏิบัติงานสหกิจศึกษา",
      description: "นักศึกษาเริ่มปฏิบัติงาน ณ สถานประกอบการ",
      category: "สำคัญ",
      status: "upcoming",
      term: "2/2567",
    },
    {
      id: 10,
      date: "15 ธ.ค. 2567",
      title: "กำหนดส่งรายงานความก้าวหน้าครั้งที่ 1",
      description: "นักศึกษาส่งรายงานความก้าวหน้าครั้งที่ 1 ผ่านระบบ",
      category: "กำหนดส่ง",
      status: "upcoming",
      term: "2/2567",
    },
    {
      id: 11,
      date: "15-25 ธ.ค. 2567",
      title: "การนิเทศครั้งที่ 1",
      description: "อาจารย์นิเทศเข้าเยี่ยมนักศึกษา ณ สถานประกอบการ",
      category: "การนิเทศ",
      status: "upcoming",
      term: "2/2567",
    },
  ];

  // Mock data for calendar grid
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // Days of the week
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  // Function to get badge color based on category
  const getBadgeColor = (category: string) => {
    switch (category) {
      case "สำคัญ":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "กำหนดส่ง":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "การนิเทศ":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "การนำเสนอ":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Function to get status badge
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

  useEffect(() => {
    fetchCalendar();
  }, []);

  useEffect(() => {
    if (calendarSelected) {
      // selectCalendar(calendarSelected);
    }
  }, [calendarSelected]);

  async function selectCalendar(id: number) {
    if (id) {
      const response = await fetch(`/api/calendar-select/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        console.log("Selected calendar:", data.data);
      } else {
        console.error("Error selecting calendar:", data.message);
      }
    }
  }

  async function fetchCalendar() {
    const response = await fetch("/api/calendar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      setCalendars(data.data || []);
      // find calenar id that is active_id = 1
      const activeCalendar = data.data.find((cal: any) => cal.active_id === 1);
      if (activeCalendar) {
        setCalendarSelected(activeCalendar.id);
      }
      console.log("Fetched calendars:", data.data);
      // statsData[0].value = data.data.length;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <AdminSidebar activePage="calendar" />

          <div className="md:col-span-4">
            {/* Term Selector */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">รอบสหกิจศึกษา</CardTitle>
                    <CardDescription>
                      เลือกรอบสหกิจศึกษาที่ต้องการจัดการ
                    </CardDescription>
                  </div>
                  <a href={`/admin/calendar/add`}>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      สร้างรอบใหม่
                    </Button>
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="select">
                  <div>
                    <TabsList>
                      <TabsTrigger value="select">แสดงรอบสหกิจ</TabsTrigger>
                      <TabsTrigger value="manage">จัดการรอบสหกิจ</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="select">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {calendars.map((cal: any) => (
                        <Card
                          key={cal.id}
                          className={`cursor-pointer hover:border-blue-300 transition-colors ${
                            cal.id === calendarSelected
                              ? "border-blue-500 bg-blue-50"
                              : ""
                          }`}
                          onClick={() => {
                            setCalendarSelected(cal.id);
                            selectCalendar(cal.id);
                          }}
                        >
                          <CardHeader className="p-4 pb-0">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-md">
                                {cal.semester}/{cal.year}
                              </CardTitle>
                              {getStatusBadge(cal.status_id || 1)}
                            </div>
                            <CardTitle className="text-lg">
                              {cal.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600">
                              {new Date(cal.start_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}{" "}
                              -{" "}
                              {new Date(cal.end_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            <div className="flex justify-between mt-2 text-sm">
                              <span>นักศึกษา: {cal.total_student || 0}</span>
                              <span>บริษัท: {cal.total_company || 0}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="manage">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>รอบสหกิจ</TableHead>
                          <TableHead>ภาคการศึกษา</TableHead>
                          <TableHead>ระยะเวลา</TableHead>
                          <TableHead>สถานะ</TableHead>
                          <TableHead>นักศึกษา</TableHead>
                          <TableHead>บริษัท</TableHead>
                          <TableHead className="text-right">
                            การดำเนินการ
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calendars.map((cal: any) => (
                          <TableRow key={cal.id}>
                            <TableCell className="font-medium">
                              {cal.name}
                            </TableCell>
                            <TableCell>
                              {cal.semester}/{cal.year}
                            </TableCell>
                            <TableCell>
                              {new Date(cal.start_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}{" "}
                              -{" "}
                              {new Date(cal.end_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(cal.status_id || 1)}
                            </TableCell>
                            <TableCell>{cal.total_student || 0}</TableCell>
                            <TableCell>{cal.total_company || 0}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/admin/calendar/${cal.id}`}>
                                  <Button variant="outline" size="sm">
                                    ดูข้อมูล
                                  </Button>
                                </Link>
                                <Link href={`/admin/calendar/edit/${cal.id}`}>
                                  <Button variant="outline" size="sm">
                                    แก้ไข
                                  </Button>
                                </Link>
                                <Button variant="ghost" size="sm">
                                  ลบ
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {calendarSelected && (
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      ปฏิทินกิจกรรมสหกิจศึกษา
                    </CardTitle>
                    <CardDescription>
                      จัดการกำหนดการและกิจกรรมสำคัญ
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      ส่งออก
                    </Button>
                    <Link href={`/admin/event/add/${calendarSelected}`}>
                      <Button>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        เพิ่มกิจกรรม
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="list">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <TabsList>
                        <TabsTrigger value="list">รายการกิจกรรม</TabsTrigger>
                        <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
                        <TabsTrigger value="timeline">ไทม์ไลน์</TabsTrigger>
                      </TabsList>

                      <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-grow">
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            placeholder="ค้นหากิจกรรม..."
                            className="pl-10 pr-4 py-2 border rounded-md w-full"
                          />
                        </div>
                        <Select
                          defaultValue={calendarSelected || ""}
                          onValueChange={(value) => {
                            setCalendarSelected(value || null);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="เลือกรอบสหกิจ" />
                          </SelectTrigger>
                          <SelectContent>
                            {calendars.map((cal: any) => (
                              <SelectItem
                                key={cal.id}
                                value={cal.id}
                                onClick={() => setCalendarSelected(cal.id)}
                              >
                                {cal.name} {cal.semester}/{cal.year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <TabsContent value="list">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>วันที่</TableHead>
                              <TableHead>กิจกรรม</TableHead>
                              <TableHead>ประเภท</TableHead>
                              <TableHead>รอบสหกิจ</TableHead>
                              <TableHead>สถานะ</TableHead>
                              <TableHead className="text-right">
                                การดำเนินการ
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {events.map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium">
                                  {event.date}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {event.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {event.description}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={getBadgeColor(event.category)}
                                  >
                                    {event.category}
                                  </Badge>
                                </TableCell>
                                <TableCell>{event.term}</TableCell>
                                <TableCell>
                                  {event.status === "active" ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                      <ClockIcon className="h-3 w-3 mr-1" />
                                      กำลังดำเนินการ
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                      <ClockIcon className="h-3 w-3 mr-1" />
                                      กำลังจะมาถึง
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm">
                                      แก้ไข
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      ลบ
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    <TabsContent value="calendar">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <ChevronLeftIcon className="h-4 w-4" />
                            </Button>
                            <h3 className="text-lg font-medium">
                              {currentMonth}
                            </h3>
                            <Button variant="outline" size="sm">
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              วันนี้
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {daysOfWeek.map((day, index) => (
                            <div
                              key={index}
                              className="text-center font-medium py-2 text-sm"
                            >
                              {day}
                            </div>
                          ))}

                          {/* Empty cells for days before the 1st of the month (assuming June 2024 starts on Saturday) */}
                          {Array.from({ length: 5 }).map((_, index) => (
                            <div
                              key={`empty-${index}`}
                              className="h-24 border rounded-md bg-gray-50"
                            ></div>
                          ))}

                          {calendarDays.map((day) => (
                            <div
                              key={day}
                              className="h-24 border rounded-md p-1 hover:bg-gray-50"
                            >
                              <div className="font-medium text-sm">{day}</div>
                              {day === 1 && (
                                <div className="mt-1 p-1 text-xs bg-red-100 text-red-800 rounded truncate">
                                  เริ่มปฏิบัติงานสหกิจศึกษา
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="timeline">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">
                            ไทม์ไลน์กิจกรรมสหกิจศึกษา
                          </h3>
                        </div>

                        <div className="relative border-l-2 border-gray-200 ml-3 pl-8 space-y-8">
                          {events
                            .filter((event) => event.term === "1/2567")
                            .map((event) => (
                              <div key={event.id} className="relative">
                                <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-red-500"></div>
                                <div className="mb-1 flex items-center gap-2">
                                  <Badge
                                    className={getBadgeColor(event.category)}
                                  >
                                    {event.category}
                                  </Badge>
                                  <time className="text-sm font-normal leading-none text-gray-500">
                                    {event.date}
                                  </time>
                                </div>
                                <h3 className="text-lg font-semibold">
                                  {event.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {event.description}
                                </p>
                                <div className="mt-2 flex gap-2">
                                  <Button variant="outline" size="sm">
                                    แก้ไข
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    ลบ
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
