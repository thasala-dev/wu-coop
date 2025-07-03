"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { ArrowLeft, Edit, ChevronRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminSidebar from "@/components/admin-sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/components/loading";
import Sidebar from "@/components/sidebar";
import CustomAvatar from "@/components/avatar";
import { callUploadApi, callDeleteApi } from "@/lib/file-api";
import AvatarDesign from "@/components/AvatarDesign";

const formSchema = z.object({
  fullname: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
  student_id: z.string().min(1, "กรุณากรอกรหัสนักศึกษา"),
  email: z
    .string()
    .email("กรุณากรอกอีเมลที่ถูกต้อง")
    .optional()
    .or(z.literal("")),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง")
    .optional()
    .or(z.literal("")),
  faculty: z.string().optional(),
  major: z.string(),
  std_year: z.string().min(1, "กรุณาเลือกปีรหัส"),
  address: z.string(),
  gpa: z.string(),
  advisor_id: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z
    .string()
    .regex(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง")
    .optional()
    .or(z.literal("")),
  emergency_contact_relation: z.string().optional(),

  password: z.string(),
  image: z.string().optional(),
});

const currentYear = new Date().getFullYear() + 543;
const years = Array.from({ length: currentYear - 2562 + 1 }, (_, i) =>
  (currentYear - i).toString().slice(-2)
);

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const params = useParams();
  const id = params?.id as string;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [initialImageUrl, setInitialImageUrl] = useState<string>(""); // To track original image for deletion

  // Helper function to safely display error messages
  const getErrorMessage = (error: any) => {
    if (!error) return "";
    if (typeof error.message === "string") return error.message;
    return String(error.message || "Invalid input");
  };

  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
  } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      student_id: "",
      email: "",
      mobile: "",
      faculty: "",
      major: "",
      std_year: "",
      address: "",
      gpa: "",
      advisor_id: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      emergency_contact_relation: "",

      password: "",
      image: "",
    },
  });
  // Fetch advisors on component mount
  React.useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await fetch("/api/advisor");
        const data = await response.json();
        if (data.success) {
          setAdvisors(data.data);
        }
      } catch (error) {
        console.error("Error fetching advisors:", error);
      }
    };
    fetchAdvisors();
  }, []);

  React.useEffect(() => {
    fetchStudentData();
  }, []);

  async function fetchStudentData() {
    setLoading(true);
    try {
      console.log("Fetching student data for ID:", id);
      const response = await fetch(`/api/student/${id}`);
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
      console.log("Fetched student data:", data);

      if (data.success) {
        console.log("Setting form values with data:", data.data);
        setValue("fullname", data.data.fullname);
        setValue("student_id", data.data.student_id);
        setValue("email", data.data.email || "");
        setValue("mobile", data.data.mobile || "");
        setValue("faculty", data.data.faculty || "");
        setValue("major", data.data.major || "");
        setValue("std_year", String(data.data.std_year) || "");
        setValue("address", data.data.address || "");
        setValue("gpa", data.data.gpa || "");
        setValue(
          "advisor_id",
          data.data.advisor_id ? String(data.data.advisor_id) : ""
        );
        setValue(
          "emergency_contact_name",
          data.data.emergency_contact_name || ""
        );
        setValue(
          "emergency_contact_phone",
          data.data.emergency_contact_phone || ""
        );
        setValue(
          "emergency_contact_relation",
          data.data.emergency_contact_relation || ""
        );
        setValue("password", "");

        setValue("image", data.data.image || "");
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
  async function onSubmit(values: any) {
    console.log("Form submitted with values:", values);
    values.username = values.student_id;
    setLoading(true);
    try {
      const payload = { ...values };
      console.log("Payload before processing:", payload);

      if (payload.password === "") {
        delete payload.password; // ลบ password ออกจาก payload หากเป็นค่าว่าง
      }

      // ตรวจสอบและจัดการค่า image ก่อนส่งไปยังเซิร์ฟเวอร์
      if (payload.image && typeof payload.image === "object") {
        try {
          // แปลงออบเจ็กต์เป็น JSON string
          payload.image = JSON.stringify(payload.image);
        } catch (error) {
          console.error("Error processing avatar image:", error);
          // กรณีแปลงไม่ได้ ให้ใช้ค่าว่าง
          payload.image = "";
        }
      }

      console.log("Final payload:", payload);

      // 4. Submit main form data
      const response = await fetch(`/api/student/${id}`, {
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
        router.push("/admin/students");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="students" userType="admin" />
          {loading && <Loading />}

          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
              >
                <a href="/admin/students">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <a href="/admin/students" className="hover:text-gray-900">
                  นักศึกษาทั้งหมด
                </a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900">แก้ไขนักศึกษา</span>
              </div>
            </div>

            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="p-0">
                  <div className="p-6 relative">
                    <div>
                      <div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                          <div className="sm:col-span-12">
                            <h2 className="font-semibold tracking-tight text-lg">
                              ข้อมูลนักศึกษา
                            </h2>
                          </div>

                          <div className="sm:col-span-12 flex flex-col items-center justify-center text-center">
                            <AvatarDesign
                              value={getValues("image")}
                              setValue={(val: any) => {
                                setValue("image", val);
                              }}
                              size="32"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label>ชื่อ-นามสกุล</label>
                            <input
                              id="fullname"
                              type="text"
                              {...register("fullname")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.fullname
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกชื่อ-นามสกุล"
                            />{" "}
                            {errors.fullname && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.fullname)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>รหัสนักศึกษา</label>
                            <input
                              id="student_id"
                              type="text"
                              {...register("student_id")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.student_id
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกรหัสนักศึกษา"
                            />{" "}
                            {errors.student_id && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.student_id)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>E-mail</label>
                            <input
                              id="email"
                              type="text"
                              {...register("email")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.email ? "border-red-600  border-2" : "")
                              }
                              placeholder="กรุณากรอกอีเมล"
                            />{" "}
                            {errors.email && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.email)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>เบอร์โทรศัพท์</label>
                            <input
                              id="mobile"
                              type="text"
                              {...register("mobile")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.mobile
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกเบอร์โทรศัพท์"
                            />{" "}
                            {errors.mobile && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.mobile)}
                              </p>
                            )}{" "}
                          </div>

                          <div className="sm:col-span-6">
                            <label>สาขาวิชา</label>
                            <select
                              id="major"
                              {...register("major")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.major ? "border-red-600  border-2" : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกสาขาวิชา
                              </option>
                              <option value="SCI">
                                สาขาวิชาเภสัชกรรมอุตสาหการ
                              </option>
                              <option value="CARE">
                                สาขาวิชาการบริบาลทางเภสัชกรรม
                              </option>
                            </select>{" "}
                            {errors.major && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.major)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-6">
                            <label>อาจารย์ที่ปรึกษา</label>
                            <select
                              id="advisor_id"
                              {...register("advisor_id")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.advisor_id
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                            >
                              <option value="">เลือกอาจารย์ที่ปรึกษา</option>
                              {advisors.map((advisor) => (
                                <option key={advisor.id} value={advisor.id}>
                                  {advisor.fullname}
                                </option>
                              ))}
                            </select>
                            {errors.advisor_id && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.advisor_id)}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-3">
                            <label>ปีรหัส</label>
                            <select
                              id="std_year"
                              {...register("std_year")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.std_year
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                            >
                              <option value="" disabled>
                                เลือกปีรหัส
                              </option>
                              {years.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>{" "}
                            {errors.std_year && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.std_year)}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-3">
                            <label>GPAX</label>
                            <input
                              id="gpa"
                              type="text"
                              {...register("gpa")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.gpa ? "border-red-600  border-2" : "")
                              }
                              placeholder="กรุณากรอก GPAX (เกรดเฉลี่ย)"
                            />{" "}
                            {errors.gpa && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.gpa)}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <label>ที่อยู่ที่ติดต่อได้</label>
                            <input
                              id="address"
                              type="text"
                              {...register("address")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.address
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกที่อยู่ที่ติดต่อได้"
                            />{" "}
                            {errors.address && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.address)}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-12">
                            <h3 className="font-semibold text-md mb-4 border-t pt-4">
                              ข้อมูลผู้ติดต่อกรณีฉุกเฉิน
                            </h3>
                          </div>

                          <div className="sm:col-span-6">
                            <label>ชื่อผู้ติดต่อกรณีฉุกเฉิน</label>
                            <input
                              id="emergency_contact_name"
                              type="text"
                              {...register("emergency_contact_name")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.emergency_contact_name
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกชื่อผู้ติดต่อกรณีฉุกเฉิน"
                            />
                            {errors.emergency_contact_name && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.emergency_contact_name)}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-6">
                            <label>เบอร์โทรผู้ติดต่อกรณีฉุกเฉิน</label>
                            <input
                              id="emergency_contact_phone"
                              type="text"
                              {...register("emergency_contact_phone")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.emergency_contact_phone
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                              placeholder="กรุณากรอกเบอร์โทรศัพท์"
                            />
                            {errors.emergency_contact_phone && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(
                                  errors.emergency_contact_phone
                                )}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-6">
                            <label>ความสัมพันธ์</label>
                            <select
                              id="emergency_contact_relation"
                              {...register("emergency_contact_relation")}
                              className={
                                "w-full p-2 border rounded-md " +
                                (errors.emergency_contact_relation
                                  ? "border-red-600  border-2"
                                  : "")
                              }
                            >
                              <option value="">เลือกความสัมพันธ์</option>
                              <option value="บิดา">บิดา</option>
                              <option value="มารดา">มารดา</option>
                              <option value="ผู้ปกครอง">ผู้ปกครอง</option>
                              <option value="พี่ชาย">พี่ชาย</option>
                              <option value="พี่สาว">พี่สาว</option>
                              <option value="น้องชาย">น้องชาย</option>
                              <option value="น้องสาว">น้องสาว</option>
                              <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                            {errors.emergency_contact_relation && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(
                                  errors.emergency_contact_relation
                                )}
                              </p>
                            )}
                          </div>

                          {/* ข้อมูลผู้ใช้งาน */}
                          <div className="sm:col-span-12">
                            <h2 className="font-semibold tracking-tight text-lg">
                              ข้อมูลผู้ใช้งาน
                            </h2>
                          </div>

                          <div className="sm:col-span-6">
                            <label htmlFor="password">
                              Password (หากไม่ต้องการแก้ไขไม่ต้องกรอก)
                            </label>
                            <input
                              id="password"
                              type="password"
                              {...register("password")}
                              className={`w-full p-2 border rounded-md ${
                                errors.password ? "border-red-600 border-2" : ""
                              }`}
                              placeholder="กรุณากรอกรหัสผ่าน"
                            />{" "}
                            {errors.password && (
                              <p className="text-sm text-red-600">
                                {getErrorMessage(errors.password)}
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
