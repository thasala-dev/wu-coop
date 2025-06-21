"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect, use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  Trash2,
  Edit,
  Eye,
  Building,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";
import TableList from "@/components/TableList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  // Date range filter
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState<Date>(sevenDaysAgo);
  const [endDate, setEndDate] = useState<Date>(today);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (role === "all") {
      setFilterData(data);
    } else if (role === "admin") {
      setFilterData(data.filter((item: any) => item.user_role === "admin"));
    } else if (role === "student") {
      setFilterData(data.filter((item: any) => item.user_role === "student"));
    } else if (role === "advisor") {
      setFilterData(data.filter((item: any) => item.user_role === "advisor"));
    } else if (role === "mentor") {
      setFilterData(data.filter((item: any) => item.user_role === "mentor"));
    }
  }, [data, role]);

  async function fetchData() {
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    const response = await fetch(
      `/api/log?start=${startDateStr}&end=${endDateStr}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response.json();
    if (res.success) {
      setData(res.data || []);
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Sidebar activePage="logs" userType="admin" />
        {loading && <Loading />}

        <div className="md:col-span-4 space-y-4">
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <Card className="overflow-hidden border-gray-200 shadow-sm">
              {" "}
              <CardHeader className="pb-4 border-b border-gray-100 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-800">
                      บันทึกการใช้งาน
                    </CardTitle>
                    <CardDescription className="mt-1 text-gray-500">
                      ประวัติการเข้าใช้งานในระบบโดยผู้ใช้
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Date pickers */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-2 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          จาก:
                        </span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[180px] justify-start text-left font-normal border-gray-300 shadow-sm hover:bg-gray-50",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                              {startDate ? (
                                format(startDate, "d MMM yyyy", { locale: th })
                              ) : (
                                <span>เลือกวันที่เริ่มต้น</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 shadow-md rounded-md border-gray-200"
                            align="start"
                          >
                            {" "}
                            <CalendarComponent
                              selected={startDate}
                              onSelect={(date: Date | undefined | null) => {
                                if (date) {
                                  setStartDate(date);
                                }
                              }}
                              locale={th}
                              className="rounded-md"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          ถึง:
                        </span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[180px] justify-start text-left font-normal border-gray-300 shadow-sm hover:bg-gray-50",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                              {endDate ? (
                                format(endDate, "d MMM yyyy", { locale: th })
                              ) : (
                                <span>เลือกวันที่สิ้นสุด</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 shadow-md rounded-md border-gray-200"
                            align="start"
                          >
                            {" "}
                            <CalendarComponent
                              selected={endDate}
                              onSelect={(date: Date | undefined | null) => {
                                if (date) {
                                  setEndDate(date);
                                }
                              }}
                              locale={th}
                              className="rounded-md"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {" "}
                <div className="overflow-x-auto mb-4 border-b border-gray-200">
                  <TabsList className="bg-transparent p-0 h-auto">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 h-10"
                    >
                      ทั้งหมด{" "}
                      <span className="ml-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {data.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="admin"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 h-10"
                    >
                      ผู้ดูแลระบบ{" "}
                      <span className="ml-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {
                          data.filter((c: any) => c.user_role === "admin")
                            .length
                        }
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="student"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 h-10"
                    >
                      นักศึกษา{" "}
                      <span className="ml-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {
                          data.filter((c: any) => c.user_role === "student")
                            .length
                        }
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="advisor"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 h-10"
                    >
                      อาจารย์{" "}
                      <span className="ml-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {
                          data.filter((c: any) => c.user_role === "advisor")
                            .length
                        }
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="mentor"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 h-10"
                    >
                      แหล่งฝึก{" "}
                      <span className="ml-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {
                          data.filter((c: any) => c.user_role === "mentor")
                            .length
                        }
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>{" "}
                <div className="overflow-x-auto">
                  <TableList
                    meta={[
                      {
                        key: "id",
                        content: "ผู้ใช้งาน",
                        render: (row: any) => {
                          return (
                            <div className="flex items-center gap-3">
                              {row.user_role === "mentor" ? (
                                <Avatar className="h-9 w-9 rounded-md border border-gray-200 ring-1 ring-gray-100 shadow-sm">
                                  <AvatarImage src={row.image} alt={row.name} />
                                  <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                                    <Building className="h-6 w-6 text-gray-500" />
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <CustomAvatar
                                  id={`${row.user_role}${row.username}`}
                                  image={row.image}
                                  size="9"
                                />
                              )}

                              <div>
                                <div className="font-medium">
                                  {row.fullname}
                                </div>
                              </div>
                            </div>
                          );
                        },
                      },
                      {
                        key: "user_role",
                        content: "ประเภทผู้ใช้งาน",
                        render: (row: any) => {
                          const roleMap: Record<
                            string,
                            { color: string; name: string }
                          > = {
                            admin: {
                              color: "bg-blue-100 text-blue-800",
                              name: "ผู้ดูแลระบบ",
                            },
                            advisor: {
                              color: "bg-green-100 text-green-800",
                              name: "อาจารย์",
                            },
                            student: {
                              color: "bg-purple-100 text-purple-800",
                              name: "นักศึกษา",
                            },
                            mentor: {
                              color: "bg-amber-100 text-amber-800",
                              name: "แหล่งฝึก",
                            },
                          };

                          const roleInfo = roleMap[row.user_role] || {
                            color: "bg-gray-100 text-gray-800",
                            name: "ไม่ทราบ",
                          };
                          const roleColor = roleInfo.color;
                          const roleName = roleInfo.name;

                          return (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor}`}
                            >
                              {roleName}
                            </span>
                          );
                        },
                      },
                      {
                        key: "title",
                        content: "รายละเอียด",
                        render: (row: any) => {
                          return (
                            <div className="max-w-md text-sm leading-5">
                              {row.title}
                            </div>
                          );
                        },
                      },
                      {
                        key: "created_at",
                        width: "180px",
                        content: "เวลาที่ใช้งาน",
                        render: (row: any) => {
                          const date = new Date(row.created_at);
                          const now = new Date();
                          const diffTime = Math.abs(
                            now.getTime() - date.getTime()
                          );
                          const diffHours = Math.floor(
                            diffTime / (1000 * 60 * 60)
                          );

                          // Format the date
                          const formattedDate = date.toLocaleString("th-TH", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          });

                          // Show relative time indicator for recent logs
                          return (
                            <div className="flex flex-col">
                              <div className="text-gray-700">
                                {formattedDate}
                              </div>
                              {diffHours < 24 && (
                                <div className="text-xs text-green-600 font-medium flex items-center mt-0.5">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  {diffHours < 1
                                    ? "เมื่อไม่กี่นาทีที่แล้ว"
                                    : diffHours === 1
                                    ? "1 ชั่วโมงที่แล้ว"
                                    : `${diffHours} ชั่วโมงที่แล้ว`}
                                </div>
                              )}
                            </div>
                          );
                        },
                      },
                    ]}
                    data={filterData}
                    loading={loading}
                  />
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
