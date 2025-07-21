"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";

export default function NewsDetailPage() {
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState<any>(null);
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.success) {
          setNewsData(data.data);
        }
      } catch (error) {
        console.error("Error fetching news data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Sidebar activePage="news" userType="mentor" />
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Sidebar activePage="news" userType="mentor" />
            <div className="md:col-span-4">
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    ไม่พบข่าวประชาสัมพันธ์
                  </h3>
                  <p className="text-gray-400 mb-4">
                    ข่าวประชาสัมพันธ์ที่คุณค้นหาไม่มีอยู่หรือถูกลบไปแล้ว
                  </p>
                  <Button asChild>
                    <a href="/mentor/news">กลับสู่หน้าข่าวประชาสัมพันธ์</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="news" userType="mentor" />

          <div className="md:col-span-4 space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-200"
                asChild
              >
                <a href="/mentor/news">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <div className="text-sm text-gray-500">
                <a href="/mentor/news" className="hover:text-gray-900">
                  ข่าวประชาสัมพันธ์
                </a>
                <span className="mx-2">•</span>
                <span className="text-gray-900">รายละเอียด</span>
              </div>
            </div>

            {/* News Content */}
            <Card className="overflow-hidden">
              {/* News Header */}
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      เผยแพร่แล้ว
                    </Badge>
                  </div>

                  <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                    {newsData.title}
                  </CardTitle>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        วันที่เผยแพร่: {formatDate(newsData.news_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span>ผู้ดูแลระบบ</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* News Content */}
              <CardContent className="p-8">
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                    {newsData.detail}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back Button */}
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="hover:bg-blue-50 hover:border-blue-200"
              >
                <a href="/mentor/news">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  กลับสู่หน้าข่าวประชาสัมพันธ์
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
