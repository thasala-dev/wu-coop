import { Skeleton } from "@/components/ui/skeleton"
import MentorSidebar from "@/components/mentor-sidebar"

export default function Loading() {
  return (
    <div className="container mx-auto py-6 px-4">
      <Skeleton className="h-10 w-[250px] mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MentorSidebar activePage="dashboard" />

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6">
                <Skeleton className="h-8 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[250px] mb-4" />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <Skeleton className="h-4 w-[120px] mb-2" />
                    <Skeleton className="h-8 w-[80px]" />
                  </div>
                  <div className="border rounded-md p-4">
                    <Skeleton className="h-4 w-[180px] mb-2" />
                    <Skeleton className="h-8 w-[80px]" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6 mt-4">
                <Skeleton className="h-8 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[200px] mb-4" />
                <div className="mt-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 pb-3 border-b">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-grow">
                        <Skeleton className="h-4 w-[150px] mb-2" />
                        <Skeleton className="h-3 w-[120px]" />
                      </div>
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6">
                <Skeleton className="h-8 w-[180px] mb-2" />
                <Skeleton className="h-4 w-[220px] mb-4" />
                <div className="mt-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 pb-3 border-b">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-grow">
                        <Skeleton className="h-4 w-[150px] mb-2" />
                        <Skeleton className="h-3 w-[180px]" />
                      </div>
                      <Skeleton className="h-8 w-[70px] rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
