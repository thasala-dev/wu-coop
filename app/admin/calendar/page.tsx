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
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Sidebar from "@/components/sidebar";
import CardList from "@/components/CardList";
import TableList from "@/components/TableList";

export default function AdminCalendar() {
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState<any>([]);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState("มิถุนายน 2567");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any>([]);
  const [events, setEvents] = useState<any>([]);

  // State for calendar view
  const [currentMonthIndex, setCurrentMonthIndex] = useState(5); // June (0-indexed)
  const [currentYear, setCurrentYear] = useState(2567); // BE
  const [calendarDays, setCalendarDays] = useState<any[]>([]);

  // Days of the week
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
  const monthNames = [
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

  // Function to generate calendar days for the current month
  const generateCalendarDays = () => {
    // Convert BE year to CE year for JavaScript Date
    const ceYear = currentYear - 543;

    // Create date for the first day of the month
    const firstDay = new Date(ceYear, currentMonthIndex, 1);

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Get the last day of the month
    const lastDay = new Date(ceYear, currentMonthIndex + 1, 0).getDate();

    // Generate array of calendar days including empty days for start of month
    const days = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: null, events: [] });
    }

    // Add days of the month with their events
    for (let day = 1; day <= lastDay; day++) {
      // Find events for this day
      const dayEvents = events.filter((event: any) => {
        if (!event.day || !event.month || !event.year) return false;

        const eventDay = event.day;
        const eventMonth = event.month;
        const eventYear = event.year;

        const dayMatches = eventDay === day;
        const monthMatches = eventMonth === currentMonthIndex + 1;
        const yearMatches = eventYear === currentYear;
        const calendarMatches =
          !calendarSelected || event.calendar_id === parseInt(calendarSelected);

        return dayMatches && monthMatches && yearMatches && calendarMatches;
      });

      days.push({ day, events: dayEvents });
    }

    setCalendarDays(days);
    setCurrentMonth(`${monthNames[currentMonthIndex]} ${currentYear}`);
  };

  // Replace the filterEvents function to handle API data
  const filterEvents = () => {
    if (!events || events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    let filtered = [...events];

    // Filter by selected calendar term if one is selected
    if (calendarSelected) {
      filtered = filtered.filter(
        (event) => event.calendar_id === parseInt(calendarSelected)
      );
    }

    // Filter by search term if one is entered
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(search) ||
          event.description.toLowerCase().includes(search) ||
          event.category.toLowerCase().includes(search) ||
          event.date.toLowerCase().includes(search)
      );
    }

    setFilteredEvents(filtered);
  };

  // Handle month navigation
  const goToPreviousMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const goToToday = () => {
    // Get current date in Buddhist Era (BE)
    const today = new Date();
    const beYear = today.getFullYear() + 543;

    setCurrentMonthIndex(today.getMonth());
    setCurrentYear(beYear);
  };
  useEffect(() => {
    fetchCalendar();
  }, []);

  useEffect(() => {
    if (calendars.length > 0) {
      fetchEvents();
    }
  }, [calendars]);

  useEffect(() => {
    if (calendarSelected) {
      // selectCalendar(calendarSelected);
      filterEvents();
    }
  }, [calendarSelected, events]);
  useEffect(() => {
    generateCalendarDays();
    filterEvents();
  }, [currentMonthIndex, currentYear, calendarSelected, events]);

  useEffect(() => {
    filterEvents();
  }, [searchTerm]);

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
    setLoading(true);
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
    }
    setLoading(false);
  }

  // Function to map event type_id to category
  const mapTypeToCategory = (typeId: number): string => {
    switch (typeId) {
      case 1:
        return "สำคัญ";
      case 2:
        return "กำหนดส่ง";
      case 3:
        return "การนิเทศ";
      case 4:
        return "การนำเสนอ";
      default:
        return "ทั่วไป";
    }
  };

  // Function to map status_id to status string
  const mapStatusToString = (statusId: number): string => {
    return statusId === 1 ? "active" : "upcoming";
  };

  // Function to format API event data
  const formatEventData = (apiEvents: any[]) => {
    return apiEvents.map((event) => {
      // Parse the event_date
      const eventDate = event.event_date
        ? new Date(event.event_date)
        : new Date();
      const day = eventDate.getDate();
      const month = eventDate.getMonth() + 1; // JavaScript months are 0-indexed
      const year = eventDate.getFullYear() + 543; // Convert to Buddhist Era

      // Format the date string for display
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
      };
      const dateString = eventDate.toLocaleDateString("th-TH", dateOptions);

      return {
        ...event,
        date: dateString,
        category: mapTypeToCategory(event.type_id),
        status: mapStatusToString(event.status_id),
        term:
          event.calendar_id && calendars.length > 0
            ? getCalendarTermById(event.calendar_id)
            : "",
        day,
        month,
        year,
      };
    });
  };

  // Function to get calendar term by calendar_id
  const getCalendarTermById = (calendarId: number): string => {
    const calendar = calendars.find((cal: any) => cal.id === calendarId);
    return calendar ? `${calendar.semester}/${calendar.year}` : "";
  };

  // Function to fetch events from API
  async function fetchEvents() {
    setLoading(true);
    try {
      const response = await fetch("/api/event", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        const formattedEvents = formatEventData(data.data || []);
        setEvents(formattedEvents);
        console.log("Fetched events:", formattedEvents);
      } else {
        console.error("Error fetching events:", data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

  // Function to render event dot in calendar
  const renderEventDot = (category: string) => {
    let bgColor = "bg-gray-400";

    switch (category) {
      case "สำคัญ":
        bgColor = "bg-red-500";
        break;
      case "กำหนดส่ง":
        bgColor = "bg-blue-500";
        break;
      case "การนิเทศ":
        bgColor = "bg-purple-500";
        break;
      case "การนำเสนอ":
        bgColor = "bg-green-500";
        break;
    }

    return <div className={`h-2 w-2 rounded-full ${bgColor} mr-1`}></div>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="calendar" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            {/* Term Selector */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">รอบฝึกงานศึกษา</CardTitle>
                    <CardDescription>
                      เลือกรอบฝึกงานศึกษาที่ต้องการจัดการ
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
                      <TabsTrigger value="select">แสดงรอบฝึกงาน</TabsTrigger>
                      <TabsTrigger value="manage">จัดการรอบฝึกงาน</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="select">
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
                                <span>นักศึกษา: {cal.total_intern || 0}</span>
                                <span>แหล่งฝึก: {cal.total_regist || 0}</span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="manage">
                    <TableList
                      meta={[
                        {
                          key: "name",
                          content: "รอบฝึกงาน",
                        },
                        {
                          key: "semester",
                          content: "ภาคการศึกษา",
                          render: (cal: any) => {
                            return `${cal.semester}/${cal.year}`;
                          },
                        },
                        {
                          key: "start_date",
                          content: "ระยะเวลา",
                          render: (cal: any) => {
                            return `${new Date(
                              cal.start_date
                            ).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })} - 
                              ${new Date(cal.end_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}`;
                          },
                        },
                        {
                          key: "status_id",
                          content: "สถานะ",
                          render: (cal: any) => {
                            return getStatusBadge(cal.status_id || 1);
                          },
                        },
                        {
                          key: "total_intern",
                          content: "นักศึกษา",
                          className: "text-center",
                          width: "80px",
                          render: (cal: any) => {
                            return cal.total_intern || 0;
                          },
                        },
                        {
                          key: "total_regist",
                          content: "แหล่งฝึกงาน",
                          className: "text-center",
                          width: "80px",
                          render: (cal: any) => {
                            return cal.total_regist || 0;
                          },
                        },
                        {
                          key: "actions",
                          content: "การดำเนินการ",
                          sort: false,
                          width: "150px",
                          className: "text-center",
                          render: (cal: any) => {
                            return (
                              <div className="flex justify-end gap-2">
                                <Link href={`/admin/calendar/${cal.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                                <Link href={`/admin/calendar/edit/${cal.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            );
                          },
                        },
                      ]}
                      data={calendars}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {calendarSelected && (
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      ปฏิทินกิจกรรมฝึกงานศึกษา
                    </CardTitle>
                    <CardDescription>
                      จัดการกำหนดการและกิจกรรมสำคัญ
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
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
                        <Select
                          defaultValue={
                            calendarSelected ? calendarSelected.toString() : ""
                          }
                          onValueChange={(value) => {
                            setCalendarSelected(value || null);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="เลือกรอบฝึกงาน" />
                          </SelectTrigger>
                          <SelectContent>
                            {calendars.map((cal: any) => (
                              <SelectItem
                                key={cal.id}
                                value={cal.id.toString()}
                              >
                                {cal.name} ({cal.semester}/{cal.year})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <TabsContent value="list">
                      <div className="rounded-md">
                        <TableList
                          meta={[
                            {
                              key: "date",
                              content: "วันที่",
                            },
                            {
                              key: "title",
                              content: "กิจกรรม",
                              render: (event: any) => {
                                return (
                                  <div>
                                    <div className="font-medium">
                                      {event.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {event.description}
                                    </div>
                                  </div>
                                );
                              },
                            },
                            {
                              key: "category",
                              content: "ประเภท",
                              render: (event: any) => {
                                return (
                                  <Badge
                                    className={getBadgeColor(event.category)}
                                  >
                                    {event.category}
                                  </Badge>
                                );
                              },
                            },
                            {
                              key: "term",
                              content: "รอบฝึกงาน",
                              render: (event: any) => {
                                return getCalendarTermById(event.calendar_id);
                              },
                            },
                            {
                              key: "status",
                              content: "สถานะ",
                              render: (event: any) => {
                                return event.status === "active" ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    กำลังดำเนินการ
                                  </Badge>
                                ) : (
                                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    กำลังจะมาถึง
                                  </Badge>
                                );
                              },
                            },
                            {
                              key: "actions",
                              content: "การดำเนินการ",
                              sort: false,
                              width: "150px",
                              render: (event: any) => {
                                return (
                                  <div className="flex justify-end gap-2">
                                    <Link
                                      href={`/admin/calendar/edit/${event.id}`}
                                    >
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-3.5 w-3.5" />
                                      </Button>
                                    </Link>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                );
                              },
                            },
                          ]}
                          data={filteredEvents}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="calendar">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToPreviousMonth}
                            >
                              <ChevronLeftIcon className="h-4 w-4" />
                            </Button>
                            <h3 className="text-lg font-medium">
                              {currentMonth}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToNextMonth}
                            >
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToToday}
                            >
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

                          {calendarDays.map((day, index) => (
                            <div
                              key={index}
                              className={`min-h-24 border rounded-md p-1 ${
                                day.day ? "hover:bg-gray-50" : "bg-gray-50"
                              }`}
                            >
                              {day.day && (
                                <>
                                  <div className="font-medium text-sm mb-1">
                                    {day.day}
                                  </div>
                                  <div className="space-y-1">
                                    {day.events
                                      .slice(0, 2)
                                      .map((event: any) => (
                                        <div
                                          key={event.id}
                                          className={`p-1 text-xs rounded truncate flex items-center ${
                                            event.category === "สำคัญ"
                                              ? "bg-red-100 text-red-800"
                                              : event.category === "กำหนดส่ง"
                                              ? "bg-blue-100 text-blue-800"
                                              : event.category === "การนิเทศ"
                                              ? "bg-purple-100 text-purple-800"
                                              : event.category === "การนำเสนอ"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                                        >
                                          {renderEventDot(event.category)}
                                          {event.title}
                                        </div>
                                      ))}
                                    {day.events.length > 2 && (
                                      <div className="text-xs text-gray-500 pl-1">
                                        + {day.events.length - 2}{" "}
                                        กิจกรรมเพิ่มเติม
                                      </div>
                                    )}
                                  </div>
                                </>
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
                            ไทม์ไลน์กิจกรรมฝึกงานศึกษา
                          </h3>
                        </div>

                        <div className="relative border-l-2 border-gray-200 ml-3 pl-8 space-y-8">
                          {filteredEvents.length > 0 ? (
                            filteredEvents.map((event: any) => (
                              <div key={event.id} className="relative">
                                <div
                                  className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border-2 border-white ${
                                    event.category === "สำคัญ"
                                      ? "bg-red-500"
                                      : event.category === "กำหนดส่ง"
                                      ? "bg-blue-500"
                                      : event.category === "การนิเทศ"
                                      ? "bg-purple-500"
                                      : event.category === "การนำเสนอ"
                                      ? "bg-green-500"
                                      : "bg-gray-500"
                                  }`}
                                ></div>
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
                                  <Link href={`/admin/event/edit/${event.id}`}>
                                    <Button variant="outline" size="sm">
                                      แก้ไข
                                    </Button>
                                  </Link>
                                  <Button variant="ghost" size="sm">
                                    ลบ
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 py-8">
                              ไม่พบกิจกรรมในรอบฝึกงานศึกษานี้
                            </div>
                          )}
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
