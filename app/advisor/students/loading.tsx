import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdvisorSidebar from "@/components/advisor-sidebar"

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdvisorSidebar activePage="students" />

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <Skeleton className="h-8 w-64" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-full md:w-48" />
              </div>

              <div className="mb-4">
                <Skeleton className="h-10 w-48" />
              </div>

              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-4 md:p-6 flex-1">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <div>
                                <Skeleton className="h-6 w-48 mb-2" />
                                <Skeleton className="h-4 w-32" />
                              </div>
                              <Skeleton className="h-6 w-20 mt-2 md:mt-0" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                              {[...Array(4)].map((_, j) => (
                                <Skeleton key={j} className="h-5 w-full" />
                              ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                              {[...Array(3)].map((_, j) => (
                                <Skeleton key={j} className="h-5 w-full" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col justify-center items-center p-4 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
                        <Skeleton className="h-10 w-24 md:w-full mb-2" />
                        <Skeleton className="h-10 w-24 md:w-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
