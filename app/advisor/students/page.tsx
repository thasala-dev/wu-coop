"use client";

import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  MapPin,
  Building,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";

export default function AdvisorStudentsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      console.error("User not found in session");
      return;
    }
    setLoading(true);
    Promise.all([fetchStudentData()]).finally(() => {
      setLoading(false);
    });
  }, [user]);

  // Filter data based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (student) =>
          student.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [data, searchTerm]);
  const fetchStudentData = async () => {
    if (!user || !user.id) {
      console.error("User ID not found");
      return;
    }
    try {
      const response = await fetch(`/api/student-advisor/${user.id}`);
      const data = await response.json();
      if (data && data.success) {
        setData(data.data);
        setFilteredData(data.data);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">ปกติ</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">ต้องติดตาม</Badge>;
      case "issue":
        return <Badge className="bg-red-500">มีปัญหา</Badge>;
      default:
        return <Badge>ไม่ระบุ</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Sidebar activePage="students" userType="advisor" />
          {loading && <Loading />}

          <div className="lg:col-span-4 space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    นักศึกษาในที่ปรึกษา
                  </h1>
                  <p className="text-gray-600">
                    จัดการและติดตามข้อมูลนักศึกษาฝึกงาน ({filteredData.length}{" "}
                    คน)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-2">
                    <User className="h-4 w-4 mr-2" />
                    อาจารย์ที่ปรึกษา
                  </Badge>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ค้นหาชื่อนักศึกษา หรือรหัสนักศึกษา..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                      className="whitespace-nowrap"
                    >
                      ล้างการค้นหา
                    </Button>
                  )}
                </div>
                {searchTerm && (
                  <div className="mt-4 text-sm text-gray-600">
                    พบ {filteredData.length} ผลลัพธ์จากการค้นหา "{searchTerm}"
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Students Grid */}
            <div className="space-y-4">
              {filteredData.length > 0 ? (
                filteredData.map((student: any) => (
                  <Card
                    key={student.id}
                    className="overflow-hidden shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col lg:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <CustomAvatar
                              id={`student${student?.student_id}`}
                              image={student?.image}
                              size="16"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {student.fullname}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-gray-600 border-gray-300 font-mono text-xs"
                                  >
                                    {student.student_id}
                                  </Badge>
                                  <Badge className="bg-blue-100 text-blue-800 border border-blue-300 text-xs">
                                    <User className="h-3 w-3 mr-1" />
                                    นักศึกษาฝึกงาน
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {student.calendar_id && (
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="bg-blue-500 p-1.5 rounded-full">
                                        <Calendar className="h-3 w-3 text-white" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-blue-700 font-medium">
                                          รอบฝึกงาน
                                        </span>
                                        <p className="text-sm font-semibold text-gray-900">
                                          {student.calendar_name} ภาคการศึกษา{" "}
                                          {student.semester}/{student.year}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="bg-emerald-500 p-1.5 rounded-full">
                                        <Calendar className="h-3 w-3 text-white" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-emerald-700 font-medium">
                                          ระยะเวลา
                                        </span>
                                        <p className="text-sm font-semibold text-gray-900">
                                          {new Date(
                                            student.start_date
                                          ).toLocaleDateString("th-TH", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })}{" "}
                                          -{" "}
                                          {new Date(
                                            student.end_date
                                          ).toLocaleDateString("th-TH", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="bg-amber-500 p-1.5 rounded-full">
                                        <Building className="h-3 w-3 text-white" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-amber-700 font-medium">
                                          บริษัท
                                        </span>
                                        <p className="text-sm font-semibold text-gray-900">
                                          {student.company_name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="bg-purple-500 p-1.5 rounded-full">
                                        <MapPin className="h-3 w-3 text-white" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-purple-700 font-medium">
                                          สถานที่
                                        </span>
                                        <p className="text-sm font-semibold text-gray-900">
                                          {student.company_location}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="bg-teal-500 p-1.5 rounded-full">
                                        <User className="h-3 w-3 text-white" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-teal-700 font-medium">
                                          ผู้ประสานงาน
                                        </span>
                                        <p className="text-sm font-semibold text-gray-900">
                                          {student.contact_name}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="bg-rose-500 p-1.5 rounded-full">
                                        <Phone className="h-3 w-3 text-white" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-rose-700 font-medium">
                                          เบอร์ติดต่อ
                                        </span>
                                        <p className="text-sm font-mono font-semibold text-gray-900">
                                          {student.contact_phone}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:flex-col justify-center items-center p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-t lg:border-t-0 lg:border-l border-gray-200">
                        <Link
                          href={`/advisor/students/${student.id}`}
                          className="w-full"
                        >
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            <FileText className="h-4 w-4 mr-2" />
                            ดูข้อมูลรายละเอียด
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="shadow-sm border-0 bg-white">
                  <CardContent className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "ไม่พบผลลัพธ์" : "ไม่มีนักศึกษา"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm
                        ? `ไม่พบนักศึกษาที่ตรงกับ "${searchTerm}"`
                        : "ยังไม่มีนักศึกษาในที่ปรึกษาของคุณ"}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                        className="mt-2"
                      >
                        ล้างการค้นหา
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
