"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye as EyeIcon,
  ClipboardCheck as ClipboardCheckIcon,
  GripVertical as GripVerticalIcon,
  Pencil as PencilIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  Search as SearchIcon,
  X as XIcon,
  Loader2 as LoaderIcon,
  Plus as PlusIcon,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";

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

const defaultColor = "bg-gray-50 text-gray-700 hover:bg-gray-50";

// จำนวนกลุ่มแบบประเมินที่แสดงก่อนกด "ดูทั้งหมด"
const MATCHED_PREVIEW_COUNT = 3;

export default function AdminEvaluationsForm() {
  const [loading, setLoading] = useState(true);
  const [formList, setFormList] = useState<any[]>([]);
  const [typeList, setTypeList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<any>>(new Set());
  const [dragId, setDragId] = useState<any>(null);
  const [overId, setOverId] = useState<any>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    short_name: "",
    group: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { toast } = useToast();

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

  const keyword = search.trim().toLowerCase();

  // กรองรายการตาม tab และคำค้นหา (ค้นจากชื่อแบบฟอร์มและชื่อกลุ่มแบบประเมิน)
  const getFilteredForms = () => {
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

  const getTabCount = (tab: string) => {
    if (tab === "all") return formList.length;
    if (tab === "unmatched") {
      return formList.filter(
        (item: any) => getMatchedTypes(item.id).length === 0,
      ).length;
    }
    return formList.filter((item: any) => item.group === tab).length;
  };

  // เรียงลำดับได้เมื่อไม่ได้ค้นหา เพื่อไม่ให้สับสนกับรายการที่ถูกซ่อน
  const canReorder = !keyword && !savingOrder;

  // ย้ายรายการ sourceId ไปตำแหน่ง toIndex ของรายการที่แสดงอยู่
  // แล้วใส่กลับตำแหน่งเดิมในลำดับทั้งหมด และกำหนด seq ใหม่เป็น 1..N
  const moveItem = async (sourceId: any, toIndex: number) => {
    const visible = getFilteredForms();
    const from = visible.findIndex((item: any) => item.id === sourceId);
    if (from === -1 || toIndex < 0 || toIndex >= visible.length) return;
    if (from === toIndex) return;

    const reordered = [...visible];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(toIndex, 0, moved);

    const visibleIds = new Set(visible.map((item: any) => item.id));
    let index = 0;
    const newList = formList
      .map((item: any) => (visibleIds.has(item.id) ? reordered[index++] : item))
      .map((item: any, seq: number) => ({ ...item, seq: seq + 1 }));

    const previousList = formList;
    setFormList(newList);
    setSavingOrder(true);
    const response = await fetch(`/api/evaluations_form`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: newList.map((item: any) => ({ id: item.id, seq: item.seq })),
      }),
    });
    const res = await response.json().catch(() => ({ success: false }));
    if (!res.success) {
      setFormList(previousList);
      toast({
        title: "ไม่สามารถบันทึกลำดับได้",
        description: res.message || "เกิดข้อผิดพลาด",
        variant: "destructive",
      });
    }
    setSavingOrder(false);
  };

  const handleDrop = (targetId: any) => {
    const sourceId = dragId;
    setDragId(null);
    setOverId(null);
    if (sourceId === null || sourceId === targetId) return;
    const toIndex = getFilteredForms().findIndex(
      (item: any) => item.id === targetId,
    );
    moveItem(sourceId, toIndex);
  };

  const toggleExpanded = (id: any) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setEditForm({
      name: item.name || "",
      short_name: item.short_name || "",
      group: item.group || "",
    });
  };

  // เพิ่มแบบฟอร์มใหม่: ใช้ dialog เดียวกับการแก้ไข โดย editing ไม่มี id
  const openCreate = () => {
    setEditing({});
    setEditForm({
      name: "",
      short_name: "",
      group: groupLabels[activeTab] ? activeTab : "",
    });
  };

  const isCreating = editing !== null && editing.id === undefined;

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.short_name || !editForm.group) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }
    setSavingEdit(true);
    const response = await fetch(
      isCreating
        ? `/api/evaluations_form`
        : `/api/evaluations_form/${editing.id}`,
      {
        method: isCreating ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      },
    );
    const res = await response.json().catch(() => ({ success: false }));
    if (res.success) {
      if (isCreating) {
        // แบบฟอร์มใหม่ต่อท้ายลำดับ
        setFormList((prev) => [...prev, res.data]);
        setSearch("");
        if (activeTab !== "all" && activeTab !== res.data.group) {
          setActiveTab("all");
        }
      } else {
        setFormList((prev) =>
          prev.map((item: any) =>
            item.id === editing.id ? { ...item, ...editForm } : item,
          ),
        );
      }
      setEditing(null);
      toast({
        title: isCreating
          ? `เพิ่มแบบฟอร์ม #${res.data.id} เรียบร้อย`
          : "บันทึกข้อมูลแบบฟอร์มเรียบร้อย",
      });
    } else {
      toast({
        title: "ไม่สามารถบันทึกข้อมูลได้",
        description: res.message || "เกิดข้อผิดพลาด",
        variant: "destructive",
      });
    }
    setSavingEdit(false);
  };

  const filteredForms = getFilteredForms();

  const tabs = [
    { value: "all", label: "ทั้งหมด", color: "bg-gray-100" },
    { value: "CARE", label: "CARE", color: "bg-blue-100 text-blue-800" },
    { value: "SCI", label: "SCI", color: "bg-green-100 text-green-800" },
    {
      value: "SOCIAL_CARE",
      label: "SOCIAL CARE",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "unmatched",
      label: "ยังไม่ถูกใช้",
      color: "bg-amber-100 text-amber-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="evaluations_form" userType="admin" />

          <div className="md:col-span-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl font-bold">แบบฟอร์มการประเมิน</h1>
                <p className="text-gray-500 text-sm">
                  ดูตัวอย่าง เพิ่ม แก้ไข
                  และเรียงลำดับแบบฟอร์มการประเมินทั้งหมดในระบบ
                </p>
              </div>
              <Button onClick={openCreate} disabled={loading}>
                <PlusIcon className="h-4 w-4 mr-2" />
                เพิ่มแบบฟอร์ม
              </Button>
            </div>

            <Card className="mb-4">
              <CardContent className="p-4 space-y-3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="flex flex-wrap h-auto justify-start">
                    {tabs.map((tab) => (
                      <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                        <span
                          className={
                            "ml-1.5 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium " +
                            tab.color
                          }
                        >
                          {getTabCount(tab.value)}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="relative md:w-96">
                    <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ค้นหาชื่อแบบฟอร์ม ชื่อย่อ หรือกลุ่มแบบประเมิน"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 pr-8"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        aria-label="ล้างคำค้นหา"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    แสดง {filteredForms.length} จาก {formList.length} รายการ
                    {savingOrder && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                        กำลังบันทึกลำดับ...
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  {keyword ? (
                    <>ล้างคำค้นหาก่อน จึงจะเรียงลำดับได้</>
                  ) : (
                    <>
                      เรียงลำดับโดยลากที่ไอคอน
                      <GripVerticalIcon className="inline h-3.5 w-3.5 mx-0.5" />
                      หรือกดลูกศรขึ้น/ลง ระบบบันทึกให้อัตโนมัติ
                    </>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredForms.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      ไม่พบแบบฟอร์ม
                    </h3>
                    {search && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setSearch("")}
                      >
                        ล้างคำค้นหา
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredForms.map((item: any, index: number) => {
                      const matchedTypes = getMatchedTypes(item.id);
                      const expanded = expandedIds.has(item.id);
                      const shownTypes = expanded
                        ? matchedTypes
                        : matchedTypes.slice(0, MATCHED_PREVIEW_COUNT);
                      const hiddenCount =
                        matchedTypes.length - MATCHED_PREVIEW_COUNT;

                      return (
                        <div
                          key={item.id}
                          ref={(el) => {
                            rowRefs.current[item.id] = el;
                          }}
                          onDragOver={(e) => {
                            if (dragId === null) return;
                            e.preventDefault();
                            if (overId !== item.id) setOverId(item.id);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDrop(item.id);
                          }}
                          className={
                            "flex items-start gap-3 p-3 transition-colors " +
                            (dragId === item.id ? "opacity-40 " : "") +
                            (overId === item.id && dragId !== item.id
                              ? "bg-blue-50 ring-2 ring-inset ring-blue-400"
                              : "hover:bg-gray-50")
                          }
                        >
                          {/* ลากได้เฉพาะที่ไอคอน เพื่อให้คลิกลิงก์และเลือกข้อความได้ตามปกติ */}
                          <div
                            draggable={canReorder}
                            onDragStart={(e) => {
                              setDragId(item.id);
                              e.dataTransfer.effectAllowed = "move";
                              const row = rowRefs.current[item.id];
                              if (row) e.dataTransfer.setDragImage(row, 20, 20);
                            }}
                            onDragEnd={() => {
                              setDragId(null);
                              setOverId(null);
                            }}
                            title={
                              canReorder
                                ? "ลากเพื่อเรียงลำดับ"
                                : "ล้างคำค้นหาก่อนเรียงลำดับ"
                            }
                            className={
                              "flex flex-col items-center pt-0.5 shrink-0 " +
                              (canReorder
                                ? "cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700"
                                : "cursor-not-allowed text-gray-200")
                            }
                          >
                            <GripVerticalIcon className="h-5 w-5" />
                          </div>

                          <div className="w-8 shrink-0 pt-0.5 text-sm text-gray-400 text-right tabular-nums">
                            {formList.findIndex(
                              (form: any) => form.id === item.id,
                            ) + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  groupColors[item.group] || defaultColor
                                }
                              >
                                {item.short_name}
                              </Badge>
                              <Link
                                href={`/admin/evaluations_form/${item.id}`}
                                className="text-sm font-medium text-gray-900 hover:text-blue-700 hover:underline"
                              >
                                {item.name}
                              </Link>
                              <span className="text-xs text-gray-400">
                                #{item.id}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-xs">
                              {matchedTypes.length === 0 ? (
                                <span className="text-amber-600">
                                  ยังไม่ถูกใช้ในกลุ่มแบบประเมินใด
                                </span>
                              ) : (
                                <>
                                  <span className="text-gray-500">ใช้ใน:</span>
                                  {shownTypes.map((type: any) => (
                                    <Link
                                      key={type.id}
                                      href={`/admin/evaluations/${type.id}`}
                                      title="แก้ไขกลุ่มแบบประเมินนี้"
                                    >
                                      <Badge
                                        variant="outline"
                                        className={
                                          "font-normal hover:underline " +
                                          (groupColors[type.group] ||
                                            defaultColor)
                                        }
                                      >
                                        {type.name}
                                      </Badge>
                                    </Link>
                                  ))}
                                  {hiddenCount > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleExpanded(item.id)}
                                      className="text-blue-600 hover:underline"
                                    >
                                      {expanded
                                        ? "ย่อ"
                                        : `+${hiddenCount} กลุ่ม`}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={!canReorder || index === 0}
                              onClick={() => moveItem(item.id, index - 1)}
                              title="เลื่อนขึ้น"
                              aria-label="เลื่อนขึ้น"
                            >
                              <ArrowUpIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={
                                !canReorder ||
                                index === filteredForms.length - 1
                              }
                              onClick={() => moveItem(item.id, index + 1)}
                              title="เลื่อนลง"
                              aria-label="เลื่อนลง"
                            >
                              <ArrowDownIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 ml-1"
                              onClick={() => openEdit(item)}
                            >
                              <PencilIcon className="h-3.5 w-3.5 md:mr-1" />
                              <span className="hidden md:inline">แก้ไข</span>
                            </Button>
                            <Link href={`/admin/evaluations_form/${item.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                              >
                                <EyeIcon className="h-3.5 w-3.5 md:mr-1" />
                                <span className="hidden md:inline">
                                  ดูตัวอย่าง
                                </span>
                              </Button>
                            </Link>
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

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open && !savingEdit) setEditing(null);
        }}
      >
        <DialogContent>
          <form onSubmit={handleSaveEdit}>
            <DialogHeader>
              <DialogTitle>
                {isCreating
                  ? "เพิ่มแบบฟอร์มการประเมิน"
                  : "แก้ไขแบบฟอร์มการประเมิน"}
              </DialogTitle>
              <DialogDescription>
                {isCreating
                  ? "แบบฟอร์มใหม่จะต่อท้ายลำดับ และต้องผูกกับไฟล์ฟอร์มใน EvaluationList ก่อนจึงจะแสดงตัวอย่างได้"
                  : `แบบฟอร์ม #${editing?.id}`}
                {editing && !isCreating && (
                  <>
                    {" · "}
                    <Link
                      href={`/admin/evaluations_form/${editing.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      ดูตัวอย่าง
                    </Link>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="form-name">ชื่อแบบฟอร์ม</Label>
                <Input
                  id="form-name"
                  value={editForm.name}
                  autoFocus
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="form-short-name">ชื่อย่อ</Label>
                  <Input
                    id="form-short-name"
                    value={editForm.short_name}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        short_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-group">กลุ่ม</Label>
                  <select
                    id="form-group"
                    value={editForm.group}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        group: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 border rounded-md text-sm bg-white"
                  >
                    <option value="">เลือกกลุ่ม</option>
                    {Object.entries(groupLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
                disabled={savingEdit}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={savingEdit}>
                {savingEdit && (
                  <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                )}
                บันทึกข้อมูล
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
