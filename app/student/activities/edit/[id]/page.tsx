import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import StudentSidebar from "@/components/student-sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditActivity({ params }: { params: { id: string } }) {
  const activityId = params.id

  // Mock data for demonstration
  const activity = {
    id: activityId,
    date: "2023-06-08",
    title: "เรียนรู้การใช้งาน Git และ GitHub",
    category: "development",
    description: `เรียนรู้การใช้งาน Git และ GitHub ในการทำงานร่วมกันเป็นทีม ได้ฝึกการสร้าง repository, การทำ branching, การสร้าง pull request และการแก้ไข conflicts

ในช่วงเช้า พี่เลี้ยงได้สอนการใช้งาน Git พื้นฐาน เช่น git init, git add, git commit, git push, git pull และการสร้าง branch

ในช่วงบ่าย ได้ทดลองทำงานร่วมกับทีมโดยใช้ GitHub ได้เรียนรู้การสร้าง Pull Request, การ Review Code และการแก้ไข Conflicts ที่เกิดขึ้น`,
    learning: `ได้เรียนรู้การใช้งาน Git และ GitHub ในการทำงานร่วมกันเป็นทีม ซึ่งเป็นทักษะที่สำคัญมากในการพัฒนาซอฟต์แวร์

เข้าใจแนวคิดของ Version Control และประโยชน์ของการใช้ Git ในการจัดการโค้ด

เรียนรู้การแก้ไข Conflicts ที่เกิดขึ้นเมื่อมีการแก้ไขไฟล์เดียวกันโดยหลายคน`,
    problems: "มีความสับสนในการใช้คำสั่ง Git บางคำสั่ง และการแก้ไข Conflicts ในครั้งแรก",
    solutions: "ศึกษาเพิ่มเติมจากเอกสารและวิดีโอสอนการใช้งาน Git และขอคำแนะนำจากพี่เลี้ยงเมื่อมีข้อสงสัย",
    tags: "Git, GitHub, Version Control",
  }

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
                <CardTitle className="text-xl">แก้ไขกิจกรรม</CardTitle>
                <CardDescription>แก้ไขรายละเอียดกิจกรรมที่บันทึกไว้</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="activity-date">วันที่ทำกิจกรรม</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input id="activity-date" type="date" className="pl-10" defaultValue={activity.date} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity-category">ประเภทกิจกรรม</Label>
                      <Select defaultValue={activity.category}>
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
                    <Input id="activity-title" defaultValue={activity.title} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-description">รายละเอียดกิจกรรม</Label>
                    <Textarea id="activity-description" className="min-h-[150px]" defaultValue={activity.description} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-learning">สิ่งที่ได้เรียนรู้</Label>
                    <Textarea id="activity-learning" className="min-h-[100px]" defaultValue={activity.learning} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-problems">ปัญหาและอุปสรรค (ถ้ามี)</Label>
                    <Textarea id="activity-problems" className="min-h-[100px]" defaultValue={activity.problems} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-solutions">แนวทางการแก้ไขปัญหา (ถ้ามี)</Label>
                    <Textarea id="activity-solutions" className="min-h-[100px]" defaultValue={activity.solutions} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-tags">แท็ก (คั่นด้วยเครื่องหมายคอมม่า)</Label>
                    <Input id="activity-tags" defaultValue={activity.tags} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-files">แนบไฟล์เพิ่มเติม (ถ้ามี)</Label>
                    <Input id="activity-files" type="file" multiple />
                    <p className="text-xs text-gray-500 mt-1">
                      สามารถแนบไฟล์ได้สูงสุด 5 ไฟล์ ขนาดไม่เกิน 10MB ต่อไฟล์ (รองรับไฟล์ .pdf, .doc, .docx, .jpg, .png)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>ไฟล์ที่แนบไว้แล้ว</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>git-commands-cheatsheet.pdf (1.2 MB)</span>
                        <Button variant="outline" size="sm">
                          ลบ
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>github-workflow.png (450 KB)</span>
                        <Button variant="outline" size="sm">
                          ลบ
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/student/activities/${activityId}`}>
                  <Button variant="outline">ยกเลิก</Button>
                </Link>
                <Button>บันทึกการแก้ไข</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
