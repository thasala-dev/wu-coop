import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LinkIcon, SearchIcon, UserIcon, BuildingIcon } from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";

export default function AdminMatching() {
  // Mock data for co-op terms
  const coopTerms = [
    {
      id: 1,
      name: "ภาคการศึกษาที่ 1/2567",
      shortName: "1/2567",
      status: "active",
    },
    {
      id: 2,
      name: "ภาคการศึกษาที่ 2/2567",
      shortName: "2/2567",
      status: "upcoming",
    },
    {
      id: 3,
      name: "ภาคการศึกษาที่ 1/2568",
      shortName: "1/2568",
      status: "planning",
    },
    {
      id: 4,
      name: "ภาคการศึกษาที่ 2/2566",
      shortName: "2/2566",
      status: "completed",
    },
  ];

  // Mock data for companies
  const companies = [
    {
      id: 1,
      name: "บริษัท เทคโนโลยีดิจิทัล จำกัด",
      location: "กรุงเทพมหานคร",
      mentors: [
        { id: 1, name: "นางสาวปรียา มากความรู้", position: "Senior Developer" },
        { id: 2, name: "นายสมศักดิ์ เชี่ยวชาญ", position: "Project Manager" },
      ],
    },
    {
      id: 2,
      name: "บริษัท เน็ตเวิร์ค โซลูชั่น จำกัด",
      location: "นนทบุรี",
      mentors: [
        { id: 3, name: "นายวิทยา เชี่ยวชาญ", position: "Network Engineer" },
        {
          id: 4,
          name: "นางสาวรัตนา ผู้ชำนาญ",
          position: "System Administrator",
        },
      ],
    },
    {
      id: 3,
      name: "บริษัท โปรแกรมมิ่ง เอ็กซ์เพิร์ต จำกัด",
      location: "กรุงเทพมหานคร",
      mentors: [
        { id: 5, name: "นายธนา ชำนาญโค้ด", position: "Lead Developer" },
        { id: 6, name: "นางสาวพิมพ์ใจ รักการสอน", position: "Technical Lead" },
      ],
    },
    {
      id: 4,
      name: "บริษัท ดาต้า อินไซต์ จำกัด",
      location: "กรุงเทพมหานคร",
      mentors: [
        { id: 7, name: "นายปัญญา วิเคราะห์เก่ง", position: "Data Scientist" },
        { id: 8, name: "นางสาวมีนา ชำนาญข้อมูล", position: "Data Engineer" },
      ],
    },
    {
      id: 5,
      name: "บริษัท พลังงานสะอาด จำกัด",
      location: "ปทุมธานี",
      mentors: [
        { id: 9, name: "นายพลัง นวัตกรรม", position: "Electrical Engineer" },
        { id: 10, name: "นางสาวพลอย พลังงาน", position: "Project Coordinator" },
      ],
    },
    {
      id: 6,
      name: "บริษัท อิเล็กทรอนิกส์ จำกัด",
      location: "ชลบุรี",
      mentors: [
        {
          id: 11,
          name: "นายสุรศักดิ์ เทคนิคดี",
          position: "Electronics Engineer",
        },
        { id: 12, name: "นางสาวไพลิน อุปกรณ์", position: "Quality Control" },
      ],
    },
  ];

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            กำลังดำเนินการ
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            กำลังจะมาถึง
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            เสร็จสิ้น
          </Badge>
        );
      case "planning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            วางแผน
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            ไม่ระบุ
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              ระบบสหกิจศึกษา (ผู้ดูแลระบบ)
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
          <AdminSidebar activePage="matching" />

          <div className="md:col-span-4">
            {/* Term Selector */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">รอบสหกิจศึกษา</CardTitle>
                    <CardDescription>
                      เลือกรอบสหกิจศึกษาที่ต้องการจัดการการจับคู่
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {coopTerms.map((term) => (
                    <Card
                      key={term.id}
                      className={`cursor-pointer hover:border-blue-300 transition-colors ${
                        term.status === "active"
                          ? "border-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {term.shortName}
                          </CardTitle>
                          {getStatusBadge(term.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-gray-600">{term.name}</p>
                        <div className="mt-2">
                          <Button variant="ghost" size="sm" className="w-full">
                            เลือกรอบนี้
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      จัดการการจับคู่นักศึกษากับบริษัท
                    </CardTitle>
                    <CardDescription>ภาคการศึกษาที่ 1/2567</CardDescription>
                  </div>
                  <Button>เริ่มการจับคู่อัตโนมัติ</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <TabsList>
                      <TabsTrigger value="pending">รอจับคู่ (24)</TabsTrigger>
                      <TabsTrigger value="matched">จับคู่แล้ว (96)</TabsTrigger>
                      <TabsTrigger value="rejected">
                        ไม่ผ่านการคัดเลือก (12)
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="ค้นหานักศึกษา..."
                          className="pl-10 pr-4 py-2 border rounded-md w-full"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="รหัสนักศึกษา" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกรหัส</SelectItem>
                          <SelectItem value="cs">68</SelectItem>
                          <SelectItem value="ee">67</SelectItem>
                          <SelectItem value="ie">66</SelectItem>
                          <SelectItem value="me">65</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="ทุกสาขาวิชา" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกสาขาวิชา</SelectItem>
                          <SelectItem value="cs">
                            วิศวกรรมคอมพิวเตอร์
                          </SelectItem>
                          <SelectItem value="ee">วิศวกรรมไฟฟ้า</SelectItem>
                          <SelectItem value="ie">วิศวกรรมอุตสาหการ</SelectItem>
                          <SelectItem value="me">วิศวกรรมเครื่องกล</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <TabsContent value="pending">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>รหัสนักศึกษา</TableHead>
                          <TableHead>ชื่อ-นามสกุล</TableHead>
                          <TableHead>สาขาวิชา</TableHead>
                          <TableHead>บริษัทที่ต้องการ</TableHead>
                          <TableHead>พี่เลี้ยง</TableHead>
                          <TableHead>GPA</TableHead>
                          <TableHead className="text-right">
                            การดำเนินการ
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>64123456789</TableCell>
                          <TableCell>นายสมชาย ใจดี</TableCell>
                          <TableCell>วิศวกรรมคอมพิวเตอร์</TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="h-8 w-full md:w-[200px]">
                                <SelectValue placeholder="เลือกบริษัท" />
                              </SelectTrigger>
                              <SelectContent>
                                {companies.map((company) => (
                                  <SelectItem
                                    key={company.id}
                                    value={`company-${company.id}`}
                                  >
                                    {company.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="h-8 w-full md:w-[200px]">
                                <SelectValue placeholder="เลือกพี่เลี้ยง" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mentor-1">
                                  นางสาวปรียา มากความรู้
                                </SelectItem>
                                <SelectItem value="mentor-2">
                                  นายสมศักดิ์ เชี่ยวชาญ
                                </SelectItem>
                                <SelectItem value="mentor-5">
                                  นายธนา ชำนาญโค้ด
                                </SelectItem>
                                <SelectItem value="mentor-6">
                                  นางสาวพิมพ์ใจ รักการสอน
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>3.45</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm">
                                <LinkIcon className="h-4 w-4 mr-1" />
                                จับคู่
                              </Button>
                              <Button variant="outline" size="sm">
                                รายละเอียด
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>64123456790</TableCell>
                          <TableCell>นางสาวสมศรี ดีใจ</TableCell>
                          <TableCell>วิศวกรรมคอมพิวเตอร์</TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="h-8 w-full md:w-[200px]">
                                <SelectValue placeholder="เลือกบริษัท" />
                              </SelectTrigger>
                              <SelectContent>
                                {companies.map((company) => (
                                  <SelectItem
                                    key={company.id}
                                    value={`company-${company.id}`}
                                  >
                                    {company.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="h-8 w-full md:w-[200px]">
                                <SelectValue placeholder="เลือกพี่เลี้ยง" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mentor-3">
                                  นายวิทยา เชี่ยวชาญ
                                </SelectItem>
                                <SelectItem value="mentor-4">
                                  นางสาวรัตนา ผู้ชำนาญ
                                </SelectItem>
                                <SelectItem value="mentor-7">
                                  นายปัญญา วิเคราะห์เก่ง
                                </SelectItem>
                                <SelectItem value="mentor-8">
                                  นางสาวมีนา ชำนาญข้อมูล
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>3.78</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm">
                                <LinkIcon className="h-4 w-4 mr-1" />
                                จับคู่
                              </Button>
                              <Button variant="outline" size="sm">
                                รายละเอียด
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>64123456791</TableCell>
                          <TableCell>นายมานะ ตั้งใจ</TableCell>
                          <TableCell>วิศวกรรมไฟฟ้า</TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="h-8 w-full md:w-[200px]">
                                <SelectValue placeholder="เลือกบริษัท" />
                              </SelectTrigger>
                              <SelectContent>
                                {companies.map((company) => (
                                  <SelectItem
                                    key={company.id}
                                    value={`company-${company.id}`}
                                  >
                                    {company.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select>
                              <SelectTrigger className="h-8 w-full md:w-[200px]">
                                <SelectValue placeholder="เลือกพี่เลี้ยง" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mentor-9">
                                  นายพลัง นวัตกรรม
                                </SelectItem>
                                <SelectItem value="mentor-10">
                                  นางสาวพลอย พลังงาน
                                </SelectItem>
                                <SelectItem value="mentor-11">
                                  นายสุรศักดิ์ เทคนิคดี
                                </SelectItem>
                                <SelectItem value="mentor-12">
                                  นางสาวไพลิน อุปกรณ์
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>3.22</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm">
                                <LinkIcon className="h-4 w-4 mr-1" />
                                จับคู่
                              </Button>
                              <Button variant="outline" size="sm">
                                รายละเอียด
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="matched">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>รหัสนักศึกษา</TableHead>
                          <TableHead>ชื่อ-นามสกุล</TableHead>
                          <TableHead>สาขาวิชา</TableHead>
                          <TableHead>บริษัทที่จับคู่</TableHead>
                          <TableHead>พี่เลี้ยง</TableHead>
                          <TableHead>วันที่จับคู่</TableHead>
                          <TableHead className="text-right">
                            การดำเนินการ
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>64123456101</TableCell>
                          <TableCell>นายวิชัย เรียนดี</TableCell>
                          <TableCell>วิศวกรรมคอมพิวเตอร์</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="h-4 w-4 text-gray-500" />
                              <span>บริษัท เทคโนโลยีดิจิทัล จำกัด</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                              <span>นางสาวปรียา มากความรู้</span>
                            </div>
                          </TableCell>
                          <TableCell>15 พ.ค. 2567</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                แก้ไข
                              </Button>
                              <Button variant="ghost" size="sm">
                                รายละเอียด
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>64123456102</TableCell>
                          <TableCell>นางสาวนภา สุขใจ</TableCell>
                          <TableCell>วิศวกรรมคอมพิวเตอร์</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="h-4 w-4 text-gray-500" />
                              <span>บริษัท เน็ตเวิร์ค โซลูชั่น จำกัด</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                              <span>นายวิทยา เชี่ยวชาญ</span>
                            </div>
                          </TableCell>
                          <TableCell>15 พ.ค. 2567</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                แก้ไข
                              </Button>
                              <Button variant="ghost" size="sm">
                                รายละเอียด
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>64123456103</TableCell>
                          <TableCell>นายธนา รักการเรียน</TableCell>
                          <TableCell>วิศวกรรมไฟฟ้า</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="h-4 w-4 text-gray-500" />
                              <span>บริษัท อิเล็กทรอนิกส์ จำกัด</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                              <span>นายสุรศักดิ์ เทคนิคดี</span>
                            </div>
                          </TableCell>
                          <TableCell>15 พ.ค. 2567</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                แก้ไข
                              </Button>
                              <Button variant="ghost" size="sm">
                                รายละเอียด
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="rejected">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>รหัสนักศึกษา</TableHead>
                          <TableHead>ชื่อ-นามสกุล</TableHead>
                          <TableHead>สาขาวิชา</TableHead>
                          <TableHead>บริษัทที่ไม่ผ่าน</TableHead>
                          <TableHead>เหตุผล</TableHead>
                          <TableHead className="text-right">
                            การดำเนินการ
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>64123456201</TableCell>
                          <TableCell>นายอนุชา ช้าเรียน</TableCell>
                          <TableCell>วิศวกรรมคอมพิวเตอร์</TableCell>
                          <TableCell>บริษัท เทคโนโลยีดิจิทัล จำกัด</TableCell>
                          <TableCell>
                            ทักษะการเขียนโปรแกรมไม่ตรงตามที่ต้องการ
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm">
                                <LinkIcon className="h-4 w-4 mr-1" />
                                จับคู่ใหม่
                              </Button>
                              <Button variant="ghost" size="sm">
                                รายละเอียด
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>64123456202</TableCell>
                          <TableCell>นางสาวเมธาวี ขยันเรียน</TableCell>
                          <TableCell>วิศวกรรมไฟฟ้า</TableCell>
                          <TableCell>บริษัท พลังงานสะอาด จำกัด</TableCell>
                          <TableCell>มีผู้สมัครที่มีคุณสมบัติตรงกว่า</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm">
                                <LinkIcon className="h-4 w-4 mr-1" />
                                จับคู่ใหม่
                              </Button>
                              <Button variant="ghost" size="sm">
                                รายละเอียด
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
