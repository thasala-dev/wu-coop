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
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="เลือกผลัดฝึกงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.calendar.map((cal: any) => (
                        <SelectItem key={cal.id} value={cal.id.toString()}>
                          {cal.name} ({cal.semester}/{cal.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <CardList
                    className="grid grid-cols-1 gap-4"
                    data={data.student || []}
                    pageLength={10}
                    render={(student: any) => (
                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <CustomAvatar
                              id={`student${student.student_id}`}
                              image={student.image}
                              size="12"
                            />
                            <div>
                              <h3 className="text-lg font-medium">
                                {student.fullname || "ไม่ทราบชื่อ"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                รหัสนักศึกษา: {student.student_id || "-"}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm text-gray-500">
                                  ชุดประเมิน:
                                </span>
                                {student.evaluation_names.map(
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
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Link href={`/mentor/evaluations/${student.id}`}>
                              <Button size="sm" className="w-full">
                                ประเมินนักศึกษา
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
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
