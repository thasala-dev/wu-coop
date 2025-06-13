import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import AdminSidebar from "@/components/admin-sidebar"

export default function NewEvaluationLoading() {
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
            <div className="flex items-center mb-6">
              <Skeleton className="h-9 w-20 mr-4" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-10" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-9 w-28" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-9 w-9" />
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <div className="space-y-2">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-5 w-32" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-10" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Skeleton className="h-6 w-40 mb-4" />
                      <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i}>
                            <Skeleton className="h-5 w-64 mb-1" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-4 w-20" />
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((j) => (
                                  <Skeleton key={j} className="h-8 w-8 rounded-full" />
                                ))}
                              </div>
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
