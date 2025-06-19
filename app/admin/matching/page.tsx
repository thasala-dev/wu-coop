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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LinkIcon, SearchIcon, UserIcon, BuildingIcon } from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import TableList from "@/components/TableList";
import CardList from "@/components/CardList";

export default function AdminMatching() {
  const [loading, setLoading] = useState(true);
  const [calendars, setCalendars] = useState<any>([]);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);
  const [info, setInfo] = useState<any>({
    intern: [],
    company: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (calendarSelected) {
      fetchInterns();
    }
  }, [calendarSelected]);

  async function fetchInterns() {
    setLoading(true);
    const response = await fetch(`/api/calendar/${calendarSelected}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (res.success) {
      console.log("Fetched info:", res);
      setInfo({
        intern: res.intern,
        company: res.company,
      });
    }
    setLoading(false);
  }

  async function fetchData() {
    setLoading(false);
    const response = await fetch("/api/calendar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (res.success) {
      setCalendars(res.data);
    }
    setLoading(false);
  }

  // Mock data for companies
  const companies = [
    {
      id: 1,
      name: "แหล่งฝึก เทคโนโลยีดิจิทัล จำกัด",
      location: "กรุงเทพมหานคร",
      mentors: [
        { id: 1, name: "นางสาวปรียา มากความรู้", position: "Senior Developer" },
        { id: 2, name: "นายสมศักดิ์ เชี่ยวชาญ", position: "Project Manager" },
      ],
    },
    {
      id: 2,
      name: "แหล่งฝึก เน็ตเวิร์ค โซลูชั่น จำกัด",
      location: "นนทบุรี",
      mentors: [
        { id: 3, name: "นายวิทยา เชี่ยวชาญ", position: "Network Engineer" },
        {
          id: 4,
          name: "นางสาวรัตนา ผู้ชำนาญ",
          position: "System Administrator",
        },
      ],
    },
    {
      id: 3,
      name: "แหล่งฝึก โปรแกรมมิ่ง เอ็กซ์เพิร์ต จำกัด",
      location: "กรุงเทพมหานคร",
      mentors: [
        { id: 5, name: "นายธนา ชำนาญโค้ด", position: "Lead Developer" },
        { id: 6, name: "นางสาวพิมพ์ใจ รักการสอน", position: "Technical Lead" },
      ],
    },
    {
      id: 4,
      name: "แหล่งฝึก ดาต้า อินไซต์ จำกัด",
      location: "กรุงเทพมหานคร",
      mentors: [
        { id: 7, name: "นายปัญญา วิเคราะห์เก่ง", position: "Data Scientist" },
        { id: 8, name: "นางสาวมีนา ชำนาญข้อมูล", position: "Data Engineer" },
      ],
    },
    {
      id: 5,
      name: "แหล่งฝึก พลังงานสะอาด จำกัด",
      location: "ปทุมธานี",
      mentors: [
        { id: 9, name: "นายพลัง นวัตกรรม", position: "Electrical Engineer" },
        { id: 10, name: "นางสาวพลอย พลังงาน", position: "Project Coordinator" },
      ],
    },
    {
      id: 6,
      name: "แหล่งฝึก อิเล็กทรอนิกส์ จำกัด",
      location: "ชลบุรี",
      mentors: [
        {
          id: 11,
          name: "นายสุรศักดิ์ เทคนิคดี",
          position: "Electronics Engineer",
        },
        { id: 12, name: "นางสาวไพลิน อุปกรณ์", position: "Quality Control" },
      ],
    },
  ];

  // Function to get status badge
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            กำลังดำเนินการ
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            กำลังจะมาถึง
          </Badge>
        );
      case 4:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            เสร็จสิ้น
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            วางแผน
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            ไม่ระบุ
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="matching" userType="admin" />
          {loading && <Loading />}

          <div className="md:col-span-4">
            {/* Term Selector */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">รอบฝึกงาน</CardTitle>
                    <CardDescription>
                      เลือกรอบฝึกงานที่ต้องการจัดการการจับคู่
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <CardList
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
                    data={calendars}
                    pageLength={4}
                    render={(cal: any) => (
                      <Card
                        className={`cursor-pointer hover:border-blue-300 transition-colors ${
                          cal.id === calendarSelected
                            ? "border-blue-500 bg-blue-50"
                            : ""
                        }`}
                        onClick={() => {
                          setCalendarSelected(cal.id);
                        }}
                      >
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-md">
                              {cal.semester}/{cal.year}
                            </CardTitle>
                            {getStatusBadge(cal.status_id || 1)}
                          </div>
                          <CardTitle className="text-lg">{cal.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">
                            {cal.start_date
                              ? new Date(cal.start_date).toLocaleDateString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "-"}{" "}
                            -{" "}
                            {cal.end_date
                              ? new Date(cal.end_date).toLocaleDateString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "-"}
                          </p>
                          <div className="flex justify-between mt-2 text-sm">
                            <span>นักศึกษา: {cal.total_intern || 0}</span>
                            <span>แหล่งฝึก: {cal.total_regist || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      จัดการการจับคู่นักศึกษากับแหล่งฝึก
                    </CardTitle>
                    <CardDescription>ภาคการศึกษาที่ 1/2567</CardDescription>
                  </div>
                  <Button>
                    <UserIcon className="h-4 w-4 mr-2" />
                    นำเข้านักศึกษา
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <TabsList>
                      <TabsTrigger value="pending">
                        รอจับคู่ (
                        {
                          info.intern.filter((item: any) => !item.company_id)
                            .length
                        }
                        )
                      </TabsTrigger>
                      <TabsTrigger value="matched">
                        จับคู่แล้ว (
                        {
                          info.intern.filter((item: any) => item.company_id)
                            .length
                        }
                        )
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="ค้นหานักศึกษา..."
                          className="pl-10 pr-4 py-2 border rounded-md w-full"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="รหัสนักศึกษา" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกรหัส</SelectItem>
                          <SelectItem value="cs">68</SelectItem>
                          <SelectItem value="ee">67</SelectItem>
                          <SelectItem value="ie">66</SelectItem>
                          <SelectItem value="me">65</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="ทุกสาขาวิชา" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกสาขาวิชา</SelectItem>
                          <SelectItem value="cs">
                            วิศวกรรมคอมพิวเตอร์
                          </SelectItem>
                          <SelectItem value="ee">วิศวกรรมไฟฟ้า</SelectItem>
                          <SelectItem value="ie">วิศวกรรมอุตสาหการ</SelectItem>
                          <SelectItem value="me">วิศวกรรมเครื่องกล</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <TabsContent value="pending">
                    <TableList
                      meta={[
                        {
                          key: "student_id",
                          content: "รหัสนักศึกษา",
                          width: "120px",
                        },
                        {
                          key: "fullname",
                          content: "ชื่อ-นามสกุล",
                        },
                        {
                          key: "major",
                          content: "สาขาวิชา",
                        },
                        {
                          key: "company_id",
                          content: "แหล่งฝึกที่ต้องการ",
                          render: (item) => (
                            <Select>
                              <SelectTrigger className="h-8 w-full">
                                <SelectValue placeholder="เลือกแหล่งฝึก" />
                              </SelectTrigger>
                              <SelectContent>
                                {info.company.map((company: any) => (
                                  <SelectItem
                                    key={company.id}
                                    value={`company-${company.id}`}
                                  >
                                    {company.name} [{company.total} ตำแหน่ง]
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ),
                        },
                        {
                          key: "gpa",
                          content: "GPA",
                          className: "text-center",
                        },
                        {
                          key: "id",
                          width: "100px",
                          content: "Action",
                          className: "text-center",
                          sort: false,
                          render: (item) => (
                            <Button size="sm">
                              <LinkIcon className="h-4 w-4 mr-1" />
                              จับคู่
                            </Button>
                          ),
                        },
                      ]}
                      data={info.intern.filter((item: any) => !item.company_id)}
                      loading={loading}
                    />
                  </TabsContent>

                  <TabsContent value="matched">
                    <TableList
                      meta={[
                        {
                          key: "student_id",
                          content: "รหัสนักศึกษา",
                          width: "120px",
                        },
                        {
                          key: "fullname",
                          content: "ชื่อ-นามสกุล",
                        },
                        {
                          key: "major",
                          content: "สาขาวิชา",
                        },
                        {
                          key: "company_name",
                          content: "แหล่งฝึกที่จับคู่",
                        },
                        {
                          key: "register_date",
                          content: "วันที่จับคู่",
                          render: (item: any) => (
                            <span>
                              {new Date(item.register_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          ),
                        },
                        {
                          key: "id",
                          width: "100px",
                          content: "Action",
                          className: "text-center",
                          sort: false,

                          render: (item) => (
                            <Button size="sm" variant="destructive">
                              <LinkIcon className="h-4 w-4 mr-1" />
                              ยกเลิกการจับคู่
                            </Button>
                          ),
                        },
                      ]}
                      data={info.intern.filter((item: any) => item.company_id)}
                      loading={loading}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
