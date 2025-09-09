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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="payments" userType="mentor" />
          {loading && <Loading />}

          <div className="md:col-span-4 space-y-6">
            {/* Header Section */}
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <CreditCardIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      ข้อมูลการชำระเงิน
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      รายการการชำระเงินและหลักฐานการโอนเงิน
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
                    placeholder="ค้นหาการชำระเงิน (บริษัท, ปีการศึกษา, จำนวนเงิน)..."
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

            {/* Payment Cards */}
            {filteredData.length === 0 && !loading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CreditCardIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    ไม่มีข้อมูลการชำระเงิน
                  </h3>
                  <p className="text-gray-400">
                    {search
                      ? "ไม่พบข้อมูลการชำระเงินที่ตรงกับการค้นหา"
                      : "ยังไม่มีข้อมูลการชำระเงิน"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredData.map((payment: any) => (
                  <Card
                    key={payment.id}
                    className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group h-full"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <CalendarIcon className="h-4 w-4" />
                              {formatDate(payment.payment_date)}
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              <DollarSignIcon className="h-3 w-3 mr-1" />
                              {new Intl.NumberFormat("th-TH", {
                                style: "currency",
                                currency: "THB",
                              }).format(payment.amount || 0)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            ผลัดการฝึกงาน: {payment.calendar_name || "ไม่ระบุ"}{" "}
                            ({payment.semester || "ไม่ระบุ"}/
                            {payment.year || "ไม่ระบุ"})
                          </p>
                          {payment.detail && (
                            <p className="text-sm text-gray-600 mt-1">
                              {payment.detail}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {payment.file_attachment && (
                            <a
                              href={payment.file_attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="group-hover:bg-blue-50 group-hover:border-blue-200"
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                ดูหลักฐาน
                              </Button>
                            </a>
                          )}
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200"
                          >
                            <ClockIcon className="h-3 w-3 mr-1" />
                            ชำระแล้ว
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
