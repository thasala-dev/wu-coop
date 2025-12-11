"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomAvatar from "@/components/avatar";
import { ChevronRight, Star } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState<any>([]);
  const [students, setStudents] = useState<any>([]);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);
  const [payments, setPayments] = useState<any>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  
  useEffect(() => {
    if (isLoading || !user) return;
    fetchData();
    fetchPayments();
  }, [isLoading, user, calendarSelected]);

  async function fetchData() {
    if (!user) return;

    setLoading(true);
    const url =
      `/api/mentor/${user.id}/evaluations` +
      (calendarSelected ? `?calendarId=${calendarSelected}` : "");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
      setLoading(false);
    }
    const res = await response.json();
    if (res.success) {
      setCalendars(res.calendar);
      setStudents(res.student);
      if (!calendarSelected) {
        let findActive = res.calendar.find((cal: any) => cal.active_id === 1);
        if (findActive) {
          setCalendarSelected(findActive.id.toString());
        } else {
          setCalendarSelected(res.calendar[0]?.id.toString() || null);
        }
      }
    }
    setLoading(false);
  }

  async function fetchPayments() {
    if (!user) return;

    setLoadingPayments(true);
    try {
      const response = await fetch("/api/admin/payments?company_id=" + user.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      console.log("Payment Response:", res); // Debug
      if (res.success) {
        // API ส่งกลับมาเป็น res.data ไม่ใช่ res.payments
        setPayments(res.data || []);
        console.log("Payments set:", res.data); // Debug
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoadingPayments(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="dashboard" userType="mentor" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            <Link href="/mentor/systemSatisfaction">
              <div className="relative rounded-xl border-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-card-foreground shadow-2xl w-full p-8 mb-6 overflow-hidden group hover:scale-[1.02] transition-all duration-300 ease-out">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full  group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full  group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 group-hover:bg-white/30 transition-colors duration-300 backdrop-blur-sm">
                    <Star
                      className="h-8 w-8 text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300"
                      fill="currentColor"
                    />
                  </div>

                  <h1 className="text-3xl font-bold text-white mb-2 group-hover:text-yellow-100 transition-colors duration-300 drop-shadow-lg">
                    ประเมินความพึงพอใจระบบ
                  </h1>

                  <p className="text-blue-100 text-lg mb-4 font-medium">
                    แบ่งปันความคิดเห็นของคุณเพื่อพัฒนาระบบให้ดีขึ้น
                  </p>

                  <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors duration-300">
                    <span className="text-sm font-medium">
                      คลิกเพื่อเริ่มประเมิน
                    </span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-white/70 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-white/50 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12  transition-transform duration-1000 ease-out"></div>
              </div>
            </Link>

            {/* Payment Notifications Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold tracking-tight text-xl">
                    แจ้งเตือนค่าตอบแทน
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    รายการค่าตอบแทนที่เพิ่งเข้ามา
                  </p>
                </div>
                <Link href="/mentor/payments">
                  <Button variant="outline" size="sm">
                    ดูทั้งหมด
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {loadingPayments ? (
                  <div className="text-gray-500 text-center py-4">
                    กำลังโหลด...
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    ไม่มีรายการค่าตอบแทนใหม่
                  </div>
                ) : (
                  payments.slice(0, 5).map((payment: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-800">
                          ค่าตอบแทนผลัดที่ {payment.calendar_name || payment.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          จำนวนเงิน:{" "}
                          <span className="font-semibold text-green-600">
                            {payment.amount?.toLocaleString("th-TH") || "0"}{" "}
                            บาท
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          วันที่ได้รับ:{" "}
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </div>
                      </div>
                        <Badge className="bg-green-100 text-green-700 border border-green-200 px-3 py-1.5">
                          ชำระเงินแล้ว ✅
                        </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            {calendars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-end">
                      <div className="mt-4 flex items-center gap-2">
                        <Select
                          value={
                            calendarSelected ? calendarSelected.toString() : ""
                          }
                          onValueChange={(value) => {
                            setCalendarSelected(value || null);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="เลือกผลัดฝึกงาน" />
                          </SelectTrigger>
                          <SelectContent>
                            {calendars.map((cal: any) => (
                              <SelectItem
                                key={cal.id}
                                value={cal.id.toString()}
                              >
                                {cal.name} ปีการศึกษา {cal.semester}/{cal.year}{" "}
                                (
                                {new Date(cal.start_date).toLocaleDateString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}{" "}
                                -{" "}
                                {new Date(cal.end_date).toLocaleDateString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                                )
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <div className="font-medium">จำนวนนักศึกษา</div>
                        <div className="text-xl font-semibold">
                          {students.length || 0} คน
                        </div>
                      </div>
                      <div className="border rounded-md p-4">
                        <div className="font-medium">
                          จำนวนนักศึกษาที่ต้องประเมิน
                        </div>
                        <div className="text-xl font-semibold">
                          {students.filter(
                            (student: any) =>
                              student.total_forms !== student.total_result
                          ).length || 0}{" "}
                          คน
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6 mt-4">
                    <h2 className="font-semibold tracking-tight text-xl">
                      นักศึกษาฝึกงาน
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      นักศึกษาที่เพิ่มเข้ามาในผลัดฝึกงานนี้
                    </p>
                    <div className="mt-4 space-y-3">
                      {students.length === 0 && (
                        <div className="text-gray-500 text-center py-4">
                          ไม่มีนักศึกษาในผลัดฝึกงานนี้
                        </div>
                      )}
                      {students.map((student: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 pb-3 border-b"
                        >
                          <CustomAvatar
                            id={`student${student.student_id}`}
                            image={student.image}
                            size="10"
                          />
                          <div className="flex-grow">
                            <div className="font-medium">
                              {student.fullname}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.student_id}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Link href={`/mentor/students/${student.id}`}>
                              <Button variant="outline" size="sm">
                                ดูข้อมูล
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6">
                    <h2 className="font-semibold tracking-tight text-xl">
                      การประเมินที่ต้องทำ
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      รายการประเมินที่กำลังจะถึงกำหนด
                    </p>
                    <div className="mt-4 space-y-3">
                      {students.filter(
                        (student: any) =>
                          student.total_forms !== student.total_result
                      ).length === 0 && (
                        <div className="text-gray-500 text-center py-4">
                          ไม่มีการประเมินที่ต้องทำในผลัดฝึกงานนี้
                        </div>
                      )}
                      {students
                        .filter(
                          (student: any) =>
                            student.total_forms !== student.total_result
                        )
                        .map((student: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 pb-3 border-b"
                          >
                            <CustomAvatar
                              id={`student${student.student_id}`}
                              image={student.image}
                              size="10"
                            />
                            <div className="flex-grow">
                              <div className="font-medium">
                                {student.fullname}
                              </div>
                              <div className="gap-2 flex items-center text-sm text-gray-500 mt-1">
                                <span>ชุดประเมิน: </span>
                                {student.evaluation_names.map(
                                  (form: any, index2: number) => (
                                    <Badge
                                      key={index2}
                                      className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                                    >
                                      {form} | {student.total_result}/
                                      {student.total_forms} ชุด
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Link href={`/mentor/evaluations/${student.id}`}>
                                <Button size="sm">
                                  ประเมิน
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {calendars.length === 0 && (
              <div className="relative rounded-2xl border-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 shadow-2xl w-full p-12 overflow-hidden group">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full "></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-200/30 to-yellow-200/30 rounded-full "></div>
                <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-orange-100/40 to-amber-100/40 rounded-full blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-6 shadow-lg">
                    <div className="text-4xl text-white">📅</div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    ยังไม่มีผลัดฝึกงาน
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    ขณะนี้ยังไม่มีผลัดฝึกงานที่สร้างไว้
                    กรุณาติดต่อผู้ดูแลระบบเพื่อสร้างผลัดฝึกงานใหม่
                  </p>

                  {/* Decorative elements */}
                  <div className="flex justify-center items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>

                {/* Floating particles */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-orange-300 rounded-full animate-ping opacity-75"></div>
                <div
                  className="absolute top-32 right-32 w-2 h-2 bg-amber-300 rounded-full animate-ping opacity-75"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-24 left-32 w-2 h-2 bg-red-300 rounded-full animate-ping opacity-75"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
