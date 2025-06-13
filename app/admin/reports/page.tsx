import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, Eye, FileEdit, Trash2 } from "lucide-react"
import Link from "next/link"

// Mock data for reports
const reports = [
  {
    id: "1",
    title: "รายงานความก้าวหน้าประจำเดือนมกราคม",
    type: "รายงานประจำเดือน",
    submittedDate: "15/01/2023",
    student: "นายสมชาย ใจดี",
    company: "บริษัท เทคโนโลยี จำกัด",
    status: "ตรวจแล้ว",
  },
  {
    id: "2",
    title: "รายงานฉบับสมบูรณ์",
    type: "รายงานฉบับสมบูรณ์",
    submittedDate: "20/03/2023",
    student: "นางสาวสมหญิง รักเรียน",
    company: "บริษัท ซอฟต์แวร์ไทย จำกัด",
    status: "รอตรวจ",
  },
  {
    id: "3",
    title: "รายงานความก้าวหน้าประจำเดือนกุมภาพันธ์",
    type: "รายงานประจำเดือน",
    submittedDate: "15/02/2023",
    student: "นายวิชัย เก่งกาจ",
    company: "บริษัท ไอทีโซลูชั่น จำกัด",
    status: "ตรวจแล้ว",
  },
  {
    id: "4",
    title: "รายงานความก้าวหน้าประจำเดือนมีนาคม",
    type: "รายงานประจำเดือน",
    submittedDate: "15/03/2023",
    student: "นางสาวนภา ดาวเด่น",
    company: "บริษัท เทคโนโลยี จำกัด",
    status: "รอตรวจ",
  },
  {
    id: "5",
    title: "รายงานฉบับสมบูรณ์",
    type: "รายงานฉบับสมบูรณ์",
    submittedDate: "25/03/2023",
    student: "นายสมชาย ใจดี",
    company: "บริษัท เทคโนโลยี จำกัด",
    status: "ตรวจแล้ว",
  },
  {
    id: "6",
    title: "รายงานความก้าวหน้าประจำเดือนมกราคม",
    type: "รายงานประจำเดือน",
    submittedDate: "15/01/2023",
    student: "นางสาวสมหญิง รักเรียน",
    company: "บริษัท ซอฟต์แวร์ไทย จำกัด",
    status: "ตรวจแล้ว",
  },
  {
    id: "7",
    title: "รายงานความก้าวหน้าประจำเดือนกุมภาพันธ์",
    type: "รายงานประจำเดือน",
    submittedDate: "15/02/2023",
    student: "นายวิชัย เก่งกาจ",
    company: "บริษัท ไอทีโซลูชั่น จำกัด",
    status: "รอตรวจ",
  },
]

export default function AdminReportsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <AdminSidebar activePage="reports" />
      <div className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">รายงานทั้งหมด</h1>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="ค้นหารายงาน..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="ประเภทรายงาน" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกประเภท</SelectItem>
              <SelectItem value="monthly">รายงานประจำเดือน</SelectItem>
              <SelectItem value="final">รายงานฉบับสมบูรณ์</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="pending">รอตรวจ</SelectItem>
              <SelectItem value="checked">ตรวจแล้ว</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
            <TabsTrigger value="monthly">รายงานประจำเดือน</TabsTrigger>
            <TabsTrigger value="final">รายงานฉบับสมบูรณ์</TabsTrigger>
            <TabsTrigger value="pending">รอตรวจ</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อรายงาน</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>วันที่ส่ง</TableHead>
                      <TableHead>นักศึกษา</TableHead>
                      <TableHead>บริษัท</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-gray-500" />
                            {report.title}
                          </div>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.submittedDate}</TableCell>
                        <TableCell>{report.student}</TableCell>
                        <TableCell>{report.company}</TableCell>
                        <TableCell>
                          <Badge
                            variant={report.status === "รอตรวจ" ? "outline" : "default"}
                            className={
                              report.status === "รอตรวจ"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="icon" asChild>
                              <Link href={`/admin/reports/${report.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">ดูรายงาน</span>
                              </Link>
                            </Button>
                            <Button variant="outline" size="icon">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">ดาวน์โหลด</span>
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                              <Link href={`/admin/reports/${report.id}/edit`}>
                                <FileEdit className="h-4 w-4" />
                                <span className="sr-only">แก้ไข</span>
                              </Link>
                            </Button>
                            <Button variant="outline" size="icon" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">ลบ</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อรายงาน</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>วันที่ส่ง</TableHead>
                      <TableHead>นักศึกษา</TableHead>
                      <TableHead>บริษัท</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports
                      .filter((report) => report.type === "รายงานประจำเดือน")
                      .map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-gray-500" />
                              {report.title}
                            </div>
                          </TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                          <TableCell>{report.student}</TableCell>
                          <TableCell>{report.company}</TableCell>
                          <TableCell>
                            <Badge
                              variant={report.status === "รอตรวจ" ? "outline" : "default"}
                              className={
                                report.status === "รอตรวจ"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/reports/${report.id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">ดูรายงาน</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">ดาวน์โหลด</span>
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/reports/${report.id}/edit`}>
                                  <FileEdit className="h-4 w-4" />
                                  <span className="sr-only">แก้ไข</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">ลบ</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="final">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อรายงาน</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>วันที่ส่ง</TableHead>
                      <TableHead>นักศึกษา</TableHead>
                      <TableHead>บริษัท</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports
                      .filter((report) => report.type === "รายงานฉบับสมบูรณ์")
                      .map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-gray-500" />
                              {report.title}
                            </div>
                          </TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                          <TableCell>{report.student}</TableCell>
                          <TableCell>{report.company}</TableCell>
                          <TableCell>
                            <Badge
                              variant={report.status === "รอตรวจ" ? "outline" : "default"}
                              className={
                                report.status === "รอตรวจ"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/reports/${report.id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">ดูรายงาน</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">ดาวน์โหลด</span>
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/reports/${report.id}/edit`}>
                                  <FileEdit className="h-4 w-4" />
                                  <span className="sr-only">แก้ไข</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">ลบ</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อรายงาน</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>วันที่ส่ง</TableHead>
                      <TableHead>นักศึกษา</TableHead>
                      <TableHead>บริษัท</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports
                      .filter((report) => report.status === "รอตรวจ")
                      .map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-gray-500" />
                              {report.title}
                            </div>
                          </TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.submittedDate}</TableCell>
                          <TableCell>{report.student}</TableCell>
                          <TableCell>{report.company}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/reports/${report.id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">ดูรายงาน</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">ดาวน์โหลด</span>
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/reports/${report.id}/edit`}>
                                  <FileEdit className="h-4 w-4" />
                                  <span className="sr-only">แก้ไข</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">ลบ</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
