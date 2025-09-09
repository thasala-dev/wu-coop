"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect, use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";
import TableList from "@/components/TableList";
import { callDeleteApi } from "@/lib/file-api";

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [advisorToDelete, setAdvisorToDelete] = useState<number | null>(null);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilterData(data);
  }, [data]);

  async function fetchData() {
    const response = await fetch("/api/admin/payments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (res.success) {
      setData(res.data || []);
      setLoading(false);
    }
  }

  // Show delete confirmation dialog
  function confirmDelete(id: number) {
    setAdvisorToDelete(id);
    setShowDeleteDialog(true);
  }

  // Handle delete after confirmation
  async function handleDeleteConfirmed() {
    if (!advisorToDelete) return;

    setLoading(true);
    setShowDeleteDialog(false);

    try {
      // Find the payment record to get file attachment info
      const paymentToDelete = data.find(
        (item: any) => item.id === advisorToDelete
      );

      // Delete file attachment first if exists
      if (paymentToDelete?.file_attachment) {
        try {
          await callDeleteApi(paymentToDelete.file_attachment);
        } catch (fileError) {
          console.error("Error deleting file:", fileError);
          // Continue with payment deletion even if file deletion fails
        }
      }

      // Delete payment record
      const response = await fetch(
        `/api/admin/payments?id=${advisorToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = await response.json();
      if (res.success) {
        // Refresh data after successful deletion
        fetchData();
      } else {
        alert("ไม่สามารถลบข้อมูลได้: " + res.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      setLoading(false);
    }

    // Reset advisor to delete
    setAdvisorToDelete(null);
  }

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "1":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircleIcon className="h-3 w-3 mr-1" /> ใช้งาน
          </Badge>
        );
      case "2":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircleIcon className="h-3 w-3 mr-1" /> ไม่ใช้งาน
          </Badge>
        );
      case "0":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <ClockIcon className="h-3 w-3 mr-1" /> รอดำเนินการ
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Sidebar activePage="payments" userType="admin" />
        {loading && <Loading />}

        <div className="md:col-span-4 space-y-4">
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      จัดการข้อมูลการชำระเงิน
                    </CardTitle>
                    <CardDescription>รายการการชำระเงินทั้งหมด</CardDescription>
                  </div>
                  <a href={`/admin/payments/add`}>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      เพิ่มการชำระเงิน
                    </Button>
                  </a>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-grow">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="ค้นหาข้อมูลการชำระเงิน.."
                      className="pl-8"
                      value={search}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        if (value.trim() === "") {
                          setFilterData(data);
                        } else {
                          setFilterData(
                            data.filter(
                              (item: any) =>
                                item.company_name
                                  ?.toLowerCase()
                                  .includes(value.toLowerCase()) ||
                                item.calendar_name
                                  ?.toLowerCase()
                                  .includes(value.toLowerCase()) ||
                                item.amount?.toString().includes(value) ||
                                item.detail
                                  ?.toLowerCase()
                                  .includes(value.toLowerCase())
                            )
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto mb-1">
                  <TabsList>
                    <TabsTrigger value="all">
                      ทั้งหมด ({data.length})
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="my-4 overflow-x-auto">
                  <TableList
                    meta={[
                      {
                        key: "payment_date",
                        content: "วันที่ชำระ",
                        render: (row: any) => {
                          const date = new Date(row.payment_date);
                          return date.toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          });
                        },
                      },
                      {
                        key: "calendar_name",
                        content: "ผลัดการฝึกงาน",
                        render: (row: any) => {
                          return `${row.calendar_name} (${row.semester}/${row.year})`;
                        },
                      },
                      {
                        key: "company_name",
                        content: "แหล่งฝึกงาน",
                      },
                      {
                        key: "amount",
                        content: "จำนวนเงิน (บาท)",
                        className: "text-end",
                        render: (row: any) => {
                          return parseFloat(row.amount).toLocaleString(
                            "th-TH",
                            {
                              style: "currency",
                              currency: "THB",
                              minimumFractionDigits: 2,
                            }
                          );
                        },
                      },
                      {
                        key: "file_attachment",
                        content: "หลักฐานการชำระเงิน",
                        sort: false,
                        className: "text-center",
                        render: (row: any) => {
                          return row.file_attachment ? (
                            <a
                              href={row.file_attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                ดูหลักฐาน
                              </Button>
                            </a>
                          ) : (
                            "ไม่มีหลักฐาน"
                          );
                        },
                      },
                      {
                        key: "actions",
                        content: "จัดการ",
                        sort: false,
                        width: "80px",
                        render: (row: any) => {
                          return (
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/payments/edit/${row.id}`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => confirmDelete(row.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          );
                        },
                      },
                    ]}
                    data={filterData}
                    loading={loading}
                  />
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบข้อมูล</DialogTitle>
            <DialogDescription>
              คุณแน่ใจหรือว่าต้องการลบข้อมูลการชำระเงินนี้?
              การกระทำนี้ไม่สามารถย้อนคืนได้ และไฟล์แนบจะถูกลบด้วย
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="mr-2"
            >
              ยกเลิก
            </Button>{" "}
            <Button
              variant="destructive"
              onClick={handleDeleteConfirmed}
              disabled={loading}
            >
              {loading ? "กำลังดำเนินการ..." : "ยืนยันการลบ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
