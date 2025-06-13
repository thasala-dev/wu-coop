import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  CalendarIcon,
  MapPinIcon,
  CarIcon,
  UserIcon,
  BuildingIcon,
  PlusIcon,
  SearchIcon,
  FileTextIcon,
  CheckCircleIcon,
  ClipboardIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import AdvisorSidebar from "@/components/advisor-sidebar"

export default function AdvisorVisits() {
  // Mock data for current month
  const currentMonth = "กรกฎาคม 2567"

  // Mock data for co-op terms
  const coopTerms = [
    { id: 1, name: "ภาคการศึกษาที่ 1/2567", shortName: "1/2567", status: "active" },
    { id: 2, name: "ภาคการศึกษาที่ 2/2567", shortName: "2/2567", status: "upcoming" },
    { id: 3, name: "ภาคการศึกษาที่ 2/2566", shortName: "2/2566", status: "completed" },
  ]

  // Mock data for visits
  const visits = [
    {
      id: 1,
      date: "15 ก.ค. 2567",
      time: "10:00-12:00 น.",
      student: {
        id: 1,
        name: "นายวิชัย เรียนดี",
        studentId: "64123456101",
        major: "วิศวกรรมคอมพิวเตอร์",
      },
      company: {
        id: 1,
        name: "บริษัท เทคโนโลยีดิจิทัล จำกัด",
        address: "อาคารดิจิทัล ชั้น 15 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพมหานคร 10400",
        location: "กรุงเทพมหานคร",
      },
      mentor: {
        id: 1,
        name: "นางสาวปรียา มากความรู้",
        position: "Senior Developer",
        phone: "081-234-5678",
        email: "preya@digitaltech.co.th",
      },
      status: "upcoming",
      distance: "15 กม.",
      transportation: "รถยนต์ส่วนตัว",
      term: "1/2567",
    },
    {
      id: 2,
      date: "17 ก.ค. 2567",
      time: "13:00-15:00 น.",
      student: {
        id: 2,
        name: "นางสาวนภา สุขใจ",
        studentId: "64123456102",
        major: "วิศวกรรมคอมพิวเตอร์",
      },
      company: {
        id: 2,
        name: "บริษัท เน็ตเวิร์ค โซลูชั่น จำกัด",
        address: "อาคารเน็ตเวิร์ค ชั้น 10 ถนนติวานนท์ ตำบลบางกระสอ อำเภอเมือง จังหวัดนนทบุรี 11000",
        location: "นนทบุรี",
      },
      mentor: {
        id: 3,
        name: "นายวิทยา เชี่ยวชาญ",
        position: "Network Engineer",
        phone: "089-876-5432",
        email: "wittaya@networksolution.co.th",
      },
      status: "upcoming",
      distance: "25 กม.",
      transportation: "รถยนต์ส่วนตัว",
      term: "1/2567",
    },
    {
      id: 3,
      date: "20 ก.ค. 2567",
      time: "09:00-12:00 น.",
      student: [
        {
          id: 3,
          name: "นายมานะ ตั้งใจ",
          studentId: "64123456791",
          major: "วิศวกรรมไฟฟ้า",
        },
        {
          id: 4,
          name: "นายธนา รักการเรียน",
          studentId: "64123456103",
          major: "วิศวกรรมไฟฟ้า",
        },
      ],
      company: {
        id: 6,
        name: "บริษัท อิเล็กทรอนิกส์ จำกัด",
        address: "นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี ตำบลบ้านเก่า อำเภอพานทอง จังหวัดชลบุรี 20160",
        location: "ชลบุรี",
      },
      mentor: {
        id: 11,
        name: "นายสุรศักดิ์ เทคนิคดี",
        position: "Electronics Engineer",
        phone: "086-543-2109",
        email: "surasak@electronics.co.th",
      },
      status: "upcoming",
      distance: "90 กม.",
      transportation: "รถยนต์ส่วนตัว",
      term: "1/2567",
    },
    {
      id: 4,
      date: "5 ส.ค. 2567",
      time: "10:00-12:00 น.",
      student: {
        id: 5,
        name: "นางสาวพิมพ์ใจ รักเรียน",
        studentId: "64123456105",
        major: "วิศวกรรมคอมพิวเตอร์",
      },
      company: {
        id: 3,
        name: "บริษัท โปรแกรมมิ่ง เอ็กซ์เพิร์ต จำกัด",
        address: "อาคารซอฟต์แวร์พาร์ค ชั้น 8 ถนนแจ้งวัฒนะ ตำบลคลองเกลือ อำเภอปากเกร็ด จังหวัดนนทบุรี 11120",
        location: "นนทบุรี",
      },
      mentor: {
        id: 5,
        name: "นายธนา ชำนาญโค้ด",
        position: "Lead Developer",
        phone: "084-321-6789",
        email: "thana@programming.co.th",
      },
      status: "upcoming",
      distance: "30 กม.",
      transportation: "รถยนต์ส่วนตัว",
      term: "1/2567",
    },
    {
      id: 5,
      date: "10 มิ.ย. 2567",
      time: "13:00-15:00 น.",
      student: {
        id: 6,
        name: "นายสมศักดิ์ เรียนเก่ง",
        studentId: "64123456106",
        major: "วิศวกรรมคอมพิวเตอร์",
      },
      company: {
        id: 4,
        name: "บริษัท ดาต้า อินไซต์ จำกัด",
        address: "อาคารเอ็มควอเทียร์ ชั้น 20 ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110",
        location: "กรุงเทพมหานคร",
      },
      mentor: {
        id: 7,
        name: "นายปัญญา วิเคราะห์เก่ง",
        position: "Data Scientist",
        phone: "082-109-8765",
        email: "panya@datainsight.co.th",
      },
      status: "completed",
      distance: "20 กม.",
      transportation: "รถยนต์ส่วนตัว",
      term: "1/2567",
      report: {
        id: 1,
        status: "ดี",
        strengths: "มีความรู้ด้านการวิเคราะห์ข้อมูลดี ทำงานเป็นระบบ",
        improvements: "ควรพัฒนาทักษะการนำเสนอให้มากขึ้น",
        recommendations: "แนะนำให้ศึกษาเพิ่มเติมเกี่ยวกับ Machine Learning",
      },
    },
  ]

  // Calendar days
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">ระบบสหกิจศึกษา (อาจารย์ที่ปรึกษา)</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">ผศ.ดร. วิชาญ นักสอน</span>
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
          <AdvisorSidebar activePage="visits" />

          <div className="md:col-span-4">
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">การนิเทศนักศึกษา</CardTitle>
                  <CardDescription>จัดการการนิเทศนักศึกษา ณ สถานประกอบการ</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="term1-2567">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="เลือกรอบสหกิจ" />
                    </SelectTrigger>
                    <SelectContent>
                      {coopTerms.map((term) => (
                        <SelectItem key={term.id} value={`term${term.id}`}>
                          สหกิจ {term.shortName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Link href="/advisor/visits/plan">
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      วางแผนการนิเทศ
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <TabsList>
                      <TabsTrigger value="upcoming">กำลังจะถึง</TabsTrigger>
                      <TabsTrigger value="completed">เสร็จสิ้นแล้ว</TabsTrigger>
                      <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
                      <TabsTrigger value="reports">รายงานการนิเทศ</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input placeholder="ค้นหานักศึกษา..." className="pl-10" />
                      </div>
                      <Button variant="outline" size="icon">
                        <FilterIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="upcoming">
                    <div className="space-y-6">
                      {visits
                        .filter((visit) => visit.status === "upcoming")
                        .map((visit) => (
                          <div key={visit.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                  <div className="flex items-center text-sm text-purple-600 font-medium mb-1">
                                    <CalendarIcon className="h-4 w-4 mr-1" /> {visit.date} • {visit.time}
                                  </div>
                                  <h3 className="text-lg font-medium">นิเทศนักศึกษา - {visit.company.name}</h3>
                                  <div className="mt-2 space-y-1">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <UserIcon className="h-4 w-4 mr-1" />
                                      {Array.isArray(visit.student) ? (
                                        <span>
                                          {visit.student.map((s) => s.name).join(", ")} ({visit.student.length} คน)
                                        </span>
                                      ) : (
                                        <span>{visit.student.name}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <BuildingIcon className="h-4 w-4 mr-1" />
                                      {visit.company.name}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPinIcon className="h-4 w-4 mr-1" />
                                      {visit.company.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <CarIcon className="h-4 w-4 mr-1" />
                                      ระยะทาง: {visit.distance} • {visit.transportation}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 self-start">
                                <Link href={`/advisor/visits/${visit.id}`}>
                                  <Button variant="outline" size="sm">
                                    ดูรายละเอียด
                                  </Button>
                                </Link>
                                <Link href={`/advisor/visits/record/${visit.id}`}>
                                  <Button size="sm">
                                    <ClipboardIcon className="h-4 w-4 mr-1" />
                                    บันทึกการนิเทศ
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed">
                    <div className="space-y-6">
                      {visits
                        .filter((visit) => visit.status === "completed")
                        .map((visit) => (
                          <div key={visit.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-md flex items-center justify-center">
                                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                  <div className="flex items-center text-sm text-green-600 font-medium mb-1">
                                    <CalendarIcon className="h-4 w-4 mr-1" /> {visit.date} • {visit.time}
                                  </div>
                                  <h3 className="text-lg font-medium">นิเทศนักศึกษา - {visit.company.name}</h3>
                                  <div className="mt-2 space-y-1">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <UserIcon className="h-4 w-4 mr-1" />
                                      {Array.isArray(visit.student) ? (
                                        <span>
                                          {visit.student.map((s) => s.name).join(", ")} ({visit.student.length} คน)
                                        </span>
                                      ) : (
                                        <span>{visit.student.name}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <BuildingIcon className="h-4 w-4 mr-1" />
                                      {visit.company.name}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPinIcon className="h-4 w-4 mr-1" />
                                      {visit.company.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <CarIcon className="h-4 w-4 mr-1" />
                                      ระยะทาง: {visit.distance} • {visit.transportation}
                                    </div>
                                  </div>
                                  {visit.report && (
                                    <div className="mt-3 pt-3 border-t">
                                      <div className="flex items-center text-sm font-medium">
                                        <FileTextIcon className="h-4 w-4 mr-1" />
                                        สรุปผลการนิเทศ
                                      </div>
                                      <div className="mt-1 text-sm">
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                          {visit.report.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 self-start">
                                <Link href={`/advisor/visits/${visit.id}`}>
                                  <Button variant="outline" size="sm">
                                    ดูรายละเอียด
                                  </Button>
                                </Link>
                                <Link href={`/advisor/visits/report/${visit.id}`}>
                                  <Button size="sm">
                                    <FileTextIcon className="h-4 w-4 mr-1" />
                                    ดูรายงาน
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}

                      {visits.filter((visit) => visit.status === "completed").length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <CheckCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">ยังไม่มีการนิเทศที่เสร็จสิ้น</p>
                          <p className="text-sm">การนิเทศที่เสร็จสิ้นแล้วจะแสดงที่นี่</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="calendar">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <ChevronLeftIcon className="h-4 w-4" />
                          </Button>
                          <h3 className="text-lg font-medium">{currentMonth}</h3>
                          <Button variant="outline" size="sm">
                            <ChevronRightIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            วันนี้
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {daysOfWeek.map((day, index) => (
                          <div key={index} className="text-center font-medium py-2 text-sm">
                            {day}
                          </div>
                        ))}

                        {/* Empty cells for days before the 1st of the month (assuming July 2024 starts on Monday) */}
                        {Array.from({ length: 0 }).map((_, index) => (
                          <div key={`empty-${index}`} className="h-24 border rounded-md bg-gray-50"></div>
                        ))}

                        {calendarDays.map((day) => (
                          <div key={day} className="h-24 border rounded-md p-1 hover:bg-gray-50">
                            <div className="font-medium text-sm">{day}</div>
                            {day === 15 && (
                              <div className="mt-1 p-1 text-xs bg-purple-100 text-purple-800 rounded truncate">
                                นิเทศ - บริษัท เทคโนโลยีดิจิทัล
                              </div>
                            )}
                            {day === 17 && (
                              <div className="mt-1 p-1 text-xs bg-purple-100 text-purple-800 rounded truncate">
                                นิเทศ - บริษัท เน็ตเวิร์ค โซลูชั่น
                              </div>
                            )}
                            {day === 20 && (
                              <div className="mt-1 p-1 text-xs bg-purple-100 text-purple-800 rounded truncate">
                                นิเทศ - บริษัท อิเล็กทรอนิกส์
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reports">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">การนิเทศทั้งหมด</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-purple-600">5</div>
                            <p className="text-sm text-gray-500 mt-1">จำนวนการนิเทศทั้งหมด</p>
                            <div className="mt-4 pt-4 border-t flex flex-col gap-1 text-sm">
                              <div className="flex justify-between">
                                <span>กำลังจะถึง</span>
                                <span className="font-medium">4</span>
                              </div>
                              <div className="flex justify-between">
                                <span>เสร็จสิ้นแล้ว</span>
                                <span className="font-medium">1</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">นักศึกษาที่นิเทศ</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-purple-600">6</div>
                            <p className="text-sm text-gray-500 mt-1">จำนวนนักศึกษาที่นิเทศ</p>
                            <div className="mt-4 pt-4 border-t flex flex-col gap-1 text-sm">
                              <div className="flex justify-between">
                                <span>นิเทศแล้ว</span>
                                <span className="font-medium">1</span>
                              </div>
                              <div className="flex justify-between">
                                <span>รอนิเทศ</span>
                                <span className="font-medium">5</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">ระยะทางรวม</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-purple-600">180 กม.</div>
                            <p className="text-sm text-gray-500 mt-1">ระยะทางการนิเทศทั้งหมด</p>
                            <div className="mt-4 pt-4 border-t flex flex-col gap-1 text-sm">
                              <div className="flex justify-between">
                                <span>เดินทางแล้ว</span>
                                <span className="font-medium">20 กม.</span>
                              </div>
                              <div className="flex justify-between">
                                <span>รอเดินทาง</span>
                                <span className="font-medium">160 กม.</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">รายงานการนิเทศ</CardTitle>
                          <CardDescription>สรุปผลการนิเทศนักศึกษา</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>วันที่</TableHead>
                                <TableHead>นักศึกษา</TableHead>
                                <TableHead>บริษัท</TableHead>
                                <TableHead>ผลการประเมิน</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {visits
                                .filter((visit) => visit.status === "completed")
                                .map((visit) => (
                                  <TableRow key={visit.id}>
                                    <TableCell>{visit.date}</TableCell>
                                    <TableCell>
                                      {Array.isArray(visit.student)
                                        ? visit.student.map((s) => s.name).join(", ")
                                        : visit.student.name}
                                    </TableCell>
                                    <TableCell>{visit.company.name}</TableCell>
                                    <TableCell>
                                      {visit.report ? (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                          {visit.report.status}
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">ไม่มีข้อมูล</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {visit.status === "completed" ? (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">เสร็จสิ้น</Badge>
                                      ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                          รอดำเนินการ
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        <Link href={`/advisor/visits/report/${visit.id}`}>
                                          <Button size="sm">
                                            <FileTextIcon className="h-4 w-4 mr-1" />
                                            ดูรายงาน
                                          </Button>
                                        </Link>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>

                          {visits.filter((visit) => visit.status === "completed").length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                              <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg font-medium">ยังไม่มีรายงานการนิเทศ</p>
                              <p className="text-sm">รายงานการนิเทศจะแสดงที่นี่เมื่อคุณบันทึกการนิเทศ</p>
                            </div>
                          )}
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
