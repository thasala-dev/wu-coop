"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  BarChart3,
  Users,
  Building,
  GraduationCap,
  TrendingUp,
  Calendar,
  ChevronRight,
  Briefcase,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";

const reportMenu = [
  {
    name: "รายงานนักศึกษาตามแหล่งฝึกงานตามปีการศึกษา",
    href: "/admin/reports/studentPerYear",
    icon: Calendar,
    color: "bg-sky-500",
    description: "วิเคราะห์แนวโน้มการฝึกงานในแต่ละปีการศึกษา",
  },
  {
    name: "รายงานผลการประเมินนักศึกษา",
    href: "/admin/reports/evaluationResult",
    icon: Building,
    color: "bg-green-500",
    description: "ผลการประเมินนักศึกษาโดยแหล่งฝึก",
  },
  {
    name: "รายงานผลการนิเทศนักศึกษา",
    href: "/admin/reports/supervisionResult",
    icon: Users,
    color: "bg-yellow-500",
    description: "ผลการนิเทศนักศึกษาโดยแหล่งฝึก",
  },
  {
    name: "รายงานผลการประเมินความพึงพอใจระบบ",
    href: "/admin/reports/systemSatisfaction",
    icon: Star,
    color: "bg-purple-500",
    description: "ข้อมูลความพึงพอใจของแหล่งฝึกต่อระบบ",
  },
  // {
  //   name: "รายงานผู้ดูแลแหล่งฝึก",
  //   href: "/admin/reports/companySupervisor",
  //   icon: Users,
  //   color: "bg-orange-500",
  //   description: "รายชื่อและข้อมูลผู้ดูแลจากแหล่งฝึก",
  // },
  // {
  //   name: "รายงานผู้ดูแลนักศึกษา",
  //   href: "/admin/reports/studentSupervisor",
  //   icon: TrendingUp,
  //   color: "bg-red-500",
  //   description: "ข้อมูลอาจารย์ที่ดูแลนักศึกษาในการฝึกงาน",
  // },
];

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalAdvisors, setTotalAdvisors] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter reports based on search query
  const filteredReports = reportMenu.filter(
    (report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await fetch("/api/report");
        if (!response.ok) {
          throw new Error("Failed to fetch report data");
        }
        const data = await response.json();
        setTotalStudents(data.student);
        setTotalCompanies(data.company);
        setTotalAdvisors(data.advisor);
        setTotalAdmins(data.admin);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="reports" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4 space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-7 w-7 text-blue-600" />
                    รายงานและสถิติ
                  </h1>
                  <p className="text-gray-600 mt-1">
                    ดูรายงานและสถิติการฝึกงานของนักศึกษาในระบบ
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Eye className="h-3 w-3 mr-1" />
                    {filteredReports.length} รายงาน
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        นักศึกษาทั้งหมด
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {totalStudents}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        แหล่งฝึก
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {totalCompanies}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">
                        อาจารย์
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        {totalAdvisors}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">
                        ผู้ดูแลระบบ
                      </p>
                      <p className="text-2xl font-bold text-orange-900">
                        {totalAdmins}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reports Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  รายงานทั้งหมด
                  {searchQuery && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (พบ {filteredReports.length} รายการ)
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ค้นหารายงาน..."
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ล้าง
                    </Button>
                  )}
                </div>
              </div>

              {filteredReports.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Search className="h-12 w-12 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900">
                      ไม่พบรายงานที่ค้นหา
                    </h3>
                    <p className="text-gray-500">
                      ลองค้นหาด้วยคำอื่น หรือลบคำค้นหาเพื่อดูรายงานทั้งหมด
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                      className="mt-2"
                    >
                      แสดงรายงานทั้งหมด
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredReports.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Card
                        key={item.name}
                        className="group hover:shadow-md transition-all duration-200 border hover:border-gray-300"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-12 w-12 rounded-lg ${item.color} flex items-center justify-center shadow-sm`}
                              >
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <Link href={item.href}>
                                  <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {searchQuery ? (
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: item.name.replace(
                                            new RegExp(
                                              `(${searchQuery})`,
                                              "gi"
                                            ),
                                            '<mark class="bg-yellow-200 rounded">$1</mark>'
                                          ),
                                        }}
                                      />
                                    ) : (
                                      item.name
                                    )}
                                  </CardTitle>
                                </Link>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {searchQuery ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: item.description.replace(
                                    new RegExp(`(${searchQuery})`, "gi"),
                                    '<mark class="bg-yellow-200 rounded">$1</mark>'
                                  ),
                                }}
                              />
                            ) : (
                              item.description
                            )}
                          </p>

                          <div className="flex items-center justify-end space-x-2">
                            <Link href={item.href}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                ดูรายงาน
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
