"use client";

import { memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import Sidebar from "@/components/sidebar";
import EvaluationList from "@/components/evaluations/EvaluationList";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Calendar = {
  id: number; name: string; semester: number; year: number;
  active_id: number; start_date: string;
};
type EvaluationType = { id: number; name: string };
type EvaluationForm = { id: number; name: string; short_name: string | null; seq: number };
type Student = { id: number; fullname: string; student_id: string; company_name: string | null };
type SavedResult = {
  intern_id: number; form_id: number; type_id: number;
  result: Record<string, unknown> | null;
  evaluator: string | null; evaluation_date: string | null;
};
type SummaryGroup = { type: EvaluationType; forms: EvaluationForm[]; students: Student[] };
type Summary = {
  calendars: Calendar[]; types: EvaluationType[]; groups: SummaryGroup[];
  results: SavedResult[];
  calendarId: number | null; typeId: number | "all";
};
const resultKey = (item: { type_id: number; intern_id: number; form_id: number }) => `${item.type_id}-${item.intern_id}-${item.form_id}`;
const formLabel = (form: EvaluationForm) => form.short_name || form.name;

// Mount only a small number of forms; read their own score output without duplicating formulas.
const ScoreReader = memo(function ScoreReader({ item, onScore }: {
  item: SavedResult;
  onScore: (key: string, text: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const form = useForm({ defaultValues: { result: item.result || {} } });

  useEffect(() => {
    let finished = false;
    let secondFrame = 0;
    const read = (final: boolean) => {
      if (finished) return;
      const el = container.current?.querySelector<HTMLElement>("[data-summary-score]");
      const value = el?.textContent?.trim() || "";
      const hasScore = value !== "" && !/^[-_\s]+$/.test(value);
      if (!hasScore && !final) return;
      finished = true;
      const unit = el?.dataset.summaryScoreUnit?.trim();
      onScore(resultKey(item), hasScore ? [value, unit].filter(Boolean).join(" ") : "ประเมินแล้ว");
    };
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => read(false));
    });
    // Also advances the queue for forms without a score, or when animation frames are throttled.
    const timeout = window.setTimeout(() => read(true), 300);
    return () => {
      finished = true;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      window.clearTimeout(timeout);
    };
  }, [item, onScore]);

  return (
    <div ref={container}>
      <Form {...form}>
        <EvaluationList
          form={form}
          subtype={String(item.form_id)}
          type={String(item.type_id)}
          isSubmit={false}
          isClick={0}
          setFormValidated={() => {}}
        />
      </Form>
    </div>
  );
});

