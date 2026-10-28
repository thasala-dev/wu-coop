"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Eye as EyeIcon,
  ClipboardCheck as ClipboardCheckIcon,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

const groupLabels: Record<string, string> = {
  CARE: "CARE",
  SCI: "SCI",
  SOCIAL_CARE: "SOCIAL CARE",
};

const groupColors: Record<string, string> = {
  CARE: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  SCI: "bg-green-50 text-green-700 hover:bg-green-50",
  SOCIAL_CARE: "bg-purple-50 text-purple-700 hover:bg-purple-50",
};

export default function AdminEvaluationsForm() {
  const [loading, setLoading] = useState(true);
  const [formList, setFormList] = useState<any[]>([]);
  const [typeList, setTypeList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [formResponse, typeResponse] = await Promise.all([
      fetch(`/api/evaluations_form`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      fetch(`/api/evaluations_type`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);
    const [formRes, typeRes] = await Promise.all([
      formResponse.json(),
      typeResponse.json(),
    ]);
    if (formRes.success) {
      setFormList(formRes.data);
    }
    if (typeRes.success) {
      setTypeList(typeRes.data);
    }
    setLoading(false);
  }

  // กลุ่มแบบประเมิน (evaluations_type) ที่เลือกใช้แบบฟอร์มนี้
  const getMatchedTypes = (formId: any) => {
    return typeList.filter(
      (type: any) =>
        Array.isArray(type.form) &&
        type.form.some((id: any) => String(id) === String(formId)),
    );
  };

  // กรองรายการตาม tab และคำค้นหา (ค้นจากชื่อแบบฟอร์มและชื่อกลุ่มแบบประเมิน)
  const getFilteredForms = () => {
    const keyword = search.trim().toLowerCase();
    return formList.filter((item: any) => {
      if (activeTab === "unmatched") {
        if (getMatchedTypes(item.id).length > 0) return false;
      } else if (activeTab !== "all" && item.group !== activeTab) {
        return false;
      }
      if (!keyword) return true;
      return [
        item.name,
        item.short_name,
        ...getMatchedTypes(item.id).map((type: any) => type.name),
      ]
        .filter(Boolean)
        .some((text: string) => text.toLowerCase().includes(keyword));
    });
  };

  const getGroupCount = (group: string) => {
    if (group === "all") {
      return formList.length;
    }
    return formList.filter((item: any) => item.group === group).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="evaluations_form" userType="admin" />

          <div className="md:col-span-4">
            <div className="mb-6">
              <h1 className="text-xl font-bold">แบบฟอร์มการประเมิน</h1>
              <p className="text-gray-500">
                แสดงแบบฟอร์มการประเมินทั้งหมดในระบบ
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  ทั้งหมด
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">
                    {getGroupCount("all")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="CARE">
                  CARE
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium">
                    {getGroupCount("CARE")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="SCI">
                  SCI
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium">
                    {getGroupCount("SCI")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="SOCIAL_CARE">
                  SOCIAL CARE
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-xs font-medium">
                    {getGroupCount("SOCIAL_CARE")}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="unmatched">
                  ยังไม่ถูกใช้
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">
                    {
                      formList.filter(
                        (item: any) => getMatchedTypes(item.id).length === 0,
                      ).length
                    }
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>
                      {activeTab === "all"
                        ? "แบบฟอร์มทั้งหมด"
                        : activeTab === "unmatched"
                          ? "แบบฟอร์มที่ยังไม่ถูกใช้ในกลุ่มแบบประเมินใด"
                          : `แบบฟอร์ม ${groupLabels[activeTab]}`}
                    </CardTitle>
                    <CardDescription>
                      แสดงกลุ่มแบบประเมินที่ใช้แต่ละแบบฟอร์ม
                      คลิกชื่อกลุ่มเพื่อแก้ไขกลุ่มแบบประเมิน
                    </CardDescription>
                  </div>
                  <Input
                    placeholder="ค้นหาชื่อแบบฟอร์มหรือกลุ่มแบบประเมิน"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="md:w-72"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : getFilteredForms().length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      ไม่พบแบบฟอร์ม
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getFilteredForms().map((item: any) => {
                      const matchedTypes = getMatchedTypes(item.id);
                      return (
                        <div
                          key={item.id}
                          className="border rounded-lg p-3 hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <Badge
                                variant="outline"
                                className={
                                  groupColors[item.group] ||
                                  "bg-gray-50 text-gray-700 hover:bg-gray-50"
                                }
                              >
                                {item.short_name}
                              </Badge>
                              <span className="text-sm text-gray-800">
                                {item.name}
                              </span>
                            </div>
                            <Link
                              href={`/admin/evaluations_form/${item.id}`}
                              className="flex items-center gap-1 text-sm text-yellow-600 shrink-0 hover:underline"
                            >
                              <EyeIcon className="h-4 w-4" />
                              ดูตัวอย่าง
                            </Link>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                            <span className="text-gray-500">
                              ใช้ในกลุ่มแบบประเมิน:
                            </span>
                            {matchedTypes.length === 0 ? (
                              <span className="text-gray-400">
                                ยังไม่ถูกใช้
                              </span>
                            ) : (
                              matchedTypes.map((type: any) => (
                                <Link
                                  key={type.id}
                                  href={`/admin/evaluations/${type.id}`}
                                >
                                  <Badge
                                    variant="outline"
                                    className={
                                      "font-normal " +
                                      (groupColors[type.group] ||
                                        "bg-gray-50 text-gray-700 hover:bg-gray-50")
                                    }
                                  >
                                    {type.name}
                                  </Badge>
                                </Link>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
