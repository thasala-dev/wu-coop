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
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";

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
      console.log("Fetched data:", res.data);
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
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-grow">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="ค้นหาชื่อผู้ดูแลระบบ.."
                      className="pl-8"
                      value={search}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        if (value.trim() === "") {
                          setFilterData(
                            role === "all"
                              ? data
                              : data.filter((item: any) => {
                                  return item.user_role === role;
                                })
                          );
                        } else {
                          setFilterData(
                            (role === "all"
                              ? data
                              : data.filter((item: any) => {
                                  return item.user_role === role;
                                })
                            ).filter((item: any) =>
                              item.fullname
                                ?.toLowerCase()
                                .includes(value.toLowerCase())
                            )
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <TabsList>
                  <TabsTrigger value="all">ทั้งหมด ({data.length})</TabsTrigger>
                  <TabsTrigger value="admin">
                    ผู้ดูแลระบบ (
                    {data.filter((c: any) => c.user_role === "admin").length})
                  </TabsTrigger>
                  <TabsTrigger value="student">
                    นักศึกษา (
                    {data.filter((c: any) => c.user_role === "student").length})
                  </TabsTrigger>
                  <TabsTrigger value="advisor">
                    อาจารย์ (
                    {data.filter((c: any) => c.user_role === "advisor").length})
                  </TabsTrigger>
                  <TabsTrigger value="mentor">
                    แหล่งฝึก (
                    {data.filter((c: any) => c.user_role === "mentor").length})
                  </TabsTrigger>
                </TabsList>
                <div className="rounded-md border my-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-center py-3 px-4">ผู้ใช้งาน</th>
                        <th className="text-center py-3 px-4">รายละเอียด</th>
                        <th className="text-center py-3 px-4">เวลาที่ใช้งาน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterData.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-5">
                            <i className="text-gray-300 py-4">ไม่พบข้อมูล</i>
                          </td>
                        </tr>
                      )}
                      {filterData.map((item: any) => (
                        <tr
                          key={item.id}
                          className="border-b hover:bg-gray-50 last:border-b-0"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <CustomAvatar
                                id={`${item.user_role}${item.username}`}
                                image={item.image}
                                size="12"
                              />
                              <div>
                                <div>{item.fullname}</div>
                                <div className="text-sm text-gray-500">
                                  {item.user_role === "admin"
                                    ? "ผู้ดูแลระบบ"
                                    : item.user_role === "advisor"
                                    ? "อาจารย์"
                                    : item.user_role === "student"
                                    ? "นักศึกษา"
                                    : item.user_role === "mentor"
                                    ? "แหล่งฝึก"
                                    : "ไม่ทราบ"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">{item.title}</td>
                          <td className="py-3 px-4 text-center">
                            {
                              <div className="text-sm text-gray-500">
                                {item.created_at ? (
                                  new Date(item.created_at).toLocaleString(
                                    "th-TH",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    }
                                  )
                                ) : (
                                  <i>ไม่สามารถระบุได้</i>
                                )}
                              </div>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
