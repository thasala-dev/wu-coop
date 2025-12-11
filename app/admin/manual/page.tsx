"use client";

import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdvisorStudentsPage() {

    return (
        <div className="container max-w-full mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Sidebar activePage="manual" userType="admin" />

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
                                    src="/manual/admin.pdf"
                                    className="w-full h-full"
                                    title="คู่มือการใช้งานระบบสำหรับผู้ดูแลระบบ"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
