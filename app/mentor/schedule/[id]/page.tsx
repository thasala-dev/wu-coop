"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Video,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import MentorSidebar from "@/components/mentor-sidebar";

// Mock data for appointments (same as in schedule/page.tsx)
const appointments = [
  {
    id: "A001",
    title: "การนิเทศนักศึกษาครั้งที่ 1",
    date: "2566-07-15",
    time: "13:00 - 15:00",
    type: "onsite",
    location: "บริษัท เทคโนโลยี จำกัด ห้องประชุม 3A",
    description:
      "การนิเทศนักศึกษาครั้งที่ 1 โดยอาจารย์นิเทศ เพื่อติดตามความก้าวหน้าของนักศึกษา",
    status: "upcoming",
    participants: [
      { name: "ผศ.ดร.สมชาย ใจดี", role: "อาจารย์นิเทศ" },
      { name: "นายธนกร มั่นคง", role: "นักศึกษา" },
      { name: "นางสาวพิมพ์ชนก รักเรียน", role: "นักศึกษา" },
      { name: "นายภาคิน ใจดี", role: "นักศึกษา" },
    ],
    notes: "เตรียมเอกสารสรุปความก้าวหน้าของนักศึกษาทั้ง 3 คน และแผนงานในอนาคต",
    agenda: [
      "แนะนำตัวและชี้แจงวัตถุประสงค์การนิเทศ (15 นาที)",
      "นักศึกษานำเสนอความก้าวหน้าในการฝึกงาน (45 นาที)",
      "พี่เลี้ยงให้ข้อมูลเกี่ยวกับการปฏิบัติงานของนักศึกษา (30 นาที)",
      "อาจารย์นิเทศให้คำแนะนำและข้อเสนอแนะ (15 นาที)",
      "สรุปและวางแผนการนิเทศครั้งต่อไป (15 นาที)",
    ],
    documents: [
      { name: "แบบประเมินการนิเทศครั้งที่ 1", type: "pdf" },
      { name: "แบบบันทึกการนิเทศ", type: "doc" },
      { name: "คู่มือการนิเทศนักศึกษาฝึกงาน", type: "pdf" },
    ],
  },
  {
    id: "A002",
    title: "ประชุมติดตามความก้าวหน้าประจำเดือน",
    date: "2566-07-20",
    time: "10:00 - 11:30",
    type: "online",
    location: "Zoom Meeting",
    meetingLink: "https://zoom.us/j/123456789",
    meetingId: "123 456 789",
    passcode: "123456",
    description:
      "ประชุมติดตามความก้าวหน้าประจำเดือนกับอาจารย์นิเทศและผู้ประสานงานฝึกงาน",
    status: "upcoming",
    participants: [
      { name: "ผศ.ดร.สมชาย ใจดี", role: "อาจารย์นิเทศ" },
      { name: "ดร.วิชาญ นักสอน", role: "ผู้ประสานงานฝึกงาน" },
    ],
    notes: "เตรียมสรุปภาพรวมการฝึกงานของนักศึกษาทั้งหมด และปัญหาที่พบ",
    agenda: [
      "รายงานความก้าวหน้าของนักศึกษาแต่ละคน (30 นาที)",
      "ปัญหาและอุปสรรคในการดูแลนักศึกษา (15 นาที)",
      "แผนการประเมินผลนักศึกษา (15 นาที)",
      "เรื่องอื่นๆ (15 นาที)",
    ],
    documents: [
      { name: "แบบรายงานความก้าวหน้าประจำเดือน", type: "doc" },
      { name: "ตารางการนิเทศนักศึกษา", type: "xlsx" },
    ],
  },
  {
    id: "A003",
    title: "การนิเทศนักศึกษาครั้งที่ 2",
    date: "2566-08-15",
    time: "13:00 - 15:00",
    type: "onsite",
    location: "บริษัท เทคโนโลยี จำกัด ห้องประชุม 3A",
    description:
      "การนิเทศนักศึกษาครั้งที่ 2 โดยอาจารย์นิเทศ เพื่อติดตามความก้าวหน้าของนักศึกษา",
    status: "upcoming",
    participants: [
      { name: "ผศ.ดร.สมชาย ใจดี", role: "อาจารย์นิเทศ" },
      { name: "นายธนกร มั่นคง", role: "นักศึกษา" },
      { name: "นางสาวพิมพ์ชนก รักเรียน", role: "นักศึกษา" },
      { name: "นายภาคิน ใจดี", role: "นักศึกษา" },
    ],
    notes: "",
    agenda: [
      "ติดตามความก้าวหน้าตามข้อเสนอแนะครั้งที่ 1 (30 นาที)",
      "นักศึกษานำเสนอความก้าวหน้าในการฝึกงาน (45 นาที)",
      "พี่เลี้ยงให้ข้อมูลเกี่ยวกับการปฏิบัติงานของนักศึกษา (30 นาที)",
      "อาจารย์นิเทศให้คำแนะนำและข้อเสนอแนะ (15 นาที)",
    ],
    documents: [
      { name: "แบบประเมินการนิเทศครั้งที่ 2", type: "pdf" },
      { name: "แบบบันทึกการนิเทศ", type: "doc" },
    ],
  },
  {
    id: "A004",
    title: "ประชุมเตรียมความพร้อมก่อนสิ้นสุดการฝึกงาน",
    date: "2566-09-10",
    time: "14:00 - 15:30",
    type: "online",
    location: "Google Meet",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingId: "abc-defg-hij",
    description:
      "ประชุมเตรียมความพร้อมก่อนสิ้นสุดการฝึกงาน เพื่อสรุปผลการฝึกงานและเตรียมการนำเสนอผลงาน",
    status: "upcoming",
    participants: [
      { name: "ผศ.ดร.สมชาย ใจดี", role: "อาจารย์นิเทศ" },
      { name: "นายธนกร มั่นคง", role: "นักศึกษา" },
      { name: "นางสาวพิมพ์ชนก รักเรียน", role: "นักศึกษา" },
      { name: "นายภาคิน ใจดี", role: "นักศึกษา" },
    ],
    notes: "",
    agenda: [
      "สรุปผลการฝึกงานของนักศึกษา (30 นาที)",
      "แนวทางการจัดทำรายงานฉบับสมบูรณ์ (20 นาที)",
      "การเตรียมการนำเสนอผลงาน (20 นาที)",
      "การประเมินผลสิ้นสุดการฝึกงาน (20 นาที)",
    ],
    documents: [
      { name: "แนวทางการจัดทำรายงานฉบับสมบูรณ์", type: "pdf" },
      { name: "แบบประเมินผลสิ้นสุดการฝึกงาน", type: "pdf" },
    ],
  },
  {
    id: "A005",
    title: "การนิเทศนักศึกษาครั้งที่ 3 (ครั้งสุดท้าย)",
    date: "2566-09-20",
    time: "13:00 - 16:00",
    type: "onsite",
    location: "บริษัท เทคโนโลยี จำกัด ห้องประชุมใหญ่",
    description: "การนิเทศนักศึกษาครั้งสุดท้าย และการนำเสนอผลงานของนักศึกษา",
    status: "upcoming",
    participants: [
      { name: "ผศ.ดร.สมชาย ใจดี", role: "อาจารย์นิเทศ" },
      { name: "ดร.วิชาญ นักสอน", role: "ผู้ประสานงานฝึกงาน" },
      { name: "นายธนกร มั่นคง", role: "นักศึกษา" },
      { name: "นางสาวพิมพ์ชนก รักเรียน", role: "นักศึกษา" },
      { name: "นายภาคิน ใจดี", role: "นักศึกษา" },
    ],
    notes:
      "เตรียมสถานที่สำหรับการนำเสนอผลงานของนักศึกษา และเตรียมแบบประเมินผลการฝึกงาน",
    agenda: [
      "นักศึกษานำเสนอผลงานและสรุปการฝึกงาน (90 นาที)",
      "พี่เลี้ยงให้ข้อมูลและประเมินผลการฝึกงาน (30 นาที)",
      "อาจารย์นิเทศให้ข้อเสนอแนะและสรุปผล (30 นาที)",
      "พิธีปิดการฝึกงาน (30 นาที)",
    ],
    documents: [
      { name: "แบบประเมินการนำเสนอผลงาน", type: "pdf" },
      { name: "แบบประเมินผลสิ้นสุดการฝึกงาน", type: "pdf" },
      { name: "แบบสรุปผลการฝึกงาน", type: "doc" },
    ],
  },
  {
    id: "A006",
    title: "การปฐมนิเทศนักศึกษาฝึกงาน",
    date: "2566-06-01",
    time: "09:00 - 12:00",
    type: "onsite",
    location: "บริษัท เทคโนโลยี จำกัด ห้องประชุมใหญ่",
    description:
      "การปฐมนิเทศนักศึกษาฝึกงาน แนะนำบริษัท กฎระเบียบ และแนวทางการปฏิบัติงาน",
    status: "completed",
    participants: [
      { name: "นายธนกร มั่นคง", role: "นักศึกษา" },
      { name: "นางสาวพิมพ์ชนก รักเรียน", role: "นักศึกษา" },
      { name: "นายภาคิน ใจดี", role: "นักศึกษา" },
    ],
    notes: "การปฐมนิเทศเป็นไปด้วยดี นักศึกษาให้ความสนใจและซักถามข้อสงสัย",
    agenda: [
      "แนะนำบริษัทและวัฒนธรรมองค์กร (30 นาที)",
      "กฎระเบียบและแนวทางการปฏิบัติงาน (30 นาที)",
      "แนะนำทีมงานและโครงสร้างองค์กร (30 นาที)",
      "แนะนำโปรเจกต์และงานที่จะได้รับมอบหมาย (60 นาที)",
      "ถาม-ตอบ (30 นาที)",
    ],
    documents: [
      { name: "คู่มือพนักงาน", type: "pdf" },
      { name: "แบบฟอร์มลงเวลาปฏิบัติงาน", type: "xlsx" },
      { name: "เอกสารแนะนำบริษัท", type: "pdf" },
    ],
  },
  {
    id: "A007",
    title: "ประชุมแนะนำโปรเจกต์",
    date: "2566-06-05",
    time: "13:30 - 15:00",
    type: "onsite",
    location: "บริษัท เทคโนโลยี จำกัด ห้องประชุม 2B",
    description:
      "ประชุมแนะนำโปรเจกต์ที่นักศึกษาจะได้รับมอบหมายระหว่างการฝึกงาน",
    status: "completed",
    participants: [
      { name: "นายธนกร มั่นคง", role: "นักศึกษา" },
      { name: "นางสาวพิมพ์ชนก รักเรียน", role: "นักศึกษา" },
      { name: "นายภาคิน ใจดี", role: "นักศึกษา" },
    ],
    notes:
      "นักศึกษาเข้าใจโปรเจกต์ที่ได้รับมอบหมาย และมีความกระตือรือร้นในการเริ่มงาน",
    agenda: [
      "แนะนำโปรเจกต์และเป้าหมาย (30 นาที)",
      "รายละเอียดงานและความคาดหวัง (30 นาที)",
      "ระยะเวลาและแผนการดำเนินงาน (15 นาที)",
      "ถาม-ตอบ (15 นาที)",
    ],
    documents: [
      { name: "เอกสารรายละเอียดโปรเจกต์", type: "pdf" },
      { name: "แผนการดำเนินงาน", type: "xlsx" },
    ],
  },
];

