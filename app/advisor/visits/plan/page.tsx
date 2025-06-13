import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, ClockIcon } from "lucide-react"
import AdvisorSidebar from "@/components/advisor-sidebar"

export default function PlanVisit() {
  // Mock data for students
  const students = [
    {
      id: 1,
      name: "นายวิชัย เรียนดี",
      studentId: "64123456101",
      major: "วิศวกรรมคอมพิวเตอร์",
      company: "บริษัท เทคโนโลยีดิจิทัล จำกัด",
      location: "กรุงเทพมหานคร",
    },
    {
      id: 2,
      name: "นางสาวนภา สุขใจ",
      studentId: "64123456102",
      major: "วิศวกรรมคอมพิวเตอร์",
      company: "บริษัท เน็ตเวิร์ค โซลูชั่น จำกัด",
      location: "นนทบุรี",
    },
    {
      id: 3,
      name: "นายมานะ ตั้งใจ",
      studentId: "64123456791",
      major: "วิศวกรรมไฟฟ้า",
      company: "บริษัท อิเล็กทรอนิกส์ จำกัด",
      location: "ชลบุรี",
    },
    {
      id: 4,
      name: "นายธนา รักการเรียน",
      studentId: "64123456103",
      major: "วิศวกรรมไฟฟ้า",
      company: "บริษัท อิเล็กทรอนิกส์ จำกัด",
      location: "ชลบุรี",
    },
    {
      id: 5,
      name: "นางสาวพิมพ์ใจ รักเรียน",
      studentId: "64123456105",
      major: "วิศวกรรมคอมพิวเตอร์",
      company: "บริษัท โปรแกรมมิ่ง เอ็กซ์เพิร์ต จำกัด",
      location: "นนทบุรี",
    },
  ]

  // Mock data for transportation options
  const transportationOptions = [
    { id: "car", name: "รถยนต์ส่วนตัว" },
    { id: "taxi", name: "แท็กซี่" },
    { id: "public", name: "รถสาธารณะ" },
    { id: "university", name: "รถของมหาวิทยาลัย" },
  ]

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
                <CardTitle className="text-xl">วางแผนการนิเทศนักศึกษา</CardTitle>
                <CardDescription>กำหนดวันเวลาและรายละเอียดการนิเทศนักศึกษา</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">1. เลือกนักศึกษาที่ต้องการนิเทศ</h3>
                    <div className="border rounded-md p-4">
                      <div className="space-y-4">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-start space-x-3">
                            <Checkbox id={`student-${student.id}`} />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={`student-${student.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {student.name} ({student.studentId})
                              </label>
                              <p className="text-sm text-gray-500">
                                {student.major} • {student.company} • {student.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">2. กำหนดวันและเวลา</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="visit-date">วันที่นิเทศ</Label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input id="visit-date" type="date" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visit-time">เวลา</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input id="visit-time-start" type="time" className="pl-10" />
                          </div>
                          <div className="relative">
                            <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input id="visit-time-end" type="time" className="pl-10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">3. รายละเอียดการเดินทาง</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="transportation">การเดินทาง</Label>
                        <Select>
                          <SelectTrigger id="transportation">
                            <SelectValue placeholder="เลือกวิธีการเดินทาง" />
                          </SelectTrigger>
                          <SelectContent>
                            {transportationOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="distance">ระยะทาง (กิโลเมตร)</Label>
                        <Input id="distance" type="number" placeholder="ระบุระยะทางโดยประมาณ" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">4. หัวข้อและวัตถุประสงค์การนิเทศ</h3>
                    <div className="space-y-2">
                      <Label htmlFor="visit-title">หัวข้อการนิเทศ</Label>
                      <Input id="visit-title" placeholder="เช่น การนิเทศครั้งที่ 1 ประจำภาคการศึกษา 1/2567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visit-objectives">วัตถุประสงค์การนิเทศ</Label>
                      <Textarea
                        id="visit-objectives"
                        placeholder="ระบุวัตถุประสงค์ของการนิเทศครั้งนี้"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">5. หมายเหตุเพิ่มเติม</h3>
                    <div className="space-y-2">
                      <Label htmlFor="visit-notes">หมายเหตุ</Label>
                      <Textarea
                        id="visit-notes"
                        placeholder="ระบุข้อมูลเพิ่มเติมที่เกี่ยวข้องกับการนิเทศ (ถ้ามี)"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/advisor/visits">
                  <Button variant="outline">ยกเลิก</Button>
                </Link>
                <div className="flex gap-2">
                  <Button variant="outline">บันทึกเป็นแบบร่าง</Button>
                  <Button>บันทึกและส่งแผนการนิเทศ</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
