"use client";

import React from "react";
import {
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  FileText,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupervisionData {
  scheduled_date: string;
  start_time: string;
  end_time: string;
  advisor_name: string;
  advisor_email: string;
  advisor_mobile: string;
  status: string;
  notes?: string;
  visit_type?: string;
  location?: string;
  student_feedback?: string;
  advisor_feedback?: string;
}

interface SupervisionInfoProps {
  supervisions: SupervisionData[];
}

// Format visit time function
const formatVisitTime = (dateString: string) => {
  if (!dateString) return "ไม่ระบุวันที่";
  try {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "วันที่ไม่ถูกต้อง";
  }
};

const SupervisionInfo: React.FC<SupervisionInfoProps> = ({ supervisions }) => {
  if (!supervisions || supervisions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">ยังไม่มีการนิเทศ</p>
        <p className="text-gray-400 text-sm mt-1">
          ข้อมูลจะแสดงเมื่อมีการจัดตารางนิเทศ
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {supervisions.map((supervision, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-white to-teal-50/30 border border-teal-200/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Badge
                className={
                  supervision.status === "1"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1"
                    : supervision.status === "cancelled"
                    ? "bg-red-100 text-red-700 border border-red-300 px-3 py-1"
                    : "bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1"
                }
              >
                {supervision.status === "1" ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    เสร็จสิ้น
                  </>
                ) : supervision.status === "cancelled" ? (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    ยกเลิก
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    รอดำเนินการ
                  </>
                )}
              </Badge>
              {supervision.visit_type && (
                <Badge
                  variant="outline"
                  className="text-teal-700 border-teal-300 hover:bg-teal-50"
                >
                  {supervision.visit_type}
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatVisitTime(supervision.scheduled_date)}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {supervision.start_time} - {supervision.end_time}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Advisor Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-teal-600" />
                ข้อมูลอาจารย์นิเทศ
              </h4>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-teal-200/30">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-600">ชื่อ:</span>
                    <p className="font-medium text-gray-900">
                      {supervision.advisor_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-600">อีเมล:</span>
                    <p className="font-medium text-gray-900 break-all">
                      {supervision.advisor_email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-600">เบอร์ติดต่อ:</span>
                    <p className="font-mono font-medium text-gray-900">
                      {supervision.advisor_mobile}
                    </p>
                  </div>
                </div>
                {supervision.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-gray-600">สถานที่:</span>
                      <p className="font-medium text-gray-900">
                        {supervision.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes & Feedback */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" />
                หมายเหตุและข้อมูลเพิ่มเติม
              </h4>
              <div className="space-y-3">
                {supervision.notes && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-teal-200/30">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-teal-600" />
                      <span className="text-sm font-medium text-gray-700">
                        หมายเหตุ:
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {supervision.notes}
                    </p>
                  </div>
                )}

                {supervision.student_feedback && (
                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/30">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        ความคิดเห็นจากนักศึกษา:
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {supervision.student_feedback}
                    </p>
                  </div>
                )}

                {supervision.advisor_feedback && (
                  <div className="bg-green-50/50 rounded-lg p-4 border border-green-200/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        ความคิดเห็นจากอาจารย์:
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {supervision.advisor_feedback}
                    </p>
                  </div>
                )}

                {!supervision.notes &&
                  !supervision.student_feedback &&
                  !supervision.advisor_feedback && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                      <p className="text-sm text-gray-500 italic">
                        ยังไม่มีข้อมูลเพิ่มเติม
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="mt-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-semibold text-gray-700">
                  กำหนดการนิเทศ
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-teal-600" />
                <span className="text-gray-600">เวลา:</span>
                <span className="font-medium text-gray-900">
                  {supervision.start_time} - {supervision.end_time}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupervisionInfo;
