import { NextResponse } from "next/server";

// ข้อมูลตัวอย่างสำหรับการแสดงผล - ในอนาคตจะเรียกจากฐานข้อมูลจริง
const mockNotifications = [
  {
    id: 1,
    user_id: 101,
    type: {
      id: 1,
      code: "supervision_scheduled",
      name: "การนิเทศถูกกำหนด",
      icon: "calendar",
      color: "blue",
    },
    title: "มีการกำหนดการนิเทศใหม่",
    message:
      "คุณได้รับมอบหมายให้เป็นอาจารย์นิเทศ สำหรับนายทดสอบ ระบบ ที่บริษัท เอบีซี จำกัด ในวันที่ 28 มิถุนายน 2568",
    link: "/advisor/visits/1",
    is_read: false,
    created_at: "2025-06-20T10:30:00Z",
  },
  {
    id: 2,
    user_id: 101,
    type: {
      id: 2,
      code: "supervision_reminder_advisor",
      name: "เตือนการนิเทศ (อาจารย์)",
      icon: "bell",
      color: "orange",
    },
    title: "เตือนการนิเทศในอีก 2 วัน",
    message:
      "การนิเทศนักศึกษา นายทดสอบ ระบบ ที่บริษัท เอบีซี จำกัด จะมีขึ้นในอีก 2 วัน (28 มิถุนายน 2568)",
    link: "/advisor/visits/1",
    is_read: false,
    created_at: "2025-06-26T08:00:00Z",
  },
  {
    id: 3,
    user_id: 101,
    type: {
      id: 4,
      code: "supervision_completed",
      name: "การนิเทศเสร็จสิ้น",
      icon: "check-circle",
      color: "green",
    },
    title: "การนิเทศเสร็จสิ้น",
    message:
      "การนิเทศนักศึกษา นางสาวสมศรี เรียนดี ที่บริษัท เทคโนโลยีไทย จำกัด ได้เสร็จสิ้นแล้ว",
    link: "/advisor/visits/2",
    is_read: true,
    created_at: "2025-06-18T14:30:00Z",
  },
];

// GET /api/notifications - รับข้อมูลการแจ้งเตือนของผู้ใช้ปัจจุบัน
export async function GET(request: Request) {
  try {
    // ในอนาคตดึงข้อมูลผู้ใช้จาก session และดึงข้อมูลการแจ้งเตือนจากฐานข้อมูล
    // const session = await getSession();
    // const userId = session.user.id;
    // const notifications = await db.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);

    // จำลองการดึงข้อมูล
    return NextResponse.json(
      {
        success: true,
        data: mockNotifications,
        message: "ดึงข้อมูลการแจ้งเตือนสำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน",
      },
      { status: 500 }
    );
  }
}

// POST /api/notifications - สร้างการแจ้งเตือนใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ในอนาคตบันทึกการแจ้งเตือนลงฐานข้อมูล
    // const result = await db.query(
    //   'INSERT INTO notifications (user_id, type_id, title, message, link, data) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    //   [body.user_id, body.type_id, body.title, body.message, body.link, body.data]
    // );

    // สำหรับการทดสอบ
    console.log("Creating new notification:", body);

    return NextResponse.json(
      {
        success: true,
        message: "สร้างการแจ้งเตือนสำเร็จ",
        data: {
          id: Date.now(),
          ...body,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการสร้างการแจ้งเตือน",
      },
      { status: 500 }
    );
  }
}
