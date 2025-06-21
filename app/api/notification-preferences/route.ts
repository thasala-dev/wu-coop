import { NextResponse } from "next/server";

// ข้อมูลตัวอย่างสำหรับการตั้งค่าการแจ้งเตือน
const mockNotificationPreferences = [
  {
    id: 1,
    user_id: 101,
    type: {
      id: 1,
      code: "supervision_scheduled",
      name: "การนิเทศถูกกำหนด",
    },
    in_app_enabled: true,
    email_enabled: true,
  },
  {
    id: 2,
    user_id: 101,
    type: {
      id: 2,
      code: "supervision_reminder_advisor",
      name: "เตือนการนิเทศ (อาจารย์)",
    },
    in_app_enabled: true,
    email_enabled: true,
  },
  {
    id: 3,
    user_id: 101,
    type: {
      id: 4,
      code: "supervision_completed",
      name: "การนิเทศเสร็จสิ้น",
    },
    in_app_enabled: true,
    email_enabled: false,
  },
];

// GET /api/notification-preferences - รับข้อมูลการตั้งค่าการแจ้งเตือนของผู้ใช้
export async function GET(request: Request) {
  try {
    // ในอนาคตดึงข้อมูลผู้ใช้จาก session และดึงข้อมูลการตั้งค่าจากฐานข้อมูล
    // const session = await getSession();
    // const userId = session.user.id;
    // const preferences = await db.query(`
    //   SELECT np.*, nt.code, nt.name
    //   FROM notification_preferences np
    //   JOIN notification_types nt ON np.type_id = nt.id
    //   WHERE np.user_id = $1
    // `, [userId]);

    return NextResponse.json(
      {
        success: true,
        data: mockNotificationPreferences,
        message: "ดึงข้อมูลการตั้งค่าการแจ้งเตือนสำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่าการแจ้งเตือน",
      },
      { status: 500 }
    );
  }
}

// PUT /api/notification-preferences - อัปเดตการตั้งค่าการแจ้งเตือน
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // ในอนาคตอัปเดตการตั้งค่าการแจ้งเตือนในฐานข้อมูล
    // const { user_id, preferences } = body;
    //
    // // อัปเดตการตั้งค่าแต่ละรายการ
    // for (const pref of preferences) {
    //   await db.query(`
    //     INSERT INTO notification_preferences (user_id, type_id, in_app_enabled, email_enabled)
    //     VALUES ($1, $2, $3, $4)
    //     ON CONFLICT (user_id, type_id)
    //     DO UPDATE SET in_app_enabled = $3, email_enabled = $4, updated_at = CURRENT_TIMESTAMP
    //   `, [user_id, pref.type_id, pref.in_app_enabled, pref.email_enabled]);
    // }

    // สำหรับการทดสอบ
    console.log("Updating notification preferences:", body);

    return NextResponse.json(
      {
        success: true,
        message: "อัปเดตการตั้งค่าการแจ้งเตือนสำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการอัปเดตการตั้งค่าการแจ้งเตือน",
      },
      { status: 500 }
    );
  }
}
