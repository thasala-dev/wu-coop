"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ChevronRight, Edit } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/loading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อแบบประเมิน"),
  group: z.string().min(1, "กรุณาเลือกกลุ่มแบบประเมิน  "),
  form: z
    .array(z.number())
    .min(1, "กรุณาเลือกรูปแบบการประเมินอย่างน้อย 1 รูปแบบ"),
});

export default function NewEvaluation() {
  const [loading, setLoading] = useState(true);
  const [formList, setFormList] = useState<any[]>([]);
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      group: "",
      form: [],
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const response = await fetch(`/api/evaluations_type/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (res.success) {
      // setEvalationList(res.data);
      console.log("Fetched evaluation data:", res.data);
      // Set default values for the form
      setValue("name", res.data.name || "");
      setValue("group", res.data.group || "");
      setValue("form", res.data.form || []);
      setFormList(res.form || []);
    }
    setLoading(false);
  }

  async function onSubmit(values: any) {
    setLoading(true);

    const payload = values;

    const response = await fetch(`/api/evaluations_type/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setLoading(false);
    if (data.success) {
      toast({
        title: "ดำเนินการสำเร็จ",
        description: data.message || "เกิดข้อผิดพลาด",
        variant: "success",
      });
      router.push("/admin/evaluations");
    } else {
      toast({
        title: "ดำเนินการไม่สำเร็จ",
        description: data.message || "เกิดข้อผิดพลาด",
        variant: "destructive",
      });
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="evaluations" userType="admin" />
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
                  แบบประเมิน
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">รายละเอียด</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลแบบประเมิน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                      <label>ชื่อแบบประเมิน</label>
                      <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className={
                          "w-full p-2 border rounded-md " +
                          (errors.name ? "border-red-600  border-2" : "")
                        }
                        placeholder="กรุณากรอกชื่อแบบประเมิน"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">
                          {typeof errors.name?.message === "string"
                            ? errors.name.message
                            : "กรุณากรอกชื่อแบบประเมิน"}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-6">
                      <label>ประเภทเอกสาร</label>
                      <select
                        id="group"
                        {...register("group")}
                        className={
                          "w-full p-2 border rounded-md " +
                          (errors.group ? "border-red-600  border-2" : "")
                        }
                      >
                        <option value="" disabled>
                          เลือกประเภทเอกสาร
                        </option>
                        <option value="CARE">CARE</option>
                        <option value="SCI">SCI</option>
                        <option value="SOCIAL_CARE">SOCIAL CARE</option>
                      </select>

                      {errors.group && (
                        <p className="text-sm text-red-600">
                          {typeof errors.group?.message === "string"
                            ? errors.group.message
                            : "กรุณาเลือกประเภทเอกสาร"}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-12">
                      <div className="font-semibold tracking-tight text-lg">
                        ข้อมูลการประเมิน
                      </div>
                    </div>

                    <div className="sm:col-span-12">
                      <label className="text-sm font-medium mb-3 block">
                        รูปแบบการประเมิน (เลือกได้หลายรูปแบบ)
                      </label>
                      <div className="grid grid-cols-1 gap-3 p-4 border rounded-md bg-gray-50">
                        {formList.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="checkbox"
                              id={`evaluation-${item.id}`}
                              value={item.id}
                              checked={watch("form")?.includes(item.id)}
                              onChange={(e) => {
                                const currentValues = watch("form") || [];

                                if (e.target.checked) {
                                  const newValues = [...currentValues, item.id];
                                  setValue("form", newValues);
                                } else {
                                  const newValues = currentValues.filter(
                                    (id: string) => id !== item.id
                                  );
                                  setValue("form", newValues);
                                }
                              }}
                              className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label
                              htmlFor={`evaluation-${item.id}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              <Badge
                                variant="outline"
                                className={
                                  item.group === "CARE"
                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                    : item.group === "SCI"
                                    ? "bg-green-50 text-green-700 hover:bg-green-50"
                                    : item.group === "SOCIAL_CARE"
                                    ? "bg-purple-50 text-purple-700 hover:bg-purple-50"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-50"
                                }
                              >
                                {item.short_name}
                              </Badge>{" "}
                              {item.name}
                            </label>
                            <Link href={`/admin/evaluations/${id}/${item.id}`}>
                              <div className="text-sm text-yellow-600 cursor-pointer">
                                (ดูตัวอย่างแบบประเมิน)
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                      {errors.form && (
                        <p className="text-sm text-red-600 mt-2">
                          {typeof errors.form?.message === "string"
                            ? errors.form.message
                            : "กรุณาเลือกรูปแบบการประเมินอย่างน้อย 1 รูปแบบ"}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-12">
                      <div className="flex items-center gap-2">
                        <Button
                          type="submit"
                          className="flex items-center gap-1 h-9 px-3 rounded-md bg-gray-900 hover:bg-gray-800"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          บันทึกข้อมูล
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
