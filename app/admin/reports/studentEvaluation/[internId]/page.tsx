"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/loading";
import EvaluationList from "@/components/evaluations/EvaluationList";
import { Printer, RectangleHorizontal, RectangleVertical } from "lucide-react";

type Orientation = "portrait" | "landscape";

// ขนาดกระดาษ A4 และระยะขอบ (มม.) ใช้ทั้งตอนแสดงบนจอและตอนพิมพ์ เพื่อให้ได้หน้าตาเดียวกัน
const PAGE_SIZE = {
  portrait: { width: 210, height: 297 },
  landscape: { width: 297, height: 210 },
};
const PAGE_MARGIN = 12;

const formatDate = (date: string) =>
  date
    ? new Date(date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

// ย่อเนื้อหาที่กว้างเกินหน้ากระดาษให้พอดีความกว้าง (เช่น ตารางหลายคอลัมน์)
function FitToWidth({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const previous = inner.style.zoom;
      inner.style.zoom = "1";
      const needed = inner.scrollWidth;
      inner.style.zoom = previous;
      const next = Math.min(1, outer.clientWidth / needed);
      setZoom((current) => (Math.abs(current - next) > 0.01 ? next : current));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="relative">
      {zoom < 1 && (
        <div className="print:hidden absolute -top-5 right-0 text-xs text-gray-400">
          ย่อเหลือ {Math.round(zoom * 100)}% ให้พอดีหน้ากระดาษ
        </div>
      )}
      <div ref={innerRef} style={{ zoom }}>
        {children}
      </div>
    </div>
  );
}

// รูปแบบเอกสาร: ซ่อนหน้าตาช่องกรอกของแบบฟอร์ม เหลือเฉพาะคำตอบ
// ใช้ CSS ครอบทุกแบบฟอร์ม จึงไม่ต้องแก้ไฟล์แบบฟอร์มทีละไฟล์
const DOCUMENT_STYLE = `
  /* radio: ซ่อนตัวเลือกที่ไม่ได้เลือก และวงกลม เหลือเฉพาะข้อความของตัวเลือกที่เลือก */
  .report-doc [role="radio"],
  .report-doc input[type="radio"] { display: none !important; }
  .report-doc :is(div, label):not([role="radiogroup"]):has(> [role="radio"][data-state="unchecked"]),
  .report-doc :is(div, label):not([role="radiogroup"]):has(> input[type="radio"]:not(:checked)) {
    display: none !important;
  }

  /* radio ที่วางในช่องตารางโดยไม่มีข้อความกำกับ (ใช้หัวคอลัมน์บอกความหมาย):
     ช่องที่เลือกแสดง ✓ ช่องที่ไม่เลือกเว้นว่าง */
  .report-doc [role="radiogroup"] > [role="radio"] {
    display: inline-block !important;
    border: 0 !important;
    box-shadow: none !important;
    background: none;
  }
  .report-doc [role="radiogroup"] > [role="radio"] > * { display: none; }
  .report-doc [role="radiogroup"] > [role="radio"][data-state="checked"] {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111827' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E") center / contain no-repeat !important;
  }
  .report-doc :is(div, label):has(> [role="radio"][data-state="checked"]),
  .report-doc :is(div, label):has(> [role="radio"][data-state="checked"]) label,
  .report-doc :is(div, label):has(> input[type="radio"]:checked) {
    font-weight: 600;
    color: #111827 !important;
  }

  /* checkbox: ติ๊กแล้วแสดงเครื่องหมาย ✓ ไม่ติ๊กเว้นว่างและข้อความเป็นสีจาง */
  .report-doc input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    border: 0;
    background: none;
  }
  .report-doc input[type="checkbox"]:checked {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111827' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E") center / contain no-repeat;
  }
  .report-doc :is(div, label):has(> input[type="checkbox"]:not(:checked)) {
    color: #9ca3af;
  }

  /* ช่องข้อความ ตัวเลข และ select: เอากรอบออก แสดงเป็นข้อความธรรมดา */
  .report-doc input:not([type="checkbox"]):not([type="radio"]),
  .report-doc textarea,
  .report-doc select,
  .report-doc [role="combobox"] {
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
    padding: 0 !important;
    min-height: 0 !important;
    height: auto !important;
    resize: none;
    -webkit-appearance: none;
    appearance: none;
    -moz-appearance: textfield;
    color: #111827;
  }
  .report-doc textarea { field-sizing: content; overflow: visible; }
  .report-doc input::-webkit-outer-spin-button,
  .report-doc input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .report-doc ::placeholder { color: transparent !important; }
  .report-doc [role="combobox"] svg { display: none; }
`;

// แสดงแบบฟอร์มพร้อมคำตอบที่บันทึกไว้ (อ่านอย่างเดียว)
function FilledForm({
  item,
  documentStyle,
}: {
  item: any;
  documentStyle: boolean;
}) {
  const form = useForm({
    defaultValues: {
      result: item.result || {},
    },
  });

  return (
    <Form {...form}>
      {/* กันไม่ให้แก้ไขคำตอบในหน้ารายงาน */}
      <div
        className={"pointer-events-none " + (documentStyle ? "report-doc" : "")}
      >
        <EvaluationList
          form={form}
          subtype={String(item.form_id)}
          type={String(item.type_id)}
          isSubmit={false}
          isClick={0}
          setFormValidated={() => {}}
        />
      </div>
    </Form>
  );
}

export default function StudentEvaluationReport() {
  const params = useParams();
  const internId = params?.internId as string;
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [forms, setForms] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [showPending, setShowPending] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [documentStyle, setDocumentStyle] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(`/api/report/studentEvaluation/${internId}`);
      const res = await response.json();
      if (res.success) {
        setStudent(res.data);
        setForms(res.forms || []);
      } else {
        setError(res.message || "ไม่สามารถโหลดข้อมูลได้");
      }
    } catch (e) {
      setError("ไม่สามารถโหลดข้อมูลได้");
    }
    setLoading(false);
  }

  if (loading) return <Loading />;

  if (error || !student) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || "ไม่พบข้อมูล"}
      </div>
    );
  }

  const submittedForms = forms.filter((item: any) => item.result_id);
  const printedForms = showPending ? forms : submittedForms;
  const page = PAGE_SIZE[orientation];
  // ข้อความท้ายกระดาษ (escape เครื่องหมายคำพูดสำหรับใช้ใน CSS content)
  const footerText = `${student.fullname} (${student.student_id})`.replace(
    /["\\]/g,
    "",
  );

  return (
    <div className="bg-gray-200 min-h-screen print:bg-white">
      <style>{`
        .a4-page {
          width: ${page.width}mm;
          min-height: ${page.height}mm;
          padding: ${PAGE_MARGIN}mm;
          margin: 0 auto 16px;
          background: white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
          box-sizing: border-box;
        }
        .a4-page table tr { break-inside: avoid; }
        ${DOCUMENT_STYLE}
        @media print {
          @page {
            size: A4 ${orientation};
            margin: ${PAGE_MARGIN}mm;
            @bottom-left {
              content: "${footerText}";
              font-size: 8pt;
              color: #6b7280;
            }
            @bottom-right {
              content: "หน้า " counter(page) " / " counter(pages);
              font-size: 8pt;
              color: #6b7280;
            }
          }
          html, body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .a4-page {
            width: auto;
            min-height: 0;
            padding: 0;
            margin: 0;
            box-shadow: none;
            break-after: page;
          }
          .a4-page:last-child { break-after: auto; }
          textarea { field-sizing: content; overflow: visible; }
        }
      `}</style>

      {/* แถบเครื่องมือ (ไม่พิมพ์) */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="font-medium">
            รายงานการประเมิน: {student.fullname}
          </div>
          <div className="flex items-center gap-1 ml-auto rounded-md border p-0.5">
            <Button
              variant={orientation === "portrait" ? "default" : "ghost"}
              size="sm"
              className="h-7"
              onClick={() => setOrientation("portrait")}
            >
              <RectangleVertical className="h-4 w-4 mr-1" />
              A4 แนวตั้ง
            </Button>
            <Button
              variant={orientation === "landscape" ? "default" : "ghost"}
              size="sm"
              className="h-7"
              onClick={() => setOrientation("landscape")}
            >
              <RectangleHorizontal className="h-4 w-4 mr-1" />
              A4 แนวนอน
            </Button>
          </div>
          <div className="flex items-center gap-1 rounded-md border p-0.5">
            <Button
              variant={documentStyle ? "default" : "ghost"}
              size="sm"
              className="h-7"
              onClick={() => setDocumentStyle(true)}
            >
              แสดงเฉพาะคำตอบ
            </Button>
            <Button
              variant={!documentStyle ? "default" : "ghost"}
              size="sm"
              className="h-7"
              onClick={() => setDocumentStyle(false)}
            >
              แสดงแบบฟอร์มเดิม
            </Button>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showPending}
              onChange={(e) => setShowPending(e.target.checked)}
            />
            แสดงแบบฟอร์มที่ยังไม่ประเมิน
          </label>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            พิมพ์ / บันทึกเป็น PDF
          </Button>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-2 text-xs text-gray-500">
          ในหน้าต่างพิมพ์ให้เลือกขนาดกระดาษ A4 และปิดตัวเลือก
          &quot;ส่วนหัวและส่วนท้าย (Headers and footers)&quot;
          เพื่อให้ได้เอกสารตรงตามตัวอย่างนี้
        </div>
      </div>

      <div className="py-6 print:py-0 overflow-x-auto">
        {/* หน้าสรุป */}
        <section className="a4-page">
          <h1 className="text-xl font-bold text-center mb-4">
            รายงานผลการประเมินนักศึกษารายบุคคล
          </h1>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
            <div>
              <span className="text-gray-500">ชื่อ-นามสกุล: </span>
              <span className="font-semibold">{student.fullname}</span>
            </div>
            <div>
              <span className="text-gray-500">รหัสนักศึกษา: </span>
              <span className="font-semibold">{student.student_id}</span>
            </div>
            <div>
              <span className="text-gray-500">แหล่งฝึก: </span>
              <span className="font-semibold">{student.company_name}</span>
            </div>
            <div>
              <span className="text-gray-500">ผลัดการฝึก: </span>
              <span className="font-semibold">
                {student.calendar_name} ({student.semester}/{student.year})
              </span>
            </div>
            <div>
              <span className="text-gray-500">ช่วงเวลา: </span>
              <span className="font-semibold">
                {formatDate(student.start_date)} -{" "}
                {formatDate(student.end_date)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">อาจารย์ที่ปรึกษา: </span>
              <span className="font-semibold">
                {student.advisor_name || "-"}
              </span>
            </div>
          </div>

          <h2 className="font-semibold mb-2 text-sm">
            สรุปสถานะการประเมิน (ประเมินแล้ว {submittedForms.length}/
            {forms.length} ฉบับ)
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2 text-left w-10">#</th>
                <th className="border p-2 text-left">แบบประเมิน</th>
                <th className="border p-2 text-left">ผู้ประเมิน</th>
                <th className="border p-2 text-left">วันที่ประเมิน</th>
                <th className="border p-2 text-left">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((item: any, index: number) => (
                <tr key={`${item.type_id}-${item.form_id}`}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    <div className="font-medium">
                      [{item.short_name}] {item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.type_name}
                    </div>
                  </td>
                  <td className="border p-2">{item.evaluator || "-"}</td>
                  <td className="border p-2">
                    {formatDate(item.evaluation_date)}
                  </td>
                  <td className="border p-2">
                    {item.result_id ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        ประเมินแล้ว
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700"
                      >
                        ยังไม่ประเมิน
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* แบบฟอร์มแต่ละฉบับ เริ่มหน้าใหม่ทุกฉบับ */}
        {printedForms.map((item: any) => (
          <section key={`${item.type_id}-${item.form_id}`} className="a4-page">
            <div className="flex justify-between items-start gap-4 border-b pb-3 mb-6">
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <div className="text-sm text-gray-600">
                  {item.type_name} · {student.fullname} ({student.student_id})
                </div>
              </div>
              <div className="border border-gray-800 px-3 py-1 font-semibold text-sm shrink-0">
                {item.short_name}
              </div>
            </div>

            {item.result_id ? (
              <>
                <FitToWidth>
                  <FilledForm item={item} documentStyle={documentStyle} />
                </FitToWidth>
                <div className="grid grid-cols-2 gap-4 mt-6 text-sm break-inside-avoid">
                  <div>
                    <span className="text-gray-500">
                      ชื่ออาจารย์ประจำแหล่งฝึก:{" "}
                    </span>
                    <span className="font-semibold">{item.evaluator}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">วันที่ประเมิน: </span>
                    <span className="font-semibold">
                      {formatDate(item.evaluation_date)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8 border border-dashed rounded-md">
                ยังไม่ได้รับการประเมิน
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
