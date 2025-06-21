/**
 * บริการจัดการการแจ้งเตือน (Notification Service)
 * ใช้สำหรับสร้างการแจ้งเตือนในระบบและจัดการการแจ้งเตือน
 */

// ประเภทข้อมูลสำหรับการแจ้งเตือน
interface NotificationData {
  user_id: number;
  type_id: number;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, any>;
}

// ประเภทการแจ้งเตือนที่มีในระบบ
export enum NotificationType {
  SUPERVISION_SCHEDULED = 1,
  SUPERVISION_REMINDER_ADVISOR = 2,
  SUPERVISION_REMINDER_STUDENT = 3,
  SUPERVISION_COMPLETED = 4,
  SUPERVISION_CANCELED = 5,
  SUPERVISION_RESCHEDULED = 6,
}

/**
 * สร้างการแจ้งเตือนใหม่
 * @param data ข้อมูลการแจ้งเตือน
 * @returns Promise กับผลการสร้างการแจ้งเตือน
 */
export async function createNotification(
  data: NotificationData
): Promise<boolean> {
  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
}

/**
 * สร้างการแจ้งเตือนการกำหนดการนิเทศใหม่
 * @param advisorId รหัสอาจารย์นิเทศ
 * @param studentId รหัสนักศึกษา
 * @param studentName ชื่อนักศึกษา
 * @param companyName ชื่อบริษัท
 * @param scheduledDate วันที่นัดหมาย
 * @param supervisionId รหัสการนิเทศ
 * @returns Promise กับผลการสร้างการแจ้งเตือน
 */
export async function notifySupervisionScheduled(
  advisorId: number,
  studentId: number,
  studentName: string,
  companyName: string,
  scheduledDate: string,
  supervisionId: number
): Promise<boolean> {
  // แจ้งเตือนอาจารย์นิเทศ
  const advisorNotification = await createNotification({
    user_id: advisorId,
    type_id: NotificationType.SUPERVISION_SCHEDULED,
    title: "มีการกำหนดการนิเทศใหม่",
    message: `คุณได้รับมอบหมายให้เป็นอาจารย์นิเทศ สำหรับ${studentName} ที่${companyName} ในวันที่ ${scheduledDate}`,
    link: `/advisor/visits/${supervisionId}`,
    data: {
      supervision_id: supervisionId,
      student_id: studentId,
      company_name: companyName,
      scheduled_date: scheduledDate,
    },
  });

  // แจ้งเตือนนักศึกษา
  const studentNotification = await createNotification({
    user_id: studentId,
    type_id: NotificationType.SUPERVISION_SCHEDULED,
    title: "การนิเทศได้รับการกำหนดแล้ว",
    message: `การนิเทศของคุณได้ถูกกำหนดในวันที่ ${scheduledDate} โดยมีอาจารย์นิเทศที่ได้รับมอบหมาย`,
    link: `/student/schedule`,
    data: {
      supervision_id: supervisionId,
      advisor_id: advisorId,
      company_name: companyName,
      scheduled_date: scheduledDate,
    },
  });

  return advisorNotification && studentNotification;
}

/**
 * สร้างการแจ้งเตือนการเลื่อนการนิเทศ
 * @param advisorId รหัสอาจารย์นิเทศ
 * @param studentId รหัสนักศึกษา
 * @param studentName ชื่อนักศึกษา
 * @param oldDate วันที่นัดหมายเดิม
 * @param newDate วันที่นัดหมายใหม่
 * @param supervisionId รหัสการนิเทศ
 * @returns Promise กับผลการสร้างการแจ้งเตือน
 */
export async function notifySupervisionRescheduled(
  advisorId: number,
  studentId: number,
  studentName: string,
  oldDate: string,
  newDate: string,
  supervisionId: number
): Promise<boolean> {
  // แจ้งเตือนอาจารย์นิเทศ
  const advisorNotification = await createNotification({
    user_id: advisorId,
    type_id: NotificationType.SUPERVISION_RESCHEDULED,
    title: "การนิเทศถูกเลื่อน",
    message: `การนิเทศ ${studentName} ได้ถูกเลื่อนจากวันที่ ${oldDate} ไปเป็นวันที่ ${newDate}`,
    link: `/advisor/visits/${supervisionId}`,
    data: {
      supervision_id: supervisionId,
      student_id: studentId,
      old_date: oldDate,
      new_date: newDate,
    },
  });

  // แจ้งเตือนนักศึกษา
  const studentNotification = await createNotification({
    user_id: studentId,
    type_id: NotificationType.SUPERVISION_RESCHEDULED,
    title: "การนิเทศถูกเลื่อน",
    message: `การนิเทศของคุณได้ถูกเลื่อนจากวันที่ ${oldDate} ไปเป็นวันที่ ${newDate}`,
    link: `/student/schedule`,
    data: {
      supervision_id: supervisionId,
      advisor_id: advisorId,
      old_date: oldDate,
      new_date: newDate,
    },
  });

  return advisorNotification && studentNotification;
}

