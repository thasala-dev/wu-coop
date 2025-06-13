import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import StudentSidebar from "@/components/student-sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewActivity() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">ระบบสหกิจศึกษา (นักศึกษา)</h1>
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StudentSidebar activePage="activities" />

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">บันทึกกิจกรรมใหม่</CardTitle>
                <CardDescription>บันทึกกิจกรรมที่ทำในวันนี้</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="activity-date">วันที่ทำกิจกรรม</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="activity-date"
                          type="date"
                          className="pl-10"
                          defaultValue={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity-category">ประเภทกิจกรรม</Label>
                      <Select>
                        <SelectTrigger id="activity-category">
                          <SelectValue placeholder="เลือกประเภทกิจกรรม" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">การพัฒนา</SelectItem>
                          <SelectItem value="learning">การเรียนรู้</SelectItem>
                          <SelectItem value="meeting">การประชุม</SelectItem>
                          <SelectItem value="research">การค้นคว้าวิจัย</SelectItem>
                          <SelectItem value="testing">การทดสอบ</SelectItem>
                          <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-title">หัวข้อกิจกรรม</Label>
                    <Input id="activity-title" placeholder="ระบุหัวข้อกิจกรรมที่ทำ" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-description">รายละเอียดกิจกรรม</Label>
                    <Textarea
                      id="activity-description"
                      placeholder="อธิบายรายละเอียดของกิจกรรมที่ทำ"
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-learning">สิ่งที่ได้เรียนรู้</Label>
                    <Textarea
                      id="activity-learning"
                      placeholder="อธิบายสิ่งที่ได้เรียนรู้จากกิจกรรมนี้"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-problems">ปัญหาและอุปสรรค (ถ้ามี)</Label>
                    <Textarea
                      id="activity-problems"
                      placeholder="อธิบายปัญหาและอุปสรรคที่พบ (ถ้ามี)"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-solutions">แนวทางการแก้ไขปัญหา (ถ้ามี)</Label>
                    <Textarea
                      id="activity-solutions"
                      placeholder="อธิบายแนวทางการแก้ไขปัญหา (ถ้ามี)"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-tags">แท็ก (คั่นด้วยเครื่องหมายคอมม่า)</Label>
                    <Input id="activity-tags" placeholder="เช่น React, Next.js, Web Development" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-files">แนบไฟล์ (ถ้ามี)</Label>
                    <Input id="activity-files" type="file" multiple />
                    <p className="text-xs text-gray-500 mt-1">
                      สามารถแนบไฟล์ได้สูงสุด 5 ไฟล์ ขนาดไม่เกิน 10MB ต่อไฟล์ (รองรับไฟล์ .pdf, .doc, .docx, .jpg, .png)
                    </p>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/student/activities">
                  <Button variant="outline">ยกเลิก</Button>
                </Link>
                <Button>บันทึกกิจกรรม</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
