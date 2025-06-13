import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import StudentSidebar from "@/components/student-sidebar"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StudentSidebar activePage="reports" />

          <div className="md:col-span-3">
            <div className="flex items-center mb-6">
              <Skeleton className="h-6 w-40" />
            </div>

            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-5 w-72" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-5 w-48" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-5 w-36" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Skeleton className="h-6 w-36 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <div className="space-y-4 pt-4">
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-6 w-64 mb-2" />
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-3 border rounded-md">
                              <Skeleton className="h-5 w-24 mb-2" />
                              <Skeleton className="h-20 w-full" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Skeleton className="h-6 w-56 mb-2" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 my-6" />

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <Skeleton className="h-10 w-32" />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
