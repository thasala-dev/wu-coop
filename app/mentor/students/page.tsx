"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserCheck,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import MentorSidebar from "@/components/mentor-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/loading";
import TableList from "@/components/TableList";
import CustomAvatar from "@/components/avatar";
import { useSession } from "next-auth/react";
import CardList from "@/components/CardList";

export default function MentorStudentsPage() {
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

  useEffect(() => {
    fetchData();
  }, []);

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
          <Sidebar activePage="students" userType="mentor" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      นักศึกษาในความดูแล
                    </CardTitle>
                    <CardDescription>
                      ดูรายชื่อและติดตามความคืบหน้าของนักศึกษาที่อยู่ในความดูแลของคุณ
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      นักศึกษาทั้งหมด: {data.student.length}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="list" className="w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <TabsList>
                      <TabsTrigger value="list">รายชื่อ</TabsTrigger>
                      <TabsTrigger value="cards">การ์ด</TabsTrigger>
                    </TabsList>

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
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

                  <TabsContent value="list" className="mt-0">
                    <div className="rounded-md">
                      <div className="relative w-full overflow-auto">
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
                                    <div className="truncate">
                                      {item.fullname}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      {item.student_id}
                                    </p>
                                  </div>
                                </div>
                              ),
                            },

                            {
                              key: "mobile",
                              content: "การติดต่อ",
                              sort: false,
                              render: (item: any) => (
                                <div className="gap-2">
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {item.mobile || (
                                        <i className="text-xs text-gray-300">
                                          ไม่มีข้อมูล
                                        </i>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {item.email || (
                                        <i className="text-xs text-gray-300">
                                          ไม่มีข้อมูล
                                        </i>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ),
                            },

                            {
                              key: "advisor_name",
                              content: "อาจารย์ที่ปรึกษา",
                              render: (item: any) => {
                                if (item.advisor_name) {
                                  return (
                                    <div className="flex items-center gap-2">
                                      <CustomAvatar
                                        id={`advisor${item.advisor_username}`}
                                        image={item.advisor_image}
                                        size="8"
                                      />
                                      <div>
                                        <div className="truncate">
                                          {item.advisor_name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-3 w-3 text-gray-500" />
                                          <p className="text-xs text-gray-500">
                                            {item.advisor_mobile || (
                                              <i className="text-xs text-gray-300">
                                                ไม่มีข้อมูล
                                              </i>
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return (
                                  <i className="text-xs text-gray-300">
                                    ไม่มีข้อมูล
                                  </i>
                                );
                              },
                            },
                            {
                              key: "status",
                              content: "การประเมิน",
                              width: "100px",
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
                                      <Button variant="outline" size="sm">
                                        ดูข้อมูล
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
                    </div>
                  </TabsContent>

                  <TabsContent value="cards" className="mt-0">
                    <CardList
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      data={data.student}
                      pageLength={6}
                      render={(student: any) => (
                        <Card key={student.id} className="overflow-hidden">
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <CustomAvatar
                                  id={`student${student.student_id}`}
                                  image={student.image}
                                  size="8"
                                />
                                <div>
                                  <CardTitle className="text-base">
                                    {student.fullname}
                                  </CardTitle>
                                  <CardDescription>
                                    {student.student_id} • {student.department}
                                  </CardDescription>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm font-medium">
                                  ตำแหน่ง
                                </div>
                                <div className="text-sm">
                                  {student.position}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {student.email || (
                                    <i className="text-xs text-gray-300">
                                      ไม่มีข้อมูล
                                    </i>
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {student.mobile || (
                                    <i className="text-xs text-gray-300">
                                      ไม่มีข้อมูล
                                    </i>
                                  )}
                                </span>
                              </div>

                              <div>
                                <div className="text-sm font-medium mb-1">
                                  งานที่ได้รับมอบหมาย
                                </div>
                                <div className="space-y-1">
                                  {/* {student.tasks.map((task, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      <TaskStatusIcon status={task.status} />
                                      <span>{task.name}</span>
                                    </div>
                                  ))} */}
                                </div>
                              </div>

                              <div className="pt-2">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>ความคืบหน้า</span>
                                  <span>{student.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${student.progress}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div className="flex justify-between pt-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    href={`/mentor/evaluations/${student.id}`}
                                  >
                                    <UserCheck className="mr-1 h-4 w-4" />
                                    ประเมินผล
                                  </Link>
                                </Button>
                                <Button variant="default" size="sm" asChild>
                                  <Link href={`/mentor/students/${student.id}`}>
                                    ดูข้อมูล
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
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
