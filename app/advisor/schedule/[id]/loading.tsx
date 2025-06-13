import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import AdvisorSidebar from "@/components/advisor-sidebar"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <AdvisorSidebar activePage="schedule" />

          <div className="md:col-span-4">
            <div className="mb-6">
              <Skeleton className="h-10 w-48 mb-4" />

              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <Skeleton className="h-7 w-64 mb-2" />
                      <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Skeleton className="h-6 w-48 mb-4" />
                      <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Skeleton className="h-5 w-5 mt-0.5" />
                            <div className="flex-1">
                              <Skeleton className="h-5 w-24 mb-1" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Skeleton className="h-6 w-32 mb-4" />
                      <div className="space-y-4">
                        <div>
                          <Skeleton className="h-5 w-24 mb-2" />
                          {Array.from({ length: 2 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-3 mb-2">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="flex-1">
                                <Skeleton className="h-5 w-40 mb-1" />
                                <Skeleton className="h-4 w-32" />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <Skeleton className="h-5 w-32 mb-2" />
                          {Array.from({ length: 2 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-3 mb-2">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="flex-1">
                                <Skeleton className="h-5 w-40 mb-1" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Skeleton className="h-px w-full my-6" />

                  <div>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  <div className="mt-6">
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                    <Skeleton className="h-40 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
