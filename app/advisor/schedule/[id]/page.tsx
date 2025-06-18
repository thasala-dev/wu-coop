import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  Car,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import AdvisorSidebar from "@/components/advisor-sidebar";

export default function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock data for a single appointment
  const appointment = {
    id: 1,
    title: "นิเทศนักศึกษา - นายสมชาย ใจดี",
    date: "15 มิถุนายน 2567",
    time: "10:00 - 12:00",
    type: "ลงพื้นที่",
    location: "โรงพยาบาลศิริราช",
    locationDetail: "ฝ่ายเภสัชกรรม ชั้น 2 อาคารผู้ป่วยนอก",
    meetingLink: "",
    meetingId: "",
    meetingPassword: "",
    status: "upcoming",
    description:
      "นิเทศนักศึกษาครั้งที่ 1 ประจำภาคการศึกษา 1/2567 เพื่อติดตามความก้าวหน้าในการฝึกงาน",
    transportation: "รถยนต์ส่วนตัว",
    distance: "15 กิโลเมตร",
    students: [
      {
        id: 1,
        name: "นายสมชาย ใจดี",
        studentId: "6309681234",
        avatar: "/placeholder.svg?height=40&width=40",
        company: "โรงพยาบาลศิริราช",
        position: "ผู้ช่วยเภสัชกร",
        department: "ฝ่ายเภสัชกรรม",
      },
    ],
    participants: [
      {
        id: 1,
        name: "ผศ.ดร. วิชาญ นักสอน",
        role: "อาจารย์นิเทศ",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        name: "ภญ.สุดา รักษาดี",
        role: "พี่เลี้ยง",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    agenda: [
      {
        time: "10:00 - 10:15",
        title: "พบปะพี่เลี้ยงและนักศึกษา",
        description: "แนะนำตัวและพูดคุยเบื้องต้น",
      },
      {
        time: "10:15 - 10:45",
        title: "นักศึกษานำเสนอความก้าวหน้า",
        description: "นักศึกษานำเสนอผลการปฏิบัติงานและความก้าวหน้าในการฝึกงาน",
      },
      {
        time: "10:45 - 11:15",
        title: "พี่เลี้ยงให้ข้อมูลและความเห็น",
        description: "พี่เลี้ยงให้ข้อมูลเกี่ยวกับการปฏิบัติงานของนักศึกษา",
      },
      {
        time: "11:15 - 11:45",
        title: "อาจารย์ให้คำแนะนำและข้อเสนอแนะ",
        description: "อาจารย์ให้คำแนะนำเพื่อพัฒนาการฝึกงานของนักศึกษา",
      },
      {
        time: "11:45 - 12:00",
        title: "สรุปและวางแผนการติดตามครั้งต่อไป",
        description: "สรุปประเด็นสำคัญและวางแผนการนิเทศครั้งต่อไป",
      },
    ],
    documents: [
      {
        id: 1,
        name: "แบบประเมินการนิเทศครั้งที่ 1",
        type: "pdf",
        size: "245 KB",
      },
      {
        id: 2,
        name: "แบบบันทึกการนิเทศ",
        type: "docx",
        size: "125 KB",
      },
    ],
    notes:
      "นักศึกษามีความตั้งใจในการฝึกงาน พี่เลี้ยงให้ความเห็นว่านักศึกษาปรับตัวได้ดี มีความรับผิดชอบ แต่ควรพัฒนาทักษะการสื่อสารให้มากขึ้น",
  };

  // Function to render appointment type badge
  const renderAppointmentTypeBadge = (type: string) => {
    switch (type) {
      case "ลงพื้นที่":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Car className="h-3 w-3 mr-1" />
            {type}
          </Badge>
        );
      case "ออนไลน์":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Video className="h-3 w-3 mr-1" />
            {type}
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Function to render appointment status badge
  const renderAppointmentStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Calendar className="h-3 w-3 mr-1" />
            กำลังจะมาถึง
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            เสร็จสิ้น
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            ยกเลิก
          </Badge>
        );
      default:
        return <Badge>ไม่ระบุ</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              ระบบสหกิจศึกษา (อาจารย์ที่ปรึกษา)
            </h1>
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

      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <AdvisorSidebar activePage="schedule" />

          <div className="md:col-span-4">
            <div className="mb-6">
              <Link href="/advisor/schedule">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  กลับไปหน้าตารางนัดหมาย
                </Button>
              </Link>

              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">
                        {appointment.title}
                      </CardTitle>
                      <CardDescription>รายละเอียดการนัดหมาย</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {renderAppointmentTypeBadge(appointment.type)}
                      {renderAppointmentStatusBadge(appointment.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        ข้อมูลการนัดหมาย
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">วันที่</h4>
                            <p>{appointment.date}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">เวลา</h4>
                            <p>{appointment.time}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">สถานที่</h4>
                            <p>{appointment.location}</p>
                            {appointment.locationDetail && (
                              <p className="text-sm text-gray-500">
                                {appointment.locationDetail}
                              </p>
                            )}
                          </div>
                        </div>
                        {appointment.type === "ลงพื้นที่" && (
                          <div className="flex items-start gap-2">
                            <Car className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">การเดินทาง</h4>
                              <p>{appointment.transportation}</p>
                              <p className="text-sm text-gray-500">
                                ระยะทาง: {appointment.distance}
                              </p>
                            </div>
                          </div>
                        )}
                        {appointment.type === "ออนไลน์" &&
                          appointment.meetingLink && (
                            <div className="flex items-start gap-2">
                              <Video className="h-5 w-5 text-gray-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium">
                                  ข้อมูลการประชุมออนไลน์
                                </h4>
                                <p>
                                  <a
                                    href={appointment.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    เข้าร่วมการประชุม
                                  </a>
                                </p>
                                {appointment.meetingId && (
                                  <p className="text-sm text-gray-500">
                                    Meeting ID: {appointment.meetingId}
                                    {appointment.meetingPassword &&
                                      ` | Passcode: ${appointment.meetingPassword}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">ผู้เข้าร่วม</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">นักศึกษา</h4>
                          {appointment.students.map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center gap-3 mb-2"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={student.avatar}
                                  alt={student.name}
                                />
                                <AvatarFallback>
                                  {student.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-gray-500">
                                  {student.position}, {student.company}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">ผู้เข้าร่วมอื่นๆ</h4>
                          {appointment.participants.map((participant) => (
                            <div
                              key={participant.id}
                              className="flex items-center gap-3 mb-2"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={participant.avatar}
                                  alt={participant.name}
                                />
                                <AvatarFallback>
                                  {participant.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {participant.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {participant.role}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      รายละเอียดเพิ่มเติม
                    </h3>
                    <p className="mb-4">{appointment.description}</p>
                  </div>

                  <Tabs defaultValue="agenda" className="mt-6">
                    <TabsList>
                      <TabsTrigger value="agenda">กำหนดการ</TabsTrigger>
                      <TabsTrigger value="documents">เอกสาร</TabsTrigger>
                      <TabsTrigger value="notes">บันทึก</TabsTrigger>
                    </TabsList>
                    <TabsContent value="agenda" className="mt-4">
                      <div className="space-y-4">
                        {appointment.agenda.map((item, index) => (
                          <div key={index} className="relative pl-6 pb-4">
                            <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-blue-500"></div>
                            {index < appointment.agenda.length - 1 && (
                              <div className="absolute left-1.5 top-4 h-full w-0.5 bg-gray-200"></div>
                            )}
                            <div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <h4 className="font-medium">{item.title}</h4>
                                <span className="text-sm text-gray-500">
                                  {item.time}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="documents" className="mt-4">
                      <div className="space-y-4">
                        {appointment.documents.map((document) => (
                          <div
                            key={document.id}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-blue-500" />
                              <div>
                                <p className="font-medium">{document.name}</p>
                                <p className="text-sm text-gray-500">
                                  {document.type.toUpperCase()} •{" "}
                                  {document.size}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              ดาวน์โหลด
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="notes" className="mt-4">
                      <div className="p-4 border rounded-md bg-gray-50">
                        <p>
                          {appointment.notes ||
                            "ยังไม่มีบันทึกสำหรับการนัดหมายนี้"}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    {appointment.status === "upcoming" && (
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        ยกเลิกการนัดหมาย
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {appointment.status === "upcoming" && (
                      <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        แก้ไข
                      </Button>
                    )}
                    {appointment.status === "upcoming" &&
                      appointment.type === "ลงพื้นที่" && (
                        <Link href={`/advisor/visits/record/${appointment.id}`}>
                          <Button>บันทึกการนิเทศ</Button>
                        </Link>
                      )}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
