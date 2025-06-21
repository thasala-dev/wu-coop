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
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";
import TableList from "@/components/TableList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  useEffect(() => {
    fetchData();
  }, []);

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
    const response = await fetch("/api/log", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Logs</CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto mb-1">
                  <TabsList>
                    <TabsTrigger value="all">
                      ทั้งหมด ({data.length})
                    </TabsTrigger>
                    <TabsTrigger value="admin">
                      ผู้ดูแลระบบ (
                      {data.filter((c: any) => c.user_role === "admin").length})
                    </TabsTrigger>
                    <TabsTrigger value="student">
                      นักศึกษา (
                      {
                        data.filter((c: any) => c.user_role === "student")
                          .length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="advisor">
                      อาจารย์ (
                      {
                        data.filter((c: any) => c.user_role === "advisor")
                          .length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="mentor">
                      แหล่งฝึก (
                      {data.filter((c: any) => c.user_role === "mentor").length}
                      )
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="my-4 overflow-x-auto">
                  <TableList
                    meta={[
                      {
                        key: "id",
                        content: "ผู้ใช้งาน",
                        render: (row: any) => {
                          return (
                            <div className="flex items-center gap-3">
                              {row.user_role === "mentor" ? (
                                <Avatar className="h-8 w-8 rounded-md border border-gray-200">
                                  <AvatarImage src={row.image} alt={row.name} />
                                  <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                                    <Building className="h-6 w-6 text-gray-500" />
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <CustomAvatar
                                  id={`${row.user_role}${row.username}`}
                                  image={row.image}
                                  size="8"
                                />
                              )}

                              <div>
                                <div>{row.fullname}</div>
                              </div>
                            </div>
                          );
                        },
                      },
                      {
                        key: "user_role",
                        content: "ประเภทผู้ใช้งาน",
                        render: (row: any) => {
                          return (
                            <>
                              {row.user_role === "admin"
                                ? "ผู้ดูแลระบบ"
                                : row.user_role === "advisor"
                                ? "อาจารย์"
                                : row.user_role === "student"
                                ? "นักศึกษา"
                                : row.user_role === "mentor"
                                ? "แหล่งฝึก"
                                : "ไม่ทราบ"}
                            </>
                          );
                        },
                      },
                      {
                        key: "title",
                        content: "รายละเอียด",
                      },
                      {
                        key: "created_at",
                        width: "150px",
                        content: "เวลาที่ใช้งาน",
                        render: (row: any) => {
                          return new Date(row.created_at).toLocaleString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
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
