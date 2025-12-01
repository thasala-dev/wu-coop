"use client";

import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdvisorStudentsPage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
            <div className="container mx-auto p-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Sidebar activePage="manual" userType="advisor" />

                    <div className="md:col-span-4 space-y-6">
                        <Card className="mb-6">
                            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl">
                                        คู่มือการใช้งานระบบ
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full h-[800px] border rounded-lg overflow-hidden">
                                    <iframe
                                        src="/manual/advisor.pdf"
                                        className="w-full h-full"
                                        title="คู่มือการใช้งานระบบสำหรับอาจารย์ที่ปรึกษา"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
