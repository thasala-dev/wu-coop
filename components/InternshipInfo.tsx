"use client";

import React from "react";
import {
  Calendar,
  Building,
  MapPin,
  User,
  Mail,
  Phone,
  Clock,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InternshipData {
  calendar_name: string;
  semester: string;
  year: string;
  start_date: string;
  end_date: string;
  company_name: string;
  company_location: string;
  contact_name: string;
  contact_email: string;
  advisor_mobile: string;
  status?: string;
  position?: string;
  description?: string;
}

interface InternshipInfoProps {
  internships: InternshipData[];
}

const InternshipInfo: React.FC<InternshipInfoProps> = ({ internships }) => {
  if (!internships || internships.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Building className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">ยังไม่มีข้อมูลการฝึกงาน</p>
        <p className="text-gray-400 text-sm mt-1">
          ข้อมูลจะแสดงเมื่อมีการลงทะเบียนฝึกงาน
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {internships.map((internship, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-white to-blue-50/30 border border-blue-200/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {internship.calendar_name}
              </h3>
              <Badge className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1">
                <Calendar className="h-3 w-3 mr-1" />
                ปีการศึกษา {internship.semester}/{internship.year}
              </Badge>
            </div>
            {internship.status && (
              <Badge
                className={
                  internship.status === "active"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }
              >
                {internship.status === "active" ? "กำลังฝึกงาน" : "เสร็จสิ้น"}
              </Badge>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                ข้อมูลบริษัท
              </h4>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-blue-200/30">
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-600">ชื่อบริษัท:</span>
                    <p className="font-medium text-gray-900">
                      {internship.company_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-600">สถานที่:</span>
                    <p className="font-medium text-gray-900">
                      {internship.company_location}
                    </p>
                  </div>
                </div>
                {internship.position && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-gray-600">ตำแหน่ง:</span>
                      <p className="font-medium text-gray-900">
                        {internship.position}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact & Duration Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                ข้อมูลติดต่อ
              </h4>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-blue-200/30">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-600">ผู้ประสานงาน:</span>
                    <p className="font-medium text-gray-900">
                      {internship.contact_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-600">อีเมล:</span>
                    <p className="font-medium text-gray-900 break-all">
                      {internship.contact_email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-600">เบอร์ติดต่อ:</span>
                    <p className="font-mono font-medium text-gray-900">
                      {internship.advisor_mobile}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">
                ระยะเวลาฝึกงาน
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <span className="text-gray-600">วันที่เริ่มต้น:</span>
              <span className="font-medium text-gray-900">
                {new Date(internship.start_date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-gray-600 hidden sm:block">-</span>
              <span className="text-gray-600">วันที่สิ้นสุด:</span>
              <span className="font-medium text-gray-900">
                {new Date(internship.end_date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          {internship.description && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">
                  รายละเอียดงาน
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {internship.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InternshipInfo;
