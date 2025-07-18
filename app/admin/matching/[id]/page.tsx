"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  UserCheck,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  ArrowLeft,
  ChevronRight,
  PersonStanding,
  User,
  Building2,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";

const getErrorMessage = (error: any) => {
  if (!error) return "";
  if (typeof error.message === "string") return error.message;
  return String(error.message || "Invalid input");
};

const studentSchema = z.object({
  position: z.string(),
  job_description: z.string(),
  evaluation_type: z
    .array(z.number())
    .min(1, "กรุณาเลือกรูปแบบการประเมินอย่างน้อย 1 รูปแบบ"),
});

export default function StudentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [evaluationsType, setEvaluationsType] = useState<any[]>([]);

  const [evaluationsCompleted, setEvaluationsCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
    watch,
  } = useForm<any>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      position: "",
      job_description: "",
      evaluation_type: [],
    },
  });

  async function onSubmit(values: any) {
    console.log("Form submitted with values:", values);
    setLoading(true);
    try {
      const payload = { ...values };

      console.log("Final payload:", payload);

      // 4. Submit main form data
      const response = await fetch(`/api/registIntern/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok && data.success) {
        toast({
          title: "ดำเนินการสำเร็จ",
          description: data.message || "แก้ไขข้อมูลผู้ดูแลระบบสำเร็จ",
          variant: "success",
        });
        router.push("/admin/matching");
      } else {
        toast({
          title: "ดำเนินการไม่สำเร็จ",
          description: data.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อบันทึกข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/evaluations_type`);
      if (!res.ok) return;
      const evalations = await res.json();
      setEvaluationsType(evalations.data || []);

      console.log("Fetching student data for ID:", id);
      const response = await fetch(`/api/evaluations/${id}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        toast({
          title: "ไม่สามารถโหลดข้อมูลนักศึกษาได้",
          description: "เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา",
          variant: "destructive",
        });
        return;
      }
      const data = await response.json();
      if (data.success) {
        setData(data.data);
        setEvaluationsCompleted(data.evaluationsCompleted || 0);
        setValue("position", data.data.position);
        setValue("job_description", data.data.job_description);
        let evaluationTypes = [];
        if (data.data.evaluation_type) {
          if (Array.isArray(data.data.evaluation_type)) {
            evaluationTypes = data.data.evaluation_type;
          } else if (typeof data.data.evaluation_type === "string") {
            // If it's a comma-separated string, split it
            evaluationTypes = data.data.evaluation_type
              .split(",")
              .map((id: string) => id.trim());
          } else {
            // If it's a single value, wrap it in an array
            evaluationTypes = [data.data.evaluation_type.toString()];
          }
        }

        setValue("evaluation_type", evaluationTypes);
      } else {
        toast({
          title: "ไม่พบข้อมูลนักศึกษา",
          description: data.message || "เกิดข้อผิดพลาด",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลนักศึกษาได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Sidebar activePage="matching" userType="admin" />
        {loading && <Loading />}
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              asChild
            >
              <a href="/advisor/matching">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <a href="/advisor/matching" className="hover:text-gray-900">
                จับคู่แหล่งฝึกงาน
              </a>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900">รายละเอียดการจับคู่</span>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <CustomAvatar
                    id={`student${data?.student_id}`}
                    image={data?.image}
                    size="16"
                  />
                  <div>
                    <CardTitle className="text-xl">{data?.fullname}</CardTitle>
                    <CardDescription className="text-base">
                      {data?.student_id} • {data?.position}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">อีเมล</div>
                      <div>
                        {data?.email || (
                          <i className="text-sm text-gray-500">ไม่ระบุ</i>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">เบอร์โทรศัพท์</div>
                      <div>
                        {data?.mobile || (
                          <i className="text-sm text-gray-500">ไม่ระบุ</i>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">อาจารย์ที่ปรึกษา</div>
                      <div>
                        {data?.advisor_name || (
                          <i className="text-sm text-gray-500">ไม่ระบุ</i>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {data?.advisor_email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {data?.advisor_mobile}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">
                        {data?.calendar_name} ปีการศึกษา {data?.semester}/
                        {data?.year}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(data?.start_date).toLocaleDateString(
                          "th-TH",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(data?.end_date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">ผู้ติดต่อฉุกเฉิน</div>
                      <div>
                        {data?.emergency_contact_name || (
                          <i className="text-sm text-gray-500">ไม่ระบุ</i>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {data?.emergency_contact_relation}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {data?.emergency_contact_phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{data?.company_name}</div>
                      <div className="text-sm">{data?.company_location}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">
                    รายละเอียดการฝึกงาน
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                      <div className="sm:col-span-12">
                        <label className="text-sm font-medium mb-3 block">
                          รูปแบบการประเมิน (เลือกได้หลายรูปแบบ)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-md bg-gray-50">
                          {evaluationsType.map((item: any) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="checkbox"
                                id={`evaluation-${item.id}`}
                                value={item.id}
                                checked={watch("evaluation_type")?.includes(
                                  item.id
                                )}
                                disabled={evaluationsCompleted > 0}
                                onChange={(e) => {
                                  const currentValues =
                                    watch("evaluation_type") || [];

                                  if (e.target.checked) {
                                    const newValues = [
                                      ...currentValues,
                                      Number(item.id),
                                    ];
                                    console.log(
                                      "Adding evaluation type:",
                                      item.id
                                    );
                                    setValue("evaluation_type", newValues);
                                  } else {
                                    const newValues = currentValues.filter(
                                      (id: string) => id !== item.id
                                    );

                                    console.log(
                                      "Removing evaluation type:",
                                      item.id
                                    );
                                    console.log(
                                      "New values after removal:",
                                      newValues
                                    );
                                    setValue("evaluation_type", newValues);
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              <label
                                htmlFor={`evaluation-${item.id}`}
                                className="text-sm text-gray-700 cursor-pointer"
                              >
                                <span className="font-medium">
                                  {item.group}
                                </span>{" "}
                                - {item.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        {errors.evaluation_type && (
                          <p className="text-sm text-red-600 mt-2">
                            {typeof errors.evaluation_type?.message === "string"
                              ? errors.evaluation_type.message
                              : "กรุณาเลือกรูปแบบการประเมินอย่างน้อย 1 รูปแบบ"}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-12">
                        <label>ตำแหน่ง</label>
                        <input
                          id="position"
                          type="text"
                          {...register("position")}
                          className={
                            "w-full p-2 border rounded-md " +
                            (errors.position ? "border-red-600  border-2" : "")
                          }
                          placeholder="ตำแหน่ง"
                        />{" "}
                        {errors.position && (
                          <p className="text-sm text-red-600">
                            {getErrorMessage(errors.position)}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-12">
                        <label>รายละเอียดของงาน</label>
                        <Textarea
                          id="job_description"
                          placeholder="รายละเอียดของงาน..."
                          className={
                            "w-full p-2 border rounded-md " +
                            (errors.job_description
                              ? "border-red-600  border-2"
                              : "")
                          }
                          {...register("job_description")}
                        />
                        {errors.job_description && (
                          <p className="text-sm text-red-600">
                            {getErrorMessage(errors.job_description)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>บันทึก</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
