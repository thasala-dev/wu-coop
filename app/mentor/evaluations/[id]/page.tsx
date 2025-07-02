"use client";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";

export default function MentorEvaluations() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      console.log("Fetching data for mentor ID:", id);
      // ดึงข้อมูลนักศึกษา
      const studentResponse = await fetch(`/api/evaluations/${id}`);
      if (studentResponse.ok) {
        const studentResult = await studentResponse.json();
        console.log("Fetching student data for ID:", studentResult);
        setStudentData(studentResult.data);
        setEvaluations(studentResult.evaluation || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          ประเมินแล้ว
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          รอประเมิน
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Mock data สำหรับการประเมิน (จะถูกแทนที่ด้วยข้อมูลจริงจาก API)
  const mockEvaluations = [
    {
      id: 1,
      title: "การประเมินความเหมาะสมของสถานประกอบการ",
      status: "completed",
      evaluator: "อ.ดร.สมชาย ใจดี",
      evaluatedDate: "2024-01-15",
      dueDate: "2024-01-10",
      type: "site_evaluation",
    },
    {
      id: 2,
      title: "การประเมินผลการปฏิบัติงานของนักศึกษา",
      status: "pending",
      evaluator: "อ.ดร.สมชาย ใจดี",
      evaluatedDate: null,
      dueDate: "2024-02-15",
      type: "performance_evaluation",
    },
    {
      id: 3,
      title: "การประเมินทักษะการทำงานเป็นทีม",
      status: "overdue",
      evaluator: "อ.ดร.สมชาย ใจดี",
      evaluatedDate: null,
      dueDate: "2024-01-30",
      type: "teamwork_evaluation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="evaluations" userType="mentor" />
          {loading && <Loading />}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-blue-100"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span
                  className="hover:text-gray-900 cursor-pointer"
                  onClick={() => router.push("/mentor/evaluations")}
                >
                  การประเมิน
                </span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900 font-medium">
                  รายละเอียดการประเมิน
                </span>
              </div>
            </div>

            {/* ข้อมูลนักศึกษา */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  ข้อมูลนักศึกษา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* รูปโปรไฟล์และข้อมูลหลัก */}
                  <div className="flex items-center gap-4">
                    <CustomAvatar
                      id={`student${studentData?.student_id}`}
                      image={studentData?.image}
                      size="20"
                    />
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white">
                        {studentData?.fullname || <i>ไม่ได้ระบุ</i>}
                      </h3>
                      <p className="text-blue-100">
                        รหัสนักศึกษา:{" "}
                        {studentData?.student_id || <i>ไม่ได้ระบุ</i>}
                      </p>
                      <p className="text-blue-100">
                        สาขาวิชา: {studentData?.major || <i>ไม่ได้ระบุ</i>}
                      </p>
                    </div>
                  </div>

                  {/* ข้อมูลติดต่อและสถานประกอบการ */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-100">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">
                          {studentData?.email || <i>ไม่ได้ระบุ</i>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">
                          {studentData?.mobile || <i>ไม่ได้ระบุ</i>}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-100">
                        <Building className="h-4 w-4" />
                        <span className="text-sm">
                          {studentData?.company_name ||
                            "บริษัท เทคโนโลยี จำกัด"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(studentData?.start_date).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          -{" "}
                          {new Date(studentData?.end_date).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* สรุปสถิติการประเมิน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">ประเมินแล้ว</p>
                      <p className="text-2xl font-bold">
                        {
                          mockEvaluations.filter(
                            (e) => e.status === "completed"
                          ).length
                        }
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">รอประเมิน</p>
                      <p className="text-2xl font-bold">
                        {
                          mockEvaluations.filter((e) => e.status === "pending")
                            .length
                        }
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* รายละเอียดการประเมิน */}
            {studentData &&
              studentData.evaluations.map((item: any, index: number) => {
                const evaluationForm = evaluations[index] || [];
                return (
                  <Card className="shadow-lg border-0" key={index}>
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        ชุดประเมิน: {item.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {evaluationForm.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">
                            ยังไม่มีรายการประเมิน
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {evaluationForm.map(
                            (evaluation: any, subindex: number) => (
                              <div
                                key={subindex}
                                className="p-6 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                      <div className="bg-blue-100 rounded-full p-2 mt-1">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div className="space-y-2">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                          {evaluation.name}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                          <div className="flex items-center gap-1">
                                            <Badge
                                              key={index}
                                              className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                                            >
                                              {evaluation.short_name}
                                            </Badge>
                                          </div>
                                          {evaluation.is_submit && (
                                            <>
                                              <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span>
                                                  ผู้ประเมิน:{" "}
                                                  {evaluation.evaluator}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-green-600" />
                                                <span className="text-green-600">
                                                  วันที่ประเมิน:{" "}
                                                  {formatDate(
                                                    evaluation.evaluation_date
                                                  )}
                                                </span>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    {getStatusBadge(evaluation.is_submit)}

                                    <div className="flex gap-2">
                                      {evaluation.is_submit && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                          onClick={() =>
                                            router.push(
                                              `/mentor/evaluations/${id}/view/${evaluation.id}`
                                            )
                                          }
                                        >
                                          <Eye className="h-4 w-4 mr-1" />
                                          ดูผล
                                        </Button>
                                      )}

                                      <Button
                                        variant={
                                          evaluation.is_submit
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        className={
                                          evaluation.is_submit
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "text-gray-600 border-gray-200 hover:bg-gray-50"
                                        }
                                        onClick={() =>
                                          router.push(
                                            `/mentor/evaluations/${id}/evaluate/${evaluation.id}`
                                          )
                                        }
                                      >
                                        <Edit className="h-4 w-4 mr-1" />
                                        {evaluation.is_submit
                                          ? "แก้ไข"
                                          : "ประเมิน"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}
