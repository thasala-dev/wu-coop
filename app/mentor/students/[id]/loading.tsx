import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import MentorSidebar from "@/components/mentor-sidebar"

export default function StudentDetailLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MentorSidebar activePage="students" />

        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[200px]" />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[250px]" />
                  <Skeleton className="h-4 w-[350px]" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Skeleton className="h-5 w-5 mt-0.5" />
                        <div className="space-y-2 w-full">
                          <Skeleton className="h-4 w-[100px]" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                </div>

                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Skeleton className="h-5 w-5 mt-0.5" />
                        <div className="space-y-2 w-full">
                          <Skeleton className="h-4 w-[100px]" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}

                  <div>
                    <Skeleton className="h-4 w-[100px] mb-2" />
                    <div className="flex flex-wrap gap-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-6 w-[80px]" />
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />

                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-5 w-[200px]" />
                          <Skeleton className="h-5 w-[100px]" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-[150px]" />
                      </CardContent>
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