/**
 * สร้างการแจ้งเตือนก่อนถึงวันนิเทศ
 * @param advisorId รหัสอาจารย์นิเทศ
 * @param studentId รหัสนักศึกษา
 * @param studentName ชื่อนักศึกษา
 * @param companyName ชื่อบริษัท
 * @param scheduledDate วันที่นัดหมาย
 * @param daysLeft จำนวนวันที่เหลือก่อนถึงวันนิเทศ
 * @param supervisionId รหัสการนิเทศ
 * @returns Promise กับผลการสร้างการแจ้งเตือน
 */
export async function notifySupervisionReminder(
  advisorId: number,
  studentId: number,
  studentName: string,
  companyName: string,
  scheduledDate: string,
  daysLeft: number,
  supervisionId: number
): Promise<boolean> {
  // แจ้งเตือนอาจารย์นิเทศ
  const advisorNotification = await createNotification({
    user_id: advisorId,
    type_id: NotificationType.SUPERVISION_REMINDER_ADVISOR,
    title: `เตือนการนิเทศในอีก ${daysLeft} วัน`,
    message: `การนิเทศนักศึกษา ${studentName} ที่${companyName} จะมีขึ้นในอีก ${daysLeft} วัน (${scheduledDate})`,
    link: `/advisor/visits/${supervisionId}`,
    data: {
      supervision_id: supervisionId,
      student_id: studentId,
      company_name: companyName,
      scheduled_date: scheduledDate,
      days_left: daysLeft,
    },
  });

  // แจ้งเตือนนักศึกษา
  const studentNotification = await createNotification({
    user_id: studentId,
    type_id: NotificationType.SUPERVISION_REMINDER_STUDENT,
    title: `เตือนการนิเทศในอีก ${daysLeft} วัน`,
    message: `อาจารย์จะมานิเทศที่${companyName} ในอีก ${daysLeft} วัน (${scheduledDate})`,
    link: `/student/schedule`,
    data: {
      supervision_id: supervisionId,
      advisor_id: advisorId,
      company_name: companyName,
      scheduled_date: scheduledDate,
      days_left: daysLeft,
    },
  });

  return advisorNotification && studentNotification;
}

/**
 * สร้างการแจ้งเตือนเมื่อการนิเทศเสร็จสิ้น
 * @param advisorId รหัสอาจารย์นิเทศ
 * @param studentId รหัสนักศึกษา
 * @param studentName ชื่อนักศึกษา
 * @param supervisionId รหัสการนิเทศ
 * @returns Promise กับผลการสร้างการแจ้งเตือน
 */
export async function notifySupervisionCompleted(
  advisorId: number,
  studentId: number,
  studentName: string,
  supervisionId: number
): Promise<boolean> {
  // แจ้งเตือนฝ่ายบริหาร/ผู้ดูแลระบบ
  const adminNotification = await createNotification({
    user_id: 1, // สมมติให้ admin มี ID เป็น 1
    type_id: NotificationType.SUPERVISION_COMPLETED,
    title: "การนิเทศเสร็จสิ้น",
    message: `การนิเทศนักศึกษา ${studentName} ได้เสร็จสิ้นแล้ว`,
    link: `/admin/supervision/${supervisionId}`,
    data: {
      supervision_id: supervisionId,
      student_id: studentId,
      advisor_id: advisorId,
    },
  });

  // แจ้งเตือนนักศึกษา
  const studentNotification = await createNotification({
    user_id: studentId,
    type_id: NotificationType.SUPERVISION_COMPLETED,
    title: "การนิเทศเสร็จสิ้น",
    message: "อาจารย์ได้ทำการบันทึกผลการนิเทศของคุณเรียบร้อยแล้ว",
    link: `/student/schedule`,
    data: {
      supervision_id: supervisionId,
      advisor_id: advisorId,
    },
  });

  return adminNotification && studentNotification;
}
