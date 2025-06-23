import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AdminSidebar from "@/components/admin-sidebar";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <AdminSidebar activePage="settings" />

        <div className="md:col-span-3">
          <div className="mb-6">
            <h1 className="text-xl font-bold">ตั้งค่าระบบ</h1>
            <p className="text-gray-500">จัดการการตั้งค่าต่างๆ ของระบบฝึกงาน</p>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general">ทั่วไป</TabsTrigger>
              <TabsTrigger value="users">ผู้ใช้งาน</TabsTrigger>
              <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
              <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>ตั้งค่าทั่วไป</CardTitle>
                  <CardDescription>
                    จัดการการตั้งค่าทั่วไปของระบบ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">ข้อมูลสถาบัน</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="institution-name">ชื่อสถาบัน</Label>
                        <Input
                          id="institution-name"
                          defaultValue="มหาวิทยาลัยเทคโนโลยีสุรนารี"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department-name">ชื่อคณะ/สาขา</Label>
                        <Input
                          id="department-name"
                          defaultValue="สำนักวิชาเภสัชศาสตร์"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">ที่อยู่</Label>
                      <Input
                        id="address"
                        defaultValue="111 ถ.มหาวิทยาลัย ต.สุรนารี อ.เมือง จ.นครราชสีมา 30000"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                        <Input id="phone" defaultValue="044-123456" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">อีเมล</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="coop@sut.ac.th"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">ตั้งค่าระบบ</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenance-mode">โหมดบำรุงรักษา</Label>
                        <p className="text-sm text-gray-500">
                          เปิดใช้งานโหมดบำรุงรักษาเพื่อปิดการเข้าถึงระบบชั่วคราว
                        </p>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="debug-mode">โหมดดีบัก</Label>
                        <p className="text-sm text-gray-500">
                          เปิดใช้งานโหมดดีบักเพื่อบันทึกข้อมูลการใช้งานโดยละเอียด
                        </p>
                      </div>
                      <Switch id="debug-mode" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="system-language">ภาษาของระบบ</Label>
                      <Select defaultValue="th">
                        <SelectTrigger id="system-language">
                          <SelectValue placeholder="เลือกภาษา" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="th">ไทย</SelectItem>
                          <SelectItem value="en">อังกฤษ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>บันทึกการตั้งค่า</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>ตั้งค่าผู้ใช้งาน</CardTitle>
                  <CardDescription>
                    จัดการการตั้งค่าเกี่ยวกับผู้ใช้งานในระบบ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">การลงทะเบียน</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allow-registration">
                          อนุญาตให้ลงทะเบียน
                        </Label>
                        <p className="text-sm text-gray-500">
                          อนุญาตให้ผู้ใช้ใหม่ลงทะเบียนเข้าใช้งานระบบ
                        </p>
                      </div>
                      <Switch id="allow-registration" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-approval">
                          ต้องการการอนุมัติ
                        </Label>
                        <p className="text-sm text-gray-500">
                          ผู้ใช้ใหม่ต้องได้รับการอนุมัติก่อนเข้าใช้งานระบบ
                        </p>
                      </div>
                      <Switch id="require-approval" defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">นโยบายรหัสผ่าน</h3>
                    <div className="space-y-2">
                      <Label htmlFor="min-password-length">
                        ความยาวรหัสผ่านขั้นต่ำ
                      </Label>
                      <Select defaultValue="8">
                        <SelectTrigger id="min-password-length">
                          <SelectValue placeholder="เลือกความยาว" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 ตัวอักษร</SelectItem>
                          <SelectItem value="8">8 ตัวอักษร</SelectItem>
                          <SelectItem value="10">10 ตัวอักษร</SelectItem>
                          <SelectItem value="12">12 ตัวอักษร</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-special-char">
                          ต้องมีอักขระพิเศษ
                        </Label>
                        <p className="text-sm text-gray-500">
                          รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว
                        </p>
                      </div>
                      <Switch id="require-special-char" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-number">ต้องมีตัวเลข</Label>
                        <p className="text-sm text-gray-500">
                          รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว
                        </p>
                      </div>
                      <Switch id="require-number" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">อายุรหัสผ่าน</Label>
                      <Select defaultValue="90">
                        <SelectTrigger id="password-expiry">
                          <SelectValue placeholder="เลือกอายุรหัสผ่าน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 วัน</SelectItem>
                          <SelectItem value="60">60 วัน</SelectItem>
                          <SelectItem value="90">90 วัน</SelectItem>
                          <SelectItem value="never">ไม่มีกำหนด</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>บันทึกการตั้งค่า</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>ตั้งค่าการแจ้งเตือน</CardTitle>
                  <CardDescription>
                    จัดการการตั้งค่าการแจ้งเตือนในระบบ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      การแจ้งเตือนทางอีเมล
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">
                          เปิดใช้งานการแจ้งเตือนทางอีเมล
                        </Label>
                        <p className="text-sm text-gray-500">
                          ส่งการแจ้งเตือนทางอีเมลเมื่อมีกิจกรรมสำคัญ
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-sender">อีเมลผู้ส่ง</Label>
                      <Input
                        id="email-sender"
                        defaultValue="noreply@sut.ac.th"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-sender-name">ชื่อผู้ส่ง</Label>
                      <Input
                        id="email-sender-name"
                        defaultValue="ระบบฝึกงาน มหาวิทยาลัยเทคโนโลยีสุรนารี"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">ประเภทการแจ้งเตือน</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-new-report">รายงานใหม่</Label>
                        <p className="text-sm text-gray-500">
                          แจ้งเตือนเมื่อมีการส่งรายงานใหม่
                        </p>
                      </div>
                      <Switch id="notify-new-report" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-new-appointment">
                          การนัดหมายใหม่
                        </Label>
                        <p className="text-sm text-gray-500">
                          แจ้งเตือนเมื่อมีการสร้างการนัดหมายใหม่
                        </p>
                      </div>
                      <Switch id="notify-new-appointment" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-status-change">
                          การเปลี่ยนสถานะ
                        </Label>
                        <p className="text-sm text-gray-500">
                          แจ้งเตือนเมื่อมีการเปลี่ยนสถานะของนักศึกษา
                        </p>
                      </div>
                      <Switch id="notify-status-change" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-deadline">กำหนดส่งงาน</Label>
                        <p className="text-sm text-gray-500">
                          แจ้งเตือนเมื่อใกล้ถึงกำหนดส่งงาน
                        </p>
                      </div>
                      <Switch id="notify-deadline" defaultChecked />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>บันทึกการตั้งค่า</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle>ตั้งค่าปฏิทิน</CardTitle>
                  <CardDescription>
                    จัดการการตั้งค่าปฏิทินและกำหนดการต่างๆ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">ปีการศึกษา</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-academic-year">
                          ปีการศึกษาปัจจุบัน
                        </Label>
                        <Select defaultValue="2566">
                          <SelectTrigger id="current-academic-year">
                            <SelectValue placeholder="เลือกปีการศึกษา" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2565">2565</SelectItem>
                            <SelectItem value="2566">2566</SelectItem>
                            <SelectItem value="2567">2567</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current-semester">
                          ภาคการศึกษาปัจจุบัน
                        </Label>
                        <Select defaultValue="1">
                          <SelectTrigger id="current-semester">
                            <SelectValue placeholder="เลือกภาคการศึกษา" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">กำหนดการสำคัญ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="registration-start">
                          วันเริ่มลงทะเบียนฝึกงาน
                        </Label>
                        <Input
                          id="registration-start"
                          type="date"
                          defaultValue="2023-06-01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registration-end">
                          วันสิ้นสุดลงทะเบียนฝึกงาน
                        </Label>
                        <Input
                          id="registration-end"
                          type="date"
                          defaultValue="2023-06-15"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="coop-start">วันเริ่มฝึกงาน</Label>
                        <Input
                          id="coop-start"
                          type="date"
                          defaultValue="2023-08-01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="coop-end">วันสิ้นสุดฝึกงาน</Label>
                        <Input
                          id="coop-end"
                          type="date"
                          defaultValue="2023-12-01"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="report-deadline">
                          กำหนดส่งรายงานฉบับสมบูรณ์
                        </Label>
                        <Input
                          id="report-deadline"
                          type="date"
                          defaultValue="2023-11-15"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentation-date">
                          วันนำเสนอผลงาน
                        </Label>
                        <Input
                          id="presentation-date"
                          type="date"
                          defaultValue="2023-12-15"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">การแสดงผลปฏิทิน</h3>
                    <div className="space-y-2">
                      <Label htmlFor="default-calendar-view">
                        มุมมองปฏิทินเริ่มต้น
                      </Label>
                      <Select defaultValue="month">
                        <SelectTrigger id="default-calendar-view">
                          <SelectValue placeholder="เลือกมุมมอง" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">รายวัน</SelectItem>
                          <SelectItem value="week">รายสัปดาห์</SelectItem>
                          <SelectItem value="month">รายเดือน</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-weekends">
                          แสดงวันหยุดสุดสัปดาห์
                        </Label>
                        <p className="text-sm text-gray-500">
                          แสดงวันเสาร์และวันอาทิตย์ในมุมมองปฏิทิน
                        </p>
                      </div>
                      <Switch id="show-weekends" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-holidays">
                          แสดงวันหยุดนักขัตฤกษ์
                        </Label>
                        <p className="text-sm text-gray-500">
                          แสดงวันหยุดนักขัตฤกษ์ในมุมมองปฏิทิน
                        </p>
                      </div>
                      <Switch id="show-holidays" defaultChecked />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>บันทึกการตั้งค่า</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
