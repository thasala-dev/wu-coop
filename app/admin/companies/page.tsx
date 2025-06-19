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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BuildingIcon,
  MapPinIcon,
  UsersIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  MoreHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import Link from "next/link";
import { companyType } from "@/lib/global";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import TableList from "@/components/TableList";

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [role, setRole] = useState("all");
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (role === "all") {
      setFilterData(data);
    } else if (role === "active") {
      setFilterData(data.filter((item: any) => item.status_id === 1));
    } else if (role === "inactive") {
      setFilterData(data.filter((item: any) => item.status_id === 2));
    } else if (role === "pending") {
      setFilterData(data.filter((item: any) => item.status_id === 0));
    }
  }, [data, role]);

  async function fetchData() {
    const response = await fetch("/api/company", {
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

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "1":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircleIcon className="h-3 w-3 mr-1" /> ใช้งาน
          </Badge>
        );
      case "2":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircleIcon className="h-3 w-3 mr-1" /> ไม่ใช้งาน
          </Badge>
        );
      case "0":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <ClockIcon className="h-3 w-3 mr-1" /> รอดำเนินการ
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Sidebar activePage="companies" userType="admin" />
        {loading && <Loading />}

        <div className="md:col-span-4 space-y-4">
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      จัดการข้อมูลแหล่งฝึกงาน
                    </CardTitle>
                    <CardDescription>
                      รายชื่อแหล่งฝึกงานที่ร่วมโครงการสหกิจศึกษาทั้งหมด
                    </CardDescription>
                  </div>
                  <a href={`/admin/companies/add`}>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      สร้างรอบใหม่
                    </Button>
                  </a>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-grow">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="ค้นหาแหล่งฝึกงาน.." className="pl-8" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <TabsList>
                    <TabsTrigger value="all">
                      ทั้งหมด ({data.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                      ใช้งาน (
                      {data.filter((c: any) => c.status_id === 1).length})
                    </TabsTrigger>
                    <TabsTrigger value="inactive">
                      ไม่ใช้งาน (
                      {data.filter((c: any) => c.status_id === 2).length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      รอดำเนินการ (
                      {data.filter((c: any) => c.status_id === 0).length})
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="my-4 overflow-x-auto">
                  <TableList
                    meta={[
                      {
                        key: "id",
                        content: "รายการ",
                        render: (row: any) => {
                          return (
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 rounded-md border border-gray-200">
                                <AvatarImage src={row.image} alt={row.name} />
                                <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                                  <BuildingIcon className="h-6 w-6 text-gray-500" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <Link
                                  href={`/admin/companies/${row.id}`}
                                  className="font-medium hover:underline"
                                >
                                  {row.name}
                                </Link>
                                <div className="text-sm text-gray-500">
                                  {row.contact_name}
                                </div>
                              </div>
                            </div>
                          );
                        },
                      },
                      {
                        key: "business_type",
                        content: "ประเภทแหล่งฝึก",
                        render: (row: any) => {
                          return (
                            <div className="flex items-center gap-1">
                              <BuildingIcon className="h-4 w-4 text-gray-500" />
                              <span>
                                {companyType.find(
                                  (t) => t.value === row.business_type
                                )?.label || "-"}
                              </span>
                            </div>
                          );
                        },
                      },
                      {
                        key: "location",
                        content: "ที่ตั้ง",
                        render: (row: any) => {
                          return (
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4 text-gray-500" />
                              <span>{row.location}</span>
                            </div>
                          );
                        },
                      },
                      {
                        key: "total_intern",
                        content: "นักศึกษา",
                        render: (row: any) => {
                          return (
                            <div className="flex items-center gap-1">
                              <UsersIcon className="h-4 w-4 text-gray-500" />
                              <span>
                                {row.total_intern || 0} /{" "}
                                {row.total_regist || 0}
                              </span>
                            </div>
                          );
                        },
                      },
                      {
                        key: "last_login",
                        content: "ใช้งานล่าสุด",
                        className: "text-center",
                        width: "150px",
                        render: (row: any) => {
                          return (
                            <div className="text-sm text-gray-500">
                              {row.last_login ? (
                                new Date(row.last_login).toLocaleString(
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
                                <i>ไม่เคยใช้งาน</i>
                              )}
                            </div>
                          );
                        },
                      },
                      {
                        key: "actions",
                        content: "จัดการ",
                        sort: false,
                        width: "150px",
                        render: (row: any) => {
                          return (
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/companies/${row.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              <Link href={`/admin/companies/edit/${row.id}`}>
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
