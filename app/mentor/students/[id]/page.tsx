"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  UserCheck,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ArrowLeft,
  ChevronRight,
  PersonStanding,
  User,
  Loader2,
  Globe,
  Heart,
  Award,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";
import { cn } from "@/lib/utils";

const getErrorMessage = (error: any) => {
  if (!error) return "";
  if (typeof error.message === "string") return error.message;
  return String(error.message || "Invalid input");
};

const studentSchema = z.object({
  position: z.string(),
  job_description: z.string(),
});

export default function StudentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  // In a real application, you would fetch the student data based on the I

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
  } = useForm<any>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      position: "",
      job_description: "",
    },
  });

  async function onSubmit(values: any) {
    console.log("Form submitted with values:", values);
    setLoading(true);
    try {
      const payload = { ...values };

      console.log("Final payload:", payload);

      // 4. Submit main form data
      const response = await fetch(`/api/registIntern/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok && data.success) {
        toast({
          title: "ดำเนินการสำเร็จ",
          description: data.message || "แก้ไขข้อมูลผู้ดูแลระบบสำเร็จ",
          variant: "success",
        });
        fetchData();
      } else {
        toast({
          title: "ดำเนินการไม่สำเร็จ",
          description: data.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อบันทึกข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      console.log("Fetching student data for ID:", id);
      const response = await fetch(`/api/evaluations/${id}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        toast({
          title: "ไม่สามารถโหลดข้อมูลนักศึกษาได้",
          description: "เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา",
          variant: "destructive",
        });
        return;
      }
      const data = await response.json();
      if (data.success) {
        setData(data.data);
        setActivities(data.activities);
        console.log("Setting form values with data:", data.data);
        setValue("position", data.data.position);
        setValue("job_description", data.data.job_description);
      } else {
        toast({
          title: "ไม่พบข้อมูลนักศึกษา",
          description: data.message || "เกิดข้อผิดพลาด",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลนักศึกษาได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="students" userType="mentor" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-3 mb-6">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-sm border border-blue-200/50"
                asChild
              >
                <a href="/mentor/students">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <a
                  href="/mentor/students"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  นักศึกษาทั้งหมด
                </a>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 font-medium">
                  รายละเอียดนักศึกษา
                </span>
              </div>
            </div>

            {/* Main Profile Card */}
            <Card className="shadow-xl border-0 bg-white overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <CustomAvatar
                        id={`student${data?.student_id}`}
                        image={data?.image}
                        size="20"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white drop-shadow-sm">
                        {data?.fullname}{" "}
                        {data?.nickname ? `(${data?.nickname})` : ""}
                      </CardTitle>
                      <CardDescription className="text-blue-100 text-lg font-medium mt-1">
                        {data?.student_id} • {data?.position}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          นักศึกษาฝึกงาน
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* คอลัมน์ที่ 1: ข้อมูลติดต่อ */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      ข้อมูลติดต่อ
                    </h3>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                      <Mail className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">อีเมล</div>
                        <div className="text-blue-700 font-medium">
                          {data?.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                      <Phone className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          เบอร์โทรศัพท์
                        </div>
                        <div className="text-green-700 font-medium">
                          {data?.mobile}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200/50">
                      <User className="h-5 w-5 text-rose-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          ผู้ติดต่อฉุกเฉิน
                        </div>
                        <div className="text-rose-700 font-medium">
                          {data?.emergency_contact_name}
                        </div>
                        <div className="text-sm text-rose-600 mt-1">
                          {data?.emergency_contact_relation}
                        </div>
                        <div className="text-sm text-rose-600">
                          {data?.emergency_contact_phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* คอลัมน์ที่ 2: ข้อมูลส่วนตัว */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      ข้อมูลส่วนตัว
                    </h3>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                      <GraduationCap className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          อาจารย์ที่ปรึกษา
                        </div>
                        <div className="text-purple-700 font-medium">
                          {data?.advisor_name}
                        </div>
                        <div className="text-sm text-purple-600 mt-1">
                          {data?.advisor_email}
                        </div>
                        <div className="text-sm text-purple-600">
                          {data?.advisor_mobile}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50">
                      <Globe className="h-5 w-5 text-indigo-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          สัญชาติ
                        </div>
                        <div className="text-indigo-700 font-medium">
                          {data?.nationality || "ไม่ระบุ"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200/50">
                      <Heart className="h-5 w-5 text-pink-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">ศาสนา</div>
                        <div className="text-pink-700 font-medium">
                          {data?.religion || "ไม่ระบุ"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* คอลัมน์ที่ 3: ข้อมูลการฝึกงานและสุขภาพ */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      การฝึกงานและสุขภาพ
                    </h3>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/50">
                      <Calendar className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {data?.calendar_name} ปีการศึกษา {data?.semester}/
                          {data?.year}
                        </div>
                        <div className="text-sm text-orange-700 font-medium mt-1">
                          {new Date(data?.start_date).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          -{" "}
                          {new Date(data?.end_date).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200/50">
                      <MapPin className="h-5 w-5 text-teal-600 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          ที่อยู่
                        </div>
                        <div className="text-sm text-teal-700 leading-relaxed">
                          {data?.address}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50">
                      <Award className="h-5 w-5 text-emerald-600 mt-1" />
                      <div className="w-full">
                        <div className="font-semibold text-gray-900">
                          ทักษะพิเศษ
                        </div>
                        <div className="text-sm text-emerald-700 leading-relaxed mt-1">
                          {data?.skills ? (
                            <div className="break-words">
                              {data.skills.length > 100 ? (
                                <>
                                  {data.skills.substring(0, 100)}...
                                  <button className="text-emerald-600 hover:text-emerald-800 ml-1 underline text-xs">
                                    ดูเพิ่มเติม
                                  </button>
                                </>
                              ) : (
                                data.skills
                              )}
                            </div>
                          ) : (
                            <i className="text-gray-500">ไม่ระบุ</i>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200/50">
                      <Shield className="h-5 w-5 text-red-600 mt-1" />
                      <div className="w-full">
                        <div className="font-semibold text-gray-900">
                          ประวัติสุขภาพ/โรคประจำตัว
                        </div>
                        <div className="text-sm text-red-700 leading-relaxed mt-1">
                          {data?.medical_condition ? (
                            <div className="break-words">
                              {data.medical_condition.length > 100 ? (
                                <>
                                  {data.medical_condition.substring(0, 100)}...
                                  <button className="text-red-600 hover:text-red-800 ml-1 underline text-xs">
                                    ดูเพิ่มเติม
                                  </button>
                                </>
                              ) : (
                                data.medical_condition
                              )}
                            </div>
                          ) : (
                            <i className="text-gray-500">ไม่มีข้อมูล</i>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="notes" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2 mb-8 h-12 rounded-xl bg-gradient-to-r from-slate-100 to-gray-100 p-1 shadow-sm">
                    <TabsTrigger
                      value="notes"
                      className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 transition-all duration-200"
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      รายละเอียดการฝึกงาน
                    </TabsTrigger>
                    <TabsTrigger
                      value="reports"
                      className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 transition-all duration-200"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      กิจกรรมการปฏิบัติงาน
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="space-y-6">
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
                      <CardHeader className="pb-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <ClipboardList className="w-5 h-5" />
                          รายละเอียดการฝึกงาน
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-600" />
                                ตำแหน่ง
                              </label>
                              <input
                                id="position"
                                type="text"
                                {...register("position")}
                                className={cn(
                                  "w-full p-3 border rounded-lg transition-all duration-200 bg-white/80",
                                  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                  errors.position
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 hover:border-blue-400"
                                )}
                                placeholder="ระบุตำแหน่งการฝึกงาน"
                              />
                              {errors.position && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  {getErrorMessage(errors.position)}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                รายละเอียดของงาน
                              </label>
                              <Textarea
                                id="job_description"
                                placeholder="อธิบายรายละเอียดงานที่รับผิดชอบ..."
                                className={cn(
                                  "w-full p-3 border rounded-lg transition-all duration-200 bg-white/80 min-h-[120px]",
                                  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                  errors.job_description
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 hover:border-blue-400"
                                )}
                                {...register("job_description")}
                              />
                              {errors.job_description && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  {getErrorMessage(errors.job_description)}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end pt-4 border-t border-gray-200">
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-2"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  กำลังบันทึก...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  บันทึกข้อมูล
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reports" className="space-y-6">
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50/30">
                      <CardHeader className="pb-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          กิจกรรมการปฏิบัติงาน
                        </CardTitle>
                        <CardDescription className="text-emerald-100">
                          รายการกิจกรรมที่นักศึกษาได้ปฏิบัติในระหว่างการฝึกงาน
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                  <th className="h-14 px-6 text-left align-middle font-semibold text-gray-700 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-emerald-600" />
                                      วันที่ทำกิจกรรม
                                    </div>
                                  </th>
                                  <th className="h-14 px-6 text-left align-middle font-semibold text-gray-700 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                      <ClipboardList className="w-4 h-4 text-blue-600" />
                                      ชื่อกิจกรรม
                                    </div>
                                  </th>
                                  <th className="h-14 px-6 text-left align-middle font-semibold text-gray-700 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-purple-600" />
                                      รายละเอียด
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {activities.map((report, index) => (
                                  <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200"
                                  >
                                    <td className="p-6 align-top">
                                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(
                                          report.activity_date
                                        ).toLocaleDateString("th-TH", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </div>
                                    </td>
                                    <td className="p-6 align-top">
                                      <div className="space-y-2">
                                        <div className="font-semibold text-gray-900">
                                          {report.title}
                                        </div>
                                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-sm">
                                          {report.category_name}
                                        </Badge>
                                      </div>
                                    </td>
                                    <td className="p-6 align-top">
                                      <div className="space-y-3 text-sm">
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                          <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div>
                                              <span className="font-semibold text-blue-900">
                                                รายละเอียดกิจกรรม:
                                              </span>
                                              <p className="text-blue-800 mt-1">
                                                {report.description}
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                          <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div>
                                              <span className="font-semibold text-green-900">
                                                สิ่งที่ได้เรียนรู้:
                                              </span>
                                              <p className="text-green-800 mt-1">
                                                {report.learning || (
                                                  <i className="text-gray-500">
                                                    ไม่มีข้อมูล
                                                  </i>
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                          <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div>
                                              <span className="font-semibold text-orange-900">
                                                ปัญหาและอุปสรรค:
                                              </span>
                                              <p className="text-orange-800 mt-1">
                                                {report.problems || (
                                                  <i className="text-gray-500">
                                                    ไม่มีข้อมูล
                                                  </i>
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                          <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div>
                                              <span className="font-semibold text-purple-900">
                                                แนวทางการแก้ไขปัญหา:
                                              </span>
                                              <p className="text-purple-800 mt-1">
                                                {report.solutions || (
                                                  <i className="text-gray-500">
                                                    ไม่มีข้อมูล
                                                  </i>
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {activities.length === 0 && (
                                  <tr>
                                    <td
                                      colSpan={3}
                                      className="p-12 text-center"
                                    >
                                      <div className="flex flex-col items-center gap-3 text-gray-500">
                                        <FileText className="w-12 h-12 text-gray-300" />
                                        <p className="text-lg font-medium">
                                          ยังไม่มีกิจกรรมการปฏิบัติงาน
                                        </p>
                                        <p className="text-sm">
                                          นักศึกษายังไม่ได้บันทึกกิจกรรมการปฏิบัติงาน
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
