import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminStudentDetailLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminSidebar activePage="students" />

        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-8 w-48" />
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Skeleton className="h-24 w-24 rounded-full" />

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <Skeleton className="h-8 w-48 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    ภาพรวม
                  </TabsTrigger>
                  <TabsTrigger
                    value="coop"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    ข้อมูลสหกิจศึกษา
                  </TabsTrigger>
                  <TabsTrigger
                    value="reports"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    รายงานและการประเมิน
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    ประวัติการดำเนินการ
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          <Skeleton className="h-6 w-32" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Array(8)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-5 w-full" />
                            </div>
                          ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          <Skeleton className="h-6 w-32" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Array(2)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <div className="flex flex-wrap gap-2">
                                {Array(4)
                                  .fill(0)
                                  .map((_, j) => (
                                    <Skeleton key={j} className="h-6 w-20" />
                                  ))}
                              </div>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
