"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BuildingIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  UsersIcon,
  FileTextIcon,
  CalendarIcon,
  ClipboardIcon,
  PencilIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DownloadIcon,
  PlusIcon,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import Link from "next/link";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { useToast } from "@/hooks/use-toast";
import { companyType } from "@/lib/global";

export default function CompanyPage() {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const param_id = params?.id as string;
  const { toast } = useToast();

  const [data, setData] = useState<any>(null);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [regist, setRegist] = useState<any[]>([]);

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    calendarId: "",
    companyId: "",
    total: "",
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    const response = await fetch("/api/admin/regist_company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    console.log("Form Data:", form);
    const data = await response.json();
    setLoading(false);
    if (data.success) {
      toast({
        title: "ดำเนินการสำเร็จ",
        description: data.message || "เกิดข้อผิดพลาด",
        variant: "success",
      });
      fetchData();
    } else {
      toast({
        title: "ดำเนินการไม่สำเร็จ",
        description: data.message || "เกิดข้อผิดพลาด",
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    setOpen(true);
    setForm({
      id: "",
      calendarId: "",
      companyId: param_id,
      total: "",
    });
  };

  async function handleEdit(id: string) {
    setOpen(true);
    setForm({
      id: id,
      calendarId: "12345",
      companyId: param_id,
      total: "10",
    });
  }

  useEffect(() => {
    if (param_id) {
      fetchData();
    }
  }, [param_id]);

  async function fetchData() {
    setLoading(true);
    const response = await fetch(`/api/admin/company/${param_id}`);
    if (!response.ok) {
      toast({
        title: "ไม่สามารถโหลดข้อมูลได้",
        description: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        variant: "destructive",
      });
      return;
    }
    const res = await response.json();
    if (!res) {
      toast({
        title: "ไม่พบข้อมูลบริษัท",
        description: "ไม่พบข้อมูลสำหรับบริษัทที่ระบุ",
        variant: "destructive",
      });
      return;
    }

    setData(res.data);
    setCalendar(res.calendar);
    setRegist(res.regist);

    console.log("Company Data:", res.calendar);

    setLoading(false);
  }

  // Mock data for company with ID 2
  const company = {
    id: "2",
    name: "บริษัท ฟาร์มาเฮลท์แคร์ จำกัด",
    logo: "https://logo.clearbit.com/pfizer.com",
    industry: "เภสัชกรรม",
    location: "นนทบุรี",
    address: "99/9 ถนนติวานนท์ ตำบลบางกระสอ อำเภอเมือง จังหวัดนนทบุรี 11000",
    website: "https://www.pharmahealth.co.th",
    studentCapacity: 3,
    activeStudents: 2,
    status: "active",
    contactPerson: "คุณสมหญิง รักดี",
    contactPosition: "ผู้จัดการฝ่ายทรัพยากรบุคคล",
    contactEmail: "somying@pharmahealth.co.th",
    contactPhone: "02-234-5678",
    description:
      "บริษัท ฟาร์มาเฮลท์แคร์ จำกัด เป็นบริษัทชั้นนำในอุตสาหกรรมเภสัชกรรมของประเทศไทย ก่อตั้งเมื่อปี พ.ศ. 2535 เรามุ่งมั่นในการวิจัยและพัฒนาผลิตภัณฑ์ยาและเวชภัณฑ์ที่มีคุณภาพสูง เพื่อสุขภาพที่ดีของคนไทย",
    establishedYear: 1992,
    employeeCount: 250,
    cooperationSince: 2018,
  };

  // Mock data for students in this company
  const students = [
    {
      id: "1",
      name: "นายสมชาย ใจดี",
      studentId: "6299999921",
      avatar: "/placeholder.svg?height=40&width=40",
      faculty: "เภสัชศาสตร์",
      major: "เภสัชกรรมคลินิก",
      startDate: "1 มิถุนายน 2566",
      endDate: "30 กันยายน 2566",
      status: "active",
      position: "ผู้ช่วยเภสัชกร",
      mentor: "ภญ.วิภาดา สุขใจ",
    },
    {
      id: "2",
      name: "นางสาวสมหญิง รักเรียน",
      studentId: "6299999922",
      avatar: "/placeholder.svg?height=40&width=40",
      faculty: "เภสัชศาสตร์",
      major: "เภสัชกรรมอุตสาหการ",
      startDate: "1 มิถุนายน 2566",
      endDate: "30 กันยายน 2566",
      status: "active",
      position: "ผู้ช่วยวิจัยและพัฒนา",
      mentor: "ภก.ประเสริฐ นวัตกรรม",
    },
  ];

  // Mock data for history
  const history = [
    {
      year: "2565",
      studentCount: 3,
      completedCount: 3,
      students: [
        "นายวิชัย เรียนดี (เภสัชกรรมคลินิก)",
        "นางสาวสุดา ตั้งใจ (เภสัชกรรมอุตสาหการ)",
        "นายภาคิน พัฒนา (เภสัชกรรมคลินิก)",
      ],
    },
    {
      year: "2564",
      studentCount: 2,
      completedCount: 2,
      students: [
        "นางสาวพิมพ์ใจ ใฝ่รู้ (เภสัชกรรมคลินิก)",
        "นายสมศักดิ์ ศึกษาดี (เภสัชกรรมอุตสาหการ)",
      ],
    },
    {
      year: "2563",
      studentCount: 2,
      completedCount: 2,
      students: [
        "นายธนา รักการค้า (เภสัชกรรมคลินิก)",
        "นางสาวกมลา วิจัยดี (เภสัชกรรมอุตสาหการ)",
      ],
    },
  ];

  // Mock data for documents
  const documents = [
    {
      id: "1",
      name: "สัญญาความร่วมมือ (MOU)",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "15 มกราคม 2566",
      status: "active",
    },
    {
      id: "2",
      name: "แบบประเมินนักศึกษา",
      type: "DOCX",
      size: "1.8 MB",
      uploadDate: "20 มกราคม 2566",
      status: "active",
    },
    {
      id: "3",
      name: "คู่มือการฝึกงาน",
      type: "PDF",
      size: "5.2 MB",
      uploadDate: "25 มกราคม 2566",
      status: "active",
    },
    {
      id: "4",
      name: "รายงานผลการฝึกงานปี 2565",
      type: "PDF",
      size: "3.7 MB",
      uploadDate: "10 ตุลาคม 2565",
      status: "archived",
    },
  ];

  // Function to render status badge
  const renderStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircleIcon className="h-3 w-3 mr-1" /> ใช้งาน
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircleIcon className="h-3 w-3 mr-1" /> ไม่ใช้งาน
          </Badge>
        );
      case 0:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <ClockIcon className="h-3 w-3 mr-1" /> รอดำเนินการ
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Sidebar activePage="companies" userType="admin" />
        {loading && <Loading />}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/companies"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold">รายละเอียดบริษัท</h1>
            </div>
            <Button
              onClick={() => router.push(`/admin/companies/edit/${param_id}`)}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              แก้ไขข้อมูล
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-2/3">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-md border border-gray-200">
                    <AvatarImage src={data?.image} alt={data?.name} />
                    <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                      <BuildingIcon className="h-6 w-6 text-gray-500" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{data?.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <BuildingIcon className="h-4 w-4 text-gray-500" />
                      <span>
                        {companyType.find(
                          (t) => t.value === data?.business_type
                        )?.label || "-"}
                      </span>
                      <span className="mx-1">•</span>
                      <MapPinIcon className="h-4 w-4 text-gray-500" />
                      <span>{data?.location}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2">{renderStatusBadge(data?.status_id)}</div>
                <p className="mt-4 text-gray-700">{data?.detail}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-medium text-gray-900">ข้อมูลทั่วไป</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <BuildingIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">ปีที่ก่อตั้ง:</span>{" "}
                          {data?.establish_year || (
                            <i className="text-gray-600">ไม่ระบุ</i>
                          )}
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">จำนวนพนักงาน:</span>{" "}
                          {data?.total_employees} คน
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">
                            เริ่มร่วมโครงการสหกิจศึกษา:
                          </span>{" "}
                          {data?.joined_year || (
                            <i className="text-gray-600">ไม่ระบุ</i>
                          )}
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">
                            รับนักศึกษาสูงสุด:
                          </span>{" "}
                          {data?.joined_year || 0} คน
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <GlobeIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">เว็บไซต์:</span>{" "}
                          <a
                            href={data?.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {data?.website || (
                              <i className="text-gray-600">ไม่ระบุ</i>
                            )}
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">ข้อมูลติดต่อ</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">ผู้ประสานงาน:</span>{" "}
                          {data?.contact_name}
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <ClipboardIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">ตำแหน่ง:</span>{" "}
                          {data?.contact_position}
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <MailIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">อีเมล:</span>{" "}
                          <a
                            href={`mailto:${data?.contact_email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {data?.contact_email || (
                              <i className="text-gray-600">ไม่ระบุ</i>
                            )}
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <PhoneIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">โทรศัพท์:</span>{" "}
                          <a
                            href={`tel:${data?.contact_phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {data?.contact_phone}
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">ที่อยู่:</span>{" "}
                          {data?.contact_address || (
                            <i className="text-gray-600">ไม่ระบุ</i>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle className="text-lg">สถิติการรับนักศึกษา</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">นักศึกษาปัจจุบัน</span>
                    <span className="font-medium">
                      {company.activeStudents}/{company.studentCapacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (company.activeStudents / company.studentCapacity) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">ประวัติการรับนักศึกษา</h4>
                    <div className="space-y-3">
                      {regist.length === 0 && (
                        <div className="text-gray-500 text-sm text-center py-4">
                          - ไม่มีข้อมูลการรับนักศึกษา -
                        </div>
                      )}
                      {regist.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>
                            {item.name} ({item.semester}/{item.year})
                          </span>
                          <span className="font-medium">
                            {item.reg_total || 0}/{item.total} คน
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="students">
            <TabsList>
              <TabsTrigger value="students">
                นักศึกษาปัจจุบัน ({students.length})
              </TabsTrigger>
              <TabsTrigger value="history">บันทึกการรับนักศึกษา</TabsTrigger>
              <TabsTrigger value="documents">
                เอกสาร ({documents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>นักศึกษาที่ฝึกงานอยู่ในปัจจุบัน</CardTitle>
                  <CardDescription>
                    รายชื่อนักศึกษาที่กำลังฝึกงานอยู่ที่บริษัทนี้
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">นักศึกษา</th>
                          <th className="text-left py-3 px-4">สาขาวิชา</th>
                          <th className="text-left py-3 px-4">ตำแหน่ง</th>
                          <th className="text-left py-3 px-4">พี่เลี้ยง</th>
                          <th className="text-left py-3 px-4">ระยะเวลา</th>
                          <th className="text-left py-3 px-4">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr
                            key={student.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={student.avatar}
                                    alt={student.name}
                                  />
                                  <AvatarFallback>
                                    {student.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {student.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {student.studentId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div>{student.faculty}</div>
                                <div className="text-sm text-gray-500">
                                  {student.major}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{student.position}</td>
                            <td className="py-3 px-4">{student.mentor}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="text-sm">
                                  {student.startDate}
                                </div>
                                <div className="text-sm">
                                  ถึง {student.endDate}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <CheckCircleIcon className="h-3 w-3 mr-1" />{" "}
                                กำลังฝึกงาน
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>บันทึกการรับนักศึกษา</CardTitle>
                      <CardDescription>
                        ข้อมูลการรับนักศึกษาในปีการศึกษาที่ผ่านมา
                      </CardDescription>
                    </div>

                    <Button onClick={() => handleAdd()}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      เพิ่มรอบการรับนักศึกษา
                    </Button>
                  </div>
                </CardHeader>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>เพิ่มรอบการรับนักศึกษา</DialogTitle>
                      <DialogDescription>
                        กรอกข้อมูลรอบการรับนักศึกษาใหม่
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          รอบการฝึกงาน
                        </label>
                        <select
                          name="calendarId"
                          value={form.calendarId}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                        >
                          <option value="" disabled>
                            เลือกรอบการฝึกงาน
                          </option>
                          {calendar?.length > 0 &&
                            calendar.map((item: any) => (
                              <option key={item.id} value={item.id}>
                                {item.name} ({item.semester}/{item.year})
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          จำนวนนักศึกษา
                        </label>
                        <Input
                          name="total"
                          type="number"
                          value={form.total}
                          onChange={handleChange}
                          placeholder="เช่น 3"
                          required
                        />
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            ยกเลิก
                          </Button>
                        </DialogClose>
                        <Button type="submit">บันทึก</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <CardContent>
                  <div className="space-y-6">
                    {regist.length === 0 && (
                      <div className="text-gray-500 text-sm text-center py-4">
                        - ไม่มีข้อมูลการรับนักศึกษา -
                      </div>
                    )}
                    {regist.map((item) => (
                      <div key={item.id} className="border-t pt-4">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <div className="text-sm text-gray-500">
                          ภาคการศึกษา {item.semester} / {item.year}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            จำนวนนักศึกษา: {item.total} คน
                          </div>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            สำเร็จการฝึกงาน: {item.total} คน
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-gray-500 mb-1">
                            รายชื่อนักศึกษา:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {/* {item.students.map((student, index) => (
                              <li key={index} className="text-sm">
                                {student}
                              </li>
                            ))} */}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>เอกสารที่เกี่ยวข้อง</CardTitle>
                  <CardDescription>
                    เอกสารสำคัญที่เกี่ยวข้องกับบริษัทและการฝึกงาน
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">ชื่อเอกสาร</th>
                          <th className="text-left py-3 px-4">ประเภท</th>
                          <th className="text-left py-3 px-4">ขนาด</th>
                          <th className="text-left py-3 px-4">วันที่อัปโหลด</th>
                          <th className="text-left py-3 px-4">สถานะ</th>
                          <th className="text-left py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc) => (
                          <tr
                            key={doc.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <FileTextIcon className="h-4 w-4 text-gray-500" />
                                <span>{doc.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{doc.type}</Badge>
                            </td>
                            <td className="py-3 px-4">{doc.size}</td>
                            <td className="py-3 px-4">{doc.uploadDate}</td>
                            <td className="py-3 px-4">
                              {doc.status === "active" ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  ใช้งาน
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                  เก็บถาวร
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">
                                <DownloadIcon className="h-4 w-4 mr-1" />{" "}
                                ดาวน์โหลด
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
