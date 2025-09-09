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
  CreditCardIcon,
  EyeIcon,
  DollarSignIcon,
  FileTextIcon,
  BuildingIcon,
  TrendingUpIcon,
  DownloadIcon,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(
          (item: any) =>
            item.company_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.calendar_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.amount?.toString().includes(search) ||
            item.detail?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [data, search]);

  async function fetchData() {
    try {
      const response = await fetch(
        "/api/admin/payments?company_id=" + user?.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      if (res.success) {
        setData(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="payments" userType="mentor" />
          {loading && <Loading />}

          <div className="md:col-span-4 space-y-8">
            {/* Enhanced Header Section */}
            <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white border-0 shadow-xl">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm">
                      <DollarSignIcon className="h-10 w-10" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold mb-2">
                        การชำระเงิน
                      </CardTitle>
                      <CardDescription className="text-indigo-100 text-lg">
                        รายการการชำระเงินและหลักฐานการโอนเงินของบริษัท
                      </CardDescription>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="hidden lg:flex items-center space-x-6">
                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <p className="text-2xl font-bold">
                        {filteredData.length}
                      </p>
                      <p className="text-indigo-100 text-sm">รายการทั้งหมด</p>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <p className="text-2xl font-bold">
                        ฿
                        {filteredData
                          .reduce(
                            (sum: number, p: any) => sum + (p.amount || 0),
                            0
                          )
                          .toLocaleString()}
                      </p>
                      <p className="text-indigo-100 text-sm">ยอดรวมทั้งหมด</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Enhanced Search Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="relative w-full mb-4">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="ค้นหาการชำระเงิน (บริษัท, ปีการศึกษา, จำนวนเงิน)..."
                    className="pl-12 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {filteredData.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                      พบ {filteredData.length} รายการ
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Payment Cards */}
            {filteredData.length === 0 && !loading ? (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <DollarSignIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {search
                      ? "ไม่พบข้อมูลการชำระเงิน"
                      : "ยังไม่มีข้อมูลการชำระเงิน"}
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {search
                      ? "ลองเปลี่ยนคำค้นหาหรือตรวจสอบการสะกดอีกครั้ง"
                      : "เมื่อมีการบันทึกการชำระเงินจากบริษัท ข้อมูลจะแสดงที่นี่"}
                  </p>
                  <div className="mt-8 flex justify-center">
                    <div className="bg-blue-50 rounded-full px-6 py-2 border border-blue-200">
                      <span className="text-blue-600 text-sm font-medium">
                        {search ? "🔍 ลองค้นหาใหม่" : "💡 รอการอัปเดตข้อมูล"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map((payment: any, index: number) => (
                  <Card
                    key={payment.id}
                    className="group hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:-translate-y-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                            <BuildingIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors text-lg">
                              การชำระเงิน
                            </h3>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              #{payment.id}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Amount Highlight */}
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border-l-4 border-emerald-400">
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-700 font-medium">
                            จำนวนเงิน
                          </span>
                          <span className="text-2xl font-bold text-emerald-700">
                            {new Intl.NumberFormat("th-TH", {
                              style: "currency",
                              currency: "THB",
                            }).format(payment.amount || 0)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Date Information */}
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CalendarIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-blue-600 font-medium">
                            วันที่ชำระ
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(payment.payment_date)}
                          </p>
                        </div>
                      </div>

                      {/* Calendar Information */}
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FileTextIcon className="h-4 w-4 text-indigo-600" />
                          <span className="text-xs text-indigo-600 font-medium">
                            รายละเอียดผลัด
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.calendar_name || "ไม่ระบุผลัด"}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          ภาคเรียน {payment.semester || "ไม่ระบุ"} /{" "}
                          {payment.year || "ไม่ระบุ"}
                        </p>
                      </div>

                      {/* Detail */}
                      {payment.detail && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 font-medium mb-1">
                            รายละเอียดเพิ่มเติม
                          </p>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {payment.detail}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-4 border-t border-gray-100 space-y-3">
                        {payment.file_attachment && (
                          <a
                            href={payment.file_attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="block"
                          >
                            <Button
                              variant="outline"
                              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all group"
                            >
                              <EyeIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                              ดูหลักฐานการชำระเงิน
                              <DownloadIcon className="h-3 w-3 ml-2 opacity-75" />
                            </Button>
                          </a>
                        )}

                        <div className="flex justify-center">
                          <Badge className="bg-green-100 text-green-700 border border-green-200 px-4 py-2">
                            <ClockIcon className="h-3 w-3 mr-2" />
                            สถานะ: ชำระเงินแล้ว ✅
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
