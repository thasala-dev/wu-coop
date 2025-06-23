"use client";

import React from "react";
import { NotificationSettings } from "@/components/notification-settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotificationSettingsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            กลับหน้าหลัก
          </Button>
        </Link>
        <h1 className="text-xl font-bold">การตั้งค่าบัญชี</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar การตั้งค่า */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                <Link href="/settings/profile" passHref>
                  <div className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
                    โปรไฟล์
                  </div>
                </Link>
                <Link href="/settings/account" passHref>
                  <div className="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium">
                    บัญชีและความปลอดภัย
                  </div>
                </Link>
                <Link href="/settings/notifications" passHref>
                  <div className="block px-3 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium">
                    การแจ้งเตือน
                  </div>
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* เนื้อหาหลัก */}
        <div className="md:col-span-3">
          <Tabs defaultValue="notifications">
            <TabsList className="mb-4">
              <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
              <TabsTrigger value="emails">อีเมล</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>การแจ้งเตือน</CardTitle>
                  <CardDescription>
                    กำหนดประเภทการแจ้งเตือนที่คุณต้องการได้รับภายในแอปพลิเคชัน
                  </CardDescription>
                </CardHeader>
              </Card>

              <NotificationSettings />
            </TabsContent>

            <TabsContent value="emails" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>การแจ้งเตือนทางอีเมล</CardTitle>
                  <CardDescription>
                    กำหนดประเภทการแจ้งเตือนที่คุณต้องการได้รับทางอีเมล
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    คุณสามารถเลือกได้ว่าต้องการรับการแจ้งเตือนประเภทใดทางอีเมล
                    โดยเปลี่ยนการตั้งค่าในแท็บการแจ้งเตือน
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
