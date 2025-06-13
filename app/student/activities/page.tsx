import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, PlusIcon, SearchIcon } from "lucide-react"
import StudentSidebar from "@/components/student-sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StudentActivities() {
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
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">บันทึกกิจกรรมการปฏิบัติงาน</CardTitle>
                  <CardDescription>บันทึกกิจกรรมที่ทำในแต่ละวันระหว่างการฝึกงาน</CardDescription>
                </div>
                <Link href="/student/activities/new">
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    บันทึกกิจกรรมใหม่
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-lg font-medium">บันทึกประจำวัน</h3>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input placeholder="ค้นหากิจกรรม..." className="pl-10" />
                      </div>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="ทั้งหมด" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทั้งหมด</SelectItem>
                          <SelectItem value="june">มิถุนายน 2567</SelectItem>
                          <SelectItem value="july">กรกฎาคม 2567</SelectItem>
                          <SelectItem value="august">สิงหาคม 2567</SelectItem>
                          <SelectItem value="september">กันยายน 2567</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border p-4 rounded-lg hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">8 มิถุนายน 2567</span>
                            <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">การพัฒนา</Badge>
                          </div>
                          <h3 className="font-medium text-lg">เรียนรู้การใช้งาน Git และ GitHub</h3>
                          <p className="text-sm text-gray-600 mt-2">
                            เรียนรู้การใช้งาน Git และ GitHub ในการทำงานร่วมกันเป็นทีม ได้ฝึกการสร้าง repository, การทำ branching,
                            การสร้าง pull request และการแก้ไข conflicts
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline">Git</Badge>
                            <Badge variant="outline">GitHub</Badge>
                            <Badge variant="outline">Version Control</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 min-w-[120px] self-start">
                          <Link href="/student/activities/edit/1">
                            <Button variant="outline" size="sm">
                              แก้ไข
                            </Button>
                          </Link>
                          <Link href="/student/activities/1">
                            <Button size="sm">ดูรายละเอียด</Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="border p-4 rounded-lg hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">7 มิถุนายน 2567</span>
                            <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">การพัฒนา</Badge>
                          </div>
                          <h3 className="font-medium text-lg">ศึกษาโครงสร้างโปรเจค React และ Next.js</h3>
                          <p className="text-sm text-gray-600 mt-2">
                            ศึกษาโครงสร้างโปรเจค เรียนรู้การใช้งาน React และ Next.js เพื่อพัฒนาเว็บแอปพลิเคชัน
                            ทดลองสร้างคอมโพเนนต์อย่างง่ายและทำความเข้าใจการทำงานของ routing
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline">React</Badge>
                            <Badge variant="outline">Next.js</Badge>
                            <Badge variant="outline">Web Development</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 min-w-[120px] self-start">
                          <Link href="/student/activities/edit/2">
                            <Button variant="outline" size="sm">
                              แก้ไข
                            </Button>
                          </Link>
                          <Link href="/student/activities/2">
                            <Button size="sm">ดูรายละเอียด</Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="border p-4 rounded-lg hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">6 มิถุนายน 2567</span>
                            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">การเรียนรู้</Badge>
                          </div>
                          <h3 className="font-medium text-lg">อบรมการใช้งานระบบภายในบริษัท</h3>
                          <p className="text-sm text-gray-600 mt-2">
                            เข้าร่วมการอบรมการใช้งานระบบภายในบริษัท ได้เรียนรู้เกี่ยวกับระบบจัดการโปรเจค, ระบบรายงานเวลา,
                            และระบบการจัดการเอกสาร ทำความเข้าใจกระบวนการทำงานและขั้นตอนการพัฒนาซอฟต์แวร์ของบริษัท
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline">ระบบภายใน</Badge>
                            <Badge variant="outline">การอบรม</Badge>
                            <Badge variant="outline">กระบวนการทำงาน</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 min-w-[120px] self-start">
                          <Link href="/student/activities/edit/3">
                            <Button variant="outline" size="sm">
                              แก้ไข
                            </Button>
                          </Link>
                          <Link href="/student/activities/3">
                            <Button size="sm">ดูรายละเอียด</Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="border p-4 rounded-lg hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">5 มิถุนายน 2567</span>
                            <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100">การประชุม</Badge>
                          </div>
                          <h3 className="font-medium text-lg">ประชุมทีมและรับมอบหมายงาน</h3>
                          <p className="text-sm text-gray-600 mt-2">
                            เข้าร่วมประชุมทีมพัฒนาเพื่อรับทราบภาพรวมของโปรเจค ได้รับมอบหมายงานในส่วนของการพัฒนาหน้า UI
                            สำหรับระบบจัดการข้อมูลลูกค้า พร้อมทั้งได้รับคำแนะนำจากพี่เลี้ยงเกี่ยวกับแนวทางการพัฒนา
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline">การประชุม</Badge>
                            <Badge variant="outline">มอบหมายงาน</Badge>
                            <Badge variant="outline">UI</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 min-w-[120px] self-start">
                          <Link href="/student/activities/edit/4">
                            <Button variant="outline" size="sm">
                              แก้ไข
                            </Button>
                          </Link>
                          <Link href="/student/activities/4">
                            <Button size="sm">ดูรายละเอียด</Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button variant="outline">โหลดเพิ่มเติม</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
