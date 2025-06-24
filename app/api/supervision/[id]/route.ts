import { NextResponse } from "next/server";

// ข้อมูลตัวอย่างสำหรับการแสดงผลรายละเอียดการนิเทศ
const mockSupervision = {
  id: 1,
  student: {
    id: 101,
    name: "นายทดสอบ ระบบ",
    student_id: "64000001",
    program: "วิศวกรรมซอฟต์แวร์",
    faculty: "วิทยาศาสตร์และเทคโนโลยี",
  },
  company: {
    id: 201,
    name: "บริษัท เอบีซี จำกัด",
    address: "123 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900",
    contact_person: "คุณสมหมาย ใจดี",
    contact_phone: "02-123-4567",
    contact_email: "sommai@abc.co.th",
  },
  advisor: {
    id: 301,
    name: "อาจารย์ใจดี มากมาย",
    phone: "081-234-5678",
    email: "jaidee@university.ac.th",
  },
  scheduled_date: "2025-06-28",
  status: 1, // 1=รอดำเนินการ
  details: {
    visit_date: null,
    start_time: null,
    end_time: null,
    activity_details: "",
    student_performance: "",
    mentor_feedback: "",
    advisor_feedback: "",
    issues: "",
    next_goals: "",
  },
  photos: [],
};

// ข้อมูลตัวอย่างสำหรับการนิเทศที่เสร็จสิ้นแล้ว
const mockCompletedSupervision = {
  id: 2,
  student: {
    id: 102,
    name: "นางสาวสมศรี เรียนดี",
    student_id: "64000002",
    program: "วิทยาการคอมพิวเตอร์",
    faculty: "วิทยาศาสตร์และเทคโนโลยี",
  },
  company: {
    id: 202,
    name: "บริษัท เทคโนโลยีไทย จำกัด",
    address: "456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
    contact_person: "คุณมานี รักงาน",
    contact_phone: "02-987-6543",
    contact_email: "manee@thaitech.co.th",
  },
  advisor: {
    id: 302,
    name: "ผศ.ดร.สมชาย สอนเก่ง",
    phone: "089-876-5432",
    email: "somchai@university.ac.th",
  },
  scheduled_date: "2025-06-18",
  status: 2, // 2=เสร็จสิ้น
  details: {
    visit_date: "2025-06-18",
    start_time: "10:00:00",
    end_time: "12:00:00",
    activity_details:
      "พบนักศึกษาและแหล่งฝึก ตรวจเยี่ยมสถานประกอบการ ติดตามความคืบหน้าโครงงาน และให้คำแนะนำการทำงาน",
    student_performance:
      "นักศึกษามีความรับผิดชอบในงานที่ได้รับมอบหมาย มีความตรงต่อเวลา และสามารถทำงานร่วมกับทีมได้ดี",
    mentor_feedback:
      "นักศึกษามีความกระตือรือร้นในการเรียนรู้ สามารถปรับตัวเข้ากับทีมได้เร็ว แต่ควรพัฒนาทักษะการสื่อสารให้มากขึ้น",
    advisor_feedback:
      "นักศึกษามีพัฒนาการที่ดี ควรฝึกฝนทักษะการนำเสนอและการสื่อสารให้มากขึ้น รวมถึงเรียนรู้เทคโนโลยีใหม่ๆ ที่เกี่ยวข้องกับงาน",
    issues:
      "นักศึกษายังไม่คุ้นเคยกับการใช้เครื่องมือบางอย่างในการพัฒนาซอฟต์แวร์",
    next_goals:
      "ฝึกฝนการใช้ Git และ CI/CD ให้คล่องมากขึ้น พัฒนาทักษะการนำเสนอโดยการฝึกซ้อมก่อนนำเสนองาน",
  },
  photos: [
    {
      id: 1,
      supervision_id: 2,
      photo_path: "/placeholder.jpg",
      description: "การประชุมร่วมกับทีมแหล่งฝึก",
    },
    {
      id: 2,
      supervision_id: 2,
      photo_path: "/placeholder.jpg",
      description: "นักศึกษานำเสนอความคืบหน้าโครงงาน",
    },
  ],
};

const mockSupervision3 = {
  id: 3,
  student: {
    id: 103,
    name: "นายมานะ ตั้งใจ",
    student_id: "64000003",
    program: "วิศวกรรมคอมพิวเตอร์",
    faculty: "วิทยาศาสตร์และเทคโนโลยี",
  },
  company: {
    id: 203,
    name: "บริษัท ซอฟต์แวร์ไทย จำกัด",
    address: "789 อาคารเมืองไทยภัทร ซอยวิภาวดี 3 กรุงเทพฯ 10400",
    contact_person: "คุณพงษ์ศักดิ์ นักพัฒนา",
    contact_phone: "02-345-6789",
    contact_email: "pongsak@thaisoftware.co.th",
  },
  advisor: {
    id: 301,
    name: "อาจารย์ใจดี มากมาย",
    phone: "081-234-5678",
    email: "jaidee@university.ac.th",
  },
  scheduled_date: "2025-07-15",
  status: 1, // 1=รอดำเนินการ
  details: {
    visit_date: null,
    start_time: null,
    end_time: null,
    activity_details: "",
    student_performance: "",
    mentor_feedback: "",
    advisor_feedback: "",
    issues: "",
    next_goals: "",
  },
  photos: [],
};

// GET /api/supervision/[id] - รับข้อมูลการนิเทศตาม ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // ในอนาคตเปลี่ยนเป็นการดึงข้อมูลจากฐานข้อมูล
    // const result = await db.query('SELECT * FROM supervisions WHERE id = ?', [id]);

    // จำลองการดึงข้อมูลตาม ID
    let supervisionData;
    if (id === "1") {
      supervisionData = mockSupervision;
    } else if (id === "2") {
      supervisionData = mockCompletedSupervision;
    } else if (id === "3") {
      supervisionData = mockSupervision3;
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข้อมูลการนิเทศ",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: supervisionData,
        message: "ดึงข้อมูลการนิเทศสำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching supervision detail:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลการนิเทศ",
      },
      { status: 500 }
    );
  }
}
