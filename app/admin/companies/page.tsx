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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BuildingIcon,
  MapPinIcon,
  UsersIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  MoreHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";
import Link from "next/link";

export default function CompaniesPage() {
  // Mock data for companies
  const companies = [
    {
      id: "1",
      name: "บริษัท เอบีซี เทคโนโลยี จำกัด",
      logo: "https://logo.clearbit.com/microsoft.com",
      industry: "เทคโนโลยีสารสนเทศ",
      location: "กรุงเทพมหานคร",
      studentCapacity: 5,
      activeStudents: 3,
      status: "active",
      contactPerson: "คุณสมชาย ใจดี",
      contactEmail: "somchai@abctech.co.th",
      contactPhone: "02-123-4567",
    },
    {
      id: "2",
      name: "บริษัท ฟาร์มาเฮลท์แคร์ จำกัด",
      logo: "https://logo.clearbit.com/pfizer.com",
      industry: "เภสัชกรรม",
      location: "นนทบุรี",
      studentCapacity: 3,
      activeStudents: 2,
      status: "active",
      contactPerson: "คุณสมหญิง รักดี",
      contactEmail: "somying@pharmahealth.co.th",
      contactPhone: "02-234-5678",
    },
    {
      id: "3",
      name: "บริษัท กรีนเอนเนอร์จี จำกัด",
      logo: "https://logo.clearbit.com/tesla.com",
      industry: "พลังงานทดแทน",
      location: "ปทุมธานี",
      studentCapacity: 4,
      activeStudents: 0,
      status: "pending",
      contactPerson: "คุณวิชัย พลังงาน",
      contactEmail: "wichai@greenenergy.co.th",
      contactPhone: "02-345-6789",
    },
    {
      id: "4",
      name: "บริษัท ไทยฟู้ดส์ จำกัด",
      logo: "https://logo.clearbit.com/nestle.com",
      industry: "อาหารและเครื่องดื่ม",
      location: "สมุทรปราการ",
      studentCapacity: 6,
      activeStudents: 4,
      status: "active",
      contactPerson: "คุณนารี อร่อยดี",
      contactEmail: "naree@thaifoods.co.th",
      contactPhone: "02-456-7890",
    },
    {
      id: "5",
      name: "บริษัท สมาร์ทโลจิสติกส์ จำกัด",
      logo: "https://logo.clearbit.com/fedex.com",
      industry: "โลจิสติกส์",
      location: "ชลบุรี",
      studentCapacity: 8,
      activeStudents: 5,
      status: "active",
      contactPerson: "คุณประเสริฐ ขนส่ง",
      contactEmail: "prasert@smartlogistics.co.th",
      contactPhone: "038-123-456",
    },
    {
      id: "6",
      name: "บริษัท ดิจิตอลมาร์เก็ตติ้ง จำกัด",
      logo: "https://logo.clearbit.com/hubspot.com",
      industry: "การตลาดดิจิตอล",
      location: "กรุงเทพมหานคร",
      studentCapacity: 4,
      activeStudents: 2,
      status: "active",
      contactPerson: "คุณมานี การตลาด",
      contactEmail: "manee@digitalmarketing.co.th",
      contactPhone: "02-567-8901",
    },
    {
      id: "7",
      name: "บริษัท คอนสตรัคชั่นโปร จำกัด",
      logo: "https://logo.clearbit.com/caterpillar.com",
      industry: "ก่อสร้าง",
      location: "สมุทรสาคร",
      studentCapacity: 5,
      activeStudents: 0,
      status: "inactive",
      contactPerson: "คุณสมศักดิ์ ก่อสร้าง",
      contactEmail: "somsak@constructionpro.co.th",
      contactPhone: "034-123-456",
    },
    {
      id: "8",
      name: "บริษัท ไบโอเมดิคอล จำกัด",
      logo: "https://logo.clearbit.com/roche.com",
      industry: "การแพทย์และสุขภาพ",
      location: "เชียงใหม่",
      studentCapacity: 3,
      activeStudents: 1,
      status: "active",
      contactPerson: "คุณแพทย์หญิงสุดา รักษาดี",
      contactEmail: "suda@biomedical.co.th",
      contactPhone: "053-123-456",
    },
  ];

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircleIcon className="h-3 w-3 mr-1" /> ใช้งาน
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircleIcon className="h-3 w-3 mr-1" /> ไม่ใช้งาน
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <ClockIcon className="h-3 w-3 mr-1" /> รอดำเนินการ
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <AdminSidebar activePage="companies" />

        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light tracking-tight text-gray-900">
              จัดการข้อมูลสถานประกอบการ
            </h1>
            <a href={`/admin/companies/add`}>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                เพิ่มบริษัทใหม่
              </Button>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="ค้นหาบริษัท..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="active">ใช้งาน</SelectItem>
                  <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                  <SelectItem value="pending">รอดำเนินการ</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="ประเภทธุรกิจ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="tech">เทคโนโลยีสารสนเทศ</SelectItem>
                  <SelectItem value="pharma">เภสัชกรรม</SelectItem>
                  <SelectItem value="energy">พลังงาน</SelectItem>
                  <SelectItem value="food">อาหารและเครื่องดื่ม</SelectItem>
                  <SelectItem value="logistics">โลจิสติกส์</SelectItem>
                  <SelectItem value="marketing">การตลาด</SelectItem>
                  <SelectItem value="construction">ก่อสร้าง</SelectItem>
                  <SelectItem value="medical">การแพทย์และสุขภาพ</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                ทั้งหมด ({companies.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                ใช้งาน ({companies.filter((c) => c.status === "active").length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                ไม่ใช้งาน (
                {companies.filter((c) => c.status === "inactive").length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                รอดำเนินการ (
                {companies.filter((c) => c.status === "pending").length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>รายชื่อบริษัททั้งหมด</CardTitle>
                  <CardDescription>
                    รายชื่อบริษัทที่ร่วมโครงการสหกิจศึกษาทั้งหมด
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">บริษัท</th>
                          <th className="text-left py-3 px-4">ประเภทธุรกิจ</th>
                          <th className="text-left py-3 px-4">ที่ตั้ง</th>
                          <th className="text-left py-3 px-4">นักศึกษา</th>
                          <th className="text-left py-3 px-4">สถานะ</th>
                          <th className="text-left py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies.map((company) => (
                          <tr
                            key={company.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-md border border-gray-200">
                                  <AvatarImage
                                    src={company.logo}
                                    alt={company.name}
                                  />
                                  <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                                    {company.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <Link
                                    href={`/admin/companies/${company.id}`}
                                    className="font-medium hover:underline"
                                  >
                                    {company.name}
                                  </Link>
                                  <div className="text-sm text-gray-500">
                                    {company.contactPerson}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <BuildingIcon className="h-4 w-4 text-gray-500" />
                                <span>{company.industry}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <MapPinIcon className="h-4 w-4 text-gray-500" />
                                <span>{company.location}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <UsersIcon className="h-4 w-4 text-gray-500" />
                                <span>
                                  {company.activeStudents}/
                                  {company.studentCapacity}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {renderStatusBadge(company.status)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="icon">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>บริษัทที่ใช้งาน</CardTitle>
                  <CardDescription>
                    รายชื่อบริษัทที่กำลังใช้งานอยู่ในระบบ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">บริษัท</th>
                          <th className="text-left py-3 px-4">ประเภทธุรกิจ</th>
                          <th className="text-left py-3 px-4">ที่ตั้ง</th>
                          <th className="text-left py-3 px-4">นักศึกษา</th>
                          <th className="text-left py-3 px-4">สถานะ</th>
                          <th className="text-left py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies
                          .filter((company) => company.status === "active")
                          .map((company) => (
                            <tr
                              key={company.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 rounded-md border border-gray-200">
                                    <AvatarImage
                                      src={company.logo}
                                      alt={company.name}
                                    />
                                    <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                                      {company.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <Link
                                      href={`/admin/companies/${company.id}`}
                                      className="font-medium hover:underline"
                                    >
                                      {company.name}
                                    </Link>
                                    <div className="text-sm text-gray-500">
                                      {company.contactPerson}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <BuildingIcon className="h-4 w-4 text-gray-500" />
                                  <span>{company.industry}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <MapPinIcon className="h-4 w-4 text-gray-500" />
                                  <span>{company.location}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <UsersIcon className="h-4 w-4 text-gray-500" />
                                  <span>
                                    {company.activeStudents}/
                                    {company.studentCapacity}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {renderStatusBadge(company.status)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>บริษัทที่ไม่ใช้งาน</CardTitle>
                  <CardDescription>
                    รายชื่อบริษัทที่ไม่ได้ใช้งานในระบบ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">บริษัท</th>
                          <th className="text-left py-3 px-4">ประเภทธุรกิจ</th>
                          <th className="text-left py-3 px-4">ที่ตั้ง</th>
                          <th className="text-left py-3 px-4">นักศึกษา</th>
                          <th className="text-left py-3 px-4">สถานะ</th>
                          <th className="text-left py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies
                          .filter((company) => company.status === "inactive")
                          .map((company) => (
                            <tr
                              key={company.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 rounded-md border border-gray-200">
                                    <AvatarImage
                                      src={company.logo}
                                      alt={company.name}
                                    />
                                    <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                                      {company.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <Link
                                      href={`/admin/companies/${company.id}`}
                                      className="font-medium hover:underline"
                                    >
                                      {company.name}
                                    </Link>
                                    <div className="text-sm text-gray-500">
                                      {company.contactPerson}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <BuildingIcon className="h-4 w-4 text-gray-500" />
                                  <span>{company.industry}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <MapPinIcon className="h-4 w-4 text-gray-500" />
                                  <span>{company.location}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <UsersIcon className="h-4 w-4 text-gray-500" />
                                  <span>
                                    {company.activeStudents}/
                                    {company.studentCapacity}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {renderStatusBadge(company.status)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>บริษัทที่รอดำเนินการ</CardTitle>
                  <CardDescription>
                    รายชื่อบริษัทที่อยู่ระหว่างการดำเนินการ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">บริษัท</th>
                          <th className="text-left py-3 px-4">ประเภทธุรกิจ</th>
                          <th className="text-left py-3 px-4">ที่ตั้ง</th>
                          <th className="text-left py-3 px-4">นักศึกษา</th>
                          <th className="text-left py-3 px-4">สถานะ</th>
                          <th className="text-left py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies
                          .filter((company) => company.status === "pending")
                          .map((company) => (
                            <tr
                              key={company.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 rounded-md border border-gray-200">
                                    <AvatarImage
                                      src={company.logo}
                                      alt={company.name}
                                    />
                                    <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                                      {company.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <Link
                                      href={`/admin/companies/${company.id}`}
                                      className="font-medium hover:underline"
                                    >
                                      {company.name}
                                    </Link>
                                    <div className="text-sm text-gray-500">
                                      {company.contactPerson}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <BuildingIcon className="h-4 w-4 text-gray-500" />
                                  <span>{company.industry}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <MapPinIcon className="h-4 w-4 text-gray-500" />
                                  <span>{company.location}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <UsersIcon className="h-4 w-4 text-gray-500" />
                                  <span>
                                    {company.activeStudents}/
                                    {company.studentCapacity}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {renderStatusBadge(company.status)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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