// Helper function to format date
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("th-TH", options);
}

// Helper function to get document icon based on type
function getDocumentIcon(type: string) {
  switch (type) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "xlsx":
    case "xls":
      return "📊";
    default:
      return "📎";
  }
}

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  // Find the appointment by ID
  const appointment = appointments.find((a) => a.id === appointmentId);

  // If appointment not found, show error
  if (!appointment) {
    return (
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <MentorSidebar activePage="schedule" />
          <div className="md:col-span-3">
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-xl font-bold mb-2">
                  ไม่พบข้อมูลการนัดหมาย
                </h2>
                <p className="text-muted-foreground mb-4">
                  ไม่พบข้อมูลการนัดหมายที่คุณกำลังค้นหา
                </p>
                <Button onClick={() => router.push("/mentor/schedule")}>
                  กลับไปยังตารางนัดหมาย
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MentorSidebar activePage="schedule" />

        <div className="md:col-span-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/mentor/schedule">
                <ChevronLeft className="h-4 w-4 mr-1" />
                กลับไปยังตารางนัดหมาย
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">
                      {appointment.title}
                    </CardTitle>
                    {appointment.status === "upcoming" ? (
                      <Badge className="bg-blue-500">กำลังจะมาถึง</Badge>
                    ) : (
                      <Badge className="bg-green-500">เสร็จสิ้น</Badge>
                    )}
                  </div>
                  <CardDescription className="text-base mt-1">
                    {appointment.description}
                  </CardDescription>
                </div>
                {appointment.type === "online" && appointment.meetingLink && (
                  <Button className="self-start" asChild>
                    <Link href={appointment.meetingLink} target="_blank">
                      <Video className="mr-2 h-4 w-4" />
                      เข้าร่วมประชุม
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        วันที่
                      </div>
                      <div className="font-medium">
                        {formatDate(appointment.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">เวลา</div>
                      <div className="font-medium">{appointment.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      {appointment.type === "onsite" ? (
                        <MapPin className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Video className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        สถานที่
                      </div>
                      <div className="font-medium">{appointment.location}</div>
                      {appointment.type === "online" &&
                        appointment.meetingId && (
                          <div className="text-sm mt-1">
                            <div>Meeting ID: {appointment.meetingId}</div>
                            {appointment.passcode && (
                              <div>Passcode: {appointment.passcode}</div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        ผู้เข้าร่วม ({appointment.participants.length})
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {appointment.participants.map((participant, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {participant.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {participant.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">กำหนดการ</h3>
                <div className="space-y-2">
                  {appointment.agenda.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-0.5">{item}</div>
                    </div>
                  ))}
                </div>
              </div>

              {appointment.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-3">หมายเหตุ</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      {appointment.notes}
                    </div>
                  </div>
                </>
              )}

              {appointment.documents && appointment.documents.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      เอกสารที่เกี่ยวข้อง
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {appointment.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50"
                        >
                          <div className="text-xl">
                            {getDocumentIcon(doc.type)}
                          </div>
                          <div className="flex-1 truncate">{doc.name}</div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                {appointment.status === "upcoming" && (
                  <>
                    <Button variant="outline">แก้ไขการนัดหมาย</Button>
                    <Button variant="destructive">ยกเลิกการนัดหมาย</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
