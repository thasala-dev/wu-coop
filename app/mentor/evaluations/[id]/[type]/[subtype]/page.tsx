"use client";
import Sidebar from "@/components/sidebar";
import MedAmbu from "@/components/evaluations/medAmbu";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useRouter, useParams } from "next/navigation";

export default function MentorEvaluations() {
  const { toast } = useToast();
  const params = useParams();
  const id = params?.id as string;
  const type = params?.type as string;
  const subtype = params?.subtype as string;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    console.log("Fetching data for MedAmbu evaluation...", id, subtype);
    const response = await fetch(
      `/api/registIntern/${id}/evaluations/${subtype}`
    );
    if (!response.ok) {
      toast({
        title: "ไม่สามารถโหลดข้อมูลได้",
        description: "เกิดข้อผิดพลาดในการโหลดข้อมูลการประเมิน",
        variant: "destructive",
      });
      return;
    }
    const data = await response.json();
    console.log("Fetched data:", data);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="evaluations" userType="mentor" />

          <div className="md:col-span-4">
            <MedAmbu id={id} subtype={subtype} studentId={id} />
          </div>
        </div>
      </main>
    </div>
  );
}
