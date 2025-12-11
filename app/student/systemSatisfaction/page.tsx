"use client";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import React from "react";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import SystemForm from "@/components/systemSatisfaction/SystemForm";

export default function MentorEvaluations() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="container max-w-full mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Sidebar activePage="dashboard" userType="student" />
          {loading && <Loading />}
          <div className="md:col-span-4 space-y-6">
            <SystemForm user={user} role="student" />
          </div>
        </div>
      </main>
    </div>
  );
}
