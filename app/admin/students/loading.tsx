import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminStudentsLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminSidebar activePage="students" />

        <div className="md:col-span-3">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">
                  <Skeleton className="h-8 w-48" />
                </CardTitle>
                <Skeleton className="h-4 w-64 mt-2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Skeleton className="h-6 w-40 mb-1" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <Skeleton className="h-6 w-24" />
                            </div>

                            <div className="mt-3 space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          </div>

                          <div className="flex border-t">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 flex-1 mx-0.5" />
                            <Skeleton className="h-10 flex-1" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
