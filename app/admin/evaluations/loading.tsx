import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminEvaluationsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <AdminSidebar activePage="evaluations" />

          <div className="md:col-span-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div className="flex-1">
                            <Skeleton className="h-5 w-64 mb-2" />
                            <Skeleton className="h-4 w-80 mb-2" />
                            <div className="flex gap-2">
                              <Skeleton className="h-3 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-9 w-24" />
                          <Skeleton className="h-9 w-24" />
                          <Skeleton className="h-9 w-9" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
