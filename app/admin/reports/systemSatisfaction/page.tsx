"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";
import TableList from "@/components/TableList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear() + 543;
const years = Array.from({ length: currentYear - 2567 + 1 }, (_, i) =>
  (currentYear - i).toString()
);
let metaData: any[] = [
  {
    key: "created_at",
    width: 60,
    className: "text-nowrap",
    content: "วันที่ประเมิน",
    render: (row: any) =>
      new Date(row.created_at).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
  {
    key: "role",
    content: "บทบาทผู้ประเมิน",
    render: (row: any) => {
      if (row.role === 'admin') {
        return <span>ผู้ดูแลระบบ</span>;
      } else if (row.role === 'mentor') {
        return <span>แหล่งฝึกงาน</span>;
      } else if (row.role === 'advisor') {
        return <span>อาจารย์</span>;
      } else if (row.role === 'student') {
        return <span>นักศึกษา</span>;
      } else {
        return <span>-</span>;
      }
    }
  },
  {
    key: "company_name",
    width: 200,
    content: "แหล่งฝึกงาน",
  },
  {
    key: "p1",
    width: 100,
    sort: false,
    content: "คำอธิบาย คำแนะนำต่างๆ ชัดเจน",
  },
  {
    key: "p2",
    width: 100,
    sort: false,
    content: "การใช้งานระบบง่าย",
  },
  {
    key: "p3",
    width: 100,
    sort: false,
    content: "ระบบมีความเสถียร",
  },
  {
    key: "p4",
    width: 100,
    sort: false,
    content: "ระบบมีความปลอดภัย",
  },
  {
    key: "p5",
    width: 100,
    sort: false,
    content: "ระบบมีประสิทธิภาพ",
  },
  {
    key: "p6",
    width: 100,
    sort: false,
    content: "ระบบมีความทันสมัย",
  },
  {
    key: "p7",
    width: 100,
    sort: false,
    content: "ระบบตอบสนองต่อความต้องการได้ดี",
  },
  {
    key: "advice",
    width: 200,
    sort: false,
    content: "ข้อเสนอแนะเพิ่มเติม",
    render: (row: any) => {
      return row.advice ? row.advice : "-";
    },
  },
];

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [roleFilter, setRoleFilter] = useState<string>("all"); // default role filter
  const [viewFilter, setViewFilter] = useState<string>("summary"); // default view filter (summary or all)

  useEffect(() => {
    // initial load
    fetchData(roleFilter, viewFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData(role: string, view: string) {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ role, view }).toString();
      const response = await fetch(`/api/system-satisfaction?${qs}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      if (res.success) {
        setData(res.data || []);
      }
    } catch (e) {
      console.error("Fetch system satisfaction error", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Sidebar activePage="reports" userType="admin" />
        {loading && <Loading />}
        <div className="md:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">
                    รายงานผลการประเมินความพึงพอใจระบบ
                  </CardTitle>
                  <CardDescription>
                    ข้อมูลความพึงพอใจของแหล่งฝึกต่อระบบ
                  </CardDescription>
                </div>
                {/* Filters Section */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="flex flex-col gap-1 w-full sm:w-48">
                    <label className="text-xs font-medium text-gray-600">กลุ่มผู้ใช้งาน</label>
                    <Select
                      value={roleFilter}
                      onValueChange={(val) => {
                        setRoleFilter(val);
                        fetchData(val, viewFilter);
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="เลือกบทบาท" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทั้งหมด</SelectItem>
                        <SelectItem value="mentor">แหล่งฝึกงาน</SelectItem>
                        <SelectItem value="advisor">อาจารย์</SelectItem>
                        <SelectItem value="student">นักศึกษา</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1 w-full sm:w-40">
                    <label className="text-xs font-medium text-gray-600">รูปแบบข้อมูล</label>
                    <Select
                      value={viewFilter}
                      onValueChange={(val) => {
                        setViewFilter(val);
                        fetchData(roleFilter, val);
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="เลือกมุมมอง" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">สรุป</SelectItem>
                        <SelectItem value="all">ทั้งหมด</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* สถิติการประเมินความพึงพอใจระบบ */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
                    📊
                  </div>
                  สถิติการประเมินความพึงพอใจระบบ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* จำนวนการประเมินทั้งหมด */}
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl">
                          📝
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            จำนวนการประเมินทั้งหมด
                          </p>
                          <p className="text-2xl font-bold text-gray-800">
                            {data.length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* คะแนนเฉลี่ยรวม */}
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl">
                          ⭐
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            คะแนนเฉลี่ยรวม
                          </p>
                          <p className="text-2xl font-bold text-gray-800">
                            {data.length > 0
                              ? (
                                data.reduce(
                                  (sum: number, item: any) =>
                                    sum +
                                    item.p1 +
                                    item.p2 +
                                    item.p3 +
                                    item.p4 +
                                    item.p5 +
                                    item.p6 +
                                    item.p7,
                                  0
                                ) /
                                (data.length * 7)
                              ).toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ประเมินสูงสุด */}
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl">
                          🏆
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">คะแนนสูงสุด</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {data.length > 0
                              ? Math.max(
                                ...data.map((item: any) =>
                                  Math.max(
                                    item.p1,
                                    item.p2,
                                    item.p3,
                                    item.p4,
                                    item.p5,
                                    item.p6,
                                    item.p7
                                  )
                                )
                              )
                              : "0"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ประเมินต่ำสุด */}
                  <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl">
                          📉
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">คะแนนต่ำสุด</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {data.length > 0
                              ? Math.min(
                                ...data.map((item: any) =>
                                  Math.min(
                                    item.p1,
                                    item.p2,
                                    item.p3,
                                    item.p4,
                                    item.p5,
                                    item.p6,
                                    item.p7
                                  )
                                )
                              )
                              : "0"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* คะแนนเฉลี่ยของแต่ละหัวข้อ */}
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
                        📋
                      </div>
                      คะแนนเฉลี่ยของแต่ละหัวข้อ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          key: "p1",
                          label: "คำอธิบาย คำแนะนำต่างๆ ชัดเจน",
                          icon: "📖",
                        },
                        {
                          key: "p2",
                          label: "ประสิทธิภาพ และความรวดเร็วในการเข้าถึงข้อมูล",
                          icon: "⚡",
                        },
                        {
                          key: "p3",
                          label: "ระบบสารสนเทศครอบคลุมทุกภารกิจ",
                          icon: "🎯",
                        },
                        {
                          key: "p4",
                          label: "ระบบประเมินช่วยลดขั้นตอนในการทำงาน",
                          icon: "⚙️",
                        },
                        {
                          key: "p5",
                          label: "การใช้งานง่าย ไม่ซับซ้อน",
                          icon: "👍",
                        },
                        { key: "p6", label: "ระบบมีประโยชน์", icon: "💎" },
                        { key: "p7", label: "ลดการพิมพ์เอกสาร", icon: "🌱" },
                      ].map((item, index) => {
                        const average =
                          data.length > 0
                            ? (
                              data.reduce(
                                (sum: number, row: any) => sum + row[item.key],
                                0
                              ) / data.length
                            ).toFixed(2)
                            : "0.00";
                        const score = parseFloat(average);
                        const percentage = (score / 5) * 100;

                        return (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl">{item.icon}</span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800 leading-tight">
                                  {item.label}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className={`h-3 rounded-full transition-all duration-500 ${score >= 4.5
                                      ? "bg-gradient-to-r from-green-400 to-green-600"
                                      : score >= 3.5
                                        ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                        : score >= 2.5
                                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                          : "bg-gradient-to-r from-red-400 to-red-600"
                                      }`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-lg font-bold text-gray-800 min-w-[50px] text-right">
                                {average}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="my-4 overflow-x-auto">
                <TableList meta={metaData} data={data} loading={loading} />
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
