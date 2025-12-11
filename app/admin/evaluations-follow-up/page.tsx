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
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Users, CheckCircle, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CustomAvatar from "@/components/avatar";
import TableList from "@/components/TableList";

export default function MentorEvaluations() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    calendar: [],
    student: [],
  });
  const [stats, setStats] = useState({
    totalStudents: 0,
    completedEvaluations: 0,
    completionPercentage: 0,
  });
  const { toast } = useToast();
  const [calendarSelected, setCalendarSelected] = useState<any>(null);

  // ฟังก์ชันคำนวณสถิติ
  const calculateStats = (studentData: any[]) => {
    const totalStudents = studentData.length;
    const completedEvaluations = studentData.filter(
      (student) =>
        student.total_forms === student.total_result && student.total_forms > 0
    ).length;
    const completionPercentage =
      totalStudents > 0
        ? Math.round((completedEvaluations / totalStudents) * 100)
        : 0;

    setStats({
      totalStudents,
      completedEvaluations,
      completionPercentage,
    });
  };

  useEffect(() => {
    fetchData();
  }, [calendarSelected]);

  async function fetchData() {
    try {
      setLoading(true);

      // ดึงข้อมูลนักศึกษา
      const query = calendarSelected ? `?calendarId=${calendarSelected}` : "";
      const studentResponse = await fetch(`/api/admin/evaluations${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (studentResponse.ok) {
        const result = await studentResponse.json();
        console.log("Fetching student data for ID:", result);
        setData({
          calendar: result.calendar || [],
          student: result.student || [],
        });

        // คำนวณสถิติ
        calculateStats(result.student || []);

        let findActive = result.calendar.find(
          (cal: any) => cal.active_id === 1
        );
        if (!calendarSelected) {
          if (findActive) {
            setCalendarSelected(findActive.id.toString());
          } else {
            setCalendarSelected(result.calendar[0]?.id.toString() || null);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="evaluations-follow-up" userType="admin" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            {/* Statistics Cards */}

            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">การประเมินนักศึกษา</CardTitle>
                  <CardDescription>
                    ประเมินผลการปฏิบัติงานของนักศึกษาในความดูแล
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={calendarSelected ? calendarSelected.toString() : ""}
                    onValueChange={(value) => {
                      setCalendarSelected(value || null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกผลัดฝึกงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.calendar.map((cal: any, index: number) => (
                        <SelectItem key={index} value={cal.id.toString()}>
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
                          {new Date(cal.end_date).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Total Students */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div className="flex-1 p-6">
                          <div className="text-2xl font-bold text-gray-900">
                            {stats.totalStudents}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            นักศึกษาฝึกงานทั้งหมด
                          </p>
                        </div>
                        <div className="flex-shrink-0 p-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Completed Evaluations */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div className="flex-1 p-6">
                          <div className="text-2xl font-bold text-gray-900">
                            {stats.completedEvaluations}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            นักศึกษาที่ประเมินเสร็จสิ้น
                          </p>
                        </div>
                        <div className="flex-shrink-0 p-6">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Completion Percentage */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div className="flex-1 p-6">
                          <div className="text-2xl font-bold text-gray-900">
                            {stats.completionPercentage}%
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            เปอร์เซนต์การประเมิน
                          </p>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${stats.completionPercentage}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 p-6">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-orange-600" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <TableList
                    meta={[
                      {
                        key: "fullname",
                        content: "นักศึกษา",
                        width: "200px",
                        render: (item: any) => (
                          <div className="flex items-center gap-2">
                            <CustomAvatar
                              id={`student${item.student_id}`}
                              image={item.image}
                              size="8"
                            />
                            <div>
                              <div className="truncate">{item.fullname}</div>
                              <p className="text-xs text-gray-500">
                                {item.student_id}
                              </p>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "company_name",
                        content: "แหล่งฝึกงาน",
                        width: "300px",
                        render: (item: any) => (
                          <div>
                            <div className="truncate">{item.company_name}</div>
                            <p className="text-xs text-gray-500">
                              {item.company_location || "ไม่ระบุที่ตั้ง"}
                            </p>
                          </div>
                        ),
                      },
                      {
                        key: "evaluation_names",
                        content: "ชุดประเมิน",
                        render: (item: any) => (
                          <div className="flex flex-wrap gap-1">
                            {item.evaluation_names.map(
                              (form: any, index: number) => (
                                <Badge
                                  key={index}
                                  className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                                >
                                  {form}
                                </Badge>
                              )
                            )}
                          </div>
                        ),
                      },
                      {
                        key: "status",
                        content: "การประเมิน",
                        width: "100px",
                        render: (row: any) => {
                          const totalForms = row.total_forms || 0;
                          const totalResults = row.total_result || 0;
                          const percent = totalForms
                            ? Math.round((totalResults / totalForms) * 100)
                            : 0;
                          return (
                            <>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-green-600 h-2.5 rounded-full"
                                  style={{
                                    width: `${percent}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs">
                                <div className="mt-1 text-muted-foreground">
                                  [{totalResults}/{totalForms}]
                                </div>
                                <div className="mt-1 text-muted-foreground">
                                  {percent}%
                                </div>
                              </div>
                            </>
                          );
                        },
                      },
                    ]}
                    data={data.student || []}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
