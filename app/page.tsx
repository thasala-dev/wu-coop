"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Briefcase,
  School,
  ShieldCheck,
  Pill,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้งาน"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Home() {
  const [role, setRole] = useState("student");
  const router = useRouter();
  const { user, login, isLoading } = useAuth();
  console.log("Current User:", user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <p className="text-gray-500">กำลังโหลด...</p>
  //     </div>
  //   );
  // }

  const getButtonClass = () => {
    switch (role) {
      case "student":
        return "bg-blue-600 hover:bg-blue-700";
      case "mentor":
        return "bg-green-600 hover:bg-green-700";
      case "advisor":
        return "bg-purple-600 hover:bg-purple-700";
      case "admin":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  async function onSubmit(values: LoginFormData) {
    const success = await login(values.username, values.password, role);

    if (success) {
      switch (role) {
        case "student":
          router.push("/student/dashboard");
          break;
        case "mentor":
          router.push("/mentor/dashboard");
          break;
        case "advisor":
          router.push("/advisor/dashboard");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
      }
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-200 to-cyan-200 opacity-90" />

      {/* ชั้นที่ 2: เพิ่มความนุ่มนวลด้วย blur และ overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 mix-blend-overlay" />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-8 text-center text-green-700">
            <div className="flex items-center justify-center gap-2">
              <img src="/icon.png" alt="Logo" className="h-8 w-8 text-white" />
              <h1 className="text-4xl font-bold mb-2">ระบบฝึกงาน</h1>
            </div>
            <p className="text-green-700/80 text-lg">
              สำนักเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์
            </p>
          </div>

          <Card className="w-full max-w-md shadow-xl backdrop-blur-sm bg-white/90 border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">เข้าสู่ระบบ</CardTitle>
              <CardDescription>
                กรุณาเข้าสู่ระบบเพื่อใช้งานระบบสหกิจศึกษา
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Tabs value={role} onValueChange={setRole} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4 border-b-2 border-gray-200 ">
                    <TabsTrigger
                      value="student"
                      className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 data-[state=active]:font-bold rounded-md px-2 py-1"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span className="hidden sm:inline">นักศึกษา</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="mentor"
                      className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-600 data-[state=active]:font-bold rounded-md px-2 py-1"
                    >
                      <Briefcase className="w-4 h-4 text-green-600" />
                      <span className="hidden sm:inline">แหล่งฝึก</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="advisor"
                      className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-600 data-[state=active]:font-bold rounded-md px-2 py-1"
                    >
                      <School className="w-4 h-4 text-purple-600" />
                      <span className="hidden sm:inline">อาจารย์</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="admin"
                      className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-600 data-[state=active]:font-bold rounded-md px-2 py-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-red-600" />
                      <span className="hidden sm:inline">แอดมิน</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={role} className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="username" className="text-sm font-medium">
                        {role === "student" ? "รหัสนักศึกษา" : "ชื่อผู้ใช้งาน"}
                      </label>
                      <input
                        id="username"
                        type="text"
                        {...register("username")}
                        className="w-full p-2 border rounded-md"
                        placeholder={`กรอก${
                          role === "student" ? "รหัสนักศึกษา" : "ชื่อผู้ใช้งาน"
                        }`}
                      />
                      {errors.username && (
                        <p className="text-sm text-red-600">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="password" className="text-sm font-medium">
                        รหัสผ่าน
                      </label>
                      <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="w-full p-2 border rounded-md"
                        placeholder="กรอกรหัสผ่าน"
                      />
                      {errors.password && (
                        <p className="text-sm text-red-600">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className={`${getButtonClass()} w-full hover:opacity-90 transition-all`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          กำลังเข้าสู่ระบบ...
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4" />
                          เข้าสู่ระบบ
                        </>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>
              </form>
            </CardContent>

            <CardFooter className="text-center text-sm">
              <span className="mx-auto">
                พบปัญหาการเข้าสู่ระบบ?{" "}
                <Link href="#" className="text-green-600 hover:underline">
                  ติดต่อผู้ดูแลระบบ
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
