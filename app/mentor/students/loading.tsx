import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import MentorSidebar from "@/components/mentor-sidebar"

export default function MentorStudentsLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MentorSidebar activePage="students" />

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[250px]" />
                  <Skeleton className="h-4 w-[350px]" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-[120px]" />
                  <Skeleton className="h-6 w-[120px]" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-10 w-[200px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[120px]" />
                </div>
              </div>

              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-8 w-[100px]" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
