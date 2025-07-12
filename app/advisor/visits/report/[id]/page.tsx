"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  BuildingIcon,
  ArrowLeftIcon,
  FileTextIcon,
  CheckCircleIcon,
  PrinterIcon,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const formatVisitTime = (date: string) => {
  try {
    const visitDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = visitDate.toLocaleDateString("th-TH", options);
    return formattedDate;
  } catch (error) {
    return date;
  }
};

const ratingColors: Record<string, string> = {
  excellent: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  satisfactory: "bg-yellow-100 text-yellow-800",
  needs_improvement: "bg-orange-100 text-orange-800",
  unsatisfactory: "bg-red-100 text-red-800",
};

const ratingLabels: Record<string, string> = {
  excellent: "ดีเยี่ยม",
  good: "ดี",
  satisfactory: "พอใช้",
  needs_improvement: "ต้องปรับปรุง",
  unsatisfactory: "ไม่ผ่าน",
};

export default function VisitDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  async function fetchVisitData() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/advisor/visits/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch visit data");
      }
      const data = await response.json();
      if (data.success) {
        setData(data.data);
      }
    } catch (error) {
      console.error("Error fetching visit data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVisitData();
  }, []);

  const handlePrint = () => {
    const printContent = document.getElementById("contentPrint");
    if (printContent) {
      const originalContent = document.body.innerHTML;
      const printableContent = printContent.innerHTML;

      document.body.innerHTML = printableContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore React functionality
    }
  };

  // Mock data for evaluation criteria
  const evaluationCriteria = [
    { id: "work_quality", name: "คุณภาพงาน" },
    { id: "knowledge", name: "ความรู้และทักษะ" },
    { id: "responsibility", name: "ความรับผิดชอบ" },
    { id: "teamwork", name: "การทำงานร่วมกับผู้อื่น" },
    { id: "adaptation", name: "การปรับตัว" },
    { id: "communication", name: "การสื่อสาร" },
    { id: "problem_solving", name: "การแก้ไขปัญหา" },
    { id: "discipline", name: "ระเบียบวินัย" },
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <main className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Sidebar userType="advisor" activePage="visits" />
            <div className="md:col-span-4">
              <Alert variant="destructive">
                <AlertDescription>
                  ไม่พบข้อมูลการนิเทศ กรุณาตรวจสอบอีกครั้ง
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar userType="advisor" activePage="visits" />
          <div className="md:col-span-4 space-y-6" id="contentPrint">
            {/* Header Card */}
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 shadow-xl print:shadow-none print:border print:border-gray-200 print:text-black print:bg-white">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/advisor/visits`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-white hover:bg-white/20 print:hidden"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      กลับไปยังรายการนิเทศ
                    </Button>
                  </Link>
                  <Button
                    onClick={handlePrint}
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-white hover:bg-white/20 print:hidden"
                  >
                    <PrinterIcon className="h-4 w-4" />
                    พิมพ์รายงาน
                  </Button>
                </div>
                <CardTitle className="text-2xl flex items-center gap-2 print:text-black">
                  <FileTextIcon className="h-6 w-6" />
                  รายงานการนิเทศนักศึกษา
                </CardTitle>
                <CardDescription className="text-purple-100 print:text-gray-600">
                  รายละเอียดผลการนิเทศและประเมินนักศึกษา ณ แหล่งฝึกงาน
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Visit Information Card */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 print:shadow-none print:border print:border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b print:bg-white print:border-b print:border-gray-200">
                <CardTitle className="text-lg text-blue-900 flex items-center gap-2 print:text-black">
                  <CalendarIcon className="h-5 w-5" />
                  ข้อมูลการนิเทศ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 print:p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
                  <div className="space-y-4 print:space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg print:bg-white print:p-2 print:border-b print:border-gray-100">
                      <CalendarIcon className="h-5 w-5 text-purple-500 print:text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 print:text-gray-800">
                          วันที่นิเทศ:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data ? formatVisitTime(data.scheduled_date) : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg print:bg-white print:p-2 print:border-b print:border-gray-100">
                      <ClockIcon className="h-5 w-5 text-purple-500 print:text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 print:text-gray-800">
                          เวลา:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.start_time} - {data?.end_time} น.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg print:bg-white print:p-2 print:border-b print:border-gray-100">
                      <UserIcon className="h-5 w-5 text-purple-500 print:text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 print:text-gray-800">
                          นักศึกษา:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.student_name}
                        </div>
                        <div className="text-sm text-gray-500 print:text-gray-600">
                          ({data?.student_student_id})
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 print:space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg print:bg-white print:p-2 print:border-b print:border-gray-100">
                      <BuildingIcon className="h-5 w-5 text-purple-500 print:text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 print:text-gray-800">
                          แหล่งฝึกงาน:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.company_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg print:bg-white print:p-2 print:border-b print:border-gray-100">
                      <MapPinIcon className="h-5 w-5 text-purple-500 print:text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 print:text-gray-800">
                          ที่อยู่:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.company_location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg print:bg-white print:p-2 print:border-b print:border-gray-100">
                      <UserIcon className="h-5 w-5 text-purple-500 print:text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 print:text-gray-800">
                          ผู้ประสานงาน:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.company_contact_name}
                        </div>
                        <div className="text-sm text-gray-500 print:text-gray-600">
                          ({data?.company_contact_phone})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Results */}
            {data.result && (
              <>
                {/* Evaluation Scores Section */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 print:bg-white print:border print:border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900 flex items-center gap-2 print:text-black">
                      <CheckCircleIcon className="h-5 w-5" />
                      ผลการประเมินการปฏิบัติงาน
                    </CardTitle>
                    <CardDescription className="text-blue-700 print:text-gray-600">
                      คะแนนการประเมินผลการปฏิบัติงานของนักศึกษาในแต่ละด้าน
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 print:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4">
                      {evaluationCriteria.map((criteria) => (
                        <div
                          key={criteria.id}
                          className="p-4 rounded-lg border-2 border-gray-200 bg-white print:border print:border-gray-200 print:p-3"
                        >
                          <label className="text-sm font-medium mb-3 block text-gray-900">
                            {criteria.name}
                          </label>
                          <div className="flex justify-center">
                            <div className="text-2xl font-bold text-purple-600 print:text-black">
                              {data.result.evaluation_scores?.[criteria.id] ||
                                "-"}
                              <span className="text-sm font-normal text-gray-500 print:text-gray-600">
                                /5
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          คะแนนเฉลี่ย
                        </label>
                        <div className="text-3xl font-bold text-purple-600 print:text-black">
                          {data.result.average_score || "-"}
                          <span className="text-sm font-normal text-gray-500 print:text-gray-600 ml-1">
                            /5
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          ผลการประเมินโดยรวม
                        </label>
                        {data.result.overall_rating ? (
                          <Badge
                            className={cn(
                              "text-lg px-4 py-2",
                              ratingColors[data.result.overall_rating]
                            )}
                          >
                            {ratingLabels[data.result.overall_rating]}
                          </Badge>
                        ) : (
                          <div className="text-gray-500">-</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments and Feedback Section */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 print:bg-white print:border print:border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-900 flex items-center gap-2 print:text-black">
                      <FileTextIcon className="h-5 w-5" />
                      ความคิดเห็นและข้อเสนอแนะ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 print:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          จุดเด่นของนักศึกษา
                        </label>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[120px] print:border print:border-gray-200 print:p-3">
                          {data.result.strengths || "-"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          จุดที่ควรปรับปรุง
                        </label>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[120px] print:border print:border-gray-200 print:p-3">
                          {data.result.improvements || "-"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          ข้อเสนอแนะเพิ่มเติม
                        </label>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[120px] print:border print:border-gray-200 print:p-3">
                          {data.result.recommendations || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900">
                        สรุปผลการนิเทศ
                      </label>
                      <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[120px] print:border print:border-gray-200 print:p-3">
                        {data.result.summary || "-"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interview Section */}
                <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 print:bg-white print:border print:border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-900 print:text-black">
                      บันทึกการสัมภาษณ์
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          การสัมภาษณ์นักศึกษา
                        </label>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[150px] print:border print:border-gray-200 print:p-3">
                          {data.result.student_interview || "-"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          การสัมภาษณ์แหล่งฝึก
                        </label>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[150px] print:border print:border-gray-200 print:p-3">
                          {data.result.mentor_interview || "-"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          สภาพแวดล้อมการทำงาน
                        </label>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[100px] print:border print:border-gray-200 print:p-3">
                          {data.result.work_environment || "-"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          งานที่ได้รับมอบหมาย
                        </label>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[100px] print:border print:border-gray-200 print:p-3">
                          {data.result.assigned_tasks || "-"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!data.result && (
              <Card className="bg-white border-0 shadow-lg print:shadow-none print:border print:border-gray-200">
                <CardContent className="p-6 print:p-4">
                  <Alert variant="destructive">
                    <AlertDescription>
                      ยังไม่มีผลการประเมินสำหรับการนิเทศครั้งนี้
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            color: black;
          }
          .print-hidden {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .grid {
            display: block !important;
          }
          .gap-6 {
            gap: 0 !important;
          }
          .space-y-6 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 1rem !important;
          }
          .md\\:col-span-4 {
            grid-column: span 4 / span 4;
          }
          .shadow-none {
            box-shadow: none !important;
          }
          .print\\:border {
            border: 1px solid #e5e7eb !important;
          }
          .print\\:border-gray-200 {
            border-color: #e5e7eb !important;
          }
          .print\\:p-4 {
            padding: 1rem !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }
          .print\\:text-gray-800 {
            color: #1f2937 !important;
          }
          .sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
