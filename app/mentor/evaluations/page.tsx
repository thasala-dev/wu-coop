import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClipboardListIcon, UserIcon, AlertCircleIcon, SearchIcon } from "lucide-react"
import MentorSidebar from "@/components/mentor-sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MentorEvaluations() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">ระบบสหกิจศึกษา (พี่เลี้ยง)</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">คุณปรียา มากความรู้</span>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <MentorSidebar activePage="evaluations" />

          <div className="md:col-span-4">
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">การประเมินนักศึกษา</CardTitle>
                  <CardDescription>ประเมินผลการปฏิบัติงานของนักศึกษาในความดูแล</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="ค้นหานักศึกษา..."
                      className="pl-10 pr-4 py-2 border rounded-md w-full md:w-[200px]"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="ทั้งหมด" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="pending">รอดำเนินการ</SelectItem>
                      <SelectItem value="completed">เสร็จสิ้นแล้ว</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="progress">
                  <TabsList className="mb-4">
                    <TabsTrigger value="progress">ประเมินความก้าวหน้า</TabsTrigger>
                    <TabsTrigger value="final">ประเมินผลสิ้นสุด</TabsTrigger>
                    <TabsTrigger value="reports">รายงานการประเมิน</TabsTrigger>
                  </TabsList>

                  <TabsContent value="progress">
                    <div className="space-y-6">
                      <div className="border rounded-md p-4 bg-orange-50 border-orange-200">
                        <div className="flex items-center gap-3">
                          <AlertCircleIcon className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="font-medium">กำหนดส่งประเมินความก้าวหน้าครั้งที่ 1: 15 ก.ค. 2567 (อีก 7 วัน)</div>
                            <div className="text-sm text-gray-600">โปรดประเมินนักศึกษาในความดูแลทั้งหมดภายในกำหนด</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">นายวิชัย เรียนดี</h3>
                              <p className="text-sm text-gray-600">รหัสนักศึกษา: 64123456101</p>
                              <p className="text-sm text-gray-600">ตำแหน่ง: Web Developer</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">รอการประเมิน</Badge>
                                <span className="text-sm text-gray-500">กำหนดส่ง: 15 ก.ค. 2567</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Link href="/mentor/evaluations/1">
                              <Button size="sm" className="w-full">
                                ประเมินความก้าวหน้า
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">นางสาวนภา สุขใจ</h3>
                              <p className="text-sm text-gray-600">รหัสนักศึกษา: 64123456102</p>
                              <p className="text-sm text-gray-600">ต��แหน่ง: Mobile Developer</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">รอการประเมิน</Badge>
                                <span className="text-sm text-gray-500">กำหนดส่ง: 15 ก.ค. 2567</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Link href="/mentor/evaluations/2">
                              <Button size="sm" className="w-full">
                                ประเมินความก้าวหน้า
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">นายสมชาย ใจดี</h3>
                              <p className="text-sm text-gray-600">รหัสนักศึกษา: 64123456789</p>
                              <p className="text-sm text-gray-600">ตำแหน่ง: Backend Developer</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">รอการประเมิน</Badge>
                                <span className="text-sm text-gray-500">กำหนดส่ง: 15 ก.ค. 2567</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Link href="/mentor/evaluations/3">
                              <Button size="sm" className="w-full">
                                ประเมินความก้าวหน้า
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="final">
                    <div className="border rounded-md p-4 bg-blue-50 border-blue-200 mb-6">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">กำหนดส่งการประเมินผลสิ้นสุด: 30 ก.ย. 2567</div>
                          <div className="text-sm text-gray-600">ยังไม่ถึงกำหนดการประเมินผลสิ้นสุด</div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">นายวิชัย เรียนดี</h3>
                            <p className="text-sm text-gray-600">รหัสนักศึกษา: 64123456101</p>
                            <p className="text-sm text-gray-600">ตำแหน่ง: Web Developer</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">ยังไม่ถึงกำหนด</Badge>
                              <span className="text-sm text-gray-500">กำหนดส่ง: 30 ก.ย. 2567</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" disabled>
                            ประเมินผลสิ้นสุด
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reports">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">รายงานการประเมินทั้งหมด</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-blue-600">0/5</div>
                            <p className="text-sm text-gray-500 mt-1">การประเมินที่ส่งแล้ว</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">ความก้าวหน้าครั้งที่ 1</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-orange-600">0/5</div>
                            <p className="text-sm text-gray-500 mt-1">กำหนดส่ง: 15 ก.ค. 2567</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">การประเมินผลสิ้นสุด</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-gray-400">0/5</div>
                            <p className="text-sm text-gray-500 mt-1">กำหนดส่ง: 30 ก.ย. 2567</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-4">รายงานการประเมินที่ส่งแล้ว</h3>
                        <div className="text-center py-8 text-gray-500">
                          <ClipboardListIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>ยังไม่มีรายงานการประเมิน</p>
                          <p className="text-sm">รายงานการประเมินจะแสดงที่นี่เมื่อคุณทำการประเมินนักศึกษา</p>
                        </div>
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
  )
}
