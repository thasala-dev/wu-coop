import { AdminSidebar } from "@/components/admin-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminReportsLoading() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="all" disabled>
              ทั้งหมด
            </TabsTrigger>
            <TabsTrigger value="monthly" disabled>
              รายงานประจำเดือน
            </TabsTrigger>
            <TabsTrigger value="final" disabled>
              รายงานฉบับสมบูรณ์
            </TabsTrigger>
            <TabsTrigger value="pending" disabled>
              รอตรวจ
            </TabsTrigger>
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
                    {Array(7)
                      .fill(0)
                      .map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-20" />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
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
