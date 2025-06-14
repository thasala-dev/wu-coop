"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isCustomer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // ตรวจสอบสถานะการเข้าสู่ระบบเมื่อโหลดหน้า
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ตรวจสอบว่ามี cookie หรือไม่
        const userCookie = Cookies.get("user");

        if (userCookie) {
          // ถ้ามี cookie ให้ parse ข้อมูลผู้ใช้
          const userData = JSON.parse(decodeURIComponent(userCookie));
          setUser(userData);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ฟังก์ชันเข้าสู่ระบบ
  const login = async (
    username: string,
    password: string,
    role: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (!data.success) {
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: data.message,
          variant: "destructive",
        });
        return false;
      }

      // บันทึกข้อมูลผู้ใช้ลงใน state และ cookie
      setUser(data.data);
      Cookies.set("user", encodeURIComponent(JSON.stringify(data.data)), {
        expires: 7,
      });

      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: `ยินดีต้อนรับ ${
          role == "mentor" ? data.data.name : data.data.fullname
        }`,
        variant: "success",
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันออกจากระบบ
  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // ลบข้อมูลผู้ใช้จาก state และ cookie
      setUser(null);
      Cookies.remove("user");

      toast({
        title: "ออกจากระบบสำเร็จ",
        variant: "success",
      });

      // นำผู้ใช้กลับไปยังหน้าแรก
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "ออกจากระบบไม่สำเร็จ",
        description: "เกิดข้อผิดพลาดในการออกจากระบบ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  // ฟังก์ชันตรวจสอบว่าเป็นแอดมินหรือไม่
  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };

  // ฟังก์ชันตรวจสอบว่าเป็นลูกค้าหรือไม่
  const isCustomer = (): boolean => {
    return user?.role === "customer";
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAdmin, isCustomer }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
