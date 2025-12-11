import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  FileTextIcon,
  BriefcaseIcon,
  UserIcon,
  BookOpenIcon,
  ClipboardListIcon,
  SearchIcon,
  MapPinIcon,
  BuildingIcon,
  BanknoteIcon,
} from "lucide-react";

export default function Jobs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">เมนูหลัก</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    <span>หน้าหลัก</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>ข้อมูลส่วนตัว</span>
                  </Link>
                  <Link
                    href="/dashboard/jobs"
                    className="flex items-center gap-2 p-2 bg-blue-50 text-blue-600 rounded-md"
                  >
                    <BriefcaseIcon className="h-4 w-4" />
                    <span>ตำแหน่งงาน</span>
                  </Link>
                  <Link
                    href="/dashboard/documents"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    <span>เอกสาร</span>
                  </Link>
                  <Link
                    href="/dashboard/schedule"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span>ตารางนัดหมาย</span>
                  </Link>
                  <Link
                    href="/dashboard/reports"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  >
                    <ClipboardListIcon className="h-4 w-4" />
                    <span>รายงานผล</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">ค้นหาตำแหน่งงานฝึกงาน</CardTitle>
                <CardDescription>ค้นหาตำแหน่งงานที่เหมาะกับคุณ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ค้นหาตำแหน่งงาน, แหล่งฝึกงาน, ทักษะ..."
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="ประเภทงาน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทั้งหมด</SelectItem>
                          <SelectItem value="software">
                            พัฒนาซอฟต์แวร์
                          </SelectItem>
                          <SelectItem value="network">
                            เครือข่ายและระบบ
                          </SelectItem>
                          <SelectItem value="data">วิเคราะห์ข้อมูล</SelectItem>
                          <SelectItem value="design">
                            ออกแบบและกราฟิก
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="จังหวัด" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทั้งหมด</SelectItem>
                          <SelectItem value="bangkok">กรุงเทพมหานคร</SelectItem>
                          <SelectItem value="nonthaburi">นนทบุรี</SelectItem>
                          <SelectItem value="pathumthani">ปทุมธานี</SelectItem>
                          <SelectItem value="chiangmai">เชียงใหม่</SelectItem>
                          <SelectItem value="chonburi">ชลบุรี</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เงินเดือน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทั้งหมด</SelectItem>
                          <SelectItem value="10000">10,000+ บาท</SelectItem>
                          <SelectItem value="12000">12,000+ บาท</SelectItem>
                          <SelectItem value="15000">15,000+ บาท</SelectItem>
                          <SelectItem value="18000">18,000+ บาท</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>ค้นหา</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  ตำแหน่งงานที่เปิดรับสมัคร
                </CardTitle>
                <CardDescription>
                  พบ 15 ตำแหน่งงานที่ตรงกับสาขาวิชาของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          นักพัฒนาเว็บไซต์ (Web Developer)
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <BuildingIcon className="h-4 w-4 mr-1" />
                            <span>แหล่งฝึกงาน เทคโนโลยีดิจิทัล จำกัด</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>กรุงเทพมหานคร</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <BanknoteIcon className="h-4 w-4 mr-1" />
                            <span>15,000 บาท/เดือน</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          พัฒนาเว็บไซต์และแอปพลิเคชันด้วย React, Next.js และ
                          Node.js ทำงานร่วมกับทีมพัฒนาในโปรเจกต์จริง
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            React
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Next.js
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Node.js
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            JavaScript
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <Link href="/dashboard/jobs/1">
                          <Button className="w-full" size="sm">
                            ดูรายละเอียด
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          สมัครงาน
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          นักพัฒนาแอปพลิเคชันมือถือ (Mobile Developer)
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <BuildingIcon className="h-4 w-4 mr-1" />
                            <span>แหล่งฝึกงาน แอพพลิเคชั่น จำกัด</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>เชียงใหม่</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <BanknoteIcon className="h-4 w-4 mr-1" />
                            <span>13,000 บาท/เดือน</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          พัฒนาแอปพลิเคชันบนมือถือด้วย React Native และ Flutter
                          ทำงานร่วมกับทีมออกแบบและพัฒนา
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            React Native
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Flutter
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Mobile
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            UI/UX
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <Link href="/dashboard/jobs/2">
                          <Button className="w-full" size="sm">
                            ดูรายละเอียด
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          สมัครงาน
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          ผู้ช่วยนักวิเคราะห์ข้อมูล (Data Analyst)
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <BuildingIcon className="h-4 w-4 mr-1" />
                            <span>แหล่งฝึกงาน ดาต้า อินไซต์ จำกัด</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>กรุงเทพมหานคร</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <BanknoteIcon className="h-4 w-4 mr-1" />
                            <span>14,000 บาท/เดือน</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          วิเคราะห์ข้อมูลและสร้างรายงานด้วย Python, SQL
                          และเครื่องมือวิเคราะห์ข้อมูลต่างๆ
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Python
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            SQL
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Data Analysis
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Visualization
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <Link href="/dashboard/jobs/3">
                          <Button className="w-full" size="sm">
                            ดูรายละเอียด
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          สมัครงาน
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          ผู้ช่วยวิศวกรเครือข่าย (Network Engineer)
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <BuildingIcon className="h-4 w-4 mr-1" />
                            <span>แหล่งฝึกงาน เน็ตเวิร์ค โซลูชั่น จำกัด</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>นนทบุรี</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <BanknoteIcon className="h-4 w-4 mr-1" />
                            <span>12,000 บาท/เดือน</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          ดูแลและจัดการระบบเครือข่าย
                          ติดตั้งและกำหนดค่าอุปกรณ์เครือข่าย
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Network
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Cisco
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Linux
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Security
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <Link href="/dashboard/jobs/4">
                          <Button className="w-full" size="sm">
                            ดูรายละเอียด
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          สมัครงาน
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          นักออกแบบ UI/UX (UI/UX Designer)
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <BuildingIcon className="h-4 w-4 mr-1" />
                            <span>แหล่งฝึกงาน ครีเอทีฟ ดีไซน์ จำกัด</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>กรุงเทพมหานคร</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <BanknoteIcon className="h-4 w-4 mr-1" />
                            <span>13,500 บาท/เดือน</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          ออกแบบส่วนติดต่อผู้ใช้และประสบการณ์ผู้ใช้สำหรับเว็บไซต์และแอปพลิเคชัน
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Figma
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Adobe XD
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            UI/UX
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Prototyping
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <Link href="/dashboard/jobs/5">
                          <Button className="w-full" size="sm">
                            ดูรายละเอียด
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          สมัครงาน
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button variant="outline">แสดงเพิ่มเติม</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
