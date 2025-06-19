import Link from "next/link";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  FileTextIcon,
  BriefcaseIcon,
  UserIcon,
  BookOpenIcon,
  ClipboardListIcon,
} from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">ระบบฝึกงาน</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">นายสมชาย ใจดี</span>
              <Link href="/">
                <Button variant="outline" size="sm">
                  ออกจากระบบ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">เมนูหลัก</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    <span>หน้าหลัก</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 rounded-md"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>ข้อมูลส่วนตัว</span>
                  </Link>
                  <Link
                    href="/dashboard/jobs"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <BriefcaseIcon className="h-4 w-4" />
                    <span>ตำแหน่งงาน</span>
                  </Link>
                  <Link
                    href="/dashboard/documents"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    <span>เอกสาร</span>
                  </Link>
                  <Link
                    href="/dashboard/schedule"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span>ตารางนัดหมาย</span>
                  </Link>
                  <Link
                    href="/dashboard/reports"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <ClipboardListIcon className="h-4 w-4" />
                    <span>รายงานผล</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">ข้อมูลส่วนตัว</CardTitle>
                <CardDescription>แก้ไขข้อมูลส่วนตัวของคุณ</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal">
                  <TabsList className="mb-4">
                    <TabsTrigger value="personal">ข้อมูลส่วนตัว</TabsTrigger>
                    <TabsTrigger value="education">ข้อมูลการศึกษา</TabsTrigger>
                    <TabsTrigger value="skills">ทักษะและความสามารถ</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal">
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                            <UserIcon className="h-16 w-16 text-gray-400" />
                          </div>
                          <Button variant="outline" size="sm">
                            อัพโหลดรูปภาพ
                          </Button>
                        </div>

                        <div className="w-full md:w-2/3 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">ชื่อ</Label>
                              <Input id="firstName" defaultValue="สมชาย" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">นามสกุล</Label>
                              <Input id="lastName" defaultValue="ใจดี" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="studentId">รหัสนักศึกษา</Label>
                              <Input
                                id="studentId"
                                defaultValue="6412345678"
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="faculty">คณะ</Label>
                              <Input
                                id="faculty"
                                defaultValue="วิศวกรรมศาสตร์"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="major">สาขาวิชา</Label>
                              <Input
                                id="major"
                                defaultValue="วิศวกรรมคอมพิวเตอร์"
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="advisor">อาจารย์ที่ปรึกษา</Label>
                              <Input
                                id="advisor"
                                defaultValue="ผศ.ดร. วิชาญ นักสอน"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">ข้อมูลการติดต่อ</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">อีเมล</Label>
                            <Input
                              id="email"
                              type="email"
                              defaultValue="somchai.j@university.ac.th"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                            <Input id="phone" defaultValue="0812345678" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">ที่อยู่</Label>
                          <textarea
                            id="address"
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            defaultValue="123 หมู่ 4 ตำบลคลองหนึ่ง อำเภอคลองหลวง จังหวัดปทุมธานี 12120"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergency">ผู้ติดต่อฉุกเฉิน</Label>
                          <Input
                            id="emergency"
                            defaultValue="นางสมศรี ใจดี (มารดา) - 0898765432"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button>บันทึกข้อมูล</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="education">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">ข้อมูลการศึกษา</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="gpa">เกรดเฉลี่ยสะสม (GPAX)</Label>
                            <Input id="gpa" defaultValue="3.45" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="credits">
                              หน่วยกิตที่ลงทะเบียนแล้ว
                            </Label>
                            <Input id="credits" defaultValue="120" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="courses">
                            วิชาที่ผ่านการเรียนแล้ว (ที่เกี่ยวข้องกับฝึกงาน)
                          </Label>
                          <textarea
                            id="courses"
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            defaultValue="- การเขียนโปรแกรมคอมพิวเตอร์ 1 (A)
- การเขียนโปรแกรมคอมพิวเตอร์ 2 (B+)
- โครงสร้างข้อมูลและอัลกอริทึม (A)
- ระบบฐานข้อมูล (B+)
- การพัฒนาเว็บแอปพลิเคชัน (A)
- การพัฒนาแอปพลิเคชันบนมือถือ (B)"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">ประวัติการศึกษา</h3>

                        <div className="border p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="highSchool">โรงเรียนมัธยม</Label>
                              <Input
                                id="highSchool"
                                defaultValue="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="highSchoolProgram">
                                แผนการเรียน
                              </Label>
                              <Input
                                id="highSchoolProgram"
                                defaultValue="วิทยาศาสตร์-คณิตศาสตร์"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="highSchoolGPA">เกรดเฉลี่ย</Label>
                              <Input id="highSchoolGPA" defaultValue="3.85" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="highSchoolYear">
                                ปีที่จบการศึกษา
                              </Label>
                              <Input id="highSchoolYear" defaultValue="2564" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button>บันทึกข้อมูล</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          ทักษะและความสามารถ
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="programmingSkills">
                            ทักษะการเขียนโปรแกรม
                          </Label>
                          <textarea
                            id="programmingSkills"
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            defaultValue="- JavaScript/TypeScript (ดีมาก)
- Python (ดี)
- Java (ปานกลาง)
- C/C++ (พื้นฐาน)
- HTML/CSS (ดีมาก)
- SQL (ดี)"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="frameworks">
                            เฟรมเวิร์คและไลบรารี
                          </Label>
                          <textarea
                            id="frameworks"
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            defaultValue="- React.js (ดีมาก)
- Next.js (ดี)
- Node.js (ดี)
- Express.js (ดี)
- TailwindCSS (ดีมาก)
- Bootstrap (ดี)"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tools">เครื่องมือและเทคโนโลยี</Label>
                          <textarea
                            id="tools"
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            defaultValue="- Git/GitHub (ดี)
- Docker (พื้นฐาน)
- VS Code (ดีมาก)
- MySQL (ดี)
- MongoDB (ปานกลาง)
- Firebase (ดี)"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="languages">ทักษะภาษา</Label>
                          <textarea
                            id="languages"
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            defaultValue="- ภาษาไทย (เจ้าของภาษา)
- ภาษาอังกฤษ (ดี - TOEIC 750 คะแนน)"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="certificates">
                            ประกาศนียบัตรและการอบรม
                          </Label>
                          <textarea
                            id="certificates"
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            defaultValue="- Google Developer Certificate - 2023
- Microsoft Azure Fundamentals (AZ-900) - 2022
- React Developer Bootcamp - Udemy - 2022
- Data Science with Python - Coursera - 2021"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button>บันทึกข้อมูล</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
