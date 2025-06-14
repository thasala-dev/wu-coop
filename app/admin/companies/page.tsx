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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Sidebar activePage="companies" userType="admin" />
        {loading && <Loading />}

        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light tracking-tight text-gray-900">
              จัดการข้อมูลแหล่งฝึกงาน
            </h1>
            <a href={`/admin/companies/add`}>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                เพิ่มบริษัทใหม่
              </Button>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="ค้นหาแหล่งฝึกงาน.." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="active">ใช้งาน</SelectItem>
                  <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                  <SelectItem value="pending">รอดำเนินการ</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="ประเภทแหล่งฝึก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="tech">เทคโนโลยีสารสนเทศ</SelectItem>
                  <SelectItem value="pharma">เภสัชกรรม</SelectItem>
                  <SelectItem value="energy">พลังงาน</SelectItem>
                  <SelectItem value="food">อาหารและเครื่องดื่ม</SelectItem>
                  <SelectItem value="logistics">โลจิสติกส์</SelectItem>
                  <SelectItem value="marketing">การตลาด</SelectItem>
                  <SelectItem value="construction">ก่อสร้าง</SelectItem>
                  <SelectItem value="medical">การแพทย์และสุขภาพ</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs value={role} onValueChange={setRole} className="w-full">
            <TabsList>
              <TabsTrigger value="all">ทั้งหมด ({data.length})</TabsTrigger>
              <TabsTrigger value="active">
                ใช้งาน ({data.filter((c: any) => c.status_id === 1).length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                ไม่ใช้งาน ({data.filter((c: any) => c.status_id === 2).length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                รอดำเนินการ ({data.filter((c: any) => c.status_id === 0).length}
                )
              </TabsTrigger>
            </TabsList>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  {role === "all"
                    ? "รายชื่อแหล่งฝึกงานทั้งหมด"
                    : role === "active"
                    ? "รายชื่อแหล่งฝึกงานที่ใช้งานอยู่"
                    : role === "inactive"
                    ? "รายชื่อแหล่งฝึกงานที่ไม่ใช้งาน"
                    : "รายชื่อแหล่งฝึกงานที่รอดำเนินการ"}
                </CardTitle>
                <CardDescription>
                  รายชื่อแหล่งฝึกงานที่ร่วมโครงการสหกิจศึกษาทั้งหมด
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">แหล่งฝึกงาน</th>
                        <th className="text-left py-3 px-4">ประเภทแหล่งฝึก</th>
                        <th className="text-left py-3 px-4">ที่ตั้ง</th>
                        <th className="text-left py-3 px-4">นักศึกษา</th>
                        <th className="text-left py-3 px-4">สถานะ</th>
                        <th className="text-left py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterData.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <p className="text-gray-500">
                              ไม่พบข้อมูลแหล่งฝึกงาน
                            </p>
                          </td>
                        </tr>
                      )}
                      {filterData.map((company: any) => (
                        <tr
                          key={company.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                <BuildingIcon className="h-6 w-6 text-gray-500" />
                              </div>
                              <div>
                                <Link
                                  href={`/admin/companies/${company.id}`}
                                  className="font-medium hover:underline"
                                >
                                  {company.name}
                                </Link>
                                <div className="text-sm text-gray-500">
                                  {company.contact_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <BuildingIcon className="h-4 w-4 text-gray-500" />
                              <span>
                                {companyType.find(
                                  (t) => t.value === company.business_type
                                )?.label || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4 text-gray-500" />
                              <span>{company.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <UsersIcon className="h-4 w-4 text-gray-500" />
                              <span>
                                {company.activeStudents || 0} /
                                {company.studentCapacity || 0}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {renderStatusBadge(String(company.status_id))}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/companies/${company.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              <Link
                                href={`/admin/companies/edit/${company.id}`}
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
