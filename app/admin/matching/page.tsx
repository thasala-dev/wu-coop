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
import {
  CheckIcon,
  InfoIcon,
  LinkIcon,
  SearchIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import TableList from "@/components/TableList";
import CardList from "@/components/CardList";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminMatching() {
  const [loading, setLoading] = useState(true);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);
  const [info, setInfo] = useState<any>({
    intern: [],
    company: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (calendarSelected) {
      fetchInterns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setInfo({
        intern: res.intern,
        company: res.company,
      });
    }
    setLoading(false);
  }

  async function fetchData() {
    setLoading(true);
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"link" | "unlink" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function handleLink(id: string) {
    setSelectedId(id);
    setDialogType("link");
    setDialogOpen(true);
  }

  async function handleUnlink(id: string) {
    setSelectedId(id);
    setDialogType("unlink");
    setDialogOpen(true);
  }

  async function confirmAction() {
    if (!selectedId) return;
    setDialogOpen(false);
    setLoading(true);
    if (dialogType === "link") {
      const response = await fetch(`/api/registIntern/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: info.intern.find((item: any) => item.id === selectedId)
            .company_id,
          register_date: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: "จับคู่สำเร็จ",
          description: "ดำเนินการจับคู่นักศึกษาและแหล่งฝึกงานเรียบร้อยแล้ว",
          variant: "success",
        });
        fetchInterns();
      }
    } else if (dialogType === "unlink") {
      const response = await fetch(`/api/registIntern/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: null,
          register_date: null,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: "ยกเลิกจับคู่สำเร็จ",
          description:
            "ดำเนินการยกเลิกการจับคู่นักศึกษาและแหล่งฝึกงานเรียบร้อยแล้ว",
          variant: "success",
        });
        fetchInterns();
      }
    }
    setDialogOpen(false);
    setLoading(false);
    setSelectedId(null);
    setDialogType(null);
  }

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
            {calendarSelected && (
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
                            info.intern.filter(
                              (item: any) => !item.register_date
                            ).length
                          }
                          )
                        </TabsTrigger>
                        <TabsTrigger value="matched">
                          จับคู่แล้ว (
                          {
                            info.intern.filter(
                              (item: any) => item.register_date
                            ).length
                          }
                          )
                        </TabsTrigger>
                      </TabsList>

                      <div className="flex gap-2 w-full md:w-auto">
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
                            <SelectItem value="ie">
                              วิศวกรรมอุตสาหการ
                            </SelectItem>
                            <SelectItem value="me">
                              วิศวกรรมเครื่องกล
                            </SelectItem>
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
                              <Select
                                onValueChange={(value) => {
                                  const companyId = value.replace(
                                    "company-",
                                    ""
                                  );
                                  setInfo((prev: any) => ({
                                    ...prev,
                                    intern: prev.intern.map((intern: any) =>
                                      intern.id === item.id
                                        ? { ...intern, company_id: companyId }
                                        : intern
                                    ),
                                  }));
                                }}
                                value={
                                  item.company_id
                                    ? `company-${item.company_id}`
                                    : "company-"
                                }
                              >
                                <SelectTrigger className="h-8 w-full">
                                  <SelectValue placeholder="เลือกแหล่งฝึก" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={`company-`}>
                                    เลือกแหล่งฝึก
                                  </SelectItem>
                                  {info.company.map((company: any) => (
                                    <SelectItem
                                      key={company.id}
                                      value={`company-${company.company_id}`}
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
                            render: (item: any) => (
                              <Button
                                size="sm"
                                onClick={() => handleLink(item.id)}
                                disabled={!item.company_id}
                              >
                                <LinkIcon className="h-4 w-4 mr-1" />
                                จับคู่
                              </Button>
                            ),
                          },
                        ]}
                        data={info.intern.filter(
                          (item: any) => !item.register_date
                        )}
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
                                {new Date(
                                  item.register_date
                                ).toLocaleDateString("th-TH", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
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
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUnlink(item.id)}
                              >
                                <LinkIcon className="h-4 w-4 mr-1" />
                                ยกเลิกการจับคู่
                              </Button>
                            ),
                          },
                        ]}
                        data={info.intern.filter(
                          (item: any) => item.register_date
                        )}
                        loading={loading}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Dialog should be in JSX tree here */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center gap-2">
                <InfoIcon className="h-5 w-5" />
                {dialogType === "link"
                  ? "ยืนยันการจับคู่นักศึกษา"
                  : "ยืนยันการยกเลิกจับคู่"}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {dialogType === "link"
              ? "คุณต้องการจับคู่นักศึกษากับแหล่งฝึกงานนี้ใช่หรือไม่?"
              : "คุณต้องการยกเลิกการจับคู่นักศึกษากับแหล่งฝึกงานนี้ใช่หรือไม่?"}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <XIcon className="h-4 w-4 mr-1" />
              ยกเลิก
            </Button>
            <Button
              onClick={confirmAction}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
