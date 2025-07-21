"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  NewspaperIcon,
  EyeIcon,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";

export default function NewsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredData(data.filter((item: any) => item.status === 1)); // แสดงเฉพาะข่าวที่เผยแพร่
    } else {
      setFilteredData(
        data
          .filter((item: any) => item.status === 1)
          .filter(
            (item: any) =>
              item.title?.toLowerCase().includes(search.toLowerCase()) ||
              item.detail?.toLowerCase().includes(search.toLowerCase())
          )
      );
    }
  }, [data, search]);

  async function fetchData() {
    try {
      const response = await fetch("/api/news", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      if (res.success) {
        setData(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="news" userType="mentor" />
          {loading && <Loading />}

          <div className="md:col-span-4 space-y-6">
            {/* Header Section */}
            <Card className="bg-gradient-to-r from-lime-500 to-lime-600 text-white">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <NewspaperIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      ข่าวประชาสัมพันธ์
                    </CardTitle>
                    <CardDescription className="text-lime-100">
                      ติดตามข่าวสารและประกาศสำคัญ
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Search Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative w-full mb-4">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหาข่าวประชาสัมพันธ์..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {filteredData.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    พบ {filteredData.length} รายการ
                  </p>
                )}
              </CardContent>
            </Card>

            {/* News Cards */}
            {filteredData.length === 0 && !loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <NewspaperIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    ไม่มีข่าวประชาสัมพันธ์
                  </h3>
                  <p className="text-gray-400">
                    {search
                      ? "ไม่พบข่าวที่ตรงกับการค้นหา"
                      : "ยังไม่มีข่าวประชาสัมพันธ์"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredData.map((news: any) => (
                  <Link key={news.id} href={`/mentor/news/${news.id}`}>
                    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-6 group-hover:text-blue-600 transition-colors">
                              {news.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <CalendarIcon className="h-4 w-4" />
                                {formatDate(news.news_date)}
                              </div>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                เผยแพร่แล้ว
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {truncateText(news.detail)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="group-hover:bg-blue-50 group-hover:border-blue-200"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          อ่านเพิ่มเติม
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
