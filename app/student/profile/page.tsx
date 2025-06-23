"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, User, Camera } from "lucide-react";
import { callUploadApi } from "@/lib/file-api";
import AvatarDesign from "@/components/AvatarDesign";
import CustomAvatar from "@/components/avatar";
import Loading from "@/components/loading";

const currentYear = new Date().getFullYear() + 543;
const years = Array.from({ length: currentYear - 2562 + 1 }, (_, i) =>
  (currentYear - i).toString().slice(-2)
);

export default function StudentProfile() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<any>({
    fullname: "",
    student_id: "",
    email: "",
    mobile: "",
    faculty: "",
    major: "",
    std_year: "",
    address: "",
    gpa: "",
    image: "",
  });

  // Fetch student profile data
  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/student/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setProfileData(data.data);
        setFormData({
          fullname: data.data.fullname || "",
          student_id: data.data.student_id || "",
          email: data.data.email || "",
          mobile: data.data.mobile || "",
          faculty: data.data.faculty || "",
          major: data.data.major || "",
          std_year: data.data.std_year || "",
          address: data.data.address || "",
          gpa: data.data.gpa || "",
          image: data.data.image || "",
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
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/student/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "บันทึกข้อมูลสำเร็จ",
          description: "อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว",
          variant: "success",
        });
        setProfileData(data.data);
        setIsEditing(false);
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

  if (isLoading || !profileData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="profile" userType="student" />

          <div className="md:col-span-4">
            <Card className="border-sky-200 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-500 to-sky-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">ข้อมูลส่วนตัว</CardTitle>
                  <Button
                    variant={isEditing ? "secondary" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    className={
                      isEditing
                        ? "bg-white text-sky-700"
                        : "bg-white text-sky-700"
                    }
                  >
                    {isEditing ? "ยกเลิกการแก้ไข" : "แก้ไขข้อมูล"}
                  </Button>
                </div>
                <CardDescription className="text-sky-100">
                  ข้อมูลส่วนตัวของนักศึกษาฝึกงาน
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center space-y-4 mb-6 md:mb-0">
                    <div className="relative">
                      {isEditing ? (
                        <AvatarDesign
                          value={formData.image}
                          setValue={(val: any) => {
                            setFormData((prev: any) => ({
                              ...prev,
                              image: val,
                            }));
                          }}
                          size="32"
                        />
                      ) : (
                        <CustomAvatar
                          id={`student${formData.username}`}
                          image={formData.image}
                          size="32"
                        />
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="font-medium text-lg">
                        {profileData.fullname}
                      </h3>
                      <p className="text-gray-500">{profileData.student_id}</p>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="flex-1">
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="mb-6">
                        <TabsTrigger value="info">ข้อมูลส่วนตัว</TabsTrigger>
                        <TabsTrigger value="academic">
                          ข้อมูลการศึกษา
                        </TabsTrigger>
                      </TabsList>

                      {isEditing ? (
                        <form onSubmit={handleSubmit}>
                          <TabsContent value="info" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label
                                  htmlFor="fullname"
                                  className="text-sm font-medium"
                                >
                                  ชื่อ-สกุล
                                </label>
                                <Input
                                  id="fullname"
                                  name="fullname"
                                  value={formData.fullname}
                                  onChange={handleChange}
                                  placeholder="ชื่อ-นามสกุล"
                                />
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="student_id"
                                  className="text-sm font-medium"
                                >
                                  รหัสนักศึกษา
                                </label>
                                <Input
                                  id="student_id"
                                  name="student_id"
                                  value={formData.student_id}
                                  onChange={handleChange}
                                  placeholder="รหัสนักศึกษา"
                                />
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="email"
                                  className="text-sm font-medium"
                                >
                                  อีเมล
                                </label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder="อีเมล"
                                />
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="mobile"
                                  className="text-sm font-medium"
                                >
                                  เบอร์โทรศัพท์
                                </label>
                                <Input
                                  id="mobile"
                                  name="mobile"
                                  value={formData.mobile}
                                  onChange={handleChange}
                                  placeholder="เบอร์โทรศัพท์"
                                />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <label
                                  htmlFor="address"
                                  className="text-sm font-medium"
                                >
                                  ที่อยู่
                                </label>
                                <Textarea
                                  id="address"
                                  name="address"
                                  value={formData.address}
                                  onChange={handleChange}
                                  placeholder="ที่อยู่"
                                  rows={3}
                                />
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="academic" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <label
                                  htmlFor="major"
                                  className="text-sm font-medium"
                                >
                                  สาขาวิชา
                                </label>
                                <Select
                                  value={formData.major}
                                  onValueChange={(value) =>
                                    handleSelectChange("major", value)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="เลือกสาขาวิชา" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="SCI">SCI</SelectItem>
                                    <SelectItem value="CARE">CARE</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="std_year"
                                  className="text-sm font-medium"
                                >
                                  ปีรหัส
                                </label>
                                <Select
                                  value={formData.std_year.toString()}
                                  onValueChange={(value) =>
                                    handleSelectChange("std_year", value)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="เลือกปีรหัส" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {years.map((y) => (
                                      <SelectItem key={y} value={y}>
                                        รหัส {y}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="gpa"
                                  className="text-sm font-medium"
                                >
                                  เกรดเฉลี่ย (GPA)
                                </label>
                                <Input
                                  id="gpa"
                                  name="gpa"
                                  value={formData.gpa}
                                  onChange={handleChange}
                                  placeholder="0.00"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="4.00"
                                />
                              </div>
                            </div>
                          </TabsContent>

                          <div className="mt-6 flex justify-end">
                            <Button
                              type="submit"
                              className="bg-sky-600 hover:bg-sky-700"
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                  กำลังบันทึก...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" /> บันทึกข้อมูล
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <TabsContent value="info">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    ชื่อ-สกุล
                                  </h4>
                                  <p className="font-medium">
                                    {profileData.fullname || "-"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    รหัสนักศึกษา
                                  </h4>
                                  <p className="font-medium">
                                    {profileData.student_id || "-"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    อีเมล
                                  </h4>
                                  <p className="font-medium">
                                    {profileData.email || "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    เบอร์โทรศัพท์
                                  </h4>
                                  <p className="font-medium">
                                    {profileData.mobile || "-"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    ที่อยู่
                                  </h4>
                                  <p className="font-medium">
                                    {profileData.address || "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="academic">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-/">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    สาขาวิชา
                                  </h4>
                                  <p className="font-medium">
                                    {profileData.major || "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    ปีรหัส
                                  </h4>
                                  <p className="font-medium">
                                    {profileData.std_year
                                      ? `รหัส ${profileData.std_year}`
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">
                                    เกรดเฉลี่ย (GPA)
                                  </h4>
                                  <p className="font-medium">
                                    {profileData.gpa || "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </>
                      )}
                    </Tabs>
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
