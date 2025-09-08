"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  BuildingIcon,
  ArrowLeftIcon,
  FileTextIcon,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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

export default function RecordVisit() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  // Form state
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar userType="advisor" activePage="visits" />
          {isLoading && <Loading />}
          <div className="md:col-span-4 space-y-6">
            {/* Header Card */}
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Link href={`/advisor/visits`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-white hover:bg-white/20"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      กลับไปยังรายการนิเทศ
                    </Button>
                  </Link>
                </div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileTextIcon className="h-6 w-6" />
                  บันทึกการนิเทศนักศึกษา
                </CardTitle>
                <CardDescription className="text-purple-100">
                  บันทึกผลการนิเทศและประเมินนักศึกษา ณ แหล่งฝึกงาน
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Visit Information Card */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b">
                <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  ข้อมูลการนิเทศ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          วันที่นิเทศ:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data ? formatVisitTime(data.scheduled_date) : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          เวลา:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.start_time} - {data?.end_time} น.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <UserIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          นักศึกษา:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.student_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ({data?.student_student_id})
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <BuildingIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          แหล่งฝึกงาน:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.company_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPinIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          ที่อยู่:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.company_location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <UserIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          ผู้ประสานงาน:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {data?.company_contact_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ({data?.company_contact_phone})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {data?.type == "1" ? (
              <Page1 id={id} data={data.result} />
            ) : data?.type == "2" ? (
              <Page2 id={id} data={data.result} />
            ) : data?.type == "3" ? (
              <Page3 id={id} data={data.result} />
            ) : data?.type == "4" ? (
              <Page4 id={id} data={data.result} />
            ) : data?.type == "5" ? (
              <Page5 id={id} data={data.result} />
            ) : null}

            {/* Main Form Card */}
          </div>
        </div>
      </main>
    </div>
  );
}
