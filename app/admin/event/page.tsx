"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminSidebar from "@/components/admin-sidebar";
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
  Calendar,
  Clock,
  Edit,
  FilePlus,
  MapPin,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Event = {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  calendar_id: number;
  type_id: number;
  status_id: number;
  created_at?: string;
};

type Calendar = {
  id: number;
  name: string;
  semester: number;
  year: number;
};

export default function Page() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchCalendars();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const response = await fetch("/api/event");
      if (!response.ok) {
        toast({
          title: "ไม่สามารถโหลดข้อมูลได้",
          description: "เกิดข้อผิดพลาดในการดึงข้อมูล",
          variant: "destructive",
        });
        return;
      }
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        toast({
          title: "ไม่สามารถโหลดข้อมูลได้",
          description: data.message || "เกิดข้อผิดพลาด",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchCalendars() {
    try {
      const response = await fetch("/api/calendar");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      if (data.success) {
        setCalendars(data.data);
      }
    } catch (error) {
      console.error("Error fetching calendars:", error);
    }
  }

  async function deleteEvent() {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`/api/event/${selectedEvent.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "ลบกิจกรรมสำเร็จ",
          description: "ลบข้อมูลกิจกรรมเรียบร้อยแล้ว",
          variant: "success",
        });
        fetchEvents(); // Refresh the events list
      } else {
        toast({
          title: "ลบกิจกรรมไม่สำเร็จ",
          description: data.message || "เกิดข้อผิดพลาด",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบกิจกรรมได้",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  }

  function formatDate(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getCalendarName(calendarId: number) {
    const calendar = calendars.find((c) => c.id === calendarId);
    return calendar
      ? `${calendar.name} (${calendar.semester}/${calendar.year})`
      : "-";
  }

  function getEventTypeName(typeId: number) {
    const types: Record<number, string> = {
      1: "การประชุม",
      2: "อบรม",
      3: "สัมมนา",
      4: "นำเสนอผลงาน",
      5: "ประเมินผล",
      6: "อื่นๆ",
    };
    return types[typeId] || "ไม่ระบุ";
  }

  function getStatusBadge(statusId: number) {
    let color = "";
    let text = "";

    switch (statusId) {
      case 1:
        color = "bg-blue-500";
        text = "กำลังดำเนินการ";
        break;
      case 2:
        color = "bg-yellow-500";
        text = "กำลังจะมาถึง";
        break;
      case 3:
        color = "bg-green-500";
        text = "เสร็จสิ้น";
        break;
      case 4:
        color = "bg-red-500";
        text = "ยกเลิก";
        break;
      default:
        color = "bg-gray-500";
        text = "ไม่ระบุ";
    }

    return <Badge className={color}>{text}</Badge>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <AdminSidebar activePage="event" />

          <div className="md:col-span-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>กิจกรรมฝึกงาน</CardTitle>
                  <CardDescription>
                    จัดการกิจกรรมที่เกี่ยวข้องกับฝึกงาน
                  </CardDescription>
                </div>
                <Link href="/admin/event/add/0">
                  <Button className="flex gap-1">
                    <Plus className="h-4 w-4" />
                    เพิ่มกิจกรรม
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-10">
                    <FilePlus className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      ไม่พบข้อมูลกิจกรรม
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      เริ่มสร้างกิจกรรมใหม่โดยการคลิกปุ่มเพิ่มกิจกรรม
                    </p>
                    <div className="mt-6">
                      <Link href="/admin/event/add/0">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          เพิ่มกิจกรรม
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">ชื่อกิจกรรม</TableHead>
                        <TableHead>รอบฝึกงาน</TableHead>
                        <TableHead>ประเภทกิจกรรม</TableHead>
                        <TableHead>วันที่</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead className="text-right">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            <div>{event.title}</div>
                            {event.location && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {getCalendarName(event.calendar_id)}
                          </TableCell>
                          <TableCell>
                            {getEventTypeName(event.type_id)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(event.event_date)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(event.status_id)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <Link href={`/admin/event/edit/${event.id}`}>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    แก้ไข
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  ลบ
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ลบกิจกรรม</DialogTitle>
            <DialogDescription>
              คุณต้องการลบกิจกรรม "{selectedEvent?.title}" ใช่หรือไม่?
              การกระทำนี้ไม่สามารถเปลี่ยนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={deleteEvent}>
              ลบกิจกรรม
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
