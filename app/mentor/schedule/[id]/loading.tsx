import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import MentorSidebar from "@/components/mentor-sidebar"

export default function AppointmentDetailLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MentorSidebar activePage="schedule" />

        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[200px]" />
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-[300px]" />
                    <Skeleton className="h-6 w-[80px]" />
                  </div>
                  <Skeleton className="h-4 w-[400px]" />
                </div>
                <Skeleton className="h-10 w-[150px]" />
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="space-y-1 w-full">
                          <Skeleton className="h-4 w-[100px]" />
                          <Skeleton className="h-5 w-[200px]" />
                        </div>
                      </div>
                    ))}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>

                  <div className="space-y-3">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-3 w-[100px]" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Skeleton className="h-6 w-[150px] mb-3" />
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                </div>
              </div>

              <Separator />

              <div>
                <Skeleton className="h-6 w-[150px] mb-3" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>

              <Separator />

              <div>
                <Skeleton className="h-6 w-[150px] mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 border rounded-md">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Skeleton className="h-10 w-[150px]" />
                <Skeleton className="h-10 w-[150px]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
