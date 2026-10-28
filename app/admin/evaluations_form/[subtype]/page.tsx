"use client";
import { useParams } from "next/navigation";
import EvaluationFormPreview from "@/components/evaluations/EvaluationFormPreview";

export default function AdminEvaluationsFormPreview() {
  const params = useParams();

  // ใช้ id = 0 เพราะเป็นการแสดงตัวอย่างแบบฟอร์ม ไม่ผูกกับนักศึกษาคนใด
  return (
    <EvaluationFormPreview
      id="0"
      subtype={params?.subtype as string}
      activePage="evaluations_form"
      backHref="/admin/evaluations_form"
      backLabel="แบบฟอร์มการประเมินทั้งหมด"
    />
  );
}
