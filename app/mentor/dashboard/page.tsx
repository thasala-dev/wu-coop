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
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";
  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState<any>([]);
  const [students, setStudents] = useState<any>([]);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);
  useEffect(() => {
    if (isLoading || !user) return;
    fetchData();
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
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="dashboard" userType="mentor" />
          {loading && <Loading />}
          <div className="md:col-span-4">
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
                            <SelectItem key={cal.id} value={cal.id.toString()}>
                              {cal.name} ปีการศึกษา {cal.semester}/{cal.year} (
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
                        {students.length || 0} คน
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
                          <div className="font-medium">{student.fullname}</div>
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
                    {students.length === 0 && (
                      <div className="text-gray-500 text-center py-4">
                        ไม่มีการประเมินที่ต้องทำในผลัดฝึกงานนี้
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
                          <div className="font-medium">{student.fullname}</div>
                          <div className="gap-2 flex items-center text-sm text-gray-500 mt-1">
                            <span>ชุดประเมิน: </span>
                            {student.evaluation_names.map(
                              (form: any, index2: number) => (
                                <Badge
                                  key={index2}
                                  className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                                >
                                  {form}
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
          </div>
        </div>
      </main>
    </div>
  );
}
