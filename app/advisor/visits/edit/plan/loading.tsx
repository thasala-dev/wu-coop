import { Skeleton } from "@/components/ui/skeleton"
import { AdvisorSidebar } from "@/components/advisor-sidebar"

export default function Loading() {
  return (
    <div className="grid grid-cols-5 h-screen">
      <AdvisorSidebar />

      <div className="col-span-4 p-6 overflow-auto">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-md mr-2" />
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg shadow-sm">
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64 mb-6" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <Skeleton className="h-4 w-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg shadow-sm">
              <div className="p-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-6" />

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2 p-2">
                      <Skeleton className="h-5 w-5 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border rounded-lg shadow-sm">
              <div className="p-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-6" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  )
}
