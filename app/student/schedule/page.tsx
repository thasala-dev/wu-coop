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
import StudentSidebar from "@/components/student-sidebar";

export default function StudentSchedulePage() {
  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      title: "การนิเทศครั้งที่ 1",
      date: "15 มิถุนายน 2567",
      time: "10:00 - 12:00",
      type: "ลงพื้นที่",
      location: "บริษัท เทคโนโลยี จำกัด (ห้องประชุมชั้น 3)",
      advisor: "ผศ.ดร.สมชาย ใจดี",
      status: "upcoming",
      description:
        "การนิเทศครั้งแรกเพื่อพูดคุยเกี่ยวกับการปรับตัวและงานที่ได้รับมอบหมาย",
    },
    {
      id: 2,
      title: "การนิเทศครั้งที่ 2",
      date: "18 มิถุนายน 2567",
      time: "13:00 - 15:00",
      type: "ออนไลน์",
      location: "Zoom Meeting",
      advisor: "ผศ.ดร.สมชาย ใจดี",
      status: "upcoming",
      description: "การนิเทศครั้งที่สองเพื่อติดตามความก้าวหน้าของโครงงาน",
    },
    {
      id: 3,
      title: "การนิเทศครั้งที่ 3 (ครั้งสุดท้าย)",
      date: "20 มิถุนายน 2567",
      time: "09:00 - 16:00",
      type: "ลงพื้นที่",
      location: "บริษัท เทคโนโลยี จำกัด (ห้องประชุมใหญ่)",
      advisor: "ผศ.ดร.สมชาย ใจดี",
      status: "upcoming",
      description: "การนิเทศครั้งสุดท้ายเพื่อประเมินผลการปฏิบัติงานและโครงงาน",
    },
    {
      id: 4,
      title: "การนิเทศเพิ่มเติม",
      date: "5 มิถุนายน 2567",
      time: "10:00 - 12:00",
      type: "ลงพื้นที่",
      location: "บริษัท เทคโนโลยี จำกัด",
      advisor: "ผศ.ดร.สมชาย ใจดี",
      status: "completed",
      description: "การนิเทศเพิ่มเติมเพื่อแนะนำการเตรียมตัวก่อนเริ่มฝึกงาน",
    },
    {
      id: 5,
      title: "การประชุมออนไลน์",
      date: "8 มิถุนายน 2567",
      time: "13:00 - 15:00",
      type: "ออนไลน์",
      location: "Google Meet",
      advisor: "ผศ.ดร.สมชาย ใจดี",
      status: "completed",
      description: "การประชุมออนไลน์เพื่อแนะนำการเขียนรายงาน",
    },
  ];

  // Mock data for calendar
  const currentMonth = "มิถุนายน 2567";
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

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
          <StudentSidebar activePage="schedule" />

          <div className="md:col-span-4">
            <Card className="mb-6">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">
                    ตารางนัดหมายการนิเทศ
                  </CardTitle>
                  <CardDescription>
                    ดูและจัดการตารางนัดหมายการนิเทศของคุณ
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    นัดหมายที่กำลังจะมาถึง:{" "}
                    {appointments.filter((a) => a.status === "upcoming").length}
                  </Badge>
                </div>
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
                                  href={`/student/schedule/${appointment.id}`}
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
                                href={`/student/schedule/${appointment.id}`}
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
                                            อาจารย์: {appointment.advisor}
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
                                href={`/student/schedule/${appointment.id}`}
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
