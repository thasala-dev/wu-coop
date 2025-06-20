import type React from "react";
import "@/app/globals.css";
import { Sarabun } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sarabun",
});

export const metadata = {
  title: "ระบบฝึกงาน สำนักเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์",
  description: "ระบบฝึกงาน สำนักเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์",
  generator: "thasala.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
      </head>
      <body
        className={cn(
          sarabun.variable,
          "font-sans antialiased min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
