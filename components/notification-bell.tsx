"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// ประเภทข้อมูลสำหรับการแจ้งเตือน
interface NotificationType {
  id: number;
  code: string;
  name: string;
  icon: string;
  color: string;
}

interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // นับจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  // โหลดข้อมูลการแจ้งเตือน
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      } else {
        console.error("Error fetching notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // เมื่อคลิกที่การแจ้งเตือน
  const handleNotificationClick = async (notification: Notification) => {
    // ถ้ายังไม่ได้อ่าน ให้อัปเดตสถานะเป็นอ่านแล้ว
    if (!notification.is_read) {
      try {
        const response = await fetch(`/api/notifications/${notification.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_read: true }),
        });

        if (response.ok) {
          // อัปเดตสถานะการอ่านในข้อมูล local
          setNotifications((prevNotifications) =>
            prevNotifications.map((item) =>
              item.id === notification.id ? { ...item, is_read: true } : item
            )
          );
        }
      } catch (error) {
        console.error("Error updating notification status:", error);
      }
    }

    // ปิด popover
    setOpen(false);
  };

  // มาร์คการแจ้งเตือนทั้งหมดเป็นอ่านแล้ว
  const markAllAsRead = async () => {
    try {
      // ในอนาคตจะส่งคำขอไปยัง API เพื่ออัปเดตทั้งหมดในครั้งเดียว
      // แต่ตอนนี้เรียกทีละรายการ
      const unreadNotifications = notifications.filter(
        (notification) => !notification.is_read
      );

      for (const notification of unreadNotifications) {
        await fetch(`/api/notifications/${notification.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_read: true }),
        });
      }

      // อัปเดตสถานะการอ่านในข้อมูล local
      setNotifications((prevNotifications) =>
        prevNotifications.map((item) => ({ ...item, is_read: true }))
      );

      // แสดงข้อความแจ้งเตือน
      toast({
        title: "อ่านการแจ้งเตือนทั้งหมดแล้ว",
        description: `อ่านการแจ้งเตือน ${unreadNotifications.length} รายการแล้ว`,
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะการอ่านได้",
        variant: "destructive",
      });
    }
  };

  // ลบการแจ้งเตือน
  const deleteNotification = async (id: number, event: React.MouseEvent) => {
    // ป้องกันการ bubble event ไปยัง parent elements
    event.stopPropagation();

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // ลบออกจากข้อมูล local
        setNotifications((prevNotifications) =>
          prevNotifications.filter((item) => item.id !== id)
        );

        // แสดงข้อความแจ้งเตือน
        toast({
          title: "ลบการแจ้งเตือนแล้ว",
          description: "ลบการแจ้งเตือนเรียบร้อยแล้ว",
        });
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบการแจ้งเตือนได้",
        variant: "destructive",
      });
    }
  };

  // โหลดข้อมูลการแจ้งเตือนเมื่อ component ถูกโหลดและเมื่อ popover เปิด
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  // แสดงไอคอนตามประเภทการแจ้งเตือน
  const getNotificationIcon = (type: NotificationType) => {
    // สามารถกำหนดการแสดงไอคอนตามประเภทได้ (ในอนาคตอาจใช้ dynamic import)
    return <Bell className="h-4 w-4" />;
  };

  // แสดงวันที่ในรูปแบบที่เหมาะสม
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} นาทีที่แล้ว`;
    } else if (diffHours < 24) {
      return `${diffHours} ชั่วโมงที่แล้ว`;
    } else if (diffDays < 7) {
      return `${diffDays} วันที่แล้ว`;
    } else {
      return format(date, "d MMM yyyy", { locale: th });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 min-w-[16px] rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center px-1">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between py-2 px-4 border-b">
          <h2 className="text-sm font-medium">การแจ้งเตือน</h2>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-2"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              อ่านทั้งหมดแล้ว
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <Link href={notification.link} key={notification.id}>
                  <div
                    className={cn(
                      "flex gap-3 py-3 px-4 border-b hover:bg-gray-50 cursor-pointer",
                      !notification.is_read && "bg-blue-50"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        notification.type.color === "blue" &&
                          "bg-blue-100 text-blue-600",
                        notification.type.color === "green" &&
                          "bg-green-100 text-green-600",
                        notification.type.color === "red" &&
                          "bg-red-100 text-red-600",
                        notification.type.color === "orange" &&
                          "bg-orange-100 text-orange-600",
                        notification.type.color === "amber" &&
                          "bg-amber-100 text-amber-600"
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <h3
                          className={cn(
                            "text-sm font-medium truncate",
                            !notification.is_read && "font-semibold"
                          )}
                        >
                          {notification.title}
                        </h3>
                        <button
                          onClick={(e) =>
                            deleteNotification(notification.id, e)
                          }
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-[11px] text-gray-400 mt-1">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Bell className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">ไม่มีการแจ้งเตือนในขณะนี้</p>
            </div>
          )}
        </ScrollArea>
        <div className="py-2 px-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs w-full"
            onClick={() => setOpen(false)}
          >
            ปิด
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
