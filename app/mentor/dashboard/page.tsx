"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (isLoading) return;
  //   if (!user) return;
  //   fetchData();
  // }, [isLoading]);

  async function fetchData() {
    setLoading(true);
    const response = await fetch(`/api/mentor/${user.id}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const res = await response.json();
    if (res.success) {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Sidebar activePage="dashboard" userType="mentor" />
          {loading && <Loading />}
          <div className="md:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6">
                  <h2 className="font-semibold tracking-tight text-2xl">
                    ภาพรวม
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    สรุปข้อมูลการฝึกงานของนักศึกษา
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="font-medium">จำนวนนักศึกษา</div>
                      <div className="text-3xl font-semibold">15 คน</div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="font-medium">
                        จำนวนนักศึกษาที่ต้องติดตาม
                      </div>
                      <div className="text-3xl font-semibold">3 คน</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6 mt-4">
                  <h2 className="font-semibold tracking-tight text-2xl">
                    นักศึกษาล่าสุด
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    นักศึกษาที่เพิ่มเข้ามาใหม่
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src="https://i.pravatar.cc/40?u=student1"
                          alt="Student 1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">นายธนกร มั่นคง</div>
                        <div className="text-sm text-gray-500">
                          Software Developer Intern
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        กำลังฝึกงาน
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src="https://i.pravatar.cc/40?u=student2"
                          alt="Student 2"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">
                          นางสาวพิมพ์ชนก รักเรียน
                        </div>
                        <div className="text-sm text-gray-500">
                          UX/UI Designer Intern
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        กำลังฝึกงาน
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src="https://i.pravatar.cc/40?u=student3"
                          alt="Student 3"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">นายภาคิน ใจดี</div>
                        <div className="text-sm text-gray-500">
                          Backend Developer Intern
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        ต้องติดตาม
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6">
                  <h2 className="font-semibold tracking-tight text-2xl">
                    การประเมินที่ต้องทำ
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    รายการประเมินที่กำลังจะถึงกำหนด
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src="https://i.pravatar.cc/40?u=student1"
                          alt="Student 1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">นายธนกร มั่นคง</div>
                        <div className="text-sm text-gray-500">
                          ประเมินกลางภาค • 1 ก.ย. 2566
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        ประเมิน
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src="https://i.pravatar.cc/40?u=student2"
                          alt="Student 2"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">
                          นางสาวพิมพ์ชนก รักเรียน
                        </div>
                        <div className="text-sm text-gray-500">
                          ประเมินกลางภาค • 5 ก.ย. 2566
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        ประเมิน
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src="https://i.pravatar.cc/40?u=student4"
                          alt="Student 4"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">นางสาวกมลชนก วิชาดี</div>
                        <div className="text-sm text-gray-500">
                          ประเมินกลางภาค • 10 ก.ย. 2566
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        ประเมิน
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
