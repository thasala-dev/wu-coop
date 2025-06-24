# การอัปเกรดระบบ Authentication เป็น NextAuth.js

## ที่มา

เราได้ดำเนินการย้ายระบบ Authentication จากการใช้ Custom Auth Context เดิมที่ใช้ Client-Side Cookies มาเป็น NextAuth.js เพื่อประโยชน์ดังนี้:

1. เพิ่มความปลอดภัยด้วย HTTP-only Cookies และ JWT
2. รองรับการตรวจสอบสิทธิ์ทั้งฝั่ง Client และ Server Components
3. ลดความซับซ้อนในการจัดการ Session และ Cookies
4. รองรับการขยายระบบในอนาคต เช่น การเพิ่ม OAuth Providers

## การใช้งาน NextAuth

### การตรวจสอบสิทธิ์ใน Client Components

การใช้ NextAuth.js ใน Client Components (มี "use client" directive):

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function MyClientComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>กำลังโหลด...</div>;
  }

  if (status === "unauthenticated" || !session) {
    return <div>กรุณาเข้าสู่ระบบ</div>;
  }

  return (
    <div>
      <h1>สวัสดี {session.user.fullname || session.user.name}</h1>
      <p>บทบาท: {session.user.role}</p>
    </div>
  );
}
```

### การตรวจสอบสิทธิ์ใน Server Components

การใช้ NextAuth.js ใน Server Components:

```tsx
import { getSession, checkSessionServer } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MyServerComponent() {
  const { isAuthenticated, hasRole, user } = await checkSessionServer(
    "student"
  );

  if (!isAuthenticated || !hasRole) {
    redirect("/");
  }

  return (
    <div>
      <h1>สวัสดี {user.fullname || user.name}</h1>
      <p>บทบาท: {user.role}</p>
    </div>
  );
}
```

### การใช้ AuthGuard Component

เราได้สร้าง `AuthGuard` component ที่ช่วยในการป้องกันหน้าที่ต้องการการเข้าสู่ระบบ:

```tsx
import AuthGuard from "@/components/auth-guard";

export default function ProtectedLayout({ children }) {
  return <AuthGuard requiredRole="student">{children}</AuthGuard>;
}
```

### การเข้าสู่ระบบ

การเข้าสู่ระบบใช้ฟังก์ชัน `signIn` ของ NextAuth:

```tsx
import { signIn } from "next-auth/react";

async function handleLogin() {
  const result = await signIn("credentials", {
    username: "myusername",
    password: "mypassword",
    role: "student",
    redirect: false,
  });

  if (result?.error) {
    // จัดการกรณีเข้าสู่ระบบไม่สำเร็จ
  } else {
    // เข้าสู่ระบบสำเร็จ
  }
}
```

### การออกจากระบบ

การออกจากระบบใช้ฟังก์ชัน `signOut` ของ NextAuth:

```tsx
import { signOut } from "next-auth/react";

async function handleLogout() {
  await signOut({ redirect: true, callbackUrl: "/" });
}
```

หรือใช้ `LogoutButton` component ที่เราเตรียมไว้:

```tsx
import LogoutButton from "@/components/logout-button";

export default function MyComponent() {
  return <LogoutButton variant="destructive" showText={true} />;
}
```

## คอมโพเนนต์ที่อัปเดตเป็น NextAuth แล้ว

- `LogoutButton`: คอมโพเนนต์สำหรับการออกจากระบบด้วย NextAuth
- `AuthGuard`: คอมโพเนนต์สำหรับป้องกันหน้าที่ต้องการการเข้าสู่ระบบ
- `navbar-nextauth.tsx`: คอมโพเนนต์ Navbar ที่ใช้ NextAuth
- `user-header-nextauth.tsx`: คอมโพเนนต์ User Header ที่ใช้ NextAuth

## ขั้นตอนการอัปเกรดคอมโพเนนต์เดิม

1. แทนที่การใช้ `useAuth` ด้วย `useSession` ของ NextAuth
2. ใช้ `AuthGuard` ในเลย์เอาต์เพื่อป้องกันหน้าที่ต้องการการเข้าสู่ระบบ
3. ใช้ `LogoutButton` แทนการกดปุ่มออกจากระบบเดิม
4. ใช้ Middleware ที่อัปเดตแล้วสำหรับการป้องกันเส้นทาง

## หมายเหตุ

- ไฟล์ `auth-context.tsx` จะถูกลบในอนาคตเมื่อการย้ายไปใช้ NextAuth เสร็จสมบูรณ์
- การตรวจสอบสิทธิ์ควรใช้ NextAuth มากกว่า Custom Auth Context เดิม
- Middleware ได้รับการอัปเดตให้ใช้ NextAuth แล้ว
