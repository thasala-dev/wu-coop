"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import CustomAvatar from "@/components/avatar";
import TableList from "@/components/TableList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear() + 543;
const years = Array.from({ length: currentYear - 2567 + 1 }, (_, i) =>
  (currentYear - i).toString()
);
let metaData: any[] = [];

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [calendar, setCalendar] = useState<any>([]);
  const [yearSelected, setYearSelected] = useState<any>(currentYear);

  useEffect(() => {
    fetchData();
  }, [yearSelected]);

  async function fetchData() {
    setLoading(true);
    metaData = [
      {
        key: "student_id",
        width: 100,
        className: "text-nowrap",
        content: "รหัสนักศึกษา",
      },
      {
        key: "fullname",
        width: 200,
        className: "text-nowrap",
        content: "ชื่อ-นามสกุล",
      },
    ];
    const response = await fetch(`/api/report/studentPerYear/${yearSelected}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (res.success) {
      setData(res.data || []);
      res.calendar.map((cal: any) => {
        metaData.push({
          key: cal.name,
          className: "w-[200px] text-nowrap",
          content: cal.name,
          //   content: (
          //     <div>
          //       <div>{cal.name}</div>
          //       <div className="text-xs text-gray-500 text-nowrap">
          //         (
          //         {new Date(cal.start_date).toLocaleDateString("th-TH", {
          //           year: "numeric",
          //           month: "short",
          //           day: "numeric",
          //         })}{" "}
          //         -{" "}
          //         {new Date(cal.end_date).toLocaleDateString("th-TH", {
          //           year: "numeric",
          //           month: "short",
          //           day: "numeric",
          //         })}
          //         )
          //       </div>
          //     </div>
          //   ),
          render: (item: any) => {
            const index = item.calendar_ids.indexOf(cal.id);
            return (
              <div className="text-center">
                {index !== -1 ? item.calendar_names[index] : "-"}
              </div>
            );
          },
        });
      });

      setLoading(false);
    }
  }

  return (
    <div className="container max-w-full mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Sidebar activePage="reports" userType="admin" />
        {loading && <Loading />}
        <div className="md:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">
                    รายงานนักศึกษาตามแหล่งฝึกงานทุกผลัดการฝึกงาน
                  </CardTitle>
                  <CardDescription>ตามปีการศึกษา</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={yearSelected ? yearSelected.toString() : ""}
                    onValueChange={(value) => {
                      setYearSelected(value || null);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="เลือกปีการศึกษา" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year: any) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="my-4 overflow-x-auto">
                <TableList meta={metaData} data={data} loading={loading} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
