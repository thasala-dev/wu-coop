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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, User, Camera } from "lucide-react";
import { callUploadApi } from "@/lib/file-api";
import AvatarDesign from "@/components/AvatarDesign";
import CustomAvatar from "@/components/avatar";
import Loading from "@/components/loading";

export default function StudentProfile() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";
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
    image: "",
    username: "",
    password: "",
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
      const response = await fetch(`/api/advisor/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setProfileData(data.data);
        setFormData({
          fullname: data.data.fullname || "",
          student_id: data.data.student_id || "",
          email: data.data.email || "",
          mobile: data.data.mobile || "",
          username: data.data.username || "",
          password: "",
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

    if (!user?.id) {
      toast({
        title: "ไม่สามารถบันทึกข้อมูลได้",
        description: "กรุณาเข้าสู่ระบบอีกครั้ง",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    const payload = formData; // Ensure 'image' field reflects the latest status
    if (payload.password === "") {
      delete payload.password; // ลบ password ออกจาก payload หากเป็นค่าว่าง
    }

    try {
      const response = await fetch(`/api/advisor/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
          <Sidebar activePage="profile" userType="advisor" />

          <div className="md:col-span-4">
            <Card className="border-sky-200 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">ข้อมูลส่วนตัว</CardTitle>
                  <Button
                    variant={isEditing ? "secondary" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    className={
                      isEditing
                        ? "bg-white text-fuchsia-700"
                        : "bg-white text-fuchsia-700"
                    }
                  >
                    {isEditing ? "ยกเลิกการแก้ไข" : "แก้ไขข้อมูล"}
                  </Button>
                </div>
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label
                                  htmlFor="username"
                                  className="text-sm font-medium"
                                >
                                  Username
                                </label>
                                <Input
                                  id="username"
                                  name="username"
                                  value={formData.username}
                                  disabled
                                  onChange={handleChange}
                                  placeholder="Username"
                                />
                              </div>
                              <div className="space-y-2">
                                <label
                                  htmlFor="email"
                                  className="text-sm font-medium"
                                >
                                  Password (หากไม่ต้องการเปลี่ยนให้เว้นว่างไว้)
                                </label>
                                <Input
                                  id="password"
                                  name="password"
                                  type="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  placeholder="password"
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
