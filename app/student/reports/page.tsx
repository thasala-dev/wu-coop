import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  PlusIcon,
  SearchIcon,
  FileTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  EyeIcon,
  PencilIcon,
  FilterIcon,
  CalendarIcon,
  BookOpenIcon,
  BarChartIcon,
  FileIcon,
} from "lucide-react"
import StudentSidebar from "@/components/student-sidebar"

export default function StudentReports() {
  // Mock data for reports
  const reports = {
    weekly: [
      {
        id: 1,
        title: "รายงานประจำสัปดาห์ที่ 1",
        period: "1-7 มิถุนายน 2567",
        submissionDate: "7 มิถุนายน 2567",
        status: "submitted",
        feedback: "ดีมาก มีการอธิบายงานที่ทำได้ชัดเจน",
        grade: "A",
      },
      {
        id: 2,
        title: "รายงานประจำสัปดาห์ที่ 2",
        period: "8-14 มิถุนายน 2567",
        submissionDate: "14 มิถุนายน 2567",
        status: "submitted",
        feedback: "ดี แต่ควรเพิ่มรายละเอียดของงานที่ทำให้มากขึ้น",
        grade: "B+",
      },
      {
        id: 3,
        title: "รายงานประจำสัปดาห์ที่ 3",
        period: "15-21 มิถุนายน 2567",
        submissionDate: "21 มิถุนายน 2567",
        status: "submitted",
        feedback: "ดีมาก มีการแสดงตัวอย่างงานที่ทำได้ชัดเจน",
        grade: "A",
      },
      {
        id: 4,
        title: "รายงานประจำสัปดาห์ที่ 4",
        period: "22-28 มิถุนายน 2567",
        submissionDate: "28 มิถุนายน 2567",
        status: "submitted",
        feedback: "ดี มีการอธิบายปัญหาและวิธีแก้ไขได้ดี",
        grade: "A-",
      },
      {
        id: 5,
        title: "รายงานประจำสัปดาห์ที่ 5",
        period: "29 มิถุนายน - 5 กรกฎาคม 2567",
        submissionDate: "5 กรกฎาคม 2567",
        status: "submitted",
        feedback: "ดีมาก มีการแสดงความก้าวหน้าของงานได้ชัดเจน",
        grade: "A",
      },
      {
        id: 6,
        title: "รายงานประจำสัปดาห์ที่ 6",
        period: "6-12 กรกฎาคม 2567",
        submissionDate: "12 กรกฎาคม 2567",
        status: "pending",
        dueDate: "12 กรกฎาคม 2567",
      },
    ],
    progress: [
      {
        id: 1,
        title: "รายงานความก้าวหน้าครั้งที่ 1",
        period: "1 มิถุนายน - 15 กรกฎาคม 2567",
        dueDate: "15 กรกฎาคม 2567",
        status: "pending",
        description: "รายงานความก้าวหน้าของการปฏิบัติงานในช่วง 1.5 เดือนแรก",
      },
      {
        id: 2,
        title: "รายงานความก้าวหน้าครั้งที่ 2",
        period: "16 กรกฎาคม - 15 สิงหาคม 2567",
        dueDate: "15 สิงหาคม 2567",
        status: "upcoming",
        description: "รายงานความก้าวหน้าของการปฏิบัติงานในช่วงเดือนที่ 2-3",
      },
    ],
    final: [
      {
        id: 1,
        title: "รายงานฉบับสมบูรณ์",
        period: "1 มิถุนายน - 30 กันยายน 2567",
        dueDate: "15 กันยายน 2567",
        status: "upcoming",
        description: "รายงานสรุปผลการปฏิบัติงานสหกิจศึกษาทั้งหมด",
      },
      {
        id: 2,
        title: "สไลด์นำเสนอผลงาน",
        period: "1 มิถุนายน - 30 กันยายน 2567",
        dueDate: "20 กันยายน 2567",
        status: "upcoming",
        description: "สไลด์สำหรับการนำเสนอผลการปฏิบัติงานสหกิจศึกษา",
      },
    ],
  }

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">ส่งแล้ว</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">รอส่ง</Badge>
      case "upcoming":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">ยังไม่ถึงกำหนด</Badge>
      case "late":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">เลยกำหนด</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">ไม่ผ่าน</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">ไม่ระบุ</Badge>
    }
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
          <StudentSidebar activePage="reports" />

          <div className="md:col-span-3">
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">รายงานผลการปฏิบัติงาน</CardTitle>
                  <CardDescription>จัดการรายงานและเอกสารที่ต้องส่งทั้งหมด</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href="/student/reports/new">
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      สร้างรายงานใหม่
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weekly">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <TabsList>
                      <TabsTrigger value="weekly">รายงานประจำสัปดาห์</TabsTrigger>
                      <TabsTrigger value="progress">รายงานความก้าวหน้า</TabsTrigger>
                      <TabsTrigger value="final">รายงานฉบับสมบูรณ์</TabsTrigger>
                      <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input placeholder="ค้นหารายงาน..." className="pl-10" />
                      </div>
                      <Button variant="outline" size="icon">
                        <FilterIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="weekly">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>รายงาน</TableHead>
                            <TableHead>ช่วงเวลา</TableHead>
                            <TableHead>วันที่ส่ง/กำหนดส่ง</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead>ผลการประเมิน</TableHead>
                            <TableHead className="text-right">การดำเนินการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reports.weekly.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.title}</TableCell>
                              <TableCell>{report.period}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-3.5 w-3.5 text-gray-500" />
                                  {report.submissionDate || report.dueDate}
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(report.status)}</TableCell>
                              <TableCell>
                                {report.grade ? (
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{report.grade}</Badge>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {report.status === "submitted" ? (
                                    <Link href={`/student/reports/view/${report.id}`}>
                                      <Button variant="outline" size="sm" className="gap-1">
                                        <EyeIcon className="h-3.5 w-3.5" />
                                        ดูรายงาน
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Link href={`/student/reports/edit/${report.id}`}>
                                      <Button size="sm" className="gap-1">
                                        <PencilIcon className="h-3.5 w-3.5" />
                                        {report.status === "pending" ? "ส่งรายงาน" : "สร้างรายงาน"}
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">คำแนะนำการเขียนรายงานประจำสัปดาห์</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <BookOpenIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">เนื้อหาที่ควรมี</h3>
                                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                                  <li>สรุปงานที่ได้รับมอบหมายในสัปดาห์นั้น</li>
                                  <li>รายละเอียดของงานที่ทำในแต่ละวัน</li>
                                  <li>ปัญหาที่พบและวิธีการแก้ไข</li>
                                  <li>สิ่งที่ได้เรียนรู้จากการทำงาน</li>
                                  <li>แผนงานในสัปดาห์ถัดไป</li>
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">ข้อควรทำ</h3>
                                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                                  <li>เขียนให้กระชับและชัดเจน</li>
                                  <li>แนบรูปภาพหรือตัวอย่างผลงานประกอบ (ถ้ามี)</li>
                                  <li>ส่งรายงานตรงตามกำหนดเวลา</li>
                                  <li>ตรวจสอบความถูกต้องของเนื้อหาก่อนส่ง</li>
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircleIcon className="h-4 w-4 text-red-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">ข้อควรหลีกเลี่ยง</h3>
                                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                                  <li>เขียนเนื้อหาสั้นเกินไปหรือไม่มีรายละเอียด</li>
                                  <li>คัดลอกเนื้อหาจากรายงานสัปดาห์ก่อนหน้า</li>
                                  <li>ส่งรายงานล่าช้ากว่ากำหนด</li>
                                  <li>ไม่ระบุปัญหาหรือสิ่งที่ได้เรียนรู้</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="progress">
                    <div className="space-y-6">
                      {reports.progress.map((report) => (
                        <Card key={report.id} className={report.status === "pending" ? "border-yellow-300" : ""}>
                          <CardHeader className="pb-3">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                <CardTitle className="text-lg">{report.title}</CardTitle>
                                <CardDescription>
                                  ช่วงเวลา: {report.period} • กำหนดส่ง: {report.dueDate}
                                </CardDescription>
                              </div>
                              {getStatusBadge(report.status)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">{report.description}</p>

                            <div className="mt-4 pt-4 border-t">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  <FileTextIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">
                                    {report.status === "pending"
                                      ? "กรุณาส่งรายงานภายในวันที่กำหนด"
                                      : "รายงานจะเปิดให้ส่งเมื่อถึงกำหนด"}
                                  </span>
                                </div>
                                <div>
                                  {report.status === "pending" ? (
                                    <Link href={`/student/reports/progress/${report.id}`}>
                                      <Button size="sm" className="gap-1">
                                        <PencilIcon className="h-3.5 w-3.5" />
                                        ส่งรายงาน
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Button variant="outline" size="sm" disabled>
                                      ยังไม่ถึงกำหนด
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">คำแนะนำการเขียนรายงานความก้าวหน้า</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <BarChartIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">เนื้อหาที่ควรมี</h3>
                                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                                  <li>สรุปภาพรวมของงานที่ได้รับมอบหมาย</li>
                                  <li>ความก้าวหน้าของงานเทียบกับแผนงานที่วางไว้</li>
                                  <li>ผลงานที่สำคัญที่ได้ดำเนินการในช่วงที่ผ่านมา</li>
                                  <li>ปัญหาและอุปสรรคที่พบ พร้อมวิธีการแก้ไข</li>
                                  <li>แผนการดำเนินงานในช่วงถัดไป</li>
                                  <li>ความรู้และทักษะที่ได้รับจากการปฏิบัติงาน</li>
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <FileIcon className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">รูปแบบรายงาน</h3>
                                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                                  <li>ความยาว 5-10 หน้า</li>
                                  <li>มีหน้าปก สารบัญ และบทนำ</li>
                                  <li>แบ่งเนื้อหาเป็นบทหรือหัวข้อที่ชัดเจน</li>
                                  <li>มีรูปภาพ แผนภูมิ หรือตารางประกอบตามความเหมาะสม</li>
                                  <li>มีการอ้างอิงแหล่งข้อมูล (ถ้ามี)</li>
                                  <li>ส่งในรูปแบบไฟล์ PDF</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="final">
                    <div className="space-y-6">
                      {reports.final.map((report) => (
                        <Card key={report.id}>
                          <CardHeader className="pb-3">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                <CardTitle className="text-lg">{report.title}</CardTitle>
                                <CardDescription>
                                  ช่วงเวลา: {report.period} • กำหนดส่ง: {report.dueDate}
                                </CardDescription>
                              </div>
                              {getStatusBadge(report.status)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">{report.description}</p>

                            <div className="mt-4 pt-4 border-t">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">
                                    {report.status === "upcoming"
                                      ? "รายงานจะเปิดให้ส่งเมื่อใกล้ถึงกำหนด"
                                      : "กรุณาส่งรายงานภายในวันที่กำหนด"}
                                  </span>
                                </div>
                                <div>
                                  <Button variant="outline" size="sm" disabled>
                                    ยังไม่ถึงกำหนด
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">คำแนะนำการเขียนรายงานฉบับสมบูรณ์</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <BookOpenIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">โครงสร้างรายงาน</h3>
                                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                                  <li>บทที่ 1: บทนำ (ที่มาและความสำคัญ, วัตถุประสงค์, ขอบเขตการปฏิบัติงาน)</li>
                                  <li>บทที่ 2: รายละเอียดของสถานประกอบการและงานที่ได้รับมอบหมาย</li>
                                  <li>บทที่ 3: รายละเอียดการปฏิบัติงาน (ขั้นตอน, วิธีการ, ผลลัพธ์)</li>
                                  <li>บทที่ 4: ปัญหา อุปสรรค และวิธีการแก้ไข</li>
                                  <li>บทที่ 5: สรุปผลการปฏิบัติงานและข้อเสนอแนะ</li>
                                  <li>บรรณานุกรม และภาคผนวก (ถ้ามี)</li>
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">ข้อแนะนำในการเขียน</h3>
                                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                                  <li>ใช้ภาษาทางวิชาการที่ถูกต้องและเหมาะสม</li>
                                  <li>มีการอ้างอิงแหล่งข้อมูลตามหลักวิชาการ</li>
                                  <li>แสดงรูปภาพ แผนภูมิ หรือตารางประกอบเพื่อให้เข้าใจง่าย</li>
                                  <li>เรียบเรียงเนื้อหาให้มีความต่อเนื่องและเชื่อมโยงกัน</li>
                                  <li>ตรวจสอบความถูกต้องของเนื้อหาและการพิมพ์</li>
                                  <li>ส่งรายงานในรูปแบบไฟล์ PDF ตามรูปแบบที่กำหนด</li>
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <AlertCircleIcon className="h-4 w-4 text-yellow-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">ข้อควรระวัง</h3>
                                <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                                  <li>ไม่เปิดเผยข้อมูลที่เป็นความลับของบริษัท</li>
                                  <li>ไม่คัดลอกผลงานของผู้อื่นโดยไม่มีการอ้างอิงที่เหมาะสม</li>
                                  <li>ไม่ส่งรายงานล่าช้ากว่ากำหนด</li>
                                  <li>ไม่ใช้ภาษาที่ไม่เป็นทางการหรือไม่เหมาะสม</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="all">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">รายงานที่ต้องส่งทั้งหมด</CardTitle>
                          <CardDescription>รายการรายงานทั้งหมดที่ต้องส่งในภาคการศึกษานี้</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ประเภท</TableHead>
                                  <TableHead>รายงาน</TableHead>
                                  <TableHead>กำหนดส่ง</TableHead>
                                  <TableHead>สถานะ</TableHead>
                                  <TableHead className="text-right">การดำเนินการ</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {/* Weekly Reports */}
                                {reports.weekly.map((report) => (
                                  <TableRow key={`weekly-${report.id}`}>
                                    <TableCell>
                                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">รายสัปดาห์</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{report.title}</TableCell>
                                    <TableCell>{report.dueDate || report.submissionDate}</TableCell>
                                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        {report.status === "submitted" ? (
                                          <Link href={`/student/reports/view/${report.id}`}>
                                            <Button variant="outline" size="sm" className="gap-1">
                                              <EyeIcon className="h-3.5 w-3.5" />
                                              ดูรายงาน
                                            </Button>
                                          </Link>
                                        ) : (
                                          <Link href={`/student/reports/edit/${report.id}`}>
                                            <Button size="sm" className="gap-1">
                                              <PencilIcon className="h-3.5 w-3.5" />
                                              {report.status === "pending" ? "ส่งรายงาน" : "สร้างรายงาน"}
                                            </Button>
                                          </Link>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}

                                {/* Progress Reports */}
                                {reports.progress.map((report) => (
                                  <TableRow key={`progress-${report.id}`}>
                                    <TableCell>
                                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                        ความก้าวหน้า
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{report.title}</TableCell>
                                    <TableCell>{report.dueDate}</TableCell>
                                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        {report.status === "pending" ? (
                                          <Link href={`/student/reports/progress/${report.id}`}>
                                            <Button size="sm" className="gap-1">
                                              <PencilIcon className="h-3.5 w-3.5" />
                                              ส่งรายงาน
                                            </Button>
                                          </Link>
                                        ) : (
                                          <Button variant="outline" size="sm" disabled>
                                            ยังไม่ถึงกำหนด
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}

                                {/* Final Reports */}
                                {reports.final.map((report) => (
                                  <TableRow key={`final-${report.id}`}>
                                    <TableCell>
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                        รายงานสมบูรณ์
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{report.title}</TableCell>
                                    <TableCell>{report.dueDate}</TableCell>
                                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" disabled>
                                          ยังไม่ถึงกำหนด
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">ปฏิทินกำหนดส่งรายงาน</CardTitle>
                          <CardDescription>กำหนดการส่งรายงานทั้งหมดในภาคการศึกษานี้</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                              <div className="text-center min-w-[60px]">
                                <div className="font-bold">12</div>
                                <div className="text-xs">ก.ค.</div>
                              </div>
                              <div>
                                <h3 className="font-medium">รายงานประจำสัปดาห์ที่ 6</h3>
                                <p className="text-sm text-gray-600">กำหนดส่งรายงานประจำสัปดาห์ที่ 6</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3 border-l-4 border-purple-500 bg-purple-50 rounded-r-md">
                              <div className="text-center min-w-[60px]">
                                <div className="font-bold">15</div>
                                <div className="text-xs">ก.ค.</div>
                              </div>
                              <div>
                                <h3 className="font-medium">รายงานความก้าวหน้าครั้งที่ 1</h3>
                                <p className="text-sm text-gray-600">กำหนดส่งรายงานความก้าวหน้าครั้งที่ 1</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                              <div className="text-center min-w-[60px]">
                                <div className="font-bold">15</div>
                                <div className="text-xs">ส.ค.</div>
                              </div>
                              <div>
                                <h3 className="font-medium">รายงานความก้าวหน้าครั้งที่ 2</h3>
                                <p className="text-sm text-gray-600">กำหนดส่งรายงานความก้าวหน้าครั้งที่ 2</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3 border-l-4 border-green-500 bg-green-50 rounded-r-md">
                              <div className="text-center min-w-[60px]">
                                <div className="font-bold">15</div>
                                <div className="text-xs">ก.ย.</div>
                              </div>
                              <div>
                                <h3 className="font-medium">รายงานฉบับสมบูรณ์</h3>
                                <p className="text-sm text-gray-600">กำหนดส่งรายงานฉบับสมบูรณ์</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3 border-l-4 border-green-500 bg-green-50 rounded-r-md">
                              <div className="text-center min-w-[60px]">
                                <div className="font-bold">20</div>
                                <div className="text-xs">ก.ย.</div>
                              </div>
                              <div>
                                <h3 className="font-medium">สไลด์นำเสนอผลงาน</h3>
                                <p className="text-sm text-gray-600">กำหนดส่งสไลด์สำหรับการนำเสนอผลงาน</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
