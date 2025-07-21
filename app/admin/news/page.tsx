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

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (role === "all") {
      setFilterData(data);
    } else if (role === "active") {
      setFilterData(data.filter((item: any) => item.status_id === 1));
    } else if (role === "inactive") {
      setFilterData(data.filter((item: any) => item.status_id === 2));
    } else if (role === "pending") {
      setFilterData(data.filter((item: any) => item.status_id === 0));
    }
  }, [data, role]);

  async function fetchData() {
    const response = await fetch("/api/admin", {
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
    setAdminToDelete(id);
    setShowDeleteDialog(true);
  }

  // Handle delete after confirmation
  async function handleDeleteConfirmed() {
    if (!adminToDelete) return;

    setLoading(true);
    setShowDeleteDialog(false);

    const response = await fetch(`/api/admin/${adminToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    if (res.success) {
      // Refresh data after successful deletion
      fetchData();
    } else {
      alert("ไม่สามารถลบข้อมูลได้: " + res.message);
      setLoading(false);
    }

    // Reset admin to delete
    setAdminToDelete(null);
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
        <Sidebar activePage="news" userType="admin" />
        {loading && <Loading />}

        <div className="md:col-span-4 space-y-4">
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      จัดการข้อมูลผู้ดูแลระบบ
                    </CardTitle>
                    <CardDescription>รายชื่อผู้ดูแลระบบ</CardDescription>
                  </div>
                  <a href={`/admin/news/add`}>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      สร้างบัญชีใหม่
                    </Button>
                  </a>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-grow">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="ค้นหาชื่อผู้ดูแลระบบ.."
                      className="pl-8"
                      value={search}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        if (value.trim() === "") {
                          setFilterData(
                            role === "all"
                              ? data
                              : data.filter((item: any) => {
                                  if (role === "active")
                                    return item.status_id === 1;
                                  if (role === "inactive")
                                    return item.status_id === 2;
                                  if (role === "pending")
                                    return item.status_id === 0;
                                  return true;
                                })
                          );
                        } else {
                          setFilterData(
                            (role === "all"
                              ? data
                              : data.filter((item: any) => {
                                  if (role === "active")
                                    return item.status_id === 1;
                                  if (role === "inactive")
                                    return item.status_id === 2;
                                  if (role === "pending")
                                    return item.status_id === 0;
                                  return true;
                                })
                            ).filter((item: any) =>
                              item.fullname
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
                    <TabsTrigger value="active">
                      ใช้งาน (
                      {data.filter((c: any) => c.status_id === 1).length})
                    </TabsTrigger>
                    <TabsTrigger value="inactive">
                      ไม่ใช้งาน (
                      {data.filter((c: any) => c.status_id === 2).length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      รอดำเนินการ (
                      {data.filter((c: any) => c.status_id === 0).length})
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="my-4 overflow-x-auto">
                  <TableList
                    meta={[
                      {
                        key: "id",
                        content: "รายการ",
                        render: (row: any) => {
                          return (
                            <div className="flex items-center gap-3">
                              <CustomAvatar
                                id={`admin${row.username}`}
                                image={row.image}
                                size="8"
                              />
                              <div>
                                <div>{row.fullname}</div>
                                <div className="text-sm text-gray-500">
                                  Username: {row.username}
                                </div>
                              </div>
                            </div>
                          );
                        },
                      },
                      {
                        key: "status_id",
                        className: "text-center",
                        content: "สถานะ",
                        render: (row: any) => {
                          return renderStatusBadge(String(row.status_id));
                        },
                      },
                      {
                        key: "last_login",
                        content: "ใช้งานล่าสุด",
                        className: "text-center",
                        width: "150px",
                        render: (row: any) => {
                          return (
                            <div className="text-sm text-gray-500">
                              {row.last_login ? (
                                new Date(row.last_login).toLocaleString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  }
                                )
                              ) : (
                                <i>ไม่เคยใช้งาน</i>
                              )}
                            </div>
                          );
                        },
                      },
                      {
                        key: "actions",
                        content: "จัดการ",
                        sort: false,
                        width: "150px",
                        render: (row: any) => {
                          return (
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/news/${row.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              <Link href={`/admin/news/edit/${row.id}`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </Link>{" "}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ยืนยันการลบผู้ดูแลระบบ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบผู้ดูแลระบบนี้ใช่หรือไม่?
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirmed}
              className="bg-red-600 hover:bg-red-700"
            >
              ยืนยันการลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
