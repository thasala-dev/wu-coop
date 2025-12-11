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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  BuildingIcon,
  ArrowLeftIcon,
  SaveIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  StarIcon,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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

export default function RecordVisit() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  // Form state
  const [evaluationScores, setEvaluationScores] = useState<
    Record<string, string>
  >({});
  const [strengths, setStrengths] = useState<string>("");
  const [improvements, setImprovements] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string>("");
  const [overallRating, setOverallRating] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [studentInterview, setStudentInterview] = useState<string>("");
  const [mentorInterview, setMentorInterview] = useState<string>("");
  const [workEnvironment, setWorkEnvironment] = useState<string>("");
  const [assignedTasks, setAssignedTasks] = useState<string>("");

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("evaluation");

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
        if (data.data.result) {
          // Populate form fields with existing visit data
          setEvaluationScores(data.data.result.evaluation_scores || {});
          setStrengths(data.data.result.strengths || "");
          setImprovements(data.data.result.improvements || "");
          setRecommendations(data.data.result.recommendations || "");
          setOverallRating(data.data.result.overall_rating || "");
          setSummary(data.data.result.summary || "");
          setStudentInterview(data.data.result.student_interview || "");
          setMentorInterview(data.data.result.mentor_interview || "");
          setWorkEnvironment(data.data.result.work_environment || "");
          setAssignedTasks(data.data.result.assigned_tasks || "");
          setActiveTab("evaluation");
        }
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

  // Validation functions
  const validateEvaluation = () => {
    const newErrors: Record<string, string> = {};

    // Check if all evaluation criteria have scores
    evaluationCriteria.forEach((criteria) => {
      if (!evaluationScores[criteria.id]) {
        newErrors[criteria.id] = "กรุณาให้คะแนนการประเมิน";
      }
    });

    if (!overallRating) {
      newErrors.overallRating = "กรุณาเลือกผลการประเมินโดยรวม";
    }

    if (!summary.trim()) {
      newErrors.summary = "กรุณาระบุสรุปผลการนิเทศ";
    }

    if (!strengths.trim()) {
      newErrors.strengths = "กรุณาระบุจุดเด่นของนักศึกษา";
    }

    setErrors((err) => ({ ...err, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateInterview = () => {
    const newErrors: Record<string, string> = {};

    if (!studentInterview.trim()) {
      newErrors.studentInterview = "กรุณาบันทึกการสัมภาษณ์นักศึกษา";
    }

    if (!mentorInterview.trim()) {
      newErrors.mentorInterview = "กรุณาบันทึกการสัมภาษณ์แหล่งฝึก";
    }

    if (!workEnvironment.trim()) {
      newErrors.workEnvironment = "กรุณาบันทึกข้อมูลสภาพแวดล้อมการทำงาน";
    }

    if (!assignedTasks.trim()) {
      newErrors.assignedTasks = "กรุณาบันทึกข้อมูลงานที่ได้รับมอบหมาย";
    }

    setErrors((err) => ({ ...err, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Check if all radio buttons are selected
  const validateAllRadioButtons = () => {
    const missingScores = evaluationCriteria.filter(
      (criteria) => !evaluationScores[criteria.id]
    );

    if (missingScores.length > 0) {
      const newErrors: Record<string, string> = {};
      missingScores.forEach((criteria) => {
        newErrors[criteria.id] = "กรุณาให้คะแนนการประเมิน";
      });
      setErrors((prev) => ({ ...prev, ...newErrors }));

      // Show specific toast for missing radio buttons
      toast({
        title: "การประเมินไม่ครบถ้วน",
        description: `กรุณาให้คะแนนในหัวข้อ: ${missingScores
          .map((c) => c.name)
          .join(", ")}`,
        variant: "destructive",
      });

      return false;
    }
    return true;
  };

  const handleSubmitReport = async () => {
    // First validate all radio buttons are selected
    const allRadioSelected = validateAllRadioButtons();
    const isEvaluationValid = validateEvaluation();
    const isInterviewValid = validateInterview();

    if (!allRadioSelected || !isEvaluationValid || !isInterviewValid) {
      console.log("errors:", errors, allRadioSelected);

      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่งรายงาน",
        variant: "destructive",
      });

      // Switch to the tab with errors
      if (!allRadioSelected || !isEvaluationValid) {
        setActiveTab("evaluation");
      } else if (!isInterviewValid) {
        setActiveTab("interview");
      }
      return;
    }

    // Calculate average score
    const totalScore = Object.values(evaluationScores).reduce(
      (sum, score) => sum + parseInt(score),
      0
    );
    const averageScore = totalScore / evaluationCriteria.length;

    // Prepare form data
    const formData = {
      visit_id: id,
      evaluation_scores: evaluationScores,
      average_score: averageScore.toFixed(2),
      strengths: strengths.trim(),
      improvements: improvements.trim(),
      recommendations: recommendations.trim(),
      overall_rating: overallRating,
      summary: summary.trim(),
      student_interview: studentInterview.trim(),
      mentor_interview: mentorInterview.trim(),
      work_environment: workEnvironment.trim(),
      assigned_tasks: assignedTasks.trim(),
      submission_date: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      const response = await fetch(`/api/advisor/visits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ result: formData }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit report");
      }
      const result = await response.json();
      if (result.success) {
        // Submit report logic here
        toast({
          title: "ส่งรายงานสำเร็จ",
          description: "รายงานการนิเทศถูกส่งเรียบร้อยแล้ว",
          variant: "success",
        });
        router.push("/advisor/visits");
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งรายงานได้",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <main className="container max-w-full mx-auto p-4">
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
              <Page1 id={id} />
            ) : data?.type == "2" ? (
              <Page2 id={id} />
            ) : data?.type == "3" ? (
              <Page3 id={id} />
            ) : data?.type == "4" ? (
              <Page4 id={id} />
            ) : data?.type == "5" ? (
              <Page5 id={id} />
            ) : null}

            {/* Main Form Card */}
          </div>
        </div>
      </main>
    </div>
  );
}
