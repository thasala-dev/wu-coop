"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building as BuildingIcon,
  FileSpreadsheet as FileSpreadsheetIcon,
  Users,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  MapPin,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  Plus,
  Download,
  Briefcase,
  GraduationCap,
  School,
} from "lucide-react";
import UnifiedSidebar from "@/components/unified-sidebar";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";

const badgeNames: { [key: number]: string } = {
  1: "การประชุม",
  2: "อบรม",
  3: "สัมมนา",
  4: "นำเสนอผลงาน",
  5: "ประเมินผล",
  6: "อื่นๆ",
};
const badgeColor: { [key: number]: string } = {
  1: "blue",
  2: "green",
  3: "purple",
  4: "orange",
  5: "red",
  6: "gray",
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);
  const [data, setData] = useState<any>({
    currentCalendar: null,
    data: [],
    company: [],
    student: [],
    event: [],
  });
  useEffect(() => {
    fetchData();
  }, [calendarSelected]);

  const [percentMatch, setPercentMatch] = useState(0);

  async function fetchData() {
    setLoading(true);
    const response = await fetch("/api/admin/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const res = await response.json();
    if (res.success) {
      setCalendarSelected(res.currentCalendar?.id || null);
      setData({
        currentCalendar: res.currentCalendar,
        data: res.data,
        company: res.company || [],
        student: res.student || [],
        event: res.event || [],
      });

      let total1 =
        res.student.find((item: any) => item.group_type === 1)?.count || 0;
      let total2 =
        res.student.find((item: any) => item.group_type === 2)?.count || 0;
      setPercentMatch(
        (Number(total2) * 100) / (Number(total1) + Number(total2)) || 0
      );
      setLoading(false);
    }
  }

  async function selectCalendar(id: number) {
    if (id) {
      setLoading(true);
      const response = await fetch(`/api/calendar-select/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
    }
    setCalendarSelected(id || null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="dashboard" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-rose-600">
                    แดชบอร์ดผู้ดูแลระบบ
                  </h1>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Select
                    value={calendarSelected ? calendarSelected.toString() : ""}
                    onValueChange={(value) => {
                      selectCalendar(parseInt(value || "0", 10));
                    }}
                  >
                    <SelectTrigger className="w-[220px] bg-white shadow-sm border-gray-200">
                      <SelectValue placeholder="เลือกผลัดฝึกงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.data.map((cal: any) => (
                        <SelectItem key={cal.id} value={cal.id.toString()}>
                          {cal.name} ({cal.semester}/{cal.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              {/* <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  ภาพรวม
                </TabsTrigger>
                <TabsTrigger
                  value="cycles"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  ผลัดฝึกงาน
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  สถิติ
                </TabsTrigger>
              </TabsList> */}
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium">
                            รอบปัจจุบัน
                          </p>
                          <h3 className="text-2xl font-bold">
                            {data.currentCalendar?.name}
                          </h3>
                          <p className="text-blue-100 text-sm mt-1">
                            ภาคการศึกษาที่ {data.currentCalendar?.semester}/
                            {data.currentCalendar?.year}
                          </p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-full">
                          <Calendar className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-100 text-sm font-medium">
                            นักศึกษาทั้งหมด
                          </p>
                          <h3 className="text-3xl font-bold">
                            {data.currentCalendar?.total_intern}
                          </h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-full">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm font-medium">
                            แหล่งฝึกงาน
                          </p>
                          <h3 className="text-3xl font-bold">
                            {data.currentCalendar?.total_regist}
                          </h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-full">
                          <Briefcase className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm font-medium">
                            อัตราจับคู่
                          </p>
                          <h3 className="text-3xl font-bold">
                            {percentMatch.toLocaleString()}%
                          </h3>
                          <div className="flex items-center text-orange-100 text-sm mt-1">
                            <Star className="h-3 w-3 mr-1" />
                            <span>เป้าหมาย 90%</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white/20 rounded-full">
                          <Activity className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-800">
                            นักศึกษาในระบบ
                          </CardTitle>
                          <CardDescription>
                            แบ่งตามสถานะการจับคู่
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-full">
                              <Clock className="h-4 w-4 text-yellow-600" />
                            </div>
                            <span className="font-medium text-gray-700">
                              รอการจับคู่
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-700 border-yellow-300"
                          >
                            {data.student.find(
                              (item: any) => item.group_type === 1
                            )?.count || 0}{" "}
                            คน
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                              <UserCheck className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-700">
                              จับคู่แล้ว
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-700 border-green-300"
                          >
                            {data.student.find(
                              (item: any) => item.group_type === 2
                            )?.count || 0}{" "}
                            คน
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t">
                        <Link href="/admin/students">
                          <Button
                            variant="outline"
                            className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            ดูนักศึกษาทั้งหมด
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BuildingIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-800">
                            แหล่งฝึกงานที่เข้าร่วม
                          </CardTitle>
                          <CardDescription>
                            บริษัทและหน่วยงานที่ร่วมโครงการ
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {data.company &&
                          data.company
                            .slice(0, 3)
                            .map((company: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Avatar className="h-12 w-12 rounded-lg border-2 border-white shadow-sm">
                                  <AvatarImage
                                    src={company.image}
                                    alt={company.name}
                                  />
                                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    <BuildingIcon className="h-6 w-6" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                  <div className="font-medium text-gray-800">
                                    {company.name || "ชื่อบริษัท"}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <span>รับ {company.total || 0} คน</span>
                                    <span>•</span>
                                    <span>
                                      สมัคร {company.total_intern || 0} คน
                                    </span>
                                  </div>
                                </div>
                                <Link
                                  href={`/admin/companies/${company.id || 1}`}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-blue-100 hover:text-blue-600"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            ))}
                      </div>

                      <div className="mt-6 pt-4 border-t">
                        <Link href="/admin/companies">
                          <Button
                            variant="outline"
                            className="w-full hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            ดูแหล่งฝึกงานทั้งหมด
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Events Timeline */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-800">
                          กำหนดการสำคัญ
                        </CardTitle>
                        <CardDescription>
                          กิจกรรมและเหตุการณ์ที่กำลังจะมาถึง
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.event.map((event: any, index: number) => {
                        const dateObj = new Date(event.event_date);
                        const day = dateObj.getDate();
                        const month = dateObj.toLocaleString("th-TH", {
                          month: "short",
                        });
                        const year = (dateObj.getFullYear() + 543)
                          .toString()
                          .slice(-2);

                        const colorMap: { [key: number]: string } = {
                          1: "blue",
                          2: "green",
                          3: "purple",
                          4: "orange",
                          5: "red",
                          6: "gray",
                        };
                        const color = colorMap[event.type_id] || "gray";

                        return (
                          <div
                            key={index}
                            className={`flex gap-4 p-4 border-l-4 border-${color}-400 bg-${color}-50 rounded-r-lg hover:shadow-md transition-shadow`}
                          >
                            <div
                              className={`text-center min-w-[70px] p-3 bg-white rounded-lg shadow-sm border border-${color}-200`}
                            >
                              <div
                                className={`font-bold text-lg text-${color}-600`}
                              >
                                {day}
                              </div>
                              <div className={`text-xs text-${color}-500`}>
                                {month} {year}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-semibold text-gray-800 mb-1">
                                {event.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {event.description}
                              </p>
                              <Badge
                                variant="outline"
                                className={`mt-2 bg-${color}-100 text-${color}-700 border-${color}-300`}
                              >
                                {badgeNames[event.type_id] || "อื่นๆ"}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <Link href="/admin/calendar">
                        <Button
                          variant="outline"
                          className="w-full hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          ดูปฏิทินทั้งหมด
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cycles" className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-gray-800">
                            ผลัดฝึกงาน
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            จัดการผลัดฝึกงานทั้งหมด
                          </CardDescription>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        สร้างผลัดใหม่
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Active Cycle */}
                      <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm">
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-500 text-white">
                            กำลังดำเนินการ
                          </Badge>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                          <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                              ภาคการศึกษาที่ 1/2567
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">
                                1 มิถุนายน - 30 กันยายน 2567
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                <GraduationCap className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  นักศึกษา: 142 คน
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                <Briefcase className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  แหล่งฝึกงาน: 38 แห่ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              ดูรายละเอียด
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              จัดการ
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Upcoming Cycle */}
                      <div className="relative p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl shadow-sm">
                        <div className="absolute top-4 right-4">
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-700 border-yellow-300"
                          >
                            เตรียมการ
                          </Badge>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                          <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                              ภาคการศึกษาที่ 2/2567
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">
                                1 พฤศจิกายน 2567 - 28 กุมภาพันธ์ 2568
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                <GraduationCap className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  นักศึกษา: 92 คน
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                <Briefcase className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  แหล่งฝึกงาน: 25 แห่ง
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-orange-100"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              ดูรายละเอียด
                            </Button>
                            <Button
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              จัดการ
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Completed Cycles */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                          <Activity className="h-5 w-5 text-green-600" />
                          ผลัดที่เสร็จสิ้นแล้ว
                        </h4>

                        <div className="grid gap-4">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-green-100 text-green-700 border-green-300"
                                  >
                                    เสร็จสิ้น
                                  </Badge>
                                  <h3 className="font-semibold text-gray-800">
                                    ภาคการศึกษาที่ 2/2566
                                  </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                  1 พฤศจิกายน 2566 - 28 กุมภาพันธ์ 2567
                                </p>
                                <div className="flex gap-4 text-sm text-gray-600">
                                  <span>นักศึกษา: 128 คน</span>
                                  <span>แหล่งฝึกงาน: 35 แห่ง</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-green-100"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  ดูรายงาน
                                </Button>
                                <Button variant="ghost" size="sm">
                                  จัดการ
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-green-100 text-green-700 border-green-300"
                                  >
                                    เสร็จสิ้น
                                  </Badge>
                                  <h3 className="font-semibold text-gray-800">
                                    ภาคการศึกษาที่ 1/2566
                                  </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                  1 มิถุนายน - 30 กันยายน 2566
                                </p>
                                <div className="flex gap-4 text-sm text-gray-600">
                                  <span>นักศึกษา: 135 คน</span>
                                  <span>แหล่งฝึกงาน: 32 แห่ง</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-green-100"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  ดูรายงาน
                                </Button>
                                <Button variant="ghost" size="sm">
                                  จัดการ
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">สถิติและรายงาน</CardTitle>
                    <CardDescription>ข้อมูลสถิติและรายงานสรุป</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">
                          อัตราส่วนผ่าน/ไม่ผ่านฝึกงาน
                        </h3>
                        <div className="h-52 bg-gray-100 rounded-md flex items-center justify-center">
                          <div className="text-center">
                            <div className="font-medium text-gray-500">
                              แผนภูมิแท่งแสดงสถิตินักศึกษา
                            </div>
                            <div className="text-sm text-gray-400">
                              ผ่าน/ไม่ผ่านฝึกงาน
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">
                          การกระจายตัวของนักศึกษาตามสาขา
                        </h3>
                        <div className="h-52 bg-gray-100 rounded-md flex items-center justify-center">
                          <div className="text-center">
                            <div className="font-medium text-gray-500">
                              แผนภูมิวงกลมแสดงสัดส่วน
                            </div>
                            <div className="text-sm text-gray-400">
                              นักศึกษาแต่ละสาขา
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-lg mb-3">รายงานสรุป</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <span className="font-medium">
                            รายงานผลการประเมินนักศึกษา
                          </span>
                          <Button variant="outline" size="sm">
                            <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                            ส่งออก Excel
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <span className="font-medium">
                            รายงานสรุปแหล่งฝึกงานและตำแหน่งงาน
                          </span>
                          <Button variant="outline" size="sm">
                            <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                            ส่งออก Excel
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <span className="font-medium">
                            รายงานการนิเทศนักศึกษา
                          </span>
                          <Button variant="outline" size="sm">
                            <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                            ส่งออก Excel
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button>
                        <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
                        ส่งออกรายงานทั้งหมด
                      </Button>
                      <Button variant="outline">สร้างรายงานใหม่</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
