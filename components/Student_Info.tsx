import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
  Star,
  BookOpen,
  Award,
  Users,
} from "lucide-react";
import CustomAvatar from "./avatar";

export default function StudentInfo(props: any) {
  const { data } = props;

  console.log("StudentInfo data:", data);

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      <CardHeader className="py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CustomAvatar
                id={`student${data?.student_id}`}
                image={data?.image}
                size="16"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <Star className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                {data?.fullname}
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm sm:text-base font-medium">
                {data?.student_id} • {data?.major || "-"}
                {data?.std_year && (
                  <span className="hidden sm:inline">
                    {" "}
                    • กลุ่ม {data?.std_year}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm"
          >
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            นักศึกษาฝึกงาน
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* อีเมล */}
          <div className="group hover:bg-blue-50/50 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">อีเมล</div>
                <div className="text-gray-700 text-sm truncate">
                  {data?.email}
                </div>
              </div>
            </div>
          </div>

          {/* เบอร์โทรศัพท์ */}
          <div className="group hover:bg-green-50/50 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-green-200/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">
                  เบอร์โทรศัพท์
                </div>
                <div className="text-gray-700 text-sm">{data?.mobile}</div>
              </div>
            </div>
          </div>

          {/* กลุ่มรหัสนักศึกษา */}
          <div className="group hover:bg-teal-50/50 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-teal-200/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">
                  กลุ่มรหัส
                </div>
                <div className="text-gray-700 text-sm">
                  {data?.std_year || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* เกรดเฉลี่ย */}
          <div className="group hover:bg-amber-50/50 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">
                  เกรดเฉลี่ย
                </div>
                <div className="text-gray-700 text-sm ">
                  {data?.gpa ? parseFloat(data?.gpa).toFixed(2) : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* ที่อยู่ */}
          <div className="group hover:bg-indigo-50/50 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-indigo-200/50 md:col-span-2 xl:col-span-1">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm mb-1">
                  ที่อยู่
                </div>
                <div className="text-gray-700 text-sm ">{data?.address}</div>
              </div>
            </div>
          </div>

          {/* ผู้ติดต่อฉุกเฉิน */}
          <div className="group hover:bg-red-50/50 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm mb-1">
                  ผู้ติดต่อฉุกเฉิน
                </div>
                <div className="text-gray-700 text-sm ">
                  <div className="font-medium text-gray-900 text-sm truncate">
                    {data?.emergency_contact_name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {data?.emergency_contact_relation}
                  </div>
                  <div className="text-xs text-gray-600">
                    {data?.emergency_contact_phone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* อาจารย์ที่ปรึกษา */}
          <div className="group hover:bg-purple-50/50 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-200/50 md:col-span-2 xl:col-span-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm mb-1">
                  อาจารย์ที่ปรึกษา
                </div>
                <div className="bg-white p-2 rounded border border-gray-200/50 shadow-sm">
                  <div className="font-medium text-gray-900 text-sm truncate">
                    {data?.advisor_name}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {data?.advisor_email}
                  </div>
                  <div className="text-xs text-gray-600">
                    {data?.advisor_mobile}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
