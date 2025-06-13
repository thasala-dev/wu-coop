import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-[150px]" />
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-[200px]" />
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-8 w-[250px]" />
            <div className="flex items-center gap-2 mt-1">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-[120px]" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student & Company Info */}
        <div className="space-y-6">
          {/* Student Info Card Skeleton */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Company Info Card Skeleton */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Progress Card Skeleton */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-5 w-[50px]" />
                </div>
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </CardContent>
          </Card>

          {/* Attachments Card Skeleton */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <div>
                        <Skeleton className="h-5 w-[180px]" />
                        <Skeleton className="h-4 w-[120px]" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Evaluation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Evaluation Form Card Skeleton */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-5 w-[250px]" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Criteria Skeletons */}
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Skeleton className="h-6 w-[200px]" />
                        <Skeleton className="h-4 w-[300px] mt-1" />
                      </div>
                      <div className="flex items-center">
                        {Array(5)
                          .fill(0)
                          .map((_, j) => (
                            <Skeleton key={j} className="h-5 w-5 mx-0.5" />
                          ))}
                        <Skeleton className="h-5 w-[40px] ml-2" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                    {i < 4 && <Separator />}
                  </div>
                ))}

              {/* Overall Comment Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-24 w-full" />
              </div>

              {/* Total Score Skeleton */}
              <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
                <div>
                  <Skeleton className="h-6 w-[100px]" />
                  <Skeleton className="h-4 w-[150px] mt-1" />
                </div>
                <Skeleton className="h-8 w-[80px]" />
              </div>
            </CardContent>
          </Card>

          {/* History Card Skeleton */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="h-2 w-2 rounded-full mt-1" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px] mt-1" />
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
