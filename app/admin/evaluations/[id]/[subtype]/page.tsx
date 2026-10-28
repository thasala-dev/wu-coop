"use client";
import { useParams } from "next/navigation";
import EvaluationFormPreview from "@/components/evaluations/EvaluationFormPreview";

export default function AdminEvaluationFormPreview() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <EvaluationFormPreview
      id={id}
      subtype={params?.subtype as string}
      backHref={`/admin/evaluations/${id}`}
      backLabel="ตัวอย่างการประเมิน"
    />
  );
}
