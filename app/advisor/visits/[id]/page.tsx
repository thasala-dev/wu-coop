import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  MapPinIcon,
  CarIcon,
  UserIcon,
  BuildingIcon,
  PhoneIcon,
  MailIcon,
  ArrowLeftIcon,
  ClipboardIcon,
} from "lucide-react"
import AdvisorSidebar from "@/components/advisor-sidebar"

export default function VisitDetails({ params }: { params: { id: string } }) {
  const visitId = params.id

  // Mock data for the visit
  const visit = {
    id: Number.parseInt(visitId),
    date: "15 ก.ค. 2567",
    time: "10:00-12:00 น.",
    student: {
      id: 1,
      name: "นายวิชัย เรียนดี",
      studentId: "64123456101",
      major: "วิศวกรรมคอมพิวเตอร์",
      phone: "062-345-6789",
      email: "wichai.r@university.ac.th",
    },
    company: {
      id: 1,
      name: "บริษัท เทคโนโลยีดิจิทัล จำกัด",
      address: "อาคารดิจิทัล ชั้น 15 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพมหานคร 10400",
      location: "กรุงเทพมหานคร",
      phone: "02-123-4567",
      email: "contact@digitaltech.co.th",
      website: "https://www.digitaltech.co.th",
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
    objectives: "ติดตามความก้าวหน้าการปฏิบัติงานของนักศึกษา และประเมินผลการปฏิบัติงานร่วมกับพี่เลี้ยง",
    notes: "นัดหมายผ่านทางอีเมลและโทรศัพท์กับพี่เลี้ยงเรียบร้อยแล้ว",
  }

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
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Link href="/advisor/visits">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ArrowLeftIcon className="h-4 w-4" />
                      กลับ
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">รายละเอียดการนิเทศ</CardTitle>
                    <CardDescription>ข้อมูลการนิเทศนักศึกษา ณ สถานประกอบการ</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/advisor/visits/edit/${visitId}`}>
                      <Button variant="outline" size="sm">
                        แก้ไข
                      </Button>
                    </Link>
                    <Link href={`/advisor/visits/record/${visitId}`}>
                      <Button size="sm">
                        <ClipboardIcon className="h-4 w-4 mr-1" />
                        บันทึกการนิเทศ
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                          <CalendarIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm text-purple-600 font-medium">กำหนดการนิเทศ</div>
                          <div className="text-lg font-medium">
                            {visit.date} • {visit.time}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">กำลังจะถึง</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <UserIcon className="h-5 w-5 text-blue-500" />
                          ข้อมูลนักศึกษา
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="font-medium">{visit.student.name}</div>
                            <div className="text-sm text-gray-500">รหัสนักศึกษา: {visit.student.studentId}</div>
                          </div>
                          <div className="text-sm">
                            <div>สาขาวิชา: {visit.student.major}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <PhoneIcon className="h-3.5 w-3.5 text-gray-500" />
                              <span>{visit.student.phone}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <MailIcon className="h-3.5 w-3.5 text-gray-500" />
                              <span>{visit.student.email}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BuildingIcon className="h-5 w-5 text-blue-500" />
                          ข้อมูลบริษัท
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="font-medium">{visit.company.name}</div>
                            <div className="text-sm text-gray-500">{visit.company.location}</div>
                          </div>
                          <div className="text-sm">
                            <div className="flex items-start gap-1">
                              <MapPinIcon className="h-3.5 w-3.5 text-gray-500 mt-0.5" />
                              <span>{visit.company.address}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <PhoneIcon className="h-3.5 w-3.5 text-gray-500" />
                              <span>{visit.company.phone}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <MailIcon className="h-3.5 w-3.5 text-gray-500" />
                              <span>{visit.company.email}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <UserIcon className="h-5 w-5 text-blue-500" />
                          ข้อมูลพี่เลี้ยง
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="font-medium">{visit.mentor.name}</div>
                            <div className="text-sm text-gray-500">{visit.mentor.position}</div>
                          </div>
                          <div className="text-sm">
                            <div className="flex items-center gap-1 mt-1">
                              <PhoneIcon className="h-3.5 w-3.5 text-gray-500" />
                              <span>{visit.mentor.phone}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <MailIcon className="h-3.5 w-3.5 text-gray-500" />
                              <span>{visit.mentor.email}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CarIcon className="h-5 w-5 text-blue-500" />
                          ข้อมูลการเดินทาง
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="font-medium">ระยะทาง: {visit.distance}</div>
                            <div className="text-sm text-gray-500">การเดินทาง: {visit.transportation}</div>
                          </div>
                          <div className="text-sm">
                            <div className="flex items-start gap-1">
                              <MapPinIcon className="h-3.5 w-3.5 text-gray-500 mt-0.5" />
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  visit.company.address,
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                ดูแผนที่
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">รายละเอียดการนิเทศ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="font-medium">วัตถุประสงค์การนิเทศ</div>
                          <p className="text-sm mt-1">{visit.objectives}</p>
                        </div>
                        {visit.notes && (
                          <div>
                            <div className="font-medium">หมายเหตุ</div>
                            <p className="text-sm mt-1">{visit.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
