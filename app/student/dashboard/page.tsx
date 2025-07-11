"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/sidebar";
import {
  Bell,
  BookOpen,
  Briefcase,
  BuildingIcon,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState<any>([]);
  useEffect(() => {
    if (isLoading || !user) return;
    fetchData();
  }, [isLoading, user]);
  async function fetchData() {
    if (!user) return;
    setLoading(true);
    const url = `/api/student/${user.id}/dashboard`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const res = await response.json();
    if (res.success) {
      setCalendars(res.calendar);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="dashboard" userType="student" />

          <div className="md:col-span-4 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  แดชบอร์ดนักศึกษา
                </h1>
                <p className="text-gray-600">
                  ยินดีต้อนรับ {user?.fullname || "นักศึกษา"} สู่ระบบการฝึกงาน
                </p>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 mb-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">
                        การฝึกงานทั้งหมด
                      </p>
                      <p className="text-2xl font-bold">{calendars.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">
                        อาจารย์นิเทศ
                      </p>
                      <p className="text-2xl font-bold">
                        {calendars.reduce(
                          (total: number, cal: any) =>
                            total + (cal.supervision?.length || 0),
                          0
                        )}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Internship History Card */}
            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  ประวัติการฝึกงาน
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  ดูประวัติการฝึกงานและบริษัทที่เคยร่วมงาน
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {calendars.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ยังไม่มีประวัติการฝึกงาน
                      </h3>
                      <p className="text-gray-500 mb-4">
                        เริ่มต้นการฝึกงานครั้งแรกของคุณ
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        สมัครฝึกงาน
                      </Button>
                    </div>
                  ) : (
                    calendars.map((calendar: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-16 w-16 rounded-xl border-2 border-gray-200 shadow-md group-hover:border-blue-300 transition-colors">
                                <AvatarImage
                                  src={calendar.company_image}
                                  alt={calendar.company_name}
                                  className="object-cover"
                                />
                                <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-lg font-semibold">
                                  <BuildingIcon className="h-8 w-8" />
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                    {calendar.name}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className="w-fit text-xs px-2 py-1"
                                  >
                                    ปีการศึกษา {calendar.semester}/
                                    {calendar.year}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(
                                      calendar.start_date
                                    ).toLocaleDateString("th-TH", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                      calendar.end_date
                                    ).toLocaleDateString("th-TH", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>

                                <div className="bg-white rounded-lg p-3 border border-gray-100">
                                  <div className="flex items-center gap-3 mb-2">
                                    <BuildingIcon className="h-5 w-5 text-blue-600" />
                                    <span className="font-semibold text-gray-900 hover:text-blue-700 cursor-pointer">
                                      {calendar.company_name}
                                    </span>
                                  </div>

                                  {calendar.company_location && (
                                    <div className="text-sm text-gray-600 mb-2">
                                      📍 {calendar.company_location}
                                    </div>
                                  )}

                                  {(calendar.company_contact_name ||
                                    calendar.company_contact_position) && (
                                    <div className="text-sm text-gray-600 mb-3">
                                      <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>
                                          {calendar.company_contact_name}{" "}
                                          {calendar.company_contact_position}
                                        </span>
                                      </div>
                                      {calendar.company_contact_phone && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          📞 {calendar.company_contact_phone}
                                        </div>
                                      )}
                                      {calendar.company_contact_email && (
                                        <div className="text-xs text-gray-500">
                                          ✉️ {calendar.company_contact_email}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Advisor/Supervision Section */}
                                  {calendar.supervision &&
                                    calendar.supervision.length > 0 && (
                                      <div className="border-t border-gray-100 pt-3 mt-3">
                                        <div className="flex items-center gap-2 mb-3">
                                          <div className="bg-green-100 p-1.5 rounded-full">
                                            <Users className="h-4 w-4 text-green-600" />
                                          </div>
                                          <span className="font-semibold text-gray-900">
                                            อาจารย์นิเทศ
                                          </span>
                                        </div>

                                        {calendar.supervision.map(
                                          (
                                            supervision: any,
                                            supervisionIndex: number
                                          ) => (
                                            <div
                                              key={supervisionIndex}
                                              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-2 border border-green-100"
                                            >
                                              <div className="flex items-start gap-3">
                                                <Avatar className="h-12 w-12 rounded-lg border-2 border-green-200 shadow-sm">
                                                  <AvatarImage
                                                    src={
                                                      supervision.advisor_image
                                                    }
                                                    alt={
                                                      supervision.advisor_name
                                                    }
                                                    className="object-cover"
                                                  />
                                                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 font-semibold text-sm">
                                                    {supervision.advisor_name
                                                      ?.split(" ")
                                                      .map((n: string) => n[0])
                                                      .join("")
                                                      .substring(0, 2)}
                                                  </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                  <div className="font-semibold text-gray-900 mb-1">
                                                    {supervision.advisor_name}
                                                  </div>

                                                  {/* Supervision Schedule */}
                                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                    <Calendar className="h-3.5 w-3.5 text-green-600" />
                                                    <span>
                                                      {new Date(
                                                        supervision.scheduled_date
                                                      ).toLocaleDateString(
                                                        "th-TH",
                                                        {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                        }
                                                      )}
                                                    </span>
                                                    <Clock className="h-3.5 w-3.5 text-green-600 ml-2" />
                                                    <span>
                                                      {supervision.start_time} -{" "}
                                                      {supervision.end_time}
                                                    </span>
                                                  </div>

                                                  {/* Visit Type Badge */}
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <Badge
                                                      variant="outline"
                                                      className={`text-xs px-2 py-1 ${
                                                        supervision.visit_type ===
                                                        "online"
                                                          ? "bg-blue-50 border-blue-200 text-blue-700"
                                                          : "bg-orange-50 border-orange-200 text-orange-700"
                                                      }`}
                                                    >
                                                      {supervision.visit_type ===
                                                      "online"
                                                        ? "🖥️ ออนไลน์"
                                                        : "🏢 เยี่ยมสถานประกอบการ"}
                                                    </Badge>
                                                  </div>

                                                  {/* Contact Information */}
                                                  <div className="space-y-1">
                                                    {supervision.advisor_mobile && (
                                                      <div className="text-xs text-gray-600 flex items-center gap-1">
                                                        <span>📱</span>
                                                        <span>
                                                          {
                                                            supervision.advisor_mobile
                                                          }
                                                        </span>
                                                      </div>
                                                    )}
                                                    {supervision.advisor_email && (
                                                      <div className="text-xs text-gray-600 flex items-center gap-1">
                                                        <span>✉️</span>
                                                        <span>
                                                          {
                                                            supervision.advisor_email
                                                          }
                                                        </span>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Advisor Meetings */}
            {calendars.some(
              (cal: any) => cal.supervision && cal.supervision.length > 0
            ) && (
              <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Clock className="h-6 w-6" />
                    </div>
                    การนัดหมายอาจารย์นิเทศ
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    ตารางการนิเทศและการติดตามผลการฝึกงาน
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {calendars.map((calendar: any, index: number) =>
                      calendar.supervision &&
                      calendar.supervision.length > 0 ? (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-sm">
                              {calendar.name} {calendar.semester}/
                              {calendar.year}
                            </Badge>
                          </div>

                          {calendar.supervision.map(
                            (supervision: any, supervisionIndex: number) => {
                              const meetingDate = new Date(
                                supervision.scheduled_date
                              );
                              const isUpcoming = meetingDate > new Date();
                              const isPast = meetingDate < new Date();

                              return (
                                <div
                                  key={supervisionIndex}
                                  className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                                    isUpcoming
                                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-md"
                                      : isPast
                                      ? "bg-gray-50 border-gray-200"
                                      : "bg-blue-50 border-blue-200"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <Avatar className="h-14 w-14 rounded-xl border-2 border-white shadow-lg">
                                        <AvatarImage
                                          src={supervision.advisor_image}
                                          alt={supervision.advisor_name}
                                          className="object-cover"
                                        />
                                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 font-bold">
                                          {supervision.advisor_name
                                            ?.split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .substring(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>

                                      <div>
                                        <h4 className="font-bold text-gray-900 text-lg">
                                          {supervision.advisor_name}
                                        </h4>
                                        <div className="flex items-center gap-4 mt-1">
                                          <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                              {meetingDate.toLocaleDateString(
                                                "th-TH",
                                                {
                                                  weekday: "long",
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                                }
                                              )}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                              {supervision.start_time} -{" "}
                                              {supervision.end_time}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                              supervision.visit_type ===
                                              "online"
                                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                                : "bg-orange-50 border-orange-200 text-orange-700"
                                            }`}
                                          >
                                            {supervision.visit_type === "online"
                                              ? "🖥️ ออนไลน์"
                                              : "🏢 เยี่ยมสถานประกอบการ"}
                                          </Badge>

                                          <Badge
                                            className={
                                              isUpcoming
                                                ? "bg-green-500 text-white"
                                                : isPast
                                                ? "bg-gray-400 text-white"
                                                : "bg-blue-500 text-white"
                                            }
                                          >
                                            {isUpcoming
                                              ? "กำลังจะมาถึง"
                                              : isPast
                                              ? "ผ่านไปแล้ว"
                                              : "วันนี้"}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                      {supervision.advisor_mobile && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="gap-2 text-xs"
                                        >
                                          📱 โทร
                                        </Button>
                                      )}
                                      {supervision.advisor_email && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="gap-2 text-xs"
                                        >
                                          ✉️ อีเมล
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
