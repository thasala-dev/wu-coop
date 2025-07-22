"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Building,
  Loader2,
  Save,
  User,
  Upload,
  FileTextIcon,
} from "lucide-react";
import Loading from "@/components/loading";
import { provinces, companyType, thaiBank } from "@/lib/global";
import { callUploadApi, callDeleteApi } from "@/lib/file-api";
import { Badge } from "@/components/ui/badge";
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function MentorProfile() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    business_type: "",
    location: "",
    establishYear: "",
    totalEmployees: "",
    joinedYear: "",
    website: "",
    contactName: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    detail: "",
    image: "",

    bankName: "",
    bankAccount: "",
    bookbankFile: null,

    username: "",
    password: "",
  });

  const [documentForm, setDocumentForm] = useState({
    name: "",
    type: "PDF",
    size: "",
    file: null as File | null,
  });
  // Fetch student profile data
  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/company/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setProfileData(data.data);
        // Ensure all fields are properly initialized to prevent controlled/uncontrolled warnings
        setFormData({
          name: data.data?.name || "",
          business_type: data.data?.business_type || "",
          location: data.data?.location || "",
          establishYear: data.data?.establish_year || "",
          totalEmployees: data.data?.total_employees || "",
          joinedYear: data.data?.joined_year || "",
          website: data.data?.website || "",
          contactName: data.data?.contact_name || "",
          contactPosition: data.data?.contact_position || "",
          contactEmail: data.data?.contact_email || "",
          contactPhone: data.data?.contact_phone || "",
          contactAddress: data.data?.contact_address || "",
          detail: data.data?.detail || "",
          image: data.data?.image || "",

          bankName: data.data?.bank_name || "",
          bankAccount: data.data?.bank_account || "",
          bookbankFile: data.data?.bookbank_file || "",

          username: data.data?.username || "",
          password: "", // Always empty for security
        });
      } else {
        toast({
          title: "ไม่สามารถโหลดข้อมูลได้",
          description: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value || "", // Ensure value is never undefined
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value || "", // Ensure value is never undefined
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev: any) => ({
      ...prev,
      bookbankFile: file || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast({
        title: "ไม่สามารถบันทึกข้อมูลได้",
        description: "กรุณาเข้าสู่ระบบอีกครั้ง",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      let payload = { ...formData };

      if (documentForm.file) {
        const uploadResult = await callUploadApi(
          documentForm.file,
          `company/${user.id}`,
          false
        );

        if (uploadResult.success) {
          await callDeleteApi(payload.bookbankFile);
          payload.bookbankFile = uploadResult.filePath;
        } else {
          toast({
            title: "ไม่สามารถอัปโหลดไฟล์ได้",
            description: uploadResult.error || "เกิดข้อผิดพลาดในการอัปโหลดไฟล์",
            variant: "destructive",
          });
          return;
        }
      }

      if (payload.password === "") {
        delete payload.password;
      }

      const response = await fetch(`/api/company/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "บันทึกข้อมูลสำเร็จ",
          description: "อัปเดตข้อมูลบริษัทเรียบร้อยแล้ว",
          variant: "success",
        });
        fetchProfileData();
      } else {
        toast({
          title: "บันทึกข้อมูลไม่สำเร็จ",
          description:
            data.message ||
            "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Don't render until we have valid profile data and formData is properly initialized
  if (
    isLoading ||
    !profileData ||
    !formData ||
    typeof formData.name === "undefined"
  ) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="profile" userType="mentor" />

          <div className="md:col-span-4 space-y-6">
            {/* Header Card */}
            <Card className="shadow-xl border-0 bg-white overflow-hidden">
              <CardHeader className="py-6 bg-gradient-to-r from-lime-500 to-lime-600 text-white relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                      ข้อมูลบริษัท
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-base font-medium mt-1">
                      จัดการและแก้ไขข้อมูลบริษัทและผู้ติดต่อ
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Profile Image Section */}

                    {/* Profile Information Section */}
                    <div className="flex-1">
                      <div className="flex flex-col items-center space-y-4 mb-4 gap-4">
                        <div className="relative flex flex-col items-center gap-2">
                          {formData.image && (
                            <img
                              src={formData.image}
                              alt="Profile"
                              className="mt-2 rounded w-32 h-32 object-cover border border-blue-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          <Input
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="URL รูปภาพ"
                            className="w-full bg-white/80 border-blue-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 w-full border border-blue-200/50">
                          <h3 className="font-bold text-xl text-gray-900 mb-1">
                            {formData.name || "ไม่ได้ระบุชื่อบริษัท"}
                          </h3>
                          <div className="mt-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                              <Building className="h-3 w-3 mr-1" />
                              {companyType.find(
                                (type) => type.value === formData.business_type
                              )?.label || "ไม่ได้ระบุประเภทแหล่งฝึก"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Information */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            ข้อมูลบริษัท
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-700"
                              >
                                ชื่อบริษัท
                              </label>
                              <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="ชื่อบริษัท"
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="business_type"
                                className="text-sm font-medium text-gray-700"
                              >
                                ประเภทแหล่งฝึก
                              </label>
                              <Select
                                value={formData.business_type}
                                onValueChange={(value) =>
                                  handleSelectChange("business_type", value)
                                }
                              >
                                <SelectTrigger className="bg-white/80 border-blue-200 focus:border-blue-500">
                                  <SelectValue placeholder="เลือกประเภทแหล่งฝึก" />
                                </SelectTrigger>

                                <SelectContent>
                                  {companyType.map((item, index) => (
                                    <SelectItem key={index} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="business_type"
                                className="text-sm font-medium text-gray-700"
                              >
                                ที่ตั้งบริษัท
                              </label>
                              <Select
                                value={formData.location}
                                onValueChange={(value) =>
                                  handleSelectChange("location", value)
                                }
                              >
                                <SelectTrigger className="bg-white/80 border-blue-200 focus:border-blue-500">
                                  <SelectValue placeholder="เลือกที่ตั้งบริษัท" />
                                </SelectTrigger>

                                <SelectContent>
                                  {provinces.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                      {item}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="establishYear"
                                className="text-sm font-medium text-gray-700"
                              >
                                ปีที่ก่อตั้ง
                              </label>
                              <Input
                                id="establishYear"
                                name="establishYear"
                                value={formData.establishYear}
                                onChange={handleChange}
                                placeholder="ปีที่ก่อตั้ง (พ.ศ.)"
                                type="text"
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="totalEmployees"
                                className="text-sm font-medium text-gray-700"
                              >
                                จำนวนพนักงาน
                              </label>
                              <Select
                                value={formData.totalEmployees}
                                onValueChange={(value) =>
                                  handleSelectChange("totalEmployees", value)
                                }
                              >
                                <SelectTrigger className="bg-white/80 border-blue-200 focus:border-blue-500">
                                  <SelectValue placeholder="เลือกจำนวนพนักงาน" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-10">1-10 คน</SelectItem>
                                  <SelectItem value="11-50">
                                    11-50 คน
                                  </SelectItem>
                                  <SelectItem value="51-200">
                                    51-200 คน
                                  </SelectItem>
                                  <SelectItem value="201-500">
                                    201-500 คน
                                  </SelectItem>
                                  <SelectItem value="501-1000">
                                    501-1000 คน
                                  </SelectItem>
                                  <SelectItem value="1000+">
                                    มากกว่า 1000 คน
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="joinedYear"
                                className="text-sm font-medium text-gray-700"
                              >
                                ปีที่เข้าร่วมโครงการ
                              </label>
                              <Input
                                id="joinedYear"
                                name="joinedYear"
                                value={formData.joinedYear}
                                onChange={handleChange}
                                placeholder="ปีที่เข้าร่วมโครงการ (พ.ศ.)"
                                type="text"
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="website"
                                className="text-sm font-medium text-gray-700"
                              >
                                เว็บไซต์
                              </label>
                              <Input
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://www.example.com"
                                type="url"
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <label
                                htmlFor="detail"
                                className="text-sm font-medium text-gray-700"
                              >
                                รายละเอียดบริษัท
                              </label>
                              <Textarea
                                id="detail"
                                name="detail"
                                value={formData.detail}
                                onChange={handleChange}
                                placeholder="รายละเอียดเกี่ยวกับบริษัท วิสัยทัศน์ ภารกิจ หรือข้อมูลอื่นๆ"
                                rows={6}
                                className="bg-white/80 border-blue-200 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200/50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-emerald-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            ข้อมูลการติดต่อ
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="contactName"
                                className="text-sm font-medium text-gray-700"
                              >
                                ชื่อผู้ติดต่อ
                              </label>
                              <Input
                                id="contactName"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                                placeholder="ชื่อ-นามสกุลผู้ติดต่อ"
                                className="bg-white/80 border-emerald-200 focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="contactPosition"
                                className="text-sm font-medium text-gray-700"
                              >
                                ตำแหน่งผู้ติดต่อ
                              </label>
                              <Input
                                id="contactPosition"
                                name="contactPosition"
                                value={formData.contactPosition}
                                onChange={handleChange}
                                placeholder="ตำแหน่งในบริษัท"
                                className="bg-white/80 border-emerald-200 focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="contactEmail"
                                className="text-sm font-medium text-gray-700"
                              >
                                อีเมลผู้ติดต่อ
                              </label>
                              <Input
                                id="contactEmail"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="อีเมลผู้ติดต่อ"
                                type="email"
                                className="bg-white/80 border-emerald-200 focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="contactPhone"
                                className="text-sm font-medium text-gray-700"
                              >
                                เบอร์โทรผู้ติดต่อ
                              </label>
                              <Input
                                id="contactPhone"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="เบอร์โทรศัพท์ผู้ติดต่อ"
                                className="bg-white/80 border-emerald-200 focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label
                                htmlFor="contactAddress"
                                className="text-sm font-medium text-gray-700"
                              >
                                ที่อยู่ผู้ติดต่อ
                              </label>
                              <Textarea
                                id="contactAddress"
                                name="contactAddress"
                                value={formData.contactAddress}
                                onChange={handleChange}
                                placeholder="ที่อยู่ผู้ติดต่อ"
                                rows={3}
                                className="bg-white/80 border-emerald-200 focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bank Information */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200/50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                            ข้อมูลบัญชีธนาคาร
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="bankName"
                                className="text-sm font-medium text-gray-700"
                              >
                                ธนาคาร <span className="text-red-500">*</span>
                              </label>
                              <Select
                                value={formData.bankName}
                                onValueChange={(value) =>
                                  handleSelectChange("bankName", value)
                                }
                              >
                                <SelectTrigger className="bg-white/80 border-purple-200 focus:border-purple-500">
                                  <SelectValue placeholder="เลือกธนาคาร" />
                                </SelectTrigger>
                                <SelectContent>
                                  {thaiBank.map((bank, index) => (
                                    <SelectItem key={index} value={bank.value}>
                                      {bank.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="bankAccount"
                                className="text-sm font-medium text-gray-700"
                              >
                                เลขที่บัญชี{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <Input
                                id="bankAccount"
                                name="bankAccount"
                                value={formData.bankAccount}
                                onChange={handleChange}
                                placeholder="เลขที่บัญชีธนาคาร"
                                className="bg-white/80 border-purple-200 focus:border-purple-500"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label
                                htmlFor="bookbankFile"
                                className="text-sm font-medium text-gray-700"
                              >
                                ไฟล์หน้าสมุดเงินฝาก{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="flex items-center gap-4">
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
                                  className="file:mr-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {documentForm.file && (
                                  <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                                    <div className="flex items-center gap-2 text-sm">
                                      <FileTextIcon className="h-4 w-4 text-gray-500" />
                                      <span className="font-medium text-gray-900">
                                        {documentForm.file.name}
                                      </span>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {documentForm.size}
                                      </Badge>
                                    </div>
                                  </div>
                                )}

                                {formData.bookbankFile && (
                                  <a
                                    href={formData.bookbankFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm font-medium"
                                    download
                                  >
                                    <FileTextIcon className="h-4 w-4 mr-2" />
                                    ดาวน์โหลด
                                  </a>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                รองรับไฟล์: PDF, JPG, JPEG, PNG (ขนาดไม่เกิน
                                2MB)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-gradient-to-r from-red-50 to-red-50 rounded-xl p-6 border border-red-200/50">
                          <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 11v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            เปลี่ยนรหัสผ่าน
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                              >
                                Username
                              </label>
                              <Input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                className="bg-white/80 border-red-200 focus:border-red-500"
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                              >
                                รหัสผ่านใหม่ (ไม่ต้องกรอกหากไม่ต้องการเปลี่ยน)
                              </label>
                              <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="รหัสผ่านใหม่"
                                className="bg-white/80 border-red-200 focus:border-red-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-2"
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                กำลังบันทึก...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                บันทึกข้อมูล
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
