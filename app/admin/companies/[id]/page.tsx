import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BuildingIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  UsersIcon,
  FileTextIcon,
  CalendarIcon,
  ClipboardIcon,
  PencilIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DownloadIcon,
} from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import Link from "next/link"

interface CompanyPageProps {
  params: {
    id: string
  }
}

export default function CompanyPage({ params }: CompanyPageProps) {
  // Mock data for company with ID 2
  const company = {
    id: "2",
    name: "บริษัท ฟาร์มาเฮลท์แคร์ จำกัด",
    logo: "https://logo.clearbit.com/pfizer.com",
    industry: "เภสัชกรรม",
    location: "นนทบุรี",
    address: "99/9 ถนนติวานนท์ ตำบลบางกระสอ อำเภอเมือง จังหวัดนนทบุรี 11000",
    website: "https://www.pharmahealth.co.th",
    studentCapacity: 3,
    activeStudents: 2,
    status: "active",
    contactPerson: "คุณสมหญิง รักดี",
    contactPosition: "ผู้จัดการฝ่ายทรัพยากรบุคคล",
    contactEmail: "somying@pharmahealth.co.th",
    contactPhone: "02-234-5678",
    description:
      "บริษัท ฟาร์มาเฮลท์แคร์ จำกัด เป็นบริษัทชั้นนำในอุตสาหกรรมเภสัชกรรมของประเทศไทย ก่อตั้งเมื่อปี พ.ศ. 2535 เรามุ่งมั่นในการวิจัยและพัฒนาผลิตภัณฑ์ยาและเวชภัณฑ์ที่มีคุณภาพสูง เพื่อสุขภาพที่ดีของคนไทย",
    establishedYear: 1992,
    employeeCount: 250,
    cooperationSince: 2018,
  }

  // Mock data for students in this company
  const students = [
    {
      id: "1",
      name: "นายสมชาย ใจดี",
      studentId: "6299999921",
      avatar: "/placeholder.svg?height=40&width=40",
      faculty: "เภสัชศาสตร์",
      major: "เภสัชกรรมคลินิก",
      startDate: "1 มิถุนายน 2566",
      endDate: "30 กันยายน 2566",
      status: "active",
      position: "ผู้ช่วยเภสัชกร",
      mentor: "ภญ.วิภาดา สุขใจ",
    },
    {
      id: "2",
      name: "นางสาวสมหญิง รักเรียน",
      studentId: "6299999922",
      avatar: "/placeholder.svg?height=40&width=40",
      faculty: "เภสัชศาสตร์",
      major: "เภสัชกรรมอุตสาหการ",
      startDate: "1 มิถุนายน 2566",
      endDate: "30 กันยายน 2566",
      status: "active",
      position: "ผู้ช่วยวิจัยและพัฒนา",
      mentor: "ภก.ประเสริฐ นวัตกรรม",
    },
  ]

  // Mock data for history
  const history = [
    {
      year: "2565",
      studentCount: 3,
      completedCount: 3,
      students: ["นายวิชัย เรียนดี (เภสัชกรรมคลินิก)", "นางสาวสุดา ตั้งใจ (เภสัชกรรมอุตสาหการ)", "นายภาคิน พัฒนา (เภสัชกรรมคลินิก)"],
    },
    {
      year: "2564",
      studentCount: 2,
      completedCount: 2,
      students: ["นางสาวพิมพ์ใจ ใฝ่รู้ (เภสัชกรรมคลินิก)", "นายสมศักดิ์ ศึกษาดี (เภสัชกรรมอุตสาหการ)"],
    },
    {
      year: "2563",
      studentCount: 2,
      completedCount: 2,
      students: ["นายธนา รักการค้า (เภสัชกรรมคลินิก)", "นางสาวกมลา วิจัยดี (เภสัชกรรมอุตสาหการ)"],
    },
  ]

  // Mock data for documents
  const documents = [
    {
      id: "1",
      name: "สัญญาความร่วมมือ (MOU)",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "15 มกราคม 2566",
      status: "active",
    },
    {
      id: "2",
      name: "แบบประเมินนักศึกษา",
      type: "DOCX",
      size: "1.8 MB",
      uploadDate: "20 มกราคม 2566",
      status: "active",
    },
    {
      id: "3",
      name: "คู่มือการฝึกงาน",
      type: "PDF",
      size: "5.2 MB",
      uploadDate: "25 มกราคม 2566",
      status: "active",
    },
    {
      id: "4",
      name: "รายงานผลการฝึกงานปี 2565",
      type: "PDF",
      size: "3.7 MB",
      uploadDate: "10 ตุลาคม 2565",
      status: "archived",
    },
  ]

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircleIcon className="h-3 w-3 mr-1" /> ใช้งาน
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircleIcon className="h-3 w-3 mr-1" /> ไม่ใช้งาน
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <ClockIcon className="h-3 w-3 mr-1" /> รอดำเนินการ
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <AdminSidebar activePage="companies" />

        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/admin/companies" className="text-gray-500 hover:text-gray-700">
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold">รายละเอียดบริษัท</h1>
            </div>
            <Button>
              <PencilIcon className="h-4 w-4 mr-2" />
              แก้ไขข้อมูล
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-2/3">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-md border border-gray-200">
                    <AvatarImage src={company.logo} alt={company.name} />
                    <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                      {company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <BuildingIcon className="h-4 w-4 text-gray-500" />
                      <span>{company.industry}</span>
                      <span className="mx-1">•</span>
                      <MapPinIcon className="h-4 w-4 text-gray-500" />
                      <span>{company.location}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2">{renderStatusBadge(company.status)}</div>
                <p className="mt-4 text-gray-700">{company.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-medium text-gray-900">ข้อมูลทั่วไป</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <BuildingIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">ปีที่ก่อตั้ง:</span> {company.establishedYear}
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">จำนวนพนักงาน:</span> {company.employeeCount} คน
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">เริ่มร่วมโครงการสหกิจศึกษา:</span> {company.cooperationSince}
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">รับนักศึกษาสูงสุด:</span> {company.studentCapacity} คน
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <GlobeIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">เว็บไซต์:</span>{" "}
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {company.website}
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">ข้อมูลติดต่อ</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">ผู้ประสานงาน:</span> {company.contactPerson}
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <ClipboardIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">ตำแหน่ง:</span> {company.contactPosition}
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <MailIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">อีเมล:</span>{" "}
                          <a href={`mailto:${company.contactEmail}`} className="text-blue-600 hover:underline">
                            {company.contactEmail}
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <PhoneIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">โทรศัพท์:</span>{" "}
                          <a href={`tel:${company.contactPhone}`} className="text-blue-600 hover:underline">
                            {company.contactPhone}
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-500">ที่อยู่:</span> {company.address}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle className="text-lg">สถิติการรับนักศึกษา</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">นักศึกษาปัจจุบัน</span>
                    <span className="font-medium">
                      {company.activeStudents}/{company.studentCapacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${(company.activeStudents / company.studentCapacity) * 100}%` }}
                    ></div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">ประวัติการรับนักศึกษา</h4>
                    <div className="space-y-3">
                      {history.map((item) => (
                        <div key={item.year} className="flex justify-between items-center text-sm">
                          <span>ปีการศึกษา {item.year}</span>
                          <span className="font-medium">
                            {item.completedCount}/{item.studentCount} คน
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="students">
            <TabsList>
              <TabsTrigger value="students">นักศึกษาปัจจุบัน ({students.length})</TabsTrigger>
              <TabsTrigger value="history">ประวัติการรับนักศึกษา</TabsTrigger>
              <TabsTrigger value="documents">เอกสาร ({documents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>นักศึกษาที่ฝึกงานอยู่ในปัจจุบัน</CardTitle>
                  <CardDescription>รายชื่อนักศึกษาที่กำลังฝึกงานอยู่ที่บริษัทนี้</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">นักศึกษา</th>
                          <th className="text-left py-3 px-4">สาขาวิชา</th>
                          <th className="text-left py-3 px-4">ตำแหน่ง</th>
                          <th className="text-left py-3 px-4">พี่เลี้ยง</th>
                          <th className="text-left py-3 px-4">ระยะเวลา</th>
                          <th className="text-left py-3 px-4">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={student.avatar} alt={student.name} />
                                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                  <div className="text-sm text-gray-500">{student.studentId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div>{student.faculty}</div>
                                <div className="text-sm text-gray-500">{student.major}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{student.position}</td>
                            <td className="py-3 px-4">{student.mentor}</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="text-sm">{student.startDate}</div>
                                <div className="text-sm">ถึง {student.endDate}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <CheckCircleIcon className="h-3 w-3 mr-1" /> กำลังฝึกงาน
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>ประวัติการรับนักศึกษา</CardTitle>
                  <CardDescription>ข้อมูลการรับนักศึกษาในปีการศึกษาที่ผ่านมา</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {history.map((item) => (
                      <div key={item.year} className="border-b pb-4 last:border-0">
                        <h3 className="font-medium text-lg">ปีการศึกษา {item.year}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            จำนวนนักศึกษา: {item.studentCount} คน
                          </div>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            สำเร็จการฝึกงาน: {item.completedCount} คน
                          </div>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-gray-500 mb-1">รายชื่อนักศึกษา:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {item.students.map((student, index) => (
                              <li key={index} className="text-sm">
                                {student}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>เอกสารที่เกี่ยวข้อง</CardTitle>
                  <CardDescription>เอกสารสำคัญที่เกี่ยวข้องกับบริษัทและการฝึกงาน</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">ชื่อเอกสาร</th>
                          <th className="text-left py-3 px-4">ประเภท</th>
                          <th className="text-left py-3 px-4">ขนาด</th>
                          <th className="text-left py-3 px-4">วันที่อัปโหลด</th>
                          <th className="text-left py-3 px-4">สถานะ</th>
                          <th className="text-left py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc) => (
                          <tr key={doc.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <FileTextIcon className="h-4 w-4 text-gray-500" />
                                <span>{doc.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{doc.type}</Badge>
                            </td>
                            <td className="py-3 px-4">{doc.size}</td>
                            <td className="py-3 px-4">{doc.uploadDate}</td>
                            <td className="py-3 px-4">
                              {doc.status === "active" ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">ใช้งาน</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">เก็บถาวร</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">
                                <DownloadIcon className="h-4 w-4 mr-1" /> ดาวน์โหลด
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
