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
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClipboardListIcon,
  UserIcon,
  AlertCircleIcon,
  SearchIcon,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
import MentorSidebar from "@/components/mentor-sidebar";
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
import { useSession } from "next-auth/react";
import CardList from "@/components/CardList";
import CustomAvatar from "@/components/avatar";
import TableList from "@/components/TableList";

export default function MentorEvaluations() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    calendar: [],
    student: [],
  });
  const { toast } = useToast();
  const [calendarSelected, setCalendarSelected] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [calendarSelected]);

  async function fetchData() {
    if (!user) return;
    try {
      setLoading(true);

      // ดึงข้อมูลนักศึกษา
      const query = calendarSelected ? `?calendarId=${calendarSelected}` : "";
      const studentResponse = await fetch(
        `/api/mentor/${user.id}/evaluations${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (studentResponse.ok) {
        const result = await studentResponse.json();
        console.log("Fetching student data for ID:", result);
        setData({
          calendar: result.calendar || [],
          student: result.student || [],
        });

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
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="evaluations" userType="mentor" />
          {loading && <Loading />}
          <div className="md:col-span-4">
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
                      {data.calendar.map((cal: any) => (
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
                        width: "150px",
                        render: (row: any) => {
                          return (
                            <>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-green-600 h-2.5 rounded-full"
                                  style={{
                                    width: `90%`,
                                  }}
                                ></div>
                              </div>
                              <div className="text-xs mt-1 text-muted-foreground">
                                90% เสร็จสิ้น
                              </div>
                            </>
                          );
                        },
                      },
                      {
                        key: "actions",
                        content: "",
                        sort: false,
                        width: "100px",
                        render: (row: any) => {
                          return (
                            <div className="flex justify-end gap-2">
                              <Link href={`/mentor/students/${row.id}`}>
                                <Button size="sm">
                                  ประเมินนักศึกษา
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
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
