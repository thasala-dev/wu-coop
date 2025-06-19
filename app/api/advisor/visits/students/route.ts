// API route: /api/advisor/visits/students
// Mock ตัวอย่างสำหรับดึงข้อมูลนักศึกษาที่นิเทศได้
import { NextResponse } from "next/server";

export async function GET() {
  // ตัวอย่างข้อมูล สามารถแก้ไขให้ดึงจากฐานข้อมูลจริงได้
  const students = [
    {
      id: 1,
      name: "นายวิชัย เรียนดี",
      studentId: "64123456101",
      major: "วิศวกรรมคอมพิวเตอร์",
      company: "แหล่งฝึกงาน เทคโนโลยีดิจิทัล จำกัด",
      location: "กรุงเทพมหานคร",
    },
    {
      id: 2,
      name: "นางสาวนภา สุขใจ",
      studentId: "64123456102",
      major: "วิศวกรรมคอมพิวเตอร์",
      company: "แหล่งฝึกงาน เน็ตเวิร์ค โซลูชั่น จำกัด",
      location: "นนทบุรี",
    },
    {
      id: 3,
      name: "นายมานะ ตั้งใจ",
      studentId: "64123456791",
      major: "วิศวกรรมไฟฟ้า",
      company: "แหล่งฝึกงาน อิเล็กทรอนิกส์ จำกัด",
      location: "ชลบุรี",
    },
    {
      id: 4,
      name: "นายธนา รักการเรียน",
      studentId: "64123456103",
      major: "วิศวกรรมไฟฟ้า",
      company: "แหล่งฝึกงาน อิเล็กทรอนิกส์ จำกัด",
      location: "ชลบุรี",
    },
    {
      id: 5,
      name: "นางสาวพิมพ์ใจ รักเรียน",
      studentId: "64123456105",
      major: "วิศวกรรมคอมพิวเตอร์",
      company: "แหล่งฝึกงาน โปรแกรมมิ่ง เอ็กซ์เพิร์ต จำกัด",
      location: "นนทบุรี",
    },
  ];
  return NextResponse.json({ success: true, data: students });
}
