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
  UploadIcon,
  TrashIcon,
} from "lucide-react";
import UnifiedSidebar from "@/components/unified-sidebar";
import { DocumentUploadDialog } from "@/components/document-upload-dialog";
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
import { callUploadApi, callDeleteApi } from "@/lib/file-api";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import CustomAvatar from "@/components/avatar";
import { set } from "date-fns";

export default function CompanyPage() {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const param_id = params?.id as string;
  const { toast } = useToast();

  const [data, setData] = useState<any>(null);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [regist, setRegist] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [documentForm, setDocumentForm] = useState({
    name: "",
    type: "PDF",
    size: "",
    file: null as File | null,
  });

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
        title: "ไม่พบข้อมูลแหล่งฝึกงาน",
        description: "ไม่พบข้อมูลสำหรับแหล่งฝึกงานที่ระบุ",
        variant: "destructive",
      });
      return;
    }

    setData(res.data);
    setCalendar(res.calendar);
    setRegist(res.regist);
    setCurrent(res.current || null);
    setDocuments(res.documents || []);

    setLoading(false);
  }

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
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

  // Handle document upload
  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentForm.file) {
      toast({
        title: "กรุณาเลือกไฟล์",
        description: "กรุณาเลือกไฟล์ที่ต้องการอัปโหลด",
        variant: "destructive",
      });
      return;
    }

    setUploadingFile(true);

    try {
      // อัปโหลดไฟล์ด้วย file-api
      const uploadResult = await callUploadApi(
        documentForm.file,
        `company_${param_id}`,
        false // ไม่ต้องลดขนาดรูป
      );

      console.log("Upload result:", uploadResult);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "ไม่สามารถอัปโหลดไฟล์ได้");
      }

      // บันทึกข้อมูลเอกสารลงฐานข้อมูล
      const documentData = {
        name: documentForm.name,
        file_path: uploadResult.filePath || "",
        file_type: documentForm.type,
        file_size: documentForm.file.size,
        mime_type: documentForm.file.type,
        category: "general",
        status: 1,
      };

      const response = await fetch(`/api/admin/company/${param_id}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "ไม่สามารถบันทึกข้อมูลเอกสารได้");
      }

      // อัปเดตรายการเอกสาร
      await fetchData();

      toast({
        title: "อัปโหลดเอกสารสำเร็จ",
        description: "เอกสารได้ถูกเพิ่มเรียบร้อยแล้ว",
        variant: "success",
      });

      // รีเซ็ตฟอร์ม
      setDocumentForm({
        name: "",
        type: "PDF",
        size: "",
        file: null,
      });

      setDocumentDialogOpen(false);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description:
          error instanceof Error ? error.message : "ไม่สามารถอัปโหลดเอกสารได้",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  // Handle document delete
  const handleDocumentDelete = async (documentId: string, filePath: string) => {
    if (!window.confirm("ต้องการลบเอกสารนี้ใช่หรือไม่?")) {
      return;
    }

    setDeletingFile(documentId);

    try {
      // ลบไฟล์จาก storage ด้วย file-api
      const deleteResult = await callDeleteApi(filePath);

      if (!deleteResult.success) {
        console.warn(
          "Warning: Could not delete file from storage:",
          deleteResult.error
        );
        // ไม่ throw error เพราะอาจจะยังลบ record ในฐานข้อมูลได้
      }

      // ลบข้อมูลในฐานข้อมูล (soft delete)
      const response = await fetch(
        `/api/admin/company/${param_id}/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "ไม่สามารถลบเอกสารได้");
      }

      // อัปเดตรายการเอกสาร
      await fetchData();

      toast({
        title: "ลบเอกสารสำเร็จ",
        description: "เอกสารได้ถูกลบเรียบร้อยแล้ว",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description:
          error instanceof Error ? error.message : "ไม่สามารถลบเอกสารได้",
        variant: "destructive",
      });
    } finally {
      setDeletingFile(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Sidebar activePage="companies" userType="admin" />
        {loading && <Loading />}
        <div className="md:col-span-4">
          {/* Header Section with Gradient */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 mb-6 shadow-xl">
            <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
            <div className="relative z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/companies"
                  className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    รายละเอียดแหล่งฝึกงาน
                  </h1>
                  <p className="text-white/80 text-lg">
                    จัดการข้อมูลและติดตามสถานะแหล่งฝึกงาน
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push(`/admin/companies/edit/${param_id}`)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white"
                size="lg"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                แก้ไขข้อมูล
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-2/3 shadow-lg border-0">
              <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 rounded-xl border-4 border-white shadow-lg">
                      <AvatarImage src={data?.image} alt={data?.name} />
                      <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                        <BuildingIcon className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                      {renderStatusBadge(data?.status_id)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {data?.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-base">
                      <span className="flex items-center gap-2">
                        <BuildingIcon className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">
                          {companyType.find(
                            (t) => t.value === data?.business_type
                          )?.label || "-"}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{data?.location}</span>
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {data?.detail && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <ClipboardIcon className="h-4 w-4 text-blue-600" />
                      เกี่ยวกับแหล่งฝึกงาน
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {data.detail}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                      <BuildingIcon className="h-5 w-5 text-blue-600" />
                      ข้อมูลองค์กร
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            ปีที่ก่อตั้ง
                          </span>
                          <p className="text-gray-900 font-medium">
                            {data?.establish_year || (
                              <span className="text-gray-500 italic">
                                ไม่ระบุ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <UsersIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            จำนวนพนักงาน
                          </span>
                          <p className="text-gray-900 font-medium">
                            {data?.total_employees ? (
                              `${data.total_employees} คน`
                            ) : (
                              <span className="text-gray-500 italic">
                                ไม่ระบุ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            เริ่มร่วมโครงการ
                          </span>
                          <p className="text-gray-900 font-medium">
                            {data?.joined_year || (
                              <span className="text-gray-500 italic">
                                ไม่ระบุ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <GlobeIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            เว็บไซต์
                          </span>
                          <p className="text-gray-900 font-medium">
                            {data?.website ? (
                              <a
                                href={data.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              >
                                {data.website}
                              </a>
                            ) : (
                              <span className="text-gray-500 italic">
                                ไม่ระบุ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                      <PhoneIcon className="h-5 w-5 text-green-600" />
                      ข้อมูลติดต่อ
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <UsersIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            ผู้ประสานงาน
                          </span>
                          <p className="text-gray-900 font-medium">
                            {data?.contact_name || (
                              <span className="text-gray-500 italic">
                                ไม่ระบุ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <ClipboardIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            ตำแหน่ง
                          </span>
                          <p className="text-gray-900 font-medium">
                            {data?.contact_position || (
                              <span className="text-gray-500 italic">
                                ไม่ระบุ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <MailIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            อีเมล
                          </span>
                          <p className="text-gray-900 font-medium">
                            {data?.contact_email ? (
                              <a
                                href={`mailto:${data.contact_email}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              >
                                {data.contact_email}
                              </a>
                            ) : (
                              <span className="text-gray-500 italic">
                                ไม่ระบุ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <PhoneIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            โทรศัพท์
                          </span>
                          <p className="text-gray-900 font-medium">
                            {data?.contact_phone ? (
                              <a
                                href={`tel:${data.contact_phone}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              >
                                {data.contact_phone}
                              </a>
                            ) : (
                              <span className="text-gray-500 italic">
                                ไม่ระบุ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            ที่อยู่
                          </span>
                          <p className="text-gray-900 font-medium">
                            {data?.contact_address || (
                              <span className="text-gray-500 italic">
                                ไม่ระบุ
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                  สถิติการรับนักศึกษา
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {current?.name
                    ? `${current.name} (${current.semester}/${current.year})`
                    : "ไม่มีรอบการฝึกงานที่ใช้งาน"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">นักศึกษาปัจจุบัน</span>
                    <span className="font-medium text-lg">
                      {current?.intern?.length || 0}/{current?.total || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          current?.total
                            ? (current.intern?.length / current.total) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      ประวัติการรับนักศึกษา
                    </h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {regist.length === 0 && (
                        <div className="text-gray-500 text-sm text-center py-4">
                          - ไม่มีข้อมูลการรับนักศึกษา -
                        </div>
                      )}
                      {regist.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.semester}/{item.year}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-blue-600">
                              {item.intern?.length || 0}/{item.total}
                            </div>
                            <div className="text-xs text-gray-500">คน</div>
                          </div>
                        </div>
                      ))}
                      {regist.length > 5 && (
                        <div className="text-center text-sm text-gray-500 italic">
                          และอีก {regist.length - 5} รายการ...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="students" className="my-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
              <TabsTrigger
                value="students"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <UsersIcon className="h-4 w-4 mr-2" />
                นักศึกษาปัจจุบัน ({current?.intern?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                บันทึกการรับนักศึกษา ({regist.length})
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <FileTextIcon className="h-4 w-4 mr-2" />
                เอกสาร ({documents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-blue-600" />
                    นักศึกษาที่ฝึกงานอยู่ในปัจจุบัน
                  </CardTitle>
                  <CardDescription>
                    {current?.name
                      ? `รายชื่อนักศึกษาที่กำลังฝึกงานใน${current.name} (${current.semester}/${current.year})`
                      : "ไม่มีรอบการฝึกงานที่ใช้งาน"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {!current ||
                  !current.intern ||
                  current.intern.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <UsersIcon className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ยังไม่มีนักศึกษา
                      </h3>
                      <p className="text-gray-500">
                        {current
                          ? "ยังไม่มีนักศึกษาลงทะเบียนฝึกงานในรอบนี้"
                          : "ไม่มีรอบการฝึกงานที่ใช้งาน"}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-4 px-6 font-medium text-gray-900">
                              นักศึกษา
                            </th>
                            <th className="text-left py-4 px-6 font-medium text-gray-900">
                              สาขาวิชา
                            </th>
                            <th className="text-left py-4 px-6 font-medium text-gray-900">
                              ระยะเวลา
                            </th>
                            <th className="text-left py-4 px-6 font-medium text-gray-900">
                              สถานะ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {current.intern.map((student: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <CustomAvatar
                                    id={`student${student.student_id}`}
                                    image={student.image}
                                    size="10"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {student.fullname}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      รหัสนักศึกษา: {student.student_id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {student.major}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    คณะเภสัชศาสตร์
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-sm text-gray-900">
                                  {current.start_date && current.end_date ? (
                                    <>
                                      {new Date(
                                        current.start_date
                                      ).toLocaleDateString("th-TH", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}{" "}
                                      -{" "}
                                      {new Date(
                                        current.end_date
                                      ).toLocaleDateString("th-TH", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </>
                                  ) : (
                                    <span className="text-gray-500">
                                      ไม่ระบุ
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border-green-200">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  กำลังฝึกงาน
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-green-600" />
                        บันทึกการรับนักศึกษา
                      </CardTitle>
                      <CardDescription>
                        ข้อมูลการรับนักศึกษาในแต่ละรอบการฝึกงาน
                      </CardDescription>
                    </div>

                    <Button
                      onClick={() => handleAdd()}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      เพิ่มรอบการรับนักศึกษา
                    </Button>
                  </div>
                </CardHeader>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <PlusIcon className="h-5 w-5 text-green-600" />
                        เพิ่มรอบการรับนักศึกษา
                      </DialogTitle>
                      <DialogDescription>
                        กรอกข้อมูลรอบการรับนักศึกษาใหม่สำหรับแหล่งฝึกงานนี้
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="calendar-select"
                            className="text-sm font-medium"
                          >
                            รอบการฝึกงาน <span className="text-red-500">*</span>
                          </Label>
                          <select
                            id="calendar-select"
                            name="calendarId"
                            value={form.calendarId}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm py-2 px-3"
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
                          <Label
                            htmlFor="student-total"
                            className="text-sm font-medium"
                          >
                            จำนวนนักศึกษาที่รับ{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="student-total"
                            name="total"
                            type="number"
                            min="1"
                            max="20"
                            value={form.total}
                            onChange={handleChange}
                            placeholder="เช่น 3"
                            className="mt-1"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            ระบุจำนวนนักศึกษาที่แหล่งฝึกงานสามารถรับได้ในรอบนี้
                          </p>
                        </div>
                      </div>

                      <DialogFooter className="gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            ยกเลิก
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          เพิ่มรอบการรับ
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <CardContent className="pt-6">
                  {regist.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <CalendarIcon className="h-12 w-12 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ยังไม่มีข้อมูลการรับนักศึกษา
                      </h3>
                      <p className="text-gray-500 mb-4">
                        เริ่มต้นด้วยการเพิ่มข้อมูลรอบการรับนักศึกษา
                      </p>
                      <Button
                        onClick={() => handleAdd()}
                        variant="outline"
                        className="border-dashed border-2 border-gray-300 hover:border-green-500 hover:bg-green-50"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        เพิ่มรอบการรับแรก
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {regist.map((item) => (
                        <Card
                          key={item.id}
                          className="border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg text-gray-900">
                                  {item.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-4 mt-1">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    ภาคการศึกษา {item.semester} / {item.year}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ClockIcon className="h-4 w-4" />
                                    {item.start_date && item.end_date
                                      ? `${formatDate(
                                          item.start_date
                                        )} - ${formatDate(item.end_date)}`
                                      : "ไม่ระบุวันที่"}
                                  </span>
                                </CardDescription>
                              </div>
                              {item.active_id === 1 && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  รอบปัจจุบัน
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-6 mb-4">
                              <div className="flex items-center gap-2">
                                <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                                  จำนวนที่รับ: {item.total} คน
                                </div>
                                <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
                                  ลงทะเบียนแล้ว: {item.intern?.length || 0} คน
                                </div>
                              </div>
                            </div>

                            {item.intern && item.intern.length > 0 && (
                              <div>
                                <h4 className="text-gray-700 font-medium mb-3 flex items-center gap-2">
                                  <UsersIcon className="h-4 w-4" />
                                  รายชื่อนักศึกษา:
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {item.intern.map(
                                    (student: any, i: number) => (
                                      <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                      >
                                        <CustomAvatar
                                          id={`history-student-${student.student_id}`}
                                          image={student.image}
                                          size="8"
                                        />
                                        <div>
                                          <div className="font-medium text-gray-900 text-sm">
                                            {student.fullname}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {student.student_id} •{" "}
                                            {student.major}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <div className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileTextIcon className="h-5 w-5 text-purple-600" />
                        เอกสารที่เกี่ยวข้อง
                      </CardTitle>
                      <CardDescription className="mt-1">
                        เอกสารสำคัญที่เกี่ยวข้องกับแหล่งฝึกงานและการฝึกงาน
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setDocumentDialogOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      เพิ่มเอกสาร
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {documents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <FileTextIcon className="h-12 w-12 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ยังไม่มีเอกสาร
                      </h3>
                      <p className="text-gray-500 mb-4">
                        เริ่มต้นด้วยการอัปโหลดเอกสารสำคัญของแหล่งฝึกงาน
                      </p>
                      <Button
                        onClick={() => setDocumentDialogOpen(true)}
                        variant="outline"
                        className="border-dashed border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                      >
                        <UploadIcon className="h-4 w-4 mr-2" />
                        อัปโหลดเอกสารแรก
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {documents.map((doc) => (
                        <Card
                          key={doc.id}
                          className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-purple-200"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                                  <FileTextIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4
                                    className="font-semibold text-gray-900 truncate"
                                    title={doc.name}
                                  >
                                    {doc.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {doc.file_type}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatFileSize(doc.file_size)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                              <span>
                                อัปโหลดเมื่อ: {formatDate(doc.updated_at)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                onClick={() => {
                                  window.open(doc.file_path, "_blank");
                                }}
                              >
                                <DownloadIcon className="h-4 w-4 mr-1" />
                                ดาวน์โหลด
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 hover:bg-red-50"
                                onClick={() =>
                                  handleDocumentDelete(doc.id, doc.file_path)
                                }
                                disabled={deletingFile === doc.id}
                              >
                                {deletingFile === doc.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                                    กำลังลบ...
                                  </>
                                ) : (
                                  <>
                                    <TrashIcon className="h-4 w-4 mr-1" />
                                    ลบ
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Document Upload Dialog */}
              <Dialog
                open={documentDialogOpen}
                onOpenChange={setDocumentDialogOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UploadIcon className="h-5 w-5 text-blue-600" />
                      เพิ่มเอกสารใหม่
                    </DialogTitle>
                    <DialogDescription>
                      อัปโหลดเอกสารที่เกี่ยวข้องกับแหล่งฝึกงาน เช่น
                      สัญญาความร่วมมือ แบบประเมิน คู่มือการฝึกงาน
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDocumentSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="doc-name"
                          className="text-sm font-medium"
                        >
                          ชื่อเอกสาร <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="doc-name"
                          value={documentForm.name}
                          onChange={(e) =>
                            setDocumentForm((f) => ({
                              ...f,
                              name: e.target.value,
                            }))
                          }
                          placeholder="เช่น สัญญาความร่วมมือ MOU 2567"
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="doc-type"
                          className="text-sm font-medium"
                        >
                          ประเภทเอกสาร <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={documentForm.type}
                          onValueChange={(val) =>
                            setDocumentForm((f) => ({ ...f, type: val }))
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="เลือกประเภทเอกสาร" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="DOCX">Word Document</SelectItem>
                            <SelectItem value="XLSX">
                              Excel Spreadsheet
                            </SelectItem>
                            <SelectItem value="PPTX">PowerPoint</SelectItem>
                            <SelectItem value="JPG">รูปภาพ (JPG)</SelectItem>
                            <SelectItem value="PNG">รูปภาพ (PNG)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor="doc-file"
                          className="text-sm font-medium"
                        >
                          เลือกไฟล์ <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-1">
                          <Input
                            id="doc-file"
                            type="file"
                            accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                setDocumentForm((f) => ({
                                  ...f,
                                  file,
                                  size: formatFileSize(file.size),
                                }));
                            }}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                          />
                          {documentForm.file && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                              <div className="flex items-center gap-2 text-sm">
                                <FileTextIcon className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-900">
                                  {documentForm.file.name}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {documentForm.size}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          รองรับไฟล์: PDF, Word, Excel, PowerPoint, รูปภาพ
                          (ขนาดไม่เกิน 10MB)
                        </p>
                      </div>
                    </div>

                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingFile}
                        >
                          ยกเลิก
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={uploadingFile || !documentForm.file}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {uploadingFile ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            กำลังอัปโหลด...
                          </>
                        ) : (
                          <>
                            <UploadIcon className="h-4 w-4 mr-2" />
                            อัปโหลดเอกสาร
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
