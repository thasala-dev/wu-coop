"use client";

import React, { useState, useEffect } from "react";
import { Bell, Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// ประเภทข้อมูลสำหรับประเภทการแจ้งเตือน
interface NotificationType {
  id: number;
  code: string;
  name: string;
}

// ประเภทข้อมูลสำหรับการตั้งค่าการแจ้งเตือน
interface NotificationPreference {
  id: number;
  user_id: number;
  type: NotificationType;
  in_app_enabled: boolean;
  email_enabled: boolean;
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // โหลดข้อมูลการตั้งค่าการแจ้งเตือน
  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notification-preferences");
      const data = await response.json();
      if (data.success) {
        setPreferences(data.data);
      } else {
        console.error("Error fetching notification preferences:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  // เมื่อ component โหลดให้โหลดข้อมูลการตั้งค่า
  useEffect(() => {
    fetchPreferences();
  }, []);

  // อัปเดตการตั้งค่าการแจ้งเตือนในแอปพลิเคชัน
  const handleInAppToggle = (id: number, enabled: boolean) => {
    setPreferences((prevPreferences) =>
      prevPreferences.map((pref) =>
        pref.id === id ? { ...pref, in_app_enabled: enabled } : pref
      )
    );
  };

  // อัปเดตการตั้งค่าการแจ้งเตือนทางอีเมล
  const handleEmailToggle = (id: number, enabled: boolean) => {
    setPreferences((prevPreferences) =>
      prevPreferences.map((pref) =>
        pref.id === id ? { ...pref, email_enabled: enabled } : pref
      )
    );
  };

  // บันทึกการตั้งค่าการแจ้งเตือน
  const savePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/notification-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: preferences[0].user_id, // ใช้ user_id จากการตั้งค่าแรก
          preferences: preferences.map((pref) => ({
            type_id: pref.type.id,
            in_app_enabled: pref.in_app_enabled,
            email_enabled: pref.email_enabled,
          })),
        }),
      });

      if (response.ok) {
        toast({
          title: "บันทึกการตั้งค่าแล้ว",
          description: "บันทึกการตั้งค่าการแจ้งเตือนเรียบร้อยแล้ว",
          variant: "success",
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || "เกิดข้อผิดพลาดในการบันทึกการตั้งค่า");
      }
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description:
          error instanceof Error
            ? error.message
            : "ไม่สามารถบันทึกการตั้งค่าได้",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>การตั้งค่าการแจ้งเตือน</CardTitle>
        <CardDescription>
          กำหนดวิธีการรับการแจ้งเตือนสำหรับกิจกรรมต่าง ๆ ในระบบ
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 text-sm font-medium border-b pb-2">
              <div>ประเภทการแจ้งเตือน</div>
              <div className="text-center">ในแอปพลิเคชัน</div>
              <div className="text-center">อีเมล</div>
            </div>

            {preferences.map((pref) => (
              <div key={pref.id} className="grid grid-cols-3 items-center">
                <div className="text-sm">{pref.type.name}</div>
                <div className="flex justify-center">
                  <Switch
                    checked={pref.in_app_enabled}
                    onCheckedChange={(checked) =>
                      handleInAppToggle(pref.id, checked)
                    }
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={pref.email_enabled}
                    onCheckedChange={(checked) =>
                      handleEmailToggle(pref.id, checked)
                    }
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <Button onClick={savePreferences} disabled={saving || loading}>
                {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
