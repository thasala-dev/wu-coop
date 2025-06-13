import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon, TagIcon, FileIcon, ArrowLeftIcon, PencilIcon } from "lucide-react"
import StudentSidebar from "@/components/student-sidebar"

export default function ActivityDetail({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the activity data based on the ID
  const activityId = params.id

  // Mock data for demonstration
  const activity = {
    id: activityId,
    date: "8 มิถุนายน 2567",
    title: "เรียนรู้การใช้งาน Git และ GitHub",
    category: "การพัฒนา",
    description: `เรียนรู้การใช้งาน Git และ GitHub ในการทำงานร่วมกันเป็นทีม ได้ฝึกการสร้าง repository, การทำ branching, การสร้าง pull request และการแก้ไข conflicts

ในช่วงเช้า พี่เลี้ยงได้สอนการใช้งาน Git พื้นฐาน เช่น git init, git add, git commit, git push, git pull และการสร้าง branch

ในช่วงบ่าย ได้ทดลองทำงานร่วมกับทีมโดยใช้ GitHub ได้เรียนรู้การสร้าง Pull Request, การ Review Code และการแก้ไข Conflicts ที่เกิดขึ้น`,
    learning: `ได้เรียนรู้การใช้งาน Git และ GitHub ในการทำงานร่วมกันเป็นทีม ซึ่งเป็นทักษะที่สำคัญมากในการพัฒนาซอฟต์แวร์

เข้าใจแนวคิดของ Version Control และประโยชน์ของการใช้ Git ในการจัดการโค้ด

เรียนรู้การแก้ไข Conflicts ที่เกิดขึ้นเมื่อมีการแก้ไขไฟล์เดียวกันโดยหลายคน`,
    problems: "มีความสับสนในการใช้คำสั่ง Git บางคำสั่ง และการแก้ไข Conflicts ในครั้งแรก",
    solutions: "ศึกษาเพิ่มเติมจากเอกสารและวิดีโอสอนการใช้งาน Git และขอคำแนะนำจากพี่เลี้ยงเมื่อมีข้อสงสัย",
    tags: ["Git", "GitHub", "Version Control"],
    files: [
      { name: "git-commands-cheatsheet.pdf", size: "1.2 MB" },
      { name: "github-workflow.png", size: "450 KB" },
    ],
    createdAt: "8 มิถุนายน 2567 14:30",
    updatedAt: "8 มิถุนายน 2567 15:45",
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
              <CardHeader className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Link href="/student/activities">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ArrowLeftIcon className="h-4 w-4" />
                        กลับ
                      </Button>
                    </Link>
                  </div>
                  <CardTitle className="text-xl">{activity.title}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span>{activity.date}</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{activity.category}</Badge>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href={`/student/activities/edit/${activity.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <PencilIcon className="h-4 w-4" />
                      แก้ไข
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">รายละเอียดกิจกรรม</h3>
                    <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded-md border">
                      {activity.description}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">สิ่งที่ได้เรียนรู้</h3>
                    <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded-md border">
                      {activity.learning}
                    </div>
                  </div>

                  {activity.problems && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">ปัญหาและอุปสรรค</h3>
                      <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded-md border">
                        {activity.problems}
                      </div>
                    </div>
                  )}

                  {activity.solutions && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">แนวทางการแก้ไขปัญหา</h3>
                      <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded-md border">
                        {activity.solutions}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium mb-2">แท็ก</h3>
                    <div className="flex flex-wrap gap-2">
                      {activity.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <TagIcon className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {activity.files && activity.files.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">ไฟล์แนบ</h3>
                      <div className="space-y-2">
                        {activity.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                            <FileIcon className="h-4 w-4 text-blue-500" />
                            <span className="flex-grow">{file.name}</span>
                            <span className="text-sm text-gray-500">{file.size}</span>
                            <Button variant="ghost" size="sm">
                              ดาวน์โหลด
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>สร้างเมื่อ: {activity.createdAt}</span>
                    </div>
                    {activity.updatedAt && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>แก้ไขล่าสุด: {activity.updatedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/student/activities">
                  <Button variant="outline">กลับไปหน้ากิจกรรม</Button>
                </Link>
                <div className="flex gap-2">
                  <Button variant="outline">พิมพ์</Button>
                  <Button variant="outline">ส่งออก PDF</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
