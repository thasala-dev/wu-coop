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
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StudentSidebar activePage="schedule" />

          <div className="md:col-span-4">
            <Card className="mb-6">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Skeleton className="h-7 w-64 mb-2" />
                  <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-10 w-40" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-4">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton key={`day-${index}`} className="h-8 w-full" />
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, index) => (
                    <Skeleton key={`cell-${index}`} className="h-24 w-full" />
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
