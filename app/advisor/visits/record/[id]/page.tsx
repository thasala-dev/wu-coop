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

            {/* Main Form Card */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6 bg-gray-100">
                    <TabsTrigger
                      value="evaluation"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-2"
                    >
                      <StarIcon className="h-4 w-4" />
                      การประเมิน
                      {Object.keys(errors).some(
                        (key) =>
                          [
                            "strengths",
                            "improvements",
                            "recommendations",
                            "overallRating",
                            "summary",
                          ].includes(key) ||
                          evaluationCriteria.some((c) => c.id === key)
                      ) && (
                        <Badge
                          variant="destructive"
                          className="ml-2 h-5 w-5 p-0 flex items-center justify-center"
                        >
                          !
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="interview"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-2"
                    >
                      <UserIcon className="h-4 w-4" />
                      การสัมภาษณ์
                      {Object.keys(errors).some((key) =>
                        [
                          "studentInterview",
                          "mentorInterview",
                          "workEnvironment",
                          "assignedTasks",
                        ].includes(key)
                      ) && (
                        <Badge
                          variant="destructive"
                          className="ml-2 h-5 w-5 p-0 flex items-center justify-center"
                        >
                          !
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="evaluation" className="space-y-6">
                    {/* Evaluation Scores Section */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                          <StarIcon className="h-5 w-5" />
                          การประเมินผลการปฏิบัติงาน
                          {Object.keys(errors).some((key) =>
                            evaluationCriteria.some((c) => c.id === key)
                          ) && (
                            <Badge variant="destructive" className="ml-2">
                              <AlertCircleIcon className="h-3 w-3 mr-1" />
                              ยังไม่ครบ
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-blue-700">
                          ประเมินผลการปฏิบัติงานของนักศึกษาในแต่ละด้าน
                          โดยให้คะแนน 1-5 (1 = ต้องปรับปรุง, 5 = ดีเยี่ยม)
                          {Object.keys(errors).some((key) =>
                            evaluationCriteria.some((c) => c.id === key)
                          ) && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                              <AlertCircleIcon className="h-4 w-4 inline mr-1" />
                              กรุณาให้คะแนนในทุกหัวข้อการประเมิน
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {evaluationCriteria.map((criteria) => (
                            <div
                              key={criteria.id}
                              className={cn(
                                "p-4 rounded-lg border-2 transition-all duration-300 relative",
                                errors[criteria.id]
                                  ? "border-red-400 bg-red-50 shadow-md ring-2 ring-red-100"
                                  : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm"
                              )}
                            >
                              {errors[criteria.id] && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                                  <AlertCircleIcon className="h-3 w-3" />
                                </div>
                              )}
                              <Label
                                className={cn(
                                  "text-sm font-medium mb-3 block",
                                  errors[criteria.id]
                                    ? "text-red-700"
                                    : "text-gray-900"
                                )}
                              >
                                {criteria.name}
                                {errors[criteria.id] && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </Label>
                              <RadioGroup
                                value={evaluationScores[criteria.id] || ""}
                                onValueChange={(value) => {
                                  setEvaluationScores((prev) => ({
                                    ...prev,
                                    [criteria.id]: value,
                                  }));
                                  // Clear error when user selects
                                  if (errors[criteria.id]) {
                                    setErrors((prev) => {
                                      const newErrors = { ...prev };
                                      delete newErrors[criteria.id];
                                      return newErrors;
                                    });
                                  }
                                }}
                                className="flex justify-center gap-2"
                              >
                                {[1, 2, 3, 4, 5].map((score) => (
                                  <div
                                    key={score}
                                    className="flex flex-col items-center gap-1"
                                  >
                                    <RadioGroupItem
                                      value={score.toString()}
                                      id={`${criteria.id}-${score}`}
                                      className={cn(
                                        "data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600",
                                        errors[criteria.id]
                                          ? "border-red-500 ring-2 ring-red-200"
                                          : "border-gray-300"
                                      )}
                                    />
                                    <Label
                                      htmlFor={`${criteria.id}-${score}`}
                                      className={cn(
                                        "text-xs font-medium cursor-pointer transition-colors",
                                        errors[criteria.id]
                                          ? "text-red-600 hover:text-red-700"
                                          : "text-gray-700 hover:text-purple-600"
                                      )}
                                    >
                                      {score}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                              {errors[criteria.id] && (
                                <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-md animate-pulse">
                                  <p className="text-red-700 text-xs font-semibold text-center flex items-center justify-center gap-1">
                                    <AlertCircleIcon className="h-3 w-3 flex-shrink-0" />
                                    ต้องให้คะแนน!
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Comments and Feedback Section */}
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-900 flex items-center gap-2">
                          <FileTextIcon className="h-5 w-5" />
                          ความคิดเห็นและข้อเสนอแนะ
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="strengths"
                              className="text-sm font-medium"
                            >
                              จุดเด่นของนักศึกษา{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="strengths"
                              value={strengths}
                              onChange={(e) => {
                                setStrengths(e.target.value);
                                if (errors.strengths) {
                                  setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.strengths;
                                    return newErrors;
                                  });
                                }
                              }}
                              placeholder="ระบุจุดเด่นและความสามารถพิเศษของนักศึกษา"
                              className={cn(
                                "min-h-[120px] transition-all duration-300",
                                errors.strengths
                                  ? "border-red-500 focus:border-red-500"
                                  : "focus:border-purple-500"
                              )}
                            />
                            {errors.strengths && (
                              <p className="text-red-500 text-sm flex items-center gap-1">
                                <AlertCircleIcon className="h-4 w-4" />
                                {errors.strengths}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="improvements"
                              className="text-sm font-medium"
                            >
                              จุดที่ควรปรับปรุง
                            </Label>
                            <Textarea
                              id="improvements"
                              value={improvements}
                              onChange={(e) => setImprovements(e.target.value)}
                              placeholder="ระบุจุดที่นักศึกษาควรปรับปรุงและพัฒนา"
                              className="min-h-[120px] focus:border-purple-500 transition-all duration-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="recommendations"
                              className="text-sm font-medium"
                            >
                              ข้อเสนอแนะเพิ่มเติม
                            </Label>
                            <Textarea
                              id="recommendations"
                              value={recommendations}
                              onChange={(e) =>
                                setRecommendations(e.target.value)
                              }
                              placeholder="ข้อเสนอแนะเพิ่มเติมสำหรับนักศึกษา"
                              className="min-h-[120px] focus:border-purple-500 transition-all duration-300"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Summary Section */}
                    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-900 flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5" />
                          สรุปผลการประเมิน
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="overall-rating"
                              className="text-sm font-medium"
                            >
                              ผลการประเมินโดยรวม{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={overallRating}
                              onValueChange={(value) => {
                                setOverallRating(value);
                                if (errors.overallRating) {
                                  setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.overallRating;
                                    return newErrors;
                                  });
                                }
                              }}
                            >
                              <SelectTrigger
                                className={cn(
                                  "transition-all duration-300",
                                  errors.overallRating
                                    ? "border-red-500"
                                    : "focus:border-purple-500"
                                )}
                              >
                                <SelectValue placeholder="เลือกผลการประเมิน" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="excellent">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    ดีเยี่ยม
                                  </div>
                                </SelectItem>
                                <SelectItem value="good">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    ดี
                                  </div>
                                </SelectItem>
                                <SelectItem value="satisfactory">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    พอใช้
                                  </div>
                                </SelectItem>
                                <SelectItem value="needs_improvement">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    ต้องปรับปรุง
                                  </div>
                                </SelectItem>
                                <SelectItem value="unsatisfactory">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    ไม่ผ่าน
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.overallRating && (
                              <p className="text-red-500 text-sm flex items-center gap-1">
                                <AlertCircleIcon className="h-4 w-4" />
                                {errors.overallRating}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="summary"
                              className="text-sm font-medium"
                            >
                              สรุปผลการนิเทศ{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="summary"
                              value={summary}
                              onChange={(e) => {
                                setSummary(e.target.value);
                                if (errors.summary) {
                                  setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.summary;
                                    return newErrors;
                                  });
                                }
                              }}
                              placeholder="สรุปผลการนิเทศและข้อสังเกตโดยรวม"
                              className={cn(
                                "min-h-[120px] transition-all duration-300",
                                errors.summary
                                  ? "border-red-500 focus:border-red-500"
                                  : "focus:border-purple-500"
                              )}
                            />
                            {errors.summary && (
                              <p className="text-red-500 text-sm flex items-center gap-1">
                                <AlertCircleIcon className="h-4 w-4" />
                                {errors.summary}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="interview" className="space-y-6">
                    <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-orange-900">
                          บันทึกการสัมภาษณ์
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="student-interview">
                              การสัมภาษณ์นักศึกษา *
                            </Label>
                            <Textarea
                              id="student-interview"
                              value={studentInterview}
                              onChange={(e) => {
                                setStudentInterview(e.target.value);
                                if (errors.studentInterview) {
                                  setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.studentInterview;
                                    return newErrors;
                                  });
                                }
                              }}
                              placeholder="บันทึกการสัมภาษณ์และความคิดเห็นของนักศึกษา"
                              className={cn(
                                "min-h-[150px]",
                                errors.studentInterview ? "border-red-500" : ""
                              )}
                            />
                            {errors.studentInterview && (
                              <p className="text-red-500 text-sm">
                                {errors.studentInterview}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mentor-interview">
                              การสัมภาษณ์แหล่งฝึก *
                            </Label>
                            <Textarea
                              id="mentor-interview"
                              value={mentorInterview}
                              onChange={(e) => {
                                setMentorInterview(e.target.value);
                                if (errors.mentorInterview) {
                                  setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.mentorInterview;
                                    return newErrors;
                                  });
                                }
                              }}
                              placeholder="บันทึกการสัมภาษณ์และความคิดเห็นของแหล่งฝึก"
                              className={cn(
                                "min-h-[150px]",
                                errors.mentorInterview ? "border-red-500" : ""
                              )}
                            />
                            {errors.mentorInterview && (
                              <p className="text-red-500 text-sm">
                                {errors.mentorInterview}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="work-environment">
                              สภาพแวดล้อมการทำงาน *
                            </Label>
                            <Textarea
                              id="work-environment"
                              value={workEnvironment}
                              onChange={(e) => {
                                setWorkEnvironment(e.target.value);
                                if (errors.workEnvironment) {
                                  setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.workEnvironment;
                                    return newErrors;
                                  });
                                }
                              }}
                              placeholder="บันทึกข้อมูลเกี่ยวกับสภาพแวดล้อมการทำงานของนักศึกษา"
                              className={cn(
                                "min-h-[100px]",
                                errors.workEnvironment ? "border-red-500" : ""
                              )}
                            />
                            {errors.workEnvironment && (
                              <p className="text-red-500 text-sm">
                                {errors.workEnvironment}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="assigned-tasks">
                              งานที่ได้รับมอบหมาย *
                            </Label>
                            <Textarea
                              id="assigned-tasks"
                              value={assignedTasks}
                              onChange={(e) => {
                                setAssignedTasks(e.target.value);
                                if (errors.assignedTasks) {
                                  setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.assignedTasks;
                                    return newErrors;
                                  });
                                }
                              }}
                              placeholder="บันทึกข้อมูลเกี่ยวกับงานที่นักศึกษาได้รับมอบหมาย"
                              className={cn(
                                "min-h-[100px]",
                                errors.assignedTasks ? "border-red-500" : ""
                              )}
                            />
                            {errors.assignedTasks && (
                              <p className="text-red-500 text-sm">
                                {errors.assignedTasks}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
                <Link href="/advisor/visits">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    ยกเลิก
                  </Button>
                </Link>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmitReport}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        กำลังส่ง...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        บันทึกและส่งรายงาน
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
