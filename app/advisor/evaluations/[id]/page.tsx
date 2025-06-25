"use client";

import { useState } from "react";
import {
  Building2,
  Calendar,
  ClipboardCheck,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Save,
  Send,
  Star,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Mock data for a single evaluation
const evaluationData = {
  id: "3",
  studentId: "ST003",
  studentName: "นายภาณุพงศ์ วงศ์ประเสริฐ",
  studentImage: "/placeholder.svg?height=100&width=100",
  studentEmail: "phanupong.w@example.com",
  studentPhone: "081-234-5678",
  companyName: "แหล่งฝึกงาน เภสัชกรรม ไทย จำกัด",
  companyAddress: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
  companyContact: "คุณสมศักดิ์ ใจดี (ผู้จัดการฝ่ายวิจัยและพัฒนา)",
  companyPhone: "02-123-4567",
  companyEmail: "contact@thaipharma.co.th",
  evaluationType: "ประเมินกลางภาค",
  dueDate: "15 มิ.ย. 2566",
  status: "completed",
  score: 92,
  submittedDate: "12 มิ.ย. 2566",
  startDate: "1 พ.ค. 2566",
  endDate: "31 ส.ค. 2566",
  position: "ผู้ช่วยเภสัชกร",
  department: "ฝ่ายวิจัยและพัฒนา",
  progress: 65,
  criteria: [
    {
      id: "c1",
      name: "ความรู้และทักษะทางวิชาชีพ",
      description:
        "ความรู้และทักษะทางวิชาชีพเภสัชกรรมที่นำมาประยุกต์ใช้ในการปฏิบัติงาน",
      score: 5,
      maxScore: 5,
      comment:
        "นักศึกษามีความรู้พื้นฐานทางเภสัชกรรมที่ดีมาก สามารถนำความรู้มาประยุกต์ใช้ในการทำงานได้อย่างมีประสิทธิภาพ",
    },
    {
      id: "c2",
      name: "ความรับผิดชอบและการตรงต่อเวลา",
      description: "ความรับผิดชอบต่องานที่ได้รับมอบหมายและการตรงต่อเวลา",
      score: 4,
      maxScore: 5,
      comment:
        "นักศึกษามีความรับผิดชอบสูง ส่งงานตรงเวลา แต่บางครั้งยังต้องได้รับการกระตุ้นเพื่อให้งานเสร็จทันกำหนด",
    },
    {
      id: "c3",
      name: "การทำงานร่วมกับผู้อื่น",
      description: "ความสามารถในการทำงานร่วมกับผู้อื่นและการสื่อสาร",
      score: 5,
      maxScore: 5,
      comment:
        "นักศึกษาสามารถทำงานร่วมกับผู้อื่นได้ดีมาก มีทักษะการสื่อสารที่ชัดเจน และมีมนุษยสัมพันธ์ที่ดีกับเพื่อนร่วมงาน",
    },
    {
      id: "c4",
      name: "ความคิดริเริ่มสร้างสรรค์",
      description: "ความคิดริเริ่มสร้างสรรค์และการแก้ไขปัญหา",
      score: 5,
      maxScore: 5,
      comment:
        "นักศึกษามีความคิดสร้างสรรค์ สามารถเสนอแนวทางใหม่ๆ ในการทำงาน และแก้ไขปัญหาเฉพาะหน้าได้ดี",
    },
    {
      id: "c5",
      name: "จรรยาบรรณวิชาชีพ",
      description: "การปฏิบัติตามจรรยาบรรณวิชาชีพเภสัชกรรม",
      score: 5,
      maxScore: 5,
      comment:
        "นักศึกษายึดมั่นในจรรยาบรรณวิชาชีพอย่างเคร่งครัด มีความซื่อสัตย์และรักษาความลับของผู้ป่วยได้ดี",
    },
  ],
  overallComment:
    "นักศึกษามีผลการปฏิบัติงานที่ดีเยี่ยม มีความรู้ทางวิชาชีพที่แข็งแกร่ง และมีทัศนคติที่ดีต่อการทำงาน คาดว่าจะเป็นเภสัชกรที่มีคุณภาพในอนาคต ควรพัฒนาในเรื่องการจัดการเวลาให้มีประสิทธิภาพมากขึ้น",
  attachments: [
    {
      id: "a1",
      name: "รายงานการปฏิบัติงานประจำเดือน.pdf",
      size: "2.4 MB",
      date: "10 มิ.ย. 2566",
    },
    {
      id: "a2",
      name: "แบบประเมินจากแหล่งฝึก.pdf",
      size: "1.8 MB",
      date: "11 มิ.ย. 2566",
    },
  ],
  history: [
    { id: "h1", action: "สร้างแบบประเมิน", date: "1 มิ.ย. 2566", user: "ระบบ" },
    {
      id: "h2",
      action: "เริ่มทำแบบประเมิน",
      date: "10 มิ.ย. 2566",
      user: "อ.ดร.สมชาย ใจดี",
    },
    {
      id: "h3",
      action: "บันทึกแบบประเมิน (ร่าง)",
      date: "11 มิ.ย. 2566",
      user: "อ.ดร.สมชาย ใจดี",
    },
    {
      id: "h4",
      action: "ส่งแบบประเมิน",
      date: "12 มิ.ย. 2566",
      user: "อ.ดร.สมชาย ใจดี",
    },
  ],
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    completed: {
      label: "เสร็จสิ้น",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    pending: {
      label: "รอดำเนินการ",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    in_progress: {
      label: "กำลังดำเนินการ",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    overdue: {
      label: "เลยกำหนด",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <Badge variant="outline" className={`${config.color} border`}>
      {config.label}
    </Badge>
  );
};

export default function EvaluationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [evaluation, setEvaluation] = useState(evaluationData);

  // Initialize form state with current evaluation data
  const [formState, setFormState] = useState({
    criteria: evaluation.criteria.map((c) => ({ ...c })),
    overallComment: evaluation.overallComment,
  });

  const handleScoreChange = (criteriaId: string, score: number) => {
    setFormState((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) =>
        c.id === criteriaId ? { ...c, score } : c
      ),
    }));
  };

  const handleCommentChange = (criteriaId: string, comment: string) => {
    setFormState((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) =>
        c.id === criteriaId ? { ...c, comment } : c
      ),
    }));
  };

  const handleOverallCommentChange = (comment: string) => {
    setFormState((prev) => ({
      ...prev,
      overallComment: comment,
    }));
  };

  const handleSaveDraft = () => {
    // Here you would typically save to API
    setEvaluation({
      ...evaluation,
      criteria: formState.criteria,
      overallComment: formState.overallComment,
      status: "in_progress",
    });
    setIsEditing(false);
    // Add to history
    const newHistory = {
      id: `h${evaluation.history.length + 1}`,
      action: "บันทึกแบบประเมิน (ร่าง)",
      date: new Date().toLocaleDateString("th-TH"),
      user: "อ.ดร.สมชาย ใจดี",
    };
    setEvaluation((prev) => ({
      ...prev,
      history: [...prev.history, newHistory],
    }));
  };

  const handleSubmit = () => {
    // Calculate new total score
    const totalScore = Math.round(
      (formState.criteria.reduce((sum, c) => sum + c.score, 0) /
        (formState.criteria.length * 5)) *
        100
    );

    // Here you would typically submit to API
    setEvaluation({
      ...evaluation,
      criteria: formState.criteria,
      overallComment: formState.overallComment,
      status: "completed",
      score: totalScore,
      submittedDate: new Date().toLocaleDateString("th-TH"),
    });
    setIsEditing(false);

    // Add to history
    const newHistory = {
      id: `h${evaluation.history.length + 1}`,
      action: "ส่งแบบประเมิน",
      date: new Date().toLocaleDateString("th-TH"),
      user: "อ.ดร.สมชาย ใจดี",
    };
    setEvaluation((prev) => ({
      ...prev,
      history: [...prev.history, newHistory],
    }));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/advisor/evaluations">
              การประเมินนักศึกษา
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {evaluation.evaluationType} - {evaluation.studentName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage
              src={evaluation.studentImage}
              alt={evaluation.studentName}
            />
            <AvatarFallback>{evaluation.studentName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{evaluation.studentName}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{evaluation.studentId}</span>
              <span>•</span>
              <span>{evaluation.evaluationType}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          <StatusBadge status={evaluation.status} />
          {!isEditing && evaluation.status !== "completed" && (
            <Button onClick={() => setIsEditing(true)}>แก้ไขการประเมิน</Button>
          )}
          {isEditing && (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                ยกเลิก
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                บันทึกร่าง
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                ส่งการประเมิน
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student & Company Info */}
        <div className="space-y-6">
          {/* Student Info Card */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg">ข้อมูลนักศึกษา</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {evaluation.studentName} ({evaluation.studentId})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{evaluation.studentEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{evaluation.studentPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                <span>{evaluation.position}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{evaluation.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {evaluation.startDate} - {evaluation.endDate}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Company Info Card */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg">ข้อมูลแหล่งฝึกงาน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{evaluation.companyName}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span>{evaluation.companyAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{evaluation.companyContact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{evaluation.companyPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{evaluation.companyEmail}</span>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg">ความคืบหน้าการฝึกงาน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ความคืบหน้า</span>
                  <span className="font-medium">{evaluation.progress}%</span>
                </div>
                <Progress
                  value={evaluation.progress}
                  className="h-2"
                  indicatorClassName="bg-emerald-500"
                />
                <div className="text-xs text-muted-foreground">
                  ระยะเวลาฝึกงาน: {evaluation.startDate} - {evaluation.endDate}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Card */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg">เอกสารแนบ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evaluation.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{attachment.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {attachment.size} • {attachment.date}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Evaluation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Evaluation Form Card */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg">แบบประเมินผลการฝึกงาน</CardTitle>
              <CardDescription>
                {evaluation.evaluationType} • กำหนดส่ง: {evaluation.dueDate}
                {evaluation.status === "completed" &&
                  ` • ส่งเมื่อ: ${evaluation.submittedDate}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Criteria */}
              {(isEditing ? formState.criteria : evaluation.criteria).map(
                (criteria, index) => (
                  <div key={criteria.id} className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {index + 1}. {criteria.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {criteria.description}
                        </p>
                      </div>
                      {!isEditing && (
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < criteria.score
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          <span className="ml-2 font-medium">
                            {criteria.score}/{criteria.maxScore}
                          </span>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <RadioGroup
                          defaultValue={criteria.score.toString()}
                          onValueChange={(value) =>
                            handleScoreChange(
                              criteria.id,
                              Number.parseInt(value)
                            )
                          }
                          className="flex space-x-2"
                        >
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-1"
                              >
                                <RadioGroupItem
                                  value={(i + 1).toString()}
                                  id={`${criteria.id}-${i + 1}`}
                                />
                                <Label htmlFor={`${criteria.id}-${i + 1}`}>
                                  {i + 1}
                                </Label>
                              </div>
                            ))}
                        </RadioGroup>

                        <div>
                          <Label htmlFor={`comment-${criteria.id}`}>
                            ความคิดเห็น
                          </Label>
                          <Textarea
                            id={`comment-${criteria.id}`}
                            value={criteria.comment}
                            onChange={(e) =>
                              handleCommentChange(criteria.id, e.target.value)
                            }
                            placeholder="กรอกความคิดเห็นของท่านต่อนักศึกษาในหัวข้อนี้"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        {criteria.comment}
                      </div>
                    )}

                    {index < evaluation.criteria.length - 1 && <Separator />}
                  </div>
                )
              )}

              {/* Overall Comment */}
              <div className="space-y-4">
                <h3 className="font-medium">ความคิดเห็นโดยรวม</h3>

                {isEditing ? (
                  <Textarea
                    value={formState.overallComment}
                    onChange={(e) => handleOverallCommentChange(e.target.value)}
                    placeholder="กรอกความคิดเห็นโดยรวมของท่านต่อนักศึกษา"
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {evaluation.overallComment}
                  </div>
                )}
              </div>

              {/* Total Score */}
              {evaluation.status === "completed" && (
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-md">
                  <div>
                    <h3 className="font-medium text-emerald-800">คะแนนรวม</h3>
                    <p className="text-sm text-emerald-600">
                      ประเมินเมื่อ {evaluation.submittedDate}
                    </p>
                  </div>
                  <div className="text-xl font-bold text-emerald-700">
                    {evaluation.score}/100
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History Card */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg">ประวัติการประเมิน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evaluation.history.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      {index < evaluation.history.length - 1 && (
                        <div className="absolute top-2 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gray-200 h-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.date} • {item.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
