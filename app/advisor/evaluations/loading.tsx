import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-5 w-[450px]" />
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="shadow-sm border-none">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-[120px]" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-[60px]" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Status Distribution Skeleton */}
      <Card className="shadow-sm border-none">
        <CardHeader>
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-5 w-[60px]" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      {/* Table Skeleton */}
      <Card className="shadow-sm border-none">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[100px]" />
              </div>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-[150px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-[150px]" />
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-5 w-[80px]" />
                    <Skeleton className="h-6 w-[70px]" />
                    <Skeleton className="h-5 w-[60px]" />
                    <Skeleton className="h-9 w-[100px]" />
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <Skeleton className="h-5 w-[180px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[100px]" />
            <Skeleton className="h-9 w-[100px]" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
