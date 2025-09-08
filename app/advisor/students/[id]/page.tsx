"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import {
  ArrowLeft,
  Edit,
  Download,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  BarChart,
  History,
  MapPin,
  Briefcase,
  Star,
  Users,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/components/loading";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import CustomAvatar from "@/components/avatar";

const formatVisitTime = (date: string) => {
  try {
    const visitDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = visitDate.toLocaleDateString("th-TH", options);
    return formattedDate;
  } catch (error) {
    return date;
  }
};

export default function AdminStudentDetailPage() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [internship, setInternship] = useState<any>([]);
  const [supervision, setSupervision] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const params = useParams();

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStudentData()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await fetch(`/api/student-info/${params.id}`);
      const data = await response.json();
      if (data && data.success) {
        setStudent(data.data);
        setInternship(data.intern || []);
        setSupervision(data.supervision || []);
      } else {
        console.error("Student API returned unsuccessful response:", data);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Sidebar activePage="students" userType="admin" />
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Sidebar activePage="students" userType="admin" />
            <div className="md:col-span-4 text-center py-12">
              <p>ไม่พบข้อมูลนักศึกษา</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Sidebar activePage="students" userType="advisor" />
          {loading && <Loading />}

          <div className="lg:col-span-4 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-xl hover:bg-white/80 shadow-sm border border-gray-200/50"
                asChild
              >
                <a href="/advisor/students">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <a
                  href="/advisor/students"
                  className="hover:text-gray-900 font-medium"
                >
                  นักศึกษาทั้งหมด
                </a>
                <ChevronRight className="h-3 w-3 opacity-50" />
                <span className="text-gray-900 font-semibold">
                  ข้อมูลนักศึกษา
                </span>
              </div>
            </div>

            {/* Student Header Card */}
            <Card className="overflow-hidden border-0 shadow-xl bg-white">
              <CardHeader className="py-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-full"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <CustomAvatar
                        id={`student${student?.student_id}`}
                        image={student?.image}
                        size="20"
                      />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-3 border-white rounded-full flex items-center justify-center shadow-lg">
                        <Star className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                        {student?.fullname}
                      </CardTitle>
                      <CardDescription className="text-blue-100 text-base font-medium mt-1">
                        {student?.student_id} •{" "}
                        {student?.major || (
                          <span className="italic opacity-75">ไม่ระบุ</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    นักศึกษาฝึกงาน
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="px-6 pb-6 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>
                            {student.email || (
                              <i className="text-sm">ไม่ระบุ</i>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>
                            {student.mobile || (
                              <i className="text-sm">ไม่ระบุ</i>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>
                            {student.major || (
                              <i className="text-sm">ไม่ระบุ</i>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span>
                            ปีรหัสที่{" "}
                            {student.std_year || (
                              <i className="text-sm">ไม่ระบุ</i>
                            )}{" "}
                            | เกรดเฉลี่ย{" "}
                            {student.gpa || <i className="text-sm">ไม่ระบุ</i>}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>
                            {student.address || (
                              <i className="text-sm">ไม่ระบุ</i>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span>
                            {student.company || (
                              <i className="text-sm">ไม่ระบุ</i>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          ความคืบหน้าการฝึกฝึกงาน
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mt-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 text-center hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                          <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div className="text-lg font-bold text-blue-700">
                            {internship.length || 0}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            ครั้งการฝึกงาน
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-4 text-center hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                          <div className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="text-lg font-bold text-emerald-700">
                            {supervision.length || 0}
                          </div>
                          <div className="text-xs text-emerald-600 font-medium">
                            ครั้งการนิเทศ
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white mt-6">
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent p-0">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      ภาพรวม
                    </TabsTrigger>
                    <TabsTrigger
                      value="coop"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      ข้อมูลการฝึกงาน
                    </TabsTrigger>
                    <TabsTrigger
                      value="reports"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      ข้อมูลการนิเทศ
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="shadow-lg border-0 bg-gradient-to-br from-white via-blue-50 to-blue-100">
                        <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                          <CardTitle className="text-lg font-semibold flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                              <User className="h-5 w-5" />
                            </div>
                            ข้อมูลส่วนตัว
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <dl className="space-y-4 text-sm">
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                              <dt className="text-blue-700 font-medium mb-1">
                                ชื่อ-นามสกุล
                              </dt>
                              <dd className="font-semibold text-gray-800">
                                {student.fullname}{" "}
                                {student.nickname
                                  ? `(${student.nickname})`
                                  : ""}
                              </dd>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                                <dt className="text-blue-700 font-medium mb-1">
                                  วันเกิด
                                </dt>
                                <dd className=" text-gray-800">
                                  {student.date_of_birth ? (
                                    new Date(
                                      student.date_of_birth
                                    ).toLocaleDateString("th-TH", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  ) : (
                                    <i className="text-sm opacity-75">
                                      ไม่ระบุ
                                    </i>
                                  )}
                                </dd>
                              </div>
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                                <dt className="text-blue-700 font-medium mb-1">
                                  เลขบัตรประชาชน
                                </dt>
                                <dd className=" text-gray-800">
                                  {student.id_card || (
                                    <i className="text-sm opacity-75">
                                      ไม่ระบุ
                                    </i>
                                  )}
                                </dd>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                                <dt className="text-blue-700 font-medium mb-1">
                                  สัญชาติ
                                </dt>
                                <dd className=" text-gray-800">
                                  {student.nationality || (
                                    <i className="text-sm opacity-75">
                                      ไม่ระบุ
                                    </i>
                                  )}
                                </dd>
                              </div>
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                                <dt className="text-blue-700 font-medium mb-1">
                                  ศาสนา
                                </dt>
                                <dd className=" text-gray-800">
                                  {student.religion || (
                                    <i className="text-sm opacity-75">
                                      ไม่ระบุ
                                    </i>
                                  )}
                                </dd>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-2 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                                <dt className="text-blue-700 font-medium mb-1">
                                  รหัสนักศึกษา
                                </dt>
                                <dd className=" text-gray-800">
                                  {student.student_id}
                                </dd>
                              </div>
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                                <dt className="text-blue-700 font-medium mb-1 text-xs">
                                  ปีรหัส
                                </dt>
                                <dd className="font-medium text-gray-800">
                                  {student.std_year || (
                                    <i className="text-sm opacity-75">
                                      ไม่ระบุ
                                    </i>
                                  )}
                                </dd>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-2">
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                                  <dt className="text-blue-700 font-medium mb-1">
                                    คณะ/สาขา
                                  </dt>
                                  <dd className="text-gray-800">
                                    สำนักเภสัชศาตร์ /{" "}
                                    {student.major || (
                                      <i className="text-sm opacity-75">
                                        ไม่ระบุ
                                      </i>
                                    )}
                                  </dd>
                                </div>
                              </div>

                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                                <dt className="text-blue-700 font-medium mb-1 text-xs">
                                  เกรดเฉลี่ย
                                </dt>
                                <dd className="font-medium text-gray-800">
                                  {student.gpa || (
                                    <i className="text-sm opacity-75">
                                      ไม่ระบุ
                                    </i>
                                  )}
                                </dd>
                              </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                              <dt className="text-blue-700 font-medium mb-1">
                                อีเมล
                              </dt>
                              <dd className="text-gray-800 break-all">
                                {student.email || (
                                  <i className="text-sm opacity-75">ไม่ระบุ</i>
                                )}
                              </dd>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                              <dt className="text-blue-700 font-medium mb-1">
                                เบอร์โทรศัพท์
                              </dt>
                              <dd className=" text-gray-800">
                                {student.mobile || (
                                  <i className="text-sm opacity-75">ไม่ระบุ</i>
                                )}
                              </dd>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50">
                              <dt className="text-blue-700 font-medium mb-1">
                                ที่อยู่
                              </dt>
                              <dd className="text-gray-800 leading-relaxed">
                                {student.address}
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg border-0 bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
                        <CardHeader className="pb-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
                          <CardTitle className="text-lg font-semibold flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                              <Award className="h-5 w-5" />
                            </div>
                            ข้อมูลเพิ่มเติม
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-6">
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-emerald-200/50">
                              <h4 className="text-emerald-700 font-medium mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                ทักษะ
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {student.skills &&
                                typeof student.skills === "string" &&
                                student.skills.trim() ? (
                                  student.skills
                                    .split(",")
                                    .map((skill: string, index: number) => (
                                      <Badge
                                        key={index}
                                        className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 font-medium text-xs px-3 py-1 shadow-sm"
                                      >
                                        {skill.trim()}
                                      </Badge>
                                    ))
                                ) : Array.isArray(student.skills) &&
                                  student.skills.length > 0 ? (
                                  student.skills.map(
                                    (skill: string, index: number) => (
                                      <Badge
                                        key={index}
                                        className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 font-medium text-xs px-3 py-1 shadow-sm"
                                      >
                                        {skill}
                                      </Badge>
                                    )
                                  )
                                ) : (
                                  <span className="text-sm text-gray-500 italic">
                                    ไม่ได้ระบุทักษะ
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-emerald-200/50">
                              <h4 className="text-emerald-700 font-medium mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                ทุนการศึกษา
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {student.scholarship || (
                                  <span className="text-sm text-gray-500 italic">
                                    ไม่ได้ระบุทุนการศึกษา
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-emerald-200/50">
                              <h4 className="text-emerald-700 font-medium mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                ประวัติสุขภาพ/โรคประจำตัว
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {student.medical_condition || (
                                  <span className="text-sm text-gray-500 italic">
                                    ไม่ได้ระบุประวัติสุขภาพ/โรคประจำตัว
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {internship.length > 0 && (
                        <Card className="shadow-lg border-0 bg-gradient-to-br from-white via-amber-50 to-amber-100">
                          <CardHeader className="pb-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-lg">
                            <CardTitle className="text-lg font-semibold flex items-center gap-3">
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                <Building className="h-5 w-5" />
                              </div>
                              ข้อมูลแหล่งฝึกงาน
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <dl className="space-y-4 text-sm">
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50">
                                <dt className="text-amber-700 font-medium mb-1">
                                  แหล่งฝึกงาน
                                </dt>
                                <dd className="font-semibold text-gray-800">
                                  {internship[0].company_name || (
                                    <i className="opacity-75">ไม่ระบุ</i>
                                  )}
                                </dd>
                              </div>
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50">
                                <dt className="text-amber-700 font-medium mb-1">
                                  ที่อยู่
                                </dt>
                                <dd className="text-gray-800 leading-relaxed">
                                  {internship[0].company_location || (
                                    <i className="opacity-75">ไม่ระบุ</i>
                                  )}
                                </dd>
                              </div>
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50">
                                <dt className="text-amber-700 font-medium mb-1">
                                  ตำแหน่ง
                                </dt>
                                <dd className="text-gray-800">
                                  {internship[0].position || (
                                    <i className="opacity-75">ไม่ระบุ</i>
                                  )}
                                </dd>
                              </div>
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50">
                                <dt className="text-amber-700 font-medium mb-1">
                                  ผู้ประสานงาน
                                </dt>
                                <dd className="text-gray-800">
                                  {internship[0].contact_name || (
                                    <i className="opacity-75">ไม่ระบุ</i>
                                  )}
                                </dd>
                              </div>
                              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50">
                                <dt className="text-amber-700 font-medium mb-1">
                                  ระยะเวลาฝึกงาน
                                </dt>
                                <dd className=" text-gray-800">
                                  {new Date(
                                    internship[0].start_date
                                  ).toLocaleDateString("th-TH", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}{" "}
                                  -{" "}
                                  {new Date(
                                    internship[0].end_date
                                  ).toLocaleDateString("th-TH", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </dd>
                              </div>
                            </dl>
                          </CardContent>
                        </Card>
                      )}

                      <Card className="shadow-lg border-0 bg-gradient-to-br from-white via-purple-50 to-purple-100">
                        <CardHeader className="pb-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                          <CardTitle className="text-lg font-semibold flex items-center gap-3">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                              <Phone className="h-5 w-5" />
                            </div>
                            ข้อมูลผู้ปกครอง & ผู้ติดต่อฉุกเฉิน
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <dl className="space-y-4 text-sm">
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50">
                              <dt className="text-purple-700 font-medium mb-1">
                                ชื่อผู้ปกครอง
                              </dt>
                              <dd className="font-semibold text-gray-800">
                                {student.parent_name || (
                                  <i className="opacity-75">ไม่ระบุ</i>
                                )}
                              </dd>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50">
                              <dt className="text-purple-700 font-medium mb-1">
                                อาชีพผู้ปกครอง
                              </dt>
                              <dd className="font-semibold text-gray-800">
                                {student.parent_occupation || (
                                  <i className="opacity-75">ไม่ระบุ</i>
                                )}
                              </dd>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50">
                              <dt className="text-purple-700 font-medium mb-1">
                                เบอร์โทรผู้ปกครอง
                              </dt>
                              <dd className="font-semibold text-gray-800">
                                {student.parent_phone || (
                                  <i className="opacity-75">ไม่ระบุ</i>
                                )}
                              </dd>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50">
                              <dt className="text-purple-700 font-medium mb-1">
                                ชื่อผู้ติดต่อฉุกเฉิน
                              </dt>
                              <dd className="font-semibold text-gray-800">
                                {student.emergency_contact_name || (
                                  <i className="opacity-75">ไม่ระบุ</i>
                                )}
                              </dd>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50">
                              <dt className="text-purple-700 font-medium mb-1">
                                ความสัมพันธ์
                              </dt>
                              <dd className="text-gray-800">
                                {student.emergency_contact_relation || (
                                  <i className="opacity-75">ไม่ระบุ</i>
                                )}
                              </dd>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50">
                              <dt className="text-purple-700 font-medium mb-1">
                                เบอร์โทรศัพท์
                              </dt>
                              <dd className=" text-gray-800">
                                {student.emergency_contact_phone || (
                                  <i className="opacity-75">ไม่ระบุ</i>
                                )}
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="coop" className="p-6">
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-white via-indigo-50 to-indigo-100">
                      <CardHeader className="pb-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold flex items-center gap-3">
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                            <Calendar className="h-5 w-5" />
                          </div>
                          ข้อมูลการฝึกงาน
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {internship && internship.length > 0 ? (
                          <div className="space-y-4">
                            {internship.map((intern: any, index: number) => (
                              <div
                                key={index}
                                className="bg-white/60 backdrop-blur-sm border border-indigo-200/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-3 py-1">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        ปีการศึกษา {intern.semester}/
                                        {intern.year}
                                      </Badge>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                      {intern.calendar_name}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-indigo-600" />
                                          <span className="text-gray-600">
                                            วันที่เริ่มต้น:
                                          </span>
                                          <span className="font-medium">
                                            {new Date(
                                              intern.start_date
                                            ).toLocaleDateString("th-TH", {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                            })}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-indigo-600" />
                                          <span className="text-gray-600">
                                            วันที่สิ้นสุด:
                                          </span>
                                          <span className="font-medium">
                                            {new Date(
                                              intern.end_date
                                            ).toLocaleDateString("th-TH", {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                            })}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Building className="h-4 w-4 text-indigo-600" />
                                          <span className="text-gray-600">
                                            แหล่งฝึกงาน:
                                          </span>
                                          <span className="font-medium">
                                            {intern.company_name}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4 text-indigo-600" />
                                          <span className="text-gray-600">
                                            สถานที่:
                                          </span>
                                          <span className="font-medium">
                                            {intern.company_location}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-indigo-600" />
                                          <span className="text-gray-600">
                                            ผู้ประสานงาน:
                                          </span>
                                          <span className="font-medium">
                                            {intern.contact_name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Mail className="h-4 w-4 text-indigo-600" />
                                          <span className="text-gray-600">
                                            อีเมล:
                                          </span>
                                          <span className="font-medium break-all">
                                            {intern.contact_email}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-indigo-600" />
                                          <span className="text-gray-600">
                                            เบอร์ติดต่อ:
                                          </span>
                                          <span className="">
                                            {intern.advisor_mobile}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                              <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">
                              ยังไม่มีข้อมูลการฝึกงาน
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              ข้อมูลจะแสดงเมื่อมีการลงทะเบียนฝึกงาน
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reports" className="p-6">
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-white via-teal-50 to-teal-100">
                      <CardHeader className="pb-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold flex items-center gap-3">
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                            <Users className="h-5 w-5" />
                          </div>
                          การนิเทศนักศึกษา
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {supervision && supervision.length > 0 ? (
                          <div className="space-y-4">
                            {supervision.map((visit: any, index: number) => (
                              <div
                                key={index}
                                className="bg-white/60 backdrop-blur-sm border border-teal-200/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <Badge
                                          className={
                                            visit.status == "1"
                                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1"
                                              : "bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1"
                                          }
                                        >
                                          {visit.status == "1" ? (
                                            <>
                                              <CheckCircle className="h-3 w-3 mr-1" />
                                              เสร็จสิ้น
                                            </>
                                          ) : (
                                            <>
                                              <Clock className="h-3 w-3 mr-1" />
                                              รอดำเนินการ
                                            </>
                                          )}
                                        </Badge>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">
                                          {formatVisitTime(
                                            visit.scheduled_date
                                          )}
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium">
                                          {visit.start_time} - {visit.end_time}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-teal-600" />
                                          <span className="text-gray-600">
                                            อาจารย์นิเทศ:
                                          </span>
                                          <span className="font-medium">
                                            {visit.advisor_name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Mail className="h-4 w-4 text-teal-600" />
                                          <span className="text-gray-600">
                                            อีเมล:
                                          </span>
                                          <span className="font-medium break-all">
                                            {visit.advisor_email}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-teal-600" />
                                          <span className="text-gray-600">
                                            เบอร์ติดต่อ:
                                          </span>
                                          <span className="">
                                            {visit.advisor_mobile}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-3">
                                        {visit.notes && (
                                          <div className="bg-white/80 rounded-lg p-3 border border-teal-200">
                                            <div className="flex items-center gap-2 mb-2">
                                              <FileText className="h-4 w-4 text-teal-600" />
                                              <span className="text-gray-600 font-medium">
                                                หมายเหตุ:
                                              </span>
                                            </div>
                                            <p className="text-gray-800 text-sm leading-relaxed">
                                              {visit.notes}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                              <Users className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">
                              ยังไม่มีการนิเทศ
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              ข้อมูลจะแสดงเมื่อมีการจัดตารางนิเทศ
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
