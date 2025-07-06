"use client";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  X as CloseIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import StudentSidebar from "@/components/student-sidebar";
import { time } from "console";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/sidebar";

export default function StudentSchedulePage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  // Calendar and events states
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Calendar view states
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear() + 543
  ); // Buddhist year
  const [currentMonth, setCurrentMonth] = useState("");
  const [calendarDays, setCalendarDays] = useState<any[]>([]);

  // Modal state removed, using selectedEvent and isModalOpen instead

  // Days of the week and month names in Thai
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

  useEffect(() => {
    // Mock fetch calendar data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Generate calendar days for the current month
    const daysInMonth = new Date(
      currentYear - 543,
      currentMonthIndex + 1,
      0
    ).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    setCalendarDays(daysArray);
  }, [currentMonthIndex, currentYear]);

  // Function to get calendar day class based on appointments
  const getCalendarDayClass = (day: number) => {
    // Check if there are appointments on this day
    const hasAppointment = events.some((event) => {
      const eventDay = Number.parseInt(event.date.split(" ")[0]);
      return eventDay === day && event.date.includes("มิถุนายน 2567");
    });

    if (hasAppointment) {
      return "bg-blue-50 border-blue-200";
    }

    return "";
  };

  // Function to get appointments for a specific day
  const getAppointmentsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDay = Number.parseInt(event.date.split(" ")[0]);
      return eventDay === day && event.date.includes("มิถุนายน 2567");
    });
  };

  // Function to handle month change
  const handleMonthChange = (increment: number) => {
    setCurrentMonthIndex((prev) => {
      const newIndex = prev + increment;
      if (newIndex < 0) {
        setCurrentYear((year) => year - 1);
        return 11;
      } else if (newIndex > 11) {
        setCurrentYear((year) => year + 1);
        return 0;
      }
      return newIndex;
    });
  };

  // Function to handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) =>
          event.title.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  // Function to generate calendar days for the current month
  const generateCalendarDays = () => {
    // Convert BE year to CE year for JavaScript Date
    const ceYear = currentYear - 543;
    console.log("Generating calendar for:", ceYear, currentMonthIndex);

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
        if (!event || !event.day || !event.month || !event.year) return false;

        const eventDay = event.day;
        const eventMonth = event.month;
        const eventYear = event.year;

        return (
          eventDay === day &&
          eventMonth === currentMonthIndex + 1 &&
          eventYear === currentYear
        );
      });

      days.push({ day, events: dayEvents });
    }

    setCalendarDays(days);
    setCurrentMonth(`${monthNames[currentMonthIndex]} ${currentYear}`);
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
    const today = new Date();
    setCurrentMonthIndex(today.getMonth());
    setCurrentYear(today.getFullYear() + 543); // Buddhist Era
  };

  // Filter events based on search term
  const filterEvents = () => {
    if (!events || events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    let filtered = [...events];

    // Filter by search term if one is entered
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          (event.title && event.title.toLowerCase().includes(search)) ||
          (event.description &&
            event.description.toLowerCase().includes(search)) ||
          (event.category && event.category.toLowerCase().includes(search)) ||
          (event.date && event.date.toLowerCase().includes(search))
      );
    }

    setFilteredEvents(filtered);
  };

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
    if (!apiEvents || !Array.isArray(apiEvents)) {
      console.error("Invalid events data:", apiEvents);
      return [];
    }

    return apiEvents
      .map((event) => {
        try {
          if (!event || !event.event_date) {
            console.error("Event missing required data:", event);
            return null;
          }

          // Parse the event_date
          const eventDate = new Date(event.event_date);

          // Validate date is valid
          if (isNaN(eventDate.getTime())) {
            console.error("Invalid date in event:", event);
            return null;
          }

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

          const formattedEvent = {
            ...event,
            date: dateString,
            category: mapTypeToCategory(event.type_id),
            status: mapStatusToString(event.status_id),
            day,
            month,
            year,
          };

          return formattedEvent;
        } catch (err) {
          console.error("Error formatting event:", event, err);
          return null;
        }
      })
      .filter(Boolean); // Remove null entries
  };

  // Function to format API supervision data
  const formatSupervisionData = (supervisions: any[]): any[] => {
    if (!supervisions || !Array.isArray(supervisions)) {
      console.error("Invalid supervision data:", supervisions);
      return [];
    }

    return supervisions
      .map((supervision) => {
        try {
          if (!supervision || !supervision.scheduled_date) {
            console.error("Supervision missing required data:", supervision);
            return null;
          }

          // Parse the visit_date
          const visitDate = new Date(supervision.scheduled_date);

          // Validate date is valid
          if (isNaN(visitDate.getTime())) {
            console.error("Invalid date in supervision:", supervision);
            return null;
          }

          const day = visitDate.getDate();
          const month = visitDate.getMonth() + 1; // JavaScript months are 0-indexed
          const year = visitDate.getFullYear() + 543; // Convert to Buddhist Era

          // Format the date string for display
          const dateOptions: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "short",
            year: "numeric",
          };
          const dateString = visitDate.toLocaleDateString("th-TH", dateOptions);

          // Create a formatted event from supervision data
          const formattedEvent = {
            ...supervision,
            id: `supervision-${
              supervision.supervision_id || supervision.id || Math.random()
            }`,
            title: `นิเทศ : ${supervision.student_name}`,
            description: `นิเทศ ${supervision.student_name} โดย ${supervision.advisor_name} ที่ ${supervision.company_name}`,
            event_date: supervision.visit_date,
            date: dateString,
            category: "การนิเทศ", // Fixed category for supervision
            type_id: 3, // Assuming 3 is for "การนิเทศ" based on mapTypeToCategory
            status: "upcoming", // Default status
            day,
            month,
            year,
            time: `${supervision.start_time} - ${supervision.end_time}`, // Assuming start_time and end_time are in HH:mm format
            is_supervision: true, // Flag to identify as supervision record
            location: supervision.company_name,
            calendar_name: supervision.calendar_name || "ปฏิทินการนิเทศ",
            semester: supervision.semester || "",
            year: supervision.year || year,
          };

          return formattedEvent;
        } catch (err) {
          console.error("Error formatting supervision:", supervision, err);
          return null;
        }
      })
      .filter(Boolean); // Remove null entries
  };

  // Function to get badge color based on category
  const getBadgeColor = (category: string, isSupervision?: boolean) => {
    // Special case for supervision events
    if (isSupervision) {
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
    }

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

  // Function to render event dot in calendar
  const renderEventDot = (category: string, isSupervision?: boolean) => {
    let bgColor = "bg-gray-400";

    // Special case for supervision events
    if (isSupervision) {
      bgColor = "bg-indigo-500";
    } else {
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
    }

    return <div className={`h-2 w-2 rounded-full ${bgColor} mr-1`}></div>;
  };

  // Fetch calendar and events data for the student
  const fetchData = async () => {
    setLoading(true);
    try {
      // Replace '258' with the actual student ID
      const studentId = user?.id; // This should come from authentication context in a real app

      const response = await fetch(`/api/calendar/student/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log("Fetched calendar data:", data);

        // Process both events and supervisions
        let allEvents: any[] = [];

        // Process regular events
        if (data.event && Array.isArray(data.event)) {
          // Log the first event to check structure
          if (data.event.length > 0) {
            console.log("Event data structure example:", data.event[0]);
          }

          const formattedEvents = formatEventData(data.event);
          allEvents = [...formattedEvents];
        }

        // Process supervision events if available
        if (data.supervision && Array.isArray(data.supervision)) {
          // Log the first supervision to check structure
          if (data.supervision.length > 0) {
            console.log(
              "Supervision data structure example:",
              data.supervision[0]
            );
          }

          const formattedSupervisions = formatSupervisionData(data.supervision);
          allEvents = [...allEvents, ...formattedSupervisions];
        }

        // order by event_date
        allEvents.sort((a, b) => {
          const dateA = new Date(a.event_date || a.scheduled_date);
          const dateB = new Date(b.event_date || b.scheduled_date);
          return dateB.getTime() - dateA.getTime();
        });

        if (allEvents.length > 0) {
          setEvents(allEvents);
          setFilteredEvents(allEvents);
        } else {
          console.log("No events or supervisions data found");
          setEvents([]);
          setFilteredEvents([]);
        }
      } else {
        console.error("API returned error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Generate calendar days when month/year changes or events load
  useEffect(() => {
    if (events.length > 0) {
      generateCalendarDays();
    }
  }, [currentMonthIndex, currentYear, events]);

  // Filter events when search term changes
  useEffect(() => {
    filterEvents();
  }, [searchTerm, events]);

  // Handle event modal
  const openDialog = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeDialog = () => {
    setIsModalOpen(false);
    // Clear selected event after dialog close animation completes
    setTimeout(() => setSelectedEvent(null), 300);
  };

  // Format time for display - ensures consistent result on both server and client
  const formatTime = (dateString: string) => {
    if (!dateString) return "ไม่ระบุเวลา";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "รูปแบบเวลาไม่ถูกต้อง";

      // Using explicit string formatting instead of toLocaleTimeString for consistent output
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "ไม่สามารถแสดงเวลาได้";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="schedule" userType="student" />

          <div className="md:col-span-4">
            {loading && <Loading />}

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
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="calendar">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <TabsList>
                      <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
                      <TabsTrigger value="list">รายการกิจกรรม</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="ค้นหากิจกรรม..."
                          className="pl-10 pr-4 py-2 border rounded-md w-full"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
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
                            key={`header-${index}`}
                            className="text-center font-medium py-2 text-sm"
                          >
                            {day}
                          </div>
                        ))}

                        {loading ? (
                          <div className="col-span-7 text-center py-12 text-gray-500">
                            กำลังโหลดปฏิทิน...
                          </div>
                        ) : calendarDays && calendarDays.length > 0 ? (
                          calendarDays.map((day, index) => (
                            <div
                              key={`day-${index}`}
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
                                    {day.events && day.events.length > 0 ? (
                                      <>
                                        {day.events
                                          .slice(0, 2)
                                          .map(
                                            (event: any, eventIdx: number) => (
                                              <div
                                                key={`event-${eventIdx}`}
                                                className={`p-1 text-xs rounded truncate  ${
                                                  event.category === "สำคัญ"
                                                    ? "bg-red-100 text-red-800"
                                                    : event.category ===
                                                      "กำหนดส่ง"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : event.category ===
                                                      "การนิเทศ"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : event.category ===
                                                      "การนำเสนอ"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                                onClick={() =>
                                                  openDialog(event)
                                                }
                                              >
                                                <div className="flex items-center">
                                                  {event.title}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                  {event.calendar_name} [
                                                  {event.semester}/{event.year}]
                                                </div>
                                              </div>
                                            )
                                          )}
                                        {day.events.length > 2 && (
                                          <div className="text-xs text-gray-500 pl-1">
                                            + {day.events.length - 2}{" "}
                                            กิจกรรมเพิ่มเติม
                                          </div>
                                        )}
                                      </>
                                    ) : null}
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="col-span-7 text-center py-12 text-gray-500">
                            ไม่พบกิจกรรมในปฏิทิน
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="list">
                    <div className="space-y-6">
                      {/* Active/Upcoming Events */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          รายการกิจกรรม
                        </h3>
                        {filteredEvents.filter(
                          (event) => event.status === "upcoming"
                        ).length > 0 ? (
                          <div className="space-y-4">
                            {filteredEvents.map((event) => (
                              <Card
                                key={event.id}
                                className="hover:border-blue-300 transition-colors cursor-pointer"
                                onClick={() => openDialog(event)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div>
                                      <h4 className="font-medium">
                                        {event.title}
                                      </h4>
                                      <div>
                                        {event.calendar_name} ภาคการศึกษาที่ (
                                        {event.semester} / {event.year})
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {event.description}
                                      </p>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                          <CalendarIcon className="h-4 w-4 mr-1" />
                                          {event.date}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <ClockIcon className="h-4 w-4 mr-1" />
                                          {event.is_supervision
                                            ? event.time
                                            : formatTime(event.event_date)}
                                        </div>
                                        {event.location && (
                                          <div className="flex items-center text-sm text-gray-500">
                                            <MapPinIcon className="h-4 w-4 mr-1" />
                                            {event.location}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                                      <Badge
                                        className={getBadgeColor(
                                          event.category,
                                          event.is_supervision
                                        )}
                                      >
                                        {event.is_supervision
                                          ? "การนิเทศ"
                                          : event.category}
                                      </Badge>
                                      {event.is_supervision && (
                                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
                                          นิเทศโดยอาจารย์
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-md">
                            <p className="text-gray-500">
                              ไม่มีกิจกรรมที่กำลังจะมาถึง
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Event Detail Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            // Clear selected event after dialog closes
            setTimeout(() => setSelectedEvent(null), 300);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl">
                    {selectedEvent.title}
                  </DialogTitle>
                </div>
                {/* Move Badge outside DialogDescription to prevent <p> inside <p> */}
                <div className="pt-2 gap-2 flex flex-wrap">
                  <Badge
                    className={getBadgeColor(
                      selectedEvent.category,
                      selectedEvent.is_supervision
                    )}
                  >
                    {selectedEvent.is_supervision
                      ? "การนิเทศ"
                      : selectedEvent.category}
                  </Badge>
                  {selectedEvent.is_supervision ? (
                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
                      นิเทศโดยอาจารย์
                    </Badge>
                  ) : selectedEvent.status === "active" ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      กำลังดำเนินการ
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      กำลังจะมาถึง
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <p className="text-gray-700">{selectedEvent.description}</p>

                <div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>วันที่: {selectedEvent.date}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>
                      เวลา:{" "}
                      {selectedEvent.is_supervision
                        ? selectedEvent.time
                        : formatTime(selectedEvent.event_date)}
                    </span>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      <span>สถานที่: {selectedEvent.location}</span>
                    </div>
                  )}

                  {selectedEvent.visit_location && !selectedEvent.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      <span>สถานที่: {selectedEvent.visit_location}</span>
                    </div>
                  )}

                  {selectedEvent.calendar_name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>
                        ปฏิทิน: {selectedEvent.calendar_name}
                        {selectedEvent.semester && selectedEvent.year && (
                          <>
                            {" "}
                            ภาคการศึกษาที่ ({selectedEvent.semester} /{" "}
                            {selectedEvent.year})
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {selectedEvent.is_supervision && (
                    <>
                      {selectedEvent.advisor_name && (
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                          <UsersIcon className="h-4 w-4 mr-2" />
                          <span>
                            อาจารย์นิเทศ: {selectedEvent.advisor_name}
                          </span>
                        </div>
                      )}

                      {selectedEvent.visit_type && (
                        <div className="flex items-center text-sm text-gray-600">
                          <VideoIcon className="h-4 w-4 mr-2" />
                          <span>
                            รูปแบบ:{" "}
                            {selectedEvent.visit_type === "online"
                              ? "ออนไลน์"
                              : "ลงพื้นที่"}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
