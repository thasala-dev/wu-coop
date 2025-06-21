"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ChevronLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { AdvisorSidebar } from "@/components/advisor-sidebar";

// Mock data - ในการใช้งานจริงควรดึงข้อมูลจาก API
const companies = [
  {
    id: "1",
    name: "แหล่งฝึกงาน เอบีซี จำกัด",
    address: "123 ถนนสุขุมวิท กรุงเทพฯ",
  },
  {
    id: "2",
    name: "แหล่งฝึกงาน เอ็กซ์วายแซด จำกัด",
    address: "456 ถนนสีลม กรุงเทพฯ",
  },
  {
    id: "3",
    name: "แหล่งฝึกงาน วันทูทรี จำกัด",
    address: "789 ถนนพระราม 9 กรุงเทพฯ",
  },
];

const students = [
  { id: "1", name: "นายสมชาย ใจดี", studentId: "6012345678", company: "1" },
  {
    id: "2",
    name: "นางสาวสมหญิง รักเรียน",
    studentId: "6012345679",
    company: "1",
  },
  {
    id: "3",
    name: "นายสมศักดิ์ เก่งกาจ",
    studentId: "6012345680",
    company: "2",
  },
  {
    id: "4",
    name: "นางสาวสมใจ สุขสันต์",
    studentId: "6012345681",
    company: "3",
  },
];

// สมมติว่านี่คือข้อมูลแผนการลงพื้นที่ที่ต้องการแก้ไข
const initialVisitPlan = {
  id: "123",
  title: "ลงพื้นที่แหล่งฝึกงาน เอบีซี จำกัด",
  companyId: "1",
  date: "2025-05-15",
  startTime: "09:00",
  endTime: "12:00",
  studentIds: ["1", "2"],
  notes: "พบนักศึกษาและพี่เลี้ยง ติดตามความก้าวหน้าโครงงาน",
  isOnline: false,
};

// ฟังก์ชันช่วยในการจัดรูปแบบวันที่
function formatDateForInput(dateString: string): string {
  return dateString;
}

export default function EditVisitPlanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [visitPlan, setVisitPlan] = useState(initialVisitPlan);
  const [selectedStudents, setSelectedStudents] = useState<string[]>(
    initialVisitPlan.studentIds
  );

  // ในการใช้งานจริง ควรดึงข้อมูลแผนการลงพื้นที่จาก API โดยใช้ ID จาก URL
  useEffect(() => {
    // Fetch visit plan data
    // Example: fetchVisitPlan(id).then(data => setVisitPlan(data))
  }, []);

  const handleCompanyChange = (companyId: string) => {
    setVisitPlan((prev) => ({ ...prev, companyId }));
    // Reset selected students when company changes
    setSelectedStudents([]);
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update visit plan with selected students
      const updatedVisitPlan = {
        ...visitPlan,
        studentIds: selectedStudents,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "แผนการลงพื้นที่ถูกอัปเดตแล้ว",
        description: "แผนการลงพื้นที่ได้รับการอัปเดตเรียบร้อยแล้ว",
      });

      // Navigate back to visits page
      router.push("/advisor/visits");
    } catch (error) {
      console.error("Error updating visit plan:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตแผนการลงพื้นที่ได้ โปรดลองอีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // กรองนักศึกษาตามแหล่งฝึกงานที่เลือก
  const filteredStudents = students.filter(
    (student) => student.company === visitPlan.companyId
  );

  const selectedCompany = companies.find(
    (company) => company.id === visitPlan.companyId
  );

  return (
    <div className="grid grid-cols-5 h-screen">
      <AdvisorSidebar />

      <div className="col-span-4 p-6 overflow-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => router.push("/advisor/visits")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            กลับ
          </Button>
          <h1 className="text-2xl font-bold">แก้ไขแผนการลงพื้นที่</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>รายละเอียดการลงพื้นที่</CardTitle>
                <CardDescription>
                  แก้ไขข้อมูลพื้นฐานของการลงพื้นที่
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">หัวข้อการลงพื้นที่</Label>
                  <Input
                    id="title"
                    value={visitPlan.title}
                    onChange={(e) =>
                      setVisitPlan((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">แหล่งฝึกงาน</Label>
                  <Select
                    value={visitPlan.companyId}
                    onValueChange={handleCompanyChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกแหล่งฝึกงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCompany && (
                  <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{selectedCompany.address}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="date">วันที่ลงพื้นที่</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formatDateForInput(visitPlan.date)}
                    onChange={(e) =>
                      setVisitPlan((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">เวลาเริ่มต้น</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={visitPlan.startTime}
                      onChange={(e) =>
                        setVisitPlan((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">เวลาสิ้นสุด</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={visitPlan.endTime}
                      onChange={(e) =>
                        setVisitPlan((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isOnline"
                    checked={visitPlan.isOnline}
                    onCheckedChange={(checked) =>
                      setVisitPlan((prev) => ({
                        ...prev,
                        isOnline: checked === true,
                      }))
                    }
                  />
                  <Label htmlFor="isOnline">ลงพื้นที่แบบออนไลน์</Label>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>นักศึกษาที่จะพบ</CardTitle>
                  <CardDescription>
                    เลือกนักศึกษาที่จะพบในการลงพื้นที่ครั้งนี้
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredStudents.length > 0 ? (
                    <div className="space-y-2">
                      {filteredStudents.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-muted"
                        >
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() =>
                              handleStudentToggle(student.id)
                            }
                          />
                          <Label
                            htmlFor={`student-${student.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div>{student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.studentId}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {visitPlan.companyId
                        ? "ไม่พบนักศึกษาในแหล่งฝึกงานนี้"
                        : "กรุณาเลือกแหล่งฝึกงานก่อน"}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>บันทึกเพิ่มเติม</CardTitle>
                  <CardDescription>
                    รายละเอียดเพิ่มเติมเกี่ยวกับการลงพื้นที่
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="บันทึกรายละเอียดเพิ่มเติม..."
                    className="min-h-[120px]"
                    value={visitPlan.notes}
                    onChange={(e) =>
                      setVisitPlan((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/advisor/visits")}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedStudents.length === 0}
            >
              {isLoading ? (
                <>กำลังบันทึก...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  บันทึกการแก้ไข
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