function SummaryMatrix({ data }: { data: Summary }) {
  const [scores, setScores] = useState<Record<string, string>>({});
  const results = useMemo(() => {
    const groupIds = new Map(data.groups.map((group) => [String(group.type.id), {
      formIds: new Set(group.forms.map((form) => String(form.id))),
      studentIds: new Set(group.students.map((student) => String(student.id))),
    }]));
    const unique = new Map<string, SavedResult>();
    for (const item of data.results) {
      // API orders newest first; a duplicate result contributes only one visible cell.
      const group = groupIds.get(String(item.type_id));
      if (group?.formIds.has(String(item.form_id)) && group.studentIds.has(String(item.intern_id)) && !unique.has(resultKey(item))) {
        unique.set(resultKey(item), item);
      }
    }
    return unique;
  }, [data]);
  const onScore = useCallback((key: string, text: string) => {
    setScores((current) => Object.hasOwn(current, key) ? current : { ...current, [key]: text });
  }, []);
  const pending = Array.from(results.values()).filter((item) => !Object.hasOwn(scores, resultKey(item)));
  const done = pending.length === 0;
  const cellText = (typeId: number, student: Student, form: EvaluationForm) => {
    const key = resultKey({ type_id: typeId, intern_id: student.id, form_id: form.id });
    return !results.has(key) ? "ยังไม่ประเมิน" : scores[key] ?? "กำลังคำนวณ…";
  };
  const exportExcel = () => {
    if (!done) return;
    const workbook = XLSX.utils.book_new();
    const sheetNames = new Set<string>();
    for (const group of data.groups) {
      const rows = [
        ["ชื่อ-นามสกุล", "รหัสนักศึกษา", "แหล่งฝึก", ...group.forms.map(formLabel)],
        ...group.students.map((student) => [
          student.fullname,
          student.student_id,
          student.company_name || "-",
          ...group.forms.map((form) => cellText(group.type.id, student, form)),
        ]),
      ];
      const baseName = group.type.name.replace(/[\[\]:*?\/\\]/g, "").trim() || `ชุด ${group.type.id}`;
      // Excel also rejects leading/trailing apostrophes; keep every generated name valid.
      const truncateName = (name: string, length: number) => name.slice(0, length).replace(/^'+|'+$/g, "");
      const stem = data.typeId === "all" ? truncateName(baseName, 31) || `ชุด ${group.type.id}` : "Sheet1";
      let sheetName = stem;
      let copy = 2;
      while (sheetNames.has(sheetName.toLowerCase())) {
        const suffix = ` (${copy++})`;
        sheetName = `${truncateName(stem, 31 - suffix.length)}${suffix}`;
      }
      sheetNames.add(sheetName.toLowerCase());
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), sheetName);
    }
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const name = data.typeId === "all" ? "ทั้งหมด" : data.groups[0]?.type.name || "";
    // The existing dependency has no installed TypeScript declarations.
    const { saveAs } = require("file-saver") as { saveAs: (data: Blob, filename: string) => void };
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), `สรุปผลประเมิน-${name.replace(/[\\/:*?"<>|]/g, "-")}.xlsx`);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm text-muted-foreground">
          {!done ? `กำลังคำนวณคะแนน ${results.size - pending.length}/${results.size}` : `คำนวณคะแนนเสร็จแล้ว ${results.size}/${results.size}`}
        </p>
        <Button onClick={exportExcel} disabled={!done || data.groups.length === 0}>ดาวน์โหลด Excel</Button>
      </div>
      <div className="space-y-8">
        {data.groups.map((group) => (
          <section key={group.type.id} aria-labelledby={`summary-type-${group.type.id}`} className="space-y-3">
            <div>
              <h2 id={`summary-type-${group.type.id}`} className="text-lg font-semibold">{group.type.name}</h2>
              <p className="text-sm text-muted-foreground">นักศึกษา {group.students.length} คน</p>
            </div>
            <div className="max-w-full overflow-x-auto rounded-md border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th scope="col" className="sticky left-0 z-10 min-w-48 border-b bg-slate-100 p-3 text-left">ชื่อ-นามสกุล</th>
                    <th scope="col" className="whitespace-nowrap border-b border-l p-3 text-left">รหัสนักศึกษา</th>
                    <th scope="col" className="min-w-48 border-b border-l p-3 text-left">แหล่งฝึก</th>
                    {group.forms.map((form) => (
                      <th key={form.id} scope="col" title={form.name} className="min-w-40 border-b border-l p-3 text-center">{formLabel(form)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.students.map((student) => (
                    <tr key={student.id}>
                      <th scope="row" className="sticky left-0 z-10 border-b bg-white p-3 text-left font-medium">
                        {student.fullname}
                      </th>
                      <td className="whitespace-nowrap border-b border-l p-3">{student.student_id}</td>
                      <td className="border-b border-l p-3">{student.company_name || "-"}</td>
                      {group.forms.map((form) => (
                        <td key={form.id} className={`whitespace-nowrap border-b border-l p-3 text-center ${!results.has(resultKey({ type_id: group.type.id, intern_id: student.id, form_id: form.id })) ? "text-red-500" : "text-gray-700"}`}>
                          {cellText(group.type.id, student, form)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {group.students.length === 0 && (
                    <tr><td colSpan={group.forms.length + 3} className="p-8 text-center text-muted-foreground">ไม่พบนักศึกษาในชุดประเมินที่เลือก</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        {data.groups.length === 0 && <p className="p-8 text-center text-muted-foreground">ไม่พบชุดประเมินในผลัดฝึกงานที่เลือก</p>}
      </div>
      <div aria-hidden="true" inert style={{ position: "absolute", left: -100000, top: 0, width: 1200, visibility: "hidden", pointerEvents: "none" }}>
        {pending.slice(0, 10).map((item) => <ScoreReader key={resultKey(item)} item={item} onScore={onScore} />)}
      </div>
    </>
  );
}

function SummaryPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const calendarQuery = params.get("calendarId") || "";
  const typeQuery = params.get("typeId") || "";
  const requestKey = JSON.stringify([calendarQuery, typeQuery]);
  const [response, setResponse] = useState<{ key: string; data: Summary } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const current = response?.key === requestKey ? response.data : null;
  const busy = loading || !current;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const query = new URLSearchParams();
    if (calendarQuery) query.set("calendarId", calendarQuery);
    if (typeQuery) query.set("typeId", typeQuery);
    async function load() {
      try {
        const res = await fetch(`/api/admin/evaluations/summary?${query}`, { signal: controller.signal });
        const body = await res.json();
        if (!res.ok || !body.success) throw new Error(body.message || "ไม่สามารถโหลดข้อมูลได้");
        if (!controller.signal.aborted) setResponse({ key: requestKey, data: body });
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "ไม่สามารถโหลดข้อมูลได้");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [calendarQuery, typeQuery, requestKey, retry]);

  const changeFilter = (calendarId: string, typeId?: string) => {
    const query = new URLSearchParams();
    if (calendarId) query.set("calendarId", calendarId);
    if (typeId) query.set("typeId", typeId);
    router.replace(`/admin/evaluations-follow-up/summary?${query}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto max-w-full p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <Sidebar activePage="evaluations-follow-up" userType="admin" />
          <div className="min-w-0 md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">สรุปคะแนนทุกคน</CardTitle>
                <CardDescription>สรุปผลประเมินนักศึกษาตามผลัดฝึกงานและชุดประเมิน</CardDescription>
                <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                  <div className="min-w-0 flex-1 space-y-1">
                    <label htmlFor="summary-calendar" className="text-sm font-medium">ผลัดฝึกงาน</label>
                    <Select value={String(current?.calendarId ?? calendarQuery)} onValueChange={(value) => changeFilter(value)}>
                      <SelectTrigger id="summary-calendar"><SelectValue placeholder="เลือกผลัดฝึกงาน" /></SelectTrigger>
                      <SelectContent>
                        {(response?.data.calendars || []).map((cal) => <SelectItem key={cal.id} value={String(cal.id)}>{cal.name} ปีการศึกษา {cal.semester}/{cal.year}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <label htmlFor="summary-type" className="text-sm font-medium">ชุดประเมิน</label>
                    <Select disabled={busy || !current?.types.length} value={String(current?.typeId ?? "all")} onValueChange={(value) => changeFilter(String(current?.calendarId ?? calendarQuery), value)}>
                      <SelectTrigger id="summary-type"><SelectValue placeholder="เลือกชุดประเมิน" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทั้งหมด</SelectItem>
                        {(current?.types || []).map((type) => <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div role="alert" className="space-y-3 text-red-600"><p>{error}</p><Button variant="outline" onClick={() => setRetry((value) => value + 1)}>ลองอีกครั้ง</Button></div>
                ) : busy ? (
                  <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-muted-foreground">กำลังโหลดข้อมูล…</p><Button disabled>ดาวน์โหลด Excel</Button></div>
                ) : <SummaryMatrix key={requestKey} data={current} />}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SummaryPage() {
  return <Suspense fallback={<p className="p-8 text-muted-foreground">กำลังโหลดข้อมูล…</p>}><SummaryPageContent /></Suspense>;
}
