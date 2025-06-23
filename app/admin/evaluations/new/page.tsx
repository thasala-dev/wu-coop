import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  PlusIcon,
  GripVertical,
  Trash2Icon,
  ArrowLeftIcon,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";

export default function NewEvaluation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              ระบบฝึกงาน (ผู้ดูแลระบบ)
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">ผู้ดูแลระบบ</span>
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
          <AdminSidebar activePage="evaluations" />

          <div className="md:col-span-4">
            <div className="flex items-center mb-6">
              <Link href="/admin/evaluations" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  กลับ
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">สร้างแบบประเมินใหม่</h1>
                <p className="text-gray-500">
                  กรอกข้อมูลและสร้างหัวข้อการประเมิน
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลแบบประเมิน</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">ชื่อแบบประเมิน</Label>
                      <Input id="title" placeholder="ระบุชื่อแบบประเมิน" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">คำอธิบาย</Label>
                      <Textarea
                        id="description"
                        placeholder="ระบุคำอธิบายแบบประเมิน"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="evaluator-type">ผู้ประเมิน</Label>
                        <Select>
                          <SelectTrigger id="evaluator-type">
                            <SelectValue placeholder="เลือกผู้ประเมิน" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">นักศึกษา</SelectItem>
                            <SelectItem value="advisor">อาจารย์</SelectItem>
                            <SelectItem value="mentor">พี่เลี้ยง</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evaluation-target">
                          เป้าหมายการประเมิน
                        </Label>
                        <Select>
                          <SelectTrigger id="evaluation-target">
                            <SelectValue placeholder="เลือกเป้าหมาย" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">นักศึกษา</SelectItem>
                            <SelectItem value="company">แหล่งฝึกงาน</SelectItem>
                            <SelectItem value="report">รายงาน</SelectItem>
                            <SelectItem value="presentation">
                              การนำเสนอ
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="active" />
                      <Label htmlFor="active">เปิดใช้งานแบบประเมินนี้</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>หัวข้อการประเมิน</CardTitle>
                    <Button variant="outline" size="sm">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      เพิ่มหัวข้อ
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* หัวข้อที่ 1 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <GripVertical className="h-5 w-5 text-gray-400 mr-2 cursor-move" />
                          <span className="font-medium">หัวข้อที่ 1</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="item-1-title">หัวข้อ</Label>
                          <Input
                            id="item-1-title"
                            placeholder="ระบุหัวข้อการประเมิน"
                            defaultValue="ความรู้ความสามารถทางวิชาการ"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-1-description">
                            คำอธิบาย (ถ้ามี)
                          </Label>
                          <Textarea
                            id="item-1-description"
                            placeholder="ระบุคำอธิบายเพิ่มเติม"
                            rows={2}
                            defaultValue="ประเมินความรู้ความสามารถทางวิชาการที่นักศึกษานำมาประยุกต์ใช้ในการปฏิบัติงาน"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ประเภทคำตอบ</Label>
                          <RadioGroup
                            defaultValue="rating"
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="rating" id="rating-1" />
                              <Label htmlFor="rating-1">{"คะแนน (1-5)"}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="text" id="text-1" />
                              <Label htmlFor="text-1">ข้อความ</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yesno" id="yesno-1" />
                              <Label htmlFor="yesno-1">ใช่/ไม่ใช่</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="required-1" defaultChecked />
                          <Label htmlFor="required-1">จำเป็นต้องตอบ</Label>
                        </div>
                      </div>
                    </div>

                    {/* หัวข้อที่ 2 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <GripVertical className="h-5 w-5 text-gray-400 mr-2 cursor-move" />
                          <span className="font-medium">หัวข้อที่ 2</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="item-2-title">หัวข้อ</Label>
                          <Input
                            id="item-2-title"
                            placeholder="ระบุหัวข้อการประเมิน"
                            defaultValue="ความรับผิดชอบและการตรงต่อเวลา"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-2-description">
                            คำอธิบาย (ถ้ามี)
                          </Label>
                          <Textarea
                            id="item-2-description"
                            placeholder="ระบุคำอธิบายเพิ่มเติม"
                            rows={2}
                            defaultValue="ประเมินความรับผิดชอบในงานที่ได้รับมอบหมายและการตรงต่อเวลาในการปฏิบัติงาน"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ประเภทคำตอบ</Label>
                          <RadioGroup
                            defaultValue="rating"
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="rating" id="rating-2" />
                              <Label htmlFor="rating-2">{"คะแนน (1-5)"}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="text" id="text-2" />
                              <Label htmlFor="text-2">ข้อความ</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yesno" id="yesno-2" />
                              <Label htmlFor="yesno-2">ใช่/ไม่ใช่</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="required-2" defaultChecked />
                          <Label htmlFor="required-2">จำเป็นต้องตอบ</Label>
                        </div>
                      </div>
                    </div>

                    {/* หัวข้อที่ 3 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <GripVertical className="h-5 w-5 text-gray-400 mr-2 cursor-move" />
                          <span className="font-medium">หัวข้อที่ 3</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="item-3-title">หัวข้อ</Label>
                          <Input
                            id="item-3-title"
                            placeholder="ระบุหัวข้อการประเมิน"
                            defaultValue="ความคิดริเริ่มสร้างสรรค์และการแก้ไขปัญหา"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-3-description">
                            คำอธิบาย (ถ้ามี)
                          </Label>
                          <Textarea
                            id="item-3-description"
                            placeholder="ระบุคำอธิบายเพิ่มเติม"
                            rows={2}
                            defaultValue="ประเมินความสามารถในการคิดริเริ่มสร้างสรรค์และการแก้ไขปัญหาเฉพาะหน้า"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ประเภทคำตอบ</Label>
                          <RadioGroup
                            defaultValue="rating"
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="rating" id="rating-3" />
                              <Label htmlFor="rating-3">{"คะแนน (1-5)"}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="text" id="text-3" />
                              <Label htmlFor="text-3">ข้อความ</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yesno" id="yesno-3" />
                              <Label htmlFor="yesno-3">ใช่/ไม่ใช่</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="required-3" defaultChecked />
                          <Label htmlFor="required-3">จำเป็นต้องตอบ</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ตัวอย่างแบบประเมิน</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-medium text-lg mb-4">
                        แบบประเมินใหม่
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-1">
                            1. ความรู้ความสามารถทางวิชาการ
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            ประเมินความรู้ความสามารถทางวิชาการที่นักศึกษานำมาประยุกต์ใช้ในการปฏิบัติงาน
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{"น้อยที่สุด"}</span>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <div
                                  key={rating}
                                  className="h-8 w-8 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-200"
                                >
                                  {rating}
                                </div>
                              ))}
                            </div>
                            <span className="text-sm">{"มากที่สุด"}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-1">
                            2. ความรับผิดชอบและการตรงต่อเวลา
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            ประเมินความรับผิดชอบในงานที่ได้รับมอบหมายและการตรงต่อเวลาในการปฏิบัติงาน
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{"น้อยที่สุด"}</span>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <div
                                  key={rating}
                                  className="h-8 w-8 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-200"
                                >
                                  {rating}
                                </div>
                              ))}
                            </div>
                            <span className="text-sm">{"มากที่สุด"}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-1">
                            3. ความคิดริเริ่มสร้างสรรค์และการแก้ไขปัญหา
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            ประเมินความสามารถในการคิดริเริ่มสร้างสรรค์และการแก้ไขปัญหาเฉพาะหน้า
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{"น้อยที่สุด"}</span>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <div
                                  key={rating}
                                  className="h-8 w-8 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-200"
                                >
                                  {rating}
                                </div>
                              ))}
                            </div>
                            <span className="text-sm">{"มากที่สุด"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                  <Button className="w-full">บันทึกแบบประเมิน</Button>
                  <Button variant="outline" className="w-full">
                    ยกเลิก
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
