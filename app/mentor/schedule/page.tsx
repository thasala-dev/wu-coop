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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  VideoIcon,
  CarIcon,
  FilterIcon,
} from "lucide-react";
import MentorSidebar from "@/components/mentor-sidebar";
import Sidebar from "@/components/sidebar";

export default function MentorSchedulePage() {
  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      title: "นิเทศนักศึกษา - นายธนกร มั่นคง",
      date: "15 มิถุนายน 2567",
      time: "10:00 - 12:00",
      type: "ลงพื้นที่",
      location: "บริษัท เทคโนโลยี จำกัด",
      students: ["นายธนกร มั่นคง"],
      status: "upcoming",
      description: "นิเทศนักศึกษาครั้งที่ 1 ประจำภาคการศึกษา 1/2567",
    },
    {
      id: 2,
      title: "นิเทศนักศึกษา - นางสาวพิมพ์ชนก รักเรียน",
      date: "18 มิถุนายน 2567",
      time: "13:00 - 15:00",
      type: "ออนไลน์",
      location: "Zoom Meeting",
      students: ["นางสาวพิมพ์ชนก รักเรียน"],
      status: "upcoming",
      description: "นิเทศนักศึกษาครั้งที่ 1 ประจำภาคการศึกษา 1/2567",
    },
    {
      id: 3,
      title: "นิเทศนักศึกษากลุ่ม - บริษัท เทคโนโลยี จำกัด",
      date: "20 มิถุนายน 2567",
      time: "09:00 - 16:00",
      type: "ลงพื้นที่",
      location: "บริษัท เทคโนโลยี จำกัด",
      students: ["นายธนกร มั่นคง", "นางสาวพิมพ์ชนก รักเรียน", "นายภาคิน ใจดี"],
      status: "upcoming",
      description: "นิเทศนักศึกษากลุ่มที่ฝึกงานที่บริษัท เทคโนโลยี จำกัด",
    },
    {
      id: 4,
      title: "นิเทศนักศึกษา - นายภาคิน ใจดี",
      date: "5 มิถุนายน 2567",
      time: "10:00 - 12:00",
      type: "ลงพื้นที่",
      location: "บริษัท ซอฟต์แวร์ จำกัด",
      students: ["นายภาคิน ใจดี"],
      status: "completed",
      description: "นิเทศนักศึกษาครั้งที่ 1 ประจำภาคการศึกษา 1/2567",
    },
    {
      id: 5,
      title: "ประชุมออนไลน์กับนักศึกษา",
      date: "8 มิถุนายน 2567",
      time: "13:00 - 15:00",
      type: "ออนไลน์",
      location: "Google Meet",
      students: ["นายธนกร มั่นคง", "นางสาวพิมพ์ชนก รักเรียน", "นายภาคิน ใจดี"],
      status: "completed",
      description: "ประชุมออนไลน์เพื่อติดตามความก้าวหน้าของนักศึกษา",
    },
  ];

  // Mock data for calendar
  const currentMonth = "มิถุนายน 2567";
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  // Mock data for students
  const students = [
    {
      id: 1,
      name: "นายธนกร มั่นคง",
      studentId: "6309681234",
      company: "บริษัท เทคโนโลยี จำกัด",
      location: "กรุงเทพมหานคร",
    },
    {
      id: 2,
      name: "นางสาวพิมพ์ชนก รักเรียน",
      studentId: "6309681235",
      company: "บริษัท ซอฟต์แวร์ จำกัด",
      location: "กรุงเทพมหานคร",
    },
    {
      id: 3,
      name: "นายภาคิน ใจดี",
      studentId: "6309681236",
      company: "บริษัท ซอฟต์แวร์ จำกัด",
      location: "กรุงเทพมหานคร",
    },
  ];

  // Function to get appointment type badge
  const getAppointmentTypeBadge = (type: string) => {
    switch (type) {
      case "ลงพื้นที่":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <CarIcon className="h-3 w-3 mr-1" />
            {type}
          </Badge>
        );
      case "ออนไลน์":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <VideoIcon className="h-3 w-3 mr-1" />
            {type}
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Function to get appointment status badge
  const getAppointmentStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            กำลังจะมาถึง
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            เสร็จสิ้น
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            ยกเลิก
          </Badge>
        );
      default:
        return <Badge>ไม่ระบุ</Badge>;
    }
  };

  // Function to get calendar day class based on appointments
  const getCalendarDayClass = (day: number) => {
    // Check if there are appointments on this day
    const hasAppointment = appointments.some((appointment) => {
      const appointmentDay = Number.parseInt(appointment.date.split(" ")[0]);
      return (
        appointmentDay === day && appointment.date.includes("มิถุนายน 2567")
      );
    });

    if (hasAppointment) {
      return "bg-blue-50 border-blue-200";
    }

    return "";
  };

  // Function to get appointments for a specific day
  const getAppointmentsForDay = (day: number) => {
    return appointments.filter((appointment) => {
      const appointmentDay = Number.parseInt(appointment.date.split(" ")[0]);
      return (
        appointmentDay === day && appointment.date.includes("มิถุนายน 2567")
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="schedule" userType="mentor" />

          <div className="md:col-span-4">
            <Card className="mb-6">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">
                    ตารางนัดหมายและการนิเทศ
                  </CardTitle>
                  <CardDescription>
                    จัดการตารางนัดหมายและการนิเทศนักศึกษา
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      สร้างการนัดหมายใหม่
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>สร้างการนัดหมายใหม่</DialogTitle>
                      <DialogDescription>
                        กรอกข้อมูลเพื่อสร้างการนัดหมายหรือการนิเทศนักศึกษา
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="appointment-title">
                          หัวข้อการนัดหมาย
                        </Label>
                        <Input
                          id="appointment-title"
                          placeholder="เช่น นิเทศนักศึกษา - นายธนกร มั่นคง"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="appointment-date">วันที่</Label>
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="appointment-date"
                              type="date"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="appointment-time">เวลา</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id="appointment-time-start"
                                type="time"
                                className="pl-10"
                              />
                            </div>
                            <div className="relative">
                              <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                id="appointment-time-end"
                                type="time"
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appointment-type">
                          ประเภทการนัดหมาย
                        </Label>
                        <Select>
                          <SelectTrigger id="appointment-type">
                            <SelectValue placeholder="เลือกประเภทการนัดหมาย" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="onsite">ลงพื้นที่</SelectItem>
                            <SelectItem value="online">ออนไลน์</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appointment-location">
                          สถานที่/ลิงก์การประชุม
                        </Label>
                        <Input
                          id="appointment-location"
                          placeholder="ระบุสถานที่หรือลิงก์การประชุมออนไลน์"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>เลือกนักศึกษา</Label>
                        <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                          <div className="space-y-4">
                            {students.map((student) => (
                              <div
                                key={student.id}
                                className="flex items-start space-x-3"
                              >
                                <Checkbox id={`student-${student.id}`} />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor={`student-${student.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {student.name} ({student.studentId})
                                  </label>
                                  <p className="text-sm text-gray-500">
                                    {student.company} • {student.location}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appointment-description">
                          รายละเอียด
                        </Label>
                        <Textarea
                          id="appointment-description"
                          placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับการนัดหมาย"
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">ยกเลิก</Button>
                      <Button>บันทึกการนัดหมาย</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="calendar">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <TabsList>
                      <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
                      <TabsTrigger value="list">รายการนัดหมาย</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="ค้นหาการนัดหมาย..."
                          className="pl-10 pr-4 py-2 border rounded-md w-full"
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <FilterIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

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
                            className={`h-24 border rounded-md p-1 hover:bg-gray-50 ${getCalendarDayClass(
                              day
                            )}`}
                          >
                            <div className="font-medium text-sm">{day}</div>
                            {getAppointmentsForDay(day).map(
                              (appointment, index) => (
                                <Link
                                  href={`/mentor/schedule/${appointment.id}`}
                                  key={index}
                                >
                                  <div className="mt-1 p-1 text-xs bg-blue-100 text-blue-800 rounded truncate">
                                    {appointment.time.split(" - ")[0]}{" "}
                                    {appointment.title.length > 20
                                      ? appointment.title.substring(0, 20) +
                                        "..."
                                      : appointment.title}
                                  </div>
                                </Link>
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="list">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          การนัดหมายที่กำลังจะมาถึง
                        </h3>
                        <div className="space-y-4">
                          {appointments
                            .filter(
                              (appointment) => appointment.status === "upcoming"
                            )
                            .map((appointment) => (
                              <Link
                                href={`/mentor/schedule/${appointment.id}`}
                                key={appointment.id}
                              >
                                <Card className="hover:border-blue-300 transition-colors">
                                  <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                      <div>
                                        <h4 className="font-medium">
                                          {appointment.title}
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          <div className="flex items-center text-sm text-gray-500">
                                            <CalendarIcon className="h-4 w-4 mr-1" />
                                            {appointment.date}
                                          </div>
                                          <div className="flex items-center text-sm text-gray-500">
                                            <ClockIcon className="h-4 w-4 mr-1" />
                                            {appointment.time}
                                          </div>
                                          <div className="flex items-center text-sm text-gray-500">
                                            <MapPinIcon className="h-4 w-4 mr-1" />
                                            {appointment.location}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                                        {getAppointmentTypeBadge(
                                          appointment.type
                                        )}
                                        <div className="flex items-center">
                                          <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
                                          <span className="text-sm">
                                            {appointment.students.length} คน
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          การนัดหมายที่ผ่านมาแล้ว
                        </h3>
                        <div className="space-y-4">
                          {appointments
                            .filter(
                              (appointment) =>
                                appointment.status === "completed"
                            )
                            .map((appointment) => (
                              <Link
                                href={`/mentor/schedule/${appointment.id}`}
                                key={appointment.id}
                              >
                                <Card className="hover:border-blue-300 transition-colors">
                                  <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                      <div>
                                        <h4 className="font-medium">
                                          {appointment.title}
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          <div className="flex items-center text-sm text-gray-500">
                                            <CalendarIcon className="h-4 w-4 mr-1" />
                                            {appointment.date}
                                          </div>
                                          <div className="flex items-center text-sm text-gray-500">
                                            <ClockIcon className="h-4 w-4 mr-1" />
                                            {appointment.time}
                                          </div>
                                          <div className="flex items-center text-sm text-gray-500">
                                            <MapPinIcon className="h-4 w-4 mr-1" />
                                            {appointment.location}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                                        {getAppointmentTypeBadge(
                                          appointment.type
                                        )}
                                        {getAppointmentStatusBadge(
                                          appointment.status
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                        </div>
                      </div>
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
