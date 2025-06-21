import { NextResponse } from "next/server";
import { notifySupervisionReminder } from "@/lib/services/notification-service";
import { format, addDays, isSameDay } from "date-fns";

// ข้อมูลการนิเทศจากฐานข้อมูล (ตัวอย่าง)
const mockSupervisions = [
  {
    id: 1,
    regist_intern_id: 101,
    student: {
      id: 101,
      name: "นายทดสอบ ระบบ",
    },
    company: {
      name: "บริษัท เอบีซี จำกัด",
    },
    advisor_id: 301,
    scheduled_date: "2025-06-28",
    status: 1, // รอดำเนินการ
  },
  {
    id: 2,
    regist_intern_id: 102,
    student: {
      id: 102,
      name: "นางสาวสมศรี เรียนดี",
    },
    company: {
      name: "บริษัท เทคโนโลยีไทย จำกัด",
    },
    advisor_id: 302,
    scheduled_date: "2025-06-30",
    status: 1, // รอดำเนินการ
  },
];

// GET /api/cron/supervision-reminders - API endpoint สำหรับ cron job ที่จะสร้างการแจ้งเตือน
export async function GET() {
  try {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const threeDaysLater = addDays(today, 3);

    // ในอนาคตจะดึงข้อมูลจากฐานข้อมูลจริง
    // const supervisions = await db.query(`
    //   SELECT s.id, s.regist_intern_id, s.advisor_id, s.scheduled_date, s.status,
    //          ri.student_id, st.name as student_name,
    //          c.name as company_name
    //   FROM supervisions s
    //   JOIN regist_intern ri ON s.regist_intern_id = ri.id
    //   JOIN students st ON ri.student_id = st.id
    //   JOIN companies c ON ri.company_id = c.id
    //   WHERE s.status = 1
    //   AND s.scheduled_date >= $1 AND s.scheduled_date <= $2
    // `, [format(today, 'yyyy-MM-dd'), format(threeDaysLater, 'yyyy-MM-dd')]);

    // จำนวนการแจ้งเตือนที่ส่งไปแล้ว
    let sentNotifications = 0;
    const results = [];

    // ตรวจสอบการนิเทศที่จะต้องแจ้งเตือน
    for (const supervision of mockSupervisions) {
      const supervisionDate = new Date(supervision.scheduled_date);

      // ถ้าการนิเทศจะเกิดขึ้นพรุ่งนี้ แจ้งเตือน 1 วันล่วงหน้า
      if (isSameDay(supervisionDate, tomorrow)) {
        const result = await notifySupervisionReminder(
          supervision.advisor_id,
          supervision.student.id,
          supervision.student.name,
          supervision.company.name,
          supervision.scheduled_date,
          1,
          supervision.id
        );

        if (result) {
          sentNotifications++;
          results.push({
            supervision_id: supervision.id,
            days_before: 1,
            success: true,
          });
        }
      }
      // ถ้าการนิเทศจะเกิดขึ้นในอีก 3 วัน แจ้งเตือน 3 วันล่วงหน้า
      else if (isSameDay(supervisionDate, threeDaysLater)) {
        const result = await notifySupervisionReminder(
          supervision.advisor_id,
          supervision.student.id,
          supervision.student.name,
          supervision.company.name,
          supervision.scheduled_date,
          3,
          supervision.id
        );

        if (result) {
          sentNotifications++;
          results.push({
            supervision_id: supervision.id,
            days_before: 3,
            success: true,
          });
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        sent: sentNotifications,
        results,
        message: `ส่งการแจ้งเตือนการนิเทศแล้ว ${sentNotifications} รายการ`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending supervision reminders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการส่งการแจ้งเตือนการนิเทศ",
      },
      { status: 500 }
    );
  }
}
