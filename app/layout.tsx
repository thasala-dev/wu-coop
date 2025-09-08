import type React from "react";
import "@/app/globals.css";
import { Sarabun } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import NextAuthProvider from "@/contexts/next-auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <link rel="icon" href="/logo.png" sizes="any" />
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
          <NextAuthProvider>{children}</NextAuthProvider>
          <Toaster />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
