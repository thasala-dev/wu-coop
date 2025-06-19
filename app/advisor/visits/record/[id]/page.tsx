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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  BuildingIcon,
  ArrowLeftIcon,
} from "lucide-react";
import AdvisorSidebar from "@/components/advisor-sidebar";

export default function RecordVisit({ params }: { params: { id: string } }) {
  const visitId = params.id;

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
    },
    company: {
      id: 1,
      name: "บริษัท เทคโนโลยีดิจิทัล จำกัด",
      address:
        "อาคารดิจิทัล ชั้น 15 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพมหานคร 10400",
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
  };

  // Mock data for evaluation criteria
  const evaluationCriteria = [
    { id: "work_quality", name: "คุณภาพงาน" },
    { id: "knowledge", name: "ความรู้และทักษะ" },
    { id: "responsibility", name: "ความรับผิดชอบ" },
    { id: "teamwork", name: "การทำงานร่วมกับผู้อื่น" },
    { id: "adaptation", name: "การปรับตัว" },
    { id: "communication", name: "การสื่อสาร" },
    { id: "problem_solving", name: "การแก้ไขปัญหา" },
    { id: "discipline", name: "ระเบียบวินัย" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              ระบบฝึกงาน (อาจารย์ที่ปรึกษา)
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
                <CardTitle className="text-xl">
                  บันทึกการนิเทศนักศึกษา
                </CardTitle>
                <CardDescription>
                  บันทึกผลการนิเทศและประเมินนักศึกษา
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-3">ข้อมูลการนิเทศ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">วันที่:</span>
                          <span>{visit.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">เวลา:</span>
                          <span>{visit.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">นักศึกษา:</span>
                          <span>
                            {visit.student.name} ({visit.student.studentId})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BuildingIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">บริษัท:</span>
                          <span>{visit.company.name}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPinIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">ที่อยู่:</span>
                          <span>{visit.company.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">พี่เลี้ยง:</span>
                          <span>
                            {visit.mentor.name} ({visit.mentor.position})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="evaluation">
                    <TabsList className="mb-4">
                      <TabsTrigger value="evaluation">การประเมิน</TabsTrigger>
                      <TabsTrigger value="interview">การสัมภาษณ์</TabsTrigger>
                      <TabsTrigger value="photos">ภาพถ่าย</TabsTrigger>
                    </TabsList>

                    <TabsContent value="evaluation">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            การประเมินผลการปฏิบัติงาน
                          </h3>
                          <p className="text-sm text-gray-600">
                            ประเมินผลการปฏิบัติงานของนักศึกษาในแต่ละด้าน
                            โดยให้คะแนน 1-5 (1 = ต้องปรับปรุง, 5 = ดีเยี่ยม)
                          </p>

                          <div className="space-y-4">
                            {evaluationCriteria.map((criteria) => (
                              <div key={criteria.id} className="space-y-2">
                                <Label htmlFor={criteria.id}>
                                  {criteria.name}
                                </Label>
                                <RadioGroup
                                  id={criteria.id}
                                  className="flex space-x-2"
                                >
                                  {[1, 2, 3, 4, 5].map((score) => (
                                    <div
                                      key={score}
                                      className="flex flex-col items-center"
                                    >
                                      <RadioGroupItem
                                        value={score.toString()}
                                        id={`${criteria.id}-${score}`}
                                      />
                                      <Label
                                        htmlFor={`${criteria.id}-${score}`}
                                        className="text-xs mt-1 font-normal"
                                      >
                                        {score}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            ความคิดเห็นและข้อเสนอแนะ
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="strengths">
                                จุดเด่นของนักศึกษา
                              </Label>
                              <Textarea
                                id="strengths"
                                placeholder="ระบุจุดเด่นและความสามารถพิเศษของนักศึกษา"
                                className="min-h-[100px]"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="improvements">
                                จุดที่ควรปรับปรุง
                              </Label>
                              <Textarea
                                id="improvements"
                                placeholder="ระบุจุดที่นักศึกษาควรปรับปรุงและพัฒนา"
                                className="min-h-[100px]"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="recommendations">
                                ข้อเสนอแนะเพิ่มเติม
                              </Label>
                              <Textarea
                                id="recommendations"
                                placeholder="ข้อเสนอแนะเพิ่มเติมสำหรับนักศึกษา"
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            สรุปผลการประเมิน
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="overall-rating">
                                ผลการประเมินโดยรวม
                              </Label>
                              <Select>
                                <SelectTrigger id="overall-rating">
                                  <SelectValue placeholder="เลือกผลการประเมิน" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="excellent">
                                    ดีเยี่ยม
                                  </SelectItem>
                                  <SelectItem value="good">ดี</SelectItem>
                                  <SelectItem value="satisfactory">
                                    พอใช้
                                  </SelectItem>
                                  <SelectItem value="needs_improvement">
                                    ต้องปรับปรุง
                                  </SelectItem>
                                  <SelectItem value="unsatisfactory">
                                    ไม่ผ่าน
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="summary">สรุปผลการนิเทศ</Label>
                              <Textarea
                                id="summary"
                                placeholder="สรุปผลการนิเทศและข้อสังเกตโดยรวม"
                                className="min-h-[150px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="interview">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            บันทึกการสัมภาษณ์นักศึกษา
                          </h3>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="student-interview">
                                การสัมภาษณ์นักศึกษา
                              </Label>
                              <Textarea
                                id="student-interview"
                                placeholder="บันทึกการสัมภาษณ์และความคิดเห็นของนักศึกษา"
                                className="min-h-[150px]"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="mentor-interview">
                                การสัมภาษณ์พี่เลี้ยง
                              </Label>
                              <Textarea
                                id="mentor-interview"
                                placeholder="บันทึกการสัมภาษณ์และความคิดเห็นของพี่เลี้ยง"
                                className="min-h-[150px]"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="work-environment">
                                สภาพแวดล้อมการทำงาน
                              </Label>
                              <Textarea
                                id="work-environment"
                                placeholder="บันทึกข้อมูลเกี่ยวกับสภาพแวดล้อมการทำงานของนักศึกษา"
                                className="min-h-[100px]"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="assigned-tasks">
                                งานที่ได้รับมอบหมาย
                              </Label>
                              <Textarea
                                id="assigned-tasks"
                                placeholder="บันทึกข้อมูลเกี่ยวกับงานที่นักศึกษาได้รับมอบหมาย"
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="photos">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            ภาพถ่ายการนิเทศ
                          </h3>
                          <p className="text-sm text-gray-600">
                            อัพโหลดภาพถ่ายการนิเทศ เช่น
                            ภาพถ่ายร่วมกับนักศึกษาและพี่เลี้ยง, ภาพสถานที่ทำงาน,
                            ภาพการปฏิบัติงานของนักศึกษา
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="photo-1">ภาพถ่ายที่ 1</Label>
                              <Input
                                id="photo-1"
                                type="file"
                                accept="image/*"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="photo-2">ภาพถ่ายที่ 2</Label>
                              <Input
                                id="photo-2"
                                type="file"
                                accept="image/*"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="photo-3">ภาพถ่ายที่ 3</Label>
                              <Input
                                id="photo-3"
                                type="file"
                                accept="image/*"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="photo-4">ภาพถ่ายที่ 4</Label>
                              <Input
                                id="photo-4"
                                type="file"
                                accept="image/*"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="photo-description">
                              คำอธิบายภาพถ่าย
                            </Label>
                            <Textarea
                              id="photo-description"
                              placeholder="อธิบายรายละเอียดเกี่ยวกับภาพถ่ายที่อัพโหลด"
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/advisor/visits">
                  <Button variant="outline">ยกเลิก</Button>
                </Link>
                <div className="flex gap-2">
                  <Button variant="outline">บันทึกเป็นแบบร่าง</Button>
                  <Button>บันทึกและส่งรายงาน</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
