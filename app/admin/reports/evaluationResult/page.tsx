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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cpu, Eye, Loader, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { se, th } from "date-fns/locale";
import * as XLSX from "xlsx";
import { evalu } from "@/lib/evaluations_report";

const currentYear = new Date().getFullYear() + 543;
const years = Array.from({ length: currentYear - 2567 + 1 }, (_, i) =>
  (currentYear - i).toString()
);
let metaData: any[] = [];

export default function CompaniesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [data, setData] = useState<any>([]);
  const [calendar, setCalendar] = useState<any>([]);
  const [evalations, setEvaluations] = useState<any>([]);
  const [yearSelected, setYearSelected] = useState<any>(currentYear);
  const [calendarSelected, setCalendarSelected] = useState<any>(null);
  const [evaluationSelected, setEvaluationSelected] = useState<any>(null);

  async function fetchCalendar() {
    try {
      const response = await fetch("/api/calendar");
      const res = await response.json();
      if (res.success) {
        setCalendar(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching calendar:", error);
    }
  }

  async function fetchEvaluation() {
    try {
      const response = await fetch("/api/evaluations_form");
      const res = await response.json();
      if (res.success) {
        setEvaluations(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching calendar:", error);
    }
  }

  useEffect(() => {
    fetchCalendar();
    fetchEvaluation();
  }, []);

  async function handleProcess() {
    // Validate required fields
    if (!calendarSelected) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาเลือกผลัดฝึกงาน",
        variant: "destructive",
      });
      return;
    }

    if (!evaluationSelected) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาเลือกชุดการประเมิน",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await fetchData();
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถประมวลผลข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    setLoading(true);
    metaData = evalu[evaluationSelected as keyof typeof evalu] || [];

    const response = await fetch(
      `/api/report/evaluationsResult/${calendarSelected}/${evaluationSelected}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response.json();
    if (res.success) {
      setData(res.data || []);
      setLoading(false);
      setIsResult(true);

      if (metaData.length === 0) {
        res.data.forEach((item: any) => {
          if (item.result) {
            metaData.push(
              ...Object.keys(item.result).map((key) => ({
                label: key,
                value: key,
              }))
            );
          }
        });
      }
    }
  }

  const exportToExcel = () => {
    if (data.length === 0) {
      toast({
        title: "ไม่สามารถส่งออกได้",
        description: "ไม่มีข้อมูลสำหรับการส่งออก",
        variant: "destructive",
      });
      return;
    }
    const selectedCalendar = calendar.find(
      (item: any) => item.id === calendarSelected
    );
    const selectedEvaluation = evalations.find(
      (item: any) => item.id === evaluationSelected
    );

    // สร้าง header columns รวม metaData
    const headerColumns = [
      "ลำดับ",
      "รหัสนักศึกษา",
      "ชื่อนักศึกษา",
      "แหล่งฝึกงาน",
      "อาจารย์ประจำแหล่งฝึก",
      "วันที่ประเมิน",
      "แบบประเมิน",
      ...metaData.map((meta: any) => meta.label),
    ];

    const excelData = [
      ["รายงานผลการประเมินนักศึกษา โดยอาจารย์ประจำแหล่งฝึก"],
      [
        `รอบการฝึก: ${selectedCalendar?.name} ปีการศึกษา: ${selectedCalendar?.semester}/${selectedCalendar?.year}`,
      ],
      [
        `ระหว่างวันที่ ${new Date(
          selectedCalendar?.start_date
        ).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })} - ${new Date(selectedCalendar?.end_date).toLocaleDateString(
          "th-TH",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        )}`,
      ],
      [`กลุ่มประเมิน: ${selectedEvaluation?.group} `],
      [`ชุดการประเมิน: ${selectedEvaluation?.short_name}`],
      [`ชื่อการประเมิน: ${selectedEvaluation?.name}`],
      [],
      headerColumns, // ใช้ header ที่รวม metaData แล้ว
      ...data.map((item: any, index: number) => [
        index + 1,
        item.student_id,
        item.fullname,
        item.company_name,
        item.evaluator || "-",
        item.evaluation_date
          ? new Date(item.evaluation_date).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          : "-",
        item.evaluation_name,
        ...metaData.map((meta: any) =>
          item.result ? item.result[meta.value] : "-"
        ), // เพิ่มข้อมูล metaData
      ]),
    ];

    // Create a new workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    // Set column widths รวมคอลัมน์ metaData
    const colWidths = [
      { wch: 8 }, // ลำดับ
      { wch: 15 }, // รหัสนักศึกษา
      { wch: 30 }, // ชื่อนักศึกษา
      { wch: 40 }, // แหล่งฝึกงาน
      { wch: 25 }, // อาจารย์ประจำแหล่งฝึก
      { wch: 15 }, // วันที่ประเมิน
      { wch: 15 }, // แบบประเมิน
      ...metaData.map(() => ({ wch: 15 })), // คอลัมน์ metaData
    ];
    ws["!cols"] = colWidths;

    // คำนวณจำนวนคอลัมน์ทั้งหมด
    const totalColumns = 7 + metaData.length;

    // Style the header row (row 7, which contains the table headers)
    const headerRowIndex = 7; // 0-indexed
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F46E5" } },
      alignment: { horizontal: "center" },
    };

    // Apply header styling สำหรับทุกคอลัมน์
    for (let col = 0; col < totalColumns; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: col });
      if (!ws[cellAddress]) ws[cellAddress] = { v: "", t: "s" };
      ws[cellAddress].s = headerStyle;
    }

    // Style the title rows (first 5 rows)
    for (let row = 0; row < 6; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true, size: row === 0 ? 16 : 12 },
          alignment: { horizontal: row === 0 ? "center" : "left" },
        };
      }
    }

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "รายงานผลการประเมิน");

    // Generate filename
    const filename = `รายงานผลการประเมิน_${selectedCalendar?.name}_${selectedEvaluation?.short_name
      }_${new Date().toLocaleDateString("th-TH").replace(/\//g, "-")}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="container max-w-full mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Sidebar activePage="reports" userType="admin" />
        {loading && <Loading />}
        <div className="md:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    รายงานผลการประเมินนักศึกษา
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    รายงานผลการประเมินตามผลัดฝึกงานและชุดการประเมิน
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={yearSelected ? yearSelected.toString() : ""}
                    onValueChange={(value) => {
                      setYearSelected(value || null);
                    }}
                  >
                    <SelectTrigger className="w-[180px] border-2 border-gray-200 hover:border-blue-300 transition-colors">
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

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 block">
                    ผลัดฝึกงาน
                  </label>
                  <Select
                    value={calendarSelected}
                    onValueChange={(value) => {
                      setCalendarSelected(value || null);
                      setIsResult(false);
                    }}
                  >
                    <SelectTrigger className="w-full h-11 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="เลือกผลัดฝึกงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendar
                        .filter((item: any) => item.year == yearSelected)
                        .map((item: any, index: number) => (
                          <SelectItem key={index} value={item.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {item.name} ({item.semester}/{item.year})
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(item.start_date).toLocaleDateString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}{" "}
                                -{" "}
                                {new Date(item.end_date).toLocaleDateString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 block">
                    ชุดการประเมิน
                  </label>
                  <Select
                    value={evaluationSelected}
                    onValueChange={(value) => {
                      setEvaluationSelected(value || null);
                      setIsResult(false);
                    }}
                  >
                    <SelectTrigger className="w-full h-11 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="เลือกชุดการประเมิน" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {evalations.map((item: any, index: number) => (
                        <SelectItem key={index} value={item.id}>
                          <div className="flex flex-col items-start">
                            <span
                              className="font-medium truncate"
                              title={item.name}
                            >
                              {item.name}
                            </span>
                            <div className="flex space-x-1 mt-1">
                              <span className="text-xs text-gray-500">
                                {item.short_name} • {item.group}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="my-8 flex justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleProcess}
                >
                  <Cpu className="h-4 w-4 mr-2" />
                  ประมวลผลข้อมูล
                </Button>
              </div>
              {isResult && (
                <div>
                  {calendarSelected && evaluationSelected && (
                    <div className="text-lg font-semibold text-gray-800 mb-4 justify-center text-center">
                      <div>
                        รายงานผลการประเมินนักศึกษา โดยอาจารย์ประจำแหล่งฝึก
                      </div>
                      <div>
                        รอบการฝึก:{" "}
                        {
                          calendar.find(
                            (item: any) => item.id === calendarSelected
                          )?.name
                        }{" "}
                        ปีการศึกษา:{" "}
                        {
                          calendar.find(
                            (item: any) => item.id === calendarSelected
                          )?.semester
                        }
                        /
                        {
                          calendar.find(
                            (item: any) => item.id === calendarSelected
                          )?.year
                        }
                      </div>
                      <div>
                        (ระหว่างวันที่{" "}
                        {new Date(
                          calendar.find(
                            (item: any) => item.id === calendarSelected
                          )?.start_date
                        ).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(
                          calendar.find(
                            (item: any) => item.id === calendarSelected
                          )?.end_date
                        ).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        )
                      </div>
                      <div>
                        กลุ่มประเมิน:{" "}
                        {
                          evalations.find(
                            (item: any) => item.id === evaluationSelected
                          )?.group
                        }
                      </div>
                      <div>
                        ชุดการประเมิน:{" "}
                        {
                          evalations.find(
                            (item: any) => item.id === evaluationSelected
                          )?.short_name
                        }
                      </div>
                      <div>
                        ชื่อการประเมิน:{" "}
                        {
                          evalations.find(
                            (item: any) => item.id === evaluationSelected
                          )?.name
                        }
                      </div>
                    </div>
                  )}

                  {data.length > 0 ? (
                    <div className="mt-8">
                      <div className="mb-4 flex justify-between items-center">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex-1 mr-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-green-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-800">
                                พบข้อมูลการประเมิน {data.length} รายการ
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={exportToExcel}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          ส่งออก Excel
                        </Button>
                      </div>

                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <div className="overflow-x-auto max-w-full">
                          <table
                            className="min-w-max w-full divide-y divide-gray-300 bg-white"
                            style={{ minWidth: "max-content" }}
                          >
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px]">
                                  ลำดับ
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                  รหัสนักศึกษา
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                  ชื่อนักศึกษา
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                  แหล่งฝึกงาน
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                  อาจารย์ประจำแหล่งฝึก
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                  วันที่ประเมิน
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                  แบบประเมิน
                                </th>
                                {metaData.map((item: any, index: number) => (
                                  <th
                                    key={index}
                                    className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                                  >
                                    {item.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {data.map((item: any, index: number) => (
                                <tr
                                  key={index}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {index + 1}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.student_id}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.fullname}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.company_name}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.evaluator || "-"}
                                  </td>

                                  <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.evaluation_date
                                      ? new Date(
                                        item.evaluation_date
                                      ).toLocaleDateString("th-TH", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                      : "-"}
                                  </td>
                                  <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.evaluation_name || "-"}
                                  </td>

                                  {metaData.map(
                                    (meta: any, metaIndex: number) => (
                                      <td
                                        key={metaIndex}
                                        className="p-4 whitespace-nowrap text-sm text-gray-500"
                                      >
                                        {item.result
                                          ? item.result[meta.value]
                                          : "-"}
                                      </td>
                                    )
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8">
                      <div className="text-center py-12">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                          <svg
                            className="h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          ไม่พบข้อมูลการประเมิน
                        </h3>
                        <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                          ไม่มีข้อมูลการประเมินสำหรับผลัดฝึกงานและชุดการประเมินที่เลือก
                          กรุณาตรวจสอบข้อมูลอีกครั้ง
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>
                            ลองเปลี่ยนเงื่อนไขการค้นหาแล้วประมวลผลใหม่อีกครั้ง
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
