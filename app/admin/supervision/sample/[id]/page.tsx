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

import Page1 from "@/components/supervision/super1";
import Page2 from "@/components/supervision/super2";
import Page3 from "@/components/supervision/super3";
import Page4 from "@/components/supervision/super4";
import Page5 from "@/components/supervision/super5";

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
        <main className="container max-w-full mx-auto p-4">
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
      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar userType="admin" activePage="supervision" />
          <div className="md:col-span-4 space-y-6" id="contentPrint">
            {/* Header Card */}
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 shadow-xl print:shadow-none print:border print:border-gray-200 print:text-black print:bg-white">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/admin/supervision`}>
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
                  ตัวอย่างแบบฟอร์มบันทึกการนิเทศนักศึกษา
                </CardTitle>
                <CardDescription className="text-purple-100 print:text-gray-600">
                  รายละเอียดผลการนิเทศและประเมินนักศึกษา ณ แหล่งฝึกงาน
                </CardDescription>
              </CardHeader>
            </Card>



            <>
              {data?.type == "1" ? (
                <Page1 id={id} data={data.result} report={true} />
              ) : data?.type == "2" ? (
                <Page2 id={id} data={data.result} report={true} />
              ) : data?.type == "3" ? (
                <Page3 id={id} data={data.result} report={true} />
              ) : data?.type == "4" ? (
                <Page4 id={id} data={data.result} report={true} />
              ) : data?.type == "5" ? (
                <Page5 id={id} data={data.result} report={true} />
              ) : null}
            </>

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
