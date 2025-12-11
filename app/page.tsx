"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import Loading from "@/components/loading";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้งาน"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Home() {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // ตรวจสอบว่ามี session แล้วหรือไม่
  useEffect(() => {
    if (session?.user) {
      console.log("Session detected, user:", session.user);
      const redirectTo = `/${session.user.role}/dashboard`;
      console.log("Redirecting to:", redirectTo);
      router.replace(redirectTo);
    }
  }, [session, router]);

  const getButtonClass = () => {
    switch (role) {
      case "student":
        return "bg-sky-600 hover:bg-sky-700";
      case "mentor":
        return "bg-lime-600 hover:bg-lime-700";
      case "advisor":
        return "bg-fuchsia-600 hover:bg-fuchsia-700";
      case "admin":
        return "bg-rose-600 hover:bg-rose-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  async function onSubmit(values: LoginFormData) {
    console.log("Attempting login with NextAuth...");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        role: role,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
          variant: "destructive",
        });
      } else {
        console.log("Login successful with NextAuth");
        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          variant: "success",
        });

        // NextAuth จะโหลด session ใหม่โดยอัตโนมัติ และ useEffect ด้านบนจะทำการ redirect
      }
    } catch (error) {
      console.error("Login exception:", error);
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // แสดง loading ระหว่างตรวจสอบ session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-300 to-cyan-200 opacity-90">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {isLoading && <Loading />}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-300 to-cyan-200 opacity-90" />
      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-8 flex flex-col items-center justify-center text-green-700">
            <img src="/spm.png" alt="Logo" className="h-16 mb-2" />
            <h1 className="text-4xl font-bold mb-2 text-center">ระบบฝึกปฏิบัติงานวิชาชีพเภสัชกรรม</h1>
          </div>

          <Card className="w-full rounded-xl max-w-md shadow-xl bg-white/60 backdrop-blur-md  border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-green-700">
                เข้าสู่ระบบ
              </CardTitle>
              <CardDescription className="text-sm text-green-700/50">
                กรุณาเข้าสู่ระบบเพื่อใช้งานระบบฝึกงาน
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Tabs value={role} onValueChange={setRole} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4 bg-green-100 shadow-sm">
                    <TabsTrigger
                      value="student"
                      className="data-[state=active]:bg-sky-500 data-[state=active]:text-white"
                    >
                      <GraduationCap className="hidden sm:block h-4 w-4 mr-2" />{" "}
                      นักศึกษา
                    </TabsTrigger>
                    <TabsTrigger
                      value="mentor"
                      className="data-[state=active]:bg-lime-500 data-[state=active]:text-white"
                    >
                      <Briefcase className="hidden sm:block h-4 w-4 mr-2" />{" "}
                      แหล่งฝึก
                    </TabsTrigger>
                    <TabsTrigger
                      value="advisor"
                      className="data-[state=active]:bg-fuchsia-500 data-[state=active]:text-white"
                    >
                      <School className="hidden sm:block h-4 w-4 mr-2" />{" "}
                      อาจารย์
                    </TabsTrigger>
                    <TabsTrigger
                      value="admin"
                      className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                    >
                      <ShieldCheck className="hidden sm:block h-4 w-4 mr-2" />{" "}
                      ผู้ดูแล
                    </TabsTrigger>
                  </TabsList>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="username"
                        className="text-sm font-medium text-gray-700 block"
                      >
                        ชื่อผู้ใช้งาน
                      </label>
                      <input
                        type="text"
                        id="username"
                        placeholder="กรอกชื่อผู้ใช้งาน"
                        className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        {...register("username")}
                      />
                      {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700 block"
                      >
                        รหัสผ่าน
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder="กรอกรหัสผ่าน"
                          className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          {...register("password")}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-2 rounded-md text-white transition duration-300 ${getButtonClass()}`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <LogIn className="h-4 w-4 mr-2" />
                      )}
                      เข้าสู่ระบบ
                    </Button>
                  </div>
                </Tabs>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center text-sm text-green-700/70">
              <Pill className="h-4 w-4 mr-1" />
              ระบบฝึกงาน สำนักวิชาเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
