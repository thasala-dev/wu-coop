"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import StudentSidebar from "@/components/student-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, User } from "lucide-react";

export default function StudentProfile() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          description: data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StudentSidebar activePage="profile" />
          
          <div className="md:col-span-3 space-y-6">
            <Card className="border-blue-200 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">ข้อมูลส่วนตัว</CardTitle>
                  <Button
                    variant={isEditing ? "secondary" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "bg-white text-blue-700" : "bg-white text-blue-700"}
                  >
                    {isEditing ? "ยกเลิกการแก้ไข" : "แก้ไขข้อมูล"}
                  </Button>
                </div>
                <CardDescription className="text-blue-100">
                  ข้อมูลส่วนตัวของนักศึกษาสหกิจศึกษา
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center space-y-4 mb-6 md:mb-0">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage 
                        src={profileData.image || "/placeholder-user.jpg"} 
                        alt={profileData.fullname} 
                      />
                      <AvatarFallback>
                        <User className="h-16 w-16 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{profileData.fullname}</h3>
                      <p className="text-gray-500">{profileData.student_id}</p>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="flex-1">
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="mb-6">
                        <TabsTrigger value="info">ข้อมูลส่วนตัว</TabsTrigger>
                        <TabsTrigger value="academic">ข้อมูลการศึกษา</TabsTrigger>
                      </TabsList>
                      
                      {isEditing ? (
                        <form onSubmit={handleSubmit}>
                          <TabsContent value="info" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label htmlFor="fullname" className="text-sm font-medium">ชื่อ-สกุล</label>
                                <Input 
                                  id="fullname" 
                                  name="fullname"
                                  value={formData.fullname}
                                  onChange={handleChange}
                                  placeholder="ชื่อ-นามสกุล"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="student_id" className="text-sm font-medium">รหัสนักศึกษา</label>
                                <Input 
                                  id="student_id" 
                                  name="student_id"
                                  value={formData.student_id}
                                  onChange={handleChange}
                                  placeholder="รหัสนักศึกษา"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">อีเมล</label>
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
                                <label htmlFor="mobile" className="text-sm font-medium">เบอร์โทรศัพท์</label>
                                <Input 
                                  id="mobile" 
                                  name="mobile"
                                  value={formData.mobile}
                                  onChange={handleChange}
                                  placeholder="เบอร์โทรศัพท์"
                                />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <label htmlFor="address" className="text-sm font-medium">ที่อยู่</label>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label htmlFor="faculty" className="text-sm font-medium">คณะ</label>
                                <Input 
                                  id="faculty" 
                                  name="faculty"
                                  value={formData.faculty}
                                  onChange={handleChange}
                                  placeholder="คณะ"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="major" className="text-sm font-medium">สาขาวิชา</label>
                                <Input 
                                  id="major" 
                                  name="major"
                                  value={formData.major}
                                  onChange={handleChange}
                                  placeholder="สาขาวิชา"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="std_year" className="text-sm font-medium">ชั้นปี</label>
                                <Select 
                                  value={formData.std_year.toString()} 
                                  onValueChange={(value) => handleSelectChange("std_year", value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="เลือกชั้นปี" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">ปี 1</SelectItem>
                                    <SelectItem value="2">ปี 2</SelectItem>
                                    <SelectItem value="3">ปี 3</SelectItem>
                                    <SelectItem value="4">ปี 4</SelectItem>
                                    <SelectItem value="5">ปี 5</SelectItem>
                                    <SelectItem value="6">ปี 6</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="gpa" className="text-sm font-medium">เกรดเฉลี่ย (GPA)</label>
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
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                              {isSaving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังบันทึก...
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
                                  <h4 className="text-sm font-medium text-gray-500">ชื่อ-สกุล</h4>
                                  <p className="font-medium">{profileData.fullname || "-"}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">รหัสนักศึกษา</h4>
                                  <p className="font-medium">{profileData.student_id || "-"}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">อีเมล</h4>
                                  <p className="font-medium">{profileData.email || "-"}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</h4>
                                  <p className="font-medium">{profileData.mobile || "-"}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">ที่อยู่</h4>
                                  <p className="font-medium">{profileData.address || "-"}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="academic">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">คณะ</h4>
                                  <p className="font-medium">{profileData.faculty || "-"}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">สาขาวิชา</h4>
                                  <p className="font-medium">{profileData.major || "-"}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">ชั้นปี</h4>
                                  <p className="font-medium">
                                    {profileData.std_year ? `ปี ${profileData.std_year}` : "-"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">เกรดเฉลี่ย (GPA)</h4>
                                  <p className="font-medium">{profileData.gpa || "-"}</p>
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
