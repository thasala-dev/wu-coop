import { NextResponse } from "next/server";

// ข้อมูลตัวอย่างสำหรับการแสดงผล - ในอนาคตจะเรียกจากฐานข้อมูลจริง
const supervisions = [
  {
    id: 1,
    student: {
      id: 101,
      name: "นายทดสอบ ระบบ",
      student_id: "64000001",
    },
    company: {
      id: 201,
      name: "บริษัท เอบีซี จำกัด",
    },
    advisor: {
      id: 301,
      name: "อาจารย์ใจดี มากมาย",
    },
    scheduled_date: "2025-06-28",
    status: 1, // 1=รอดำเนินการ
  },
  {
    id: 2,
    student: {
      id: 102,
      name: "นางสาวสมศรี เรียนดี",
      student_id: "64000002",
    },
    company: {
      id: 202,
      name: "บริษัท เทคโนโลยีไทย จำกัด",
    },
    advisor: {
      id: 302,
      name: "ผศ.ดร.สมชาย สอนเก่ง",
    },
    scheduled_date: "2025-06-18",
    status: 2, // 2=เสร็จสิ้น
  },
  {
    id: 3,
    student: {
      id: 103,
      name: "นายมานะ ตั้งใจ",
      student_id: "64000003",
    },
    company: {
      id: 203,
      name: "บริษัท ซอฟต์แวร์ไทย จำกัด",
    },
    advisor: {
      id: 301,
      name: "อาจารย์ใจดี มากมาย",
    },
    scheduled_date: "2025-07-15",
    status: 1, // 1=รอดำเนินการ
  },
];

// GET /api/supervision - รับข้อมูลการนิเทศทั้งหมด
export async function GET() {
  try {
    // ในอนาคตเปลี่ยนเป็นการดึงข้อมูลจากฐานข้อมูล
    // const result = await db.query('SELECT * FROM supervisions...');

    return NextResponse.json(
      {
        success: true,
        data: supervisions,
        message: "ดึงข้อมูลการนิเทศสำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching supervisions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลการนิเทศ",
      },
      { status: 500 }
    );
  }
}
