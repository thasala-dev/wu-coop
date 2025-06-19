/**
 * Formats a visit date and time into a Thai format
 * @param date The date string or Date object
 * @param timeStart The start time string
 * @param timeEnd The end time string
 * @returns Formatted date and time string in Thai format
 */
export const formatVisitDateTime = (
  date: string | Date,
  timeStart: string,
  timeEnd: string
): string => {
  const visitDate = new Date(date);

  // Thai month names
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // Format date to Thai format
  const day = visitDate.getDate();
  const month = thaiMonths[visitDate.getMonth()];
  const year = visitDate.getFullYear() + 543; // Convert to Buddhist era

  return `${day} ${month} ${year} เวลา ${timeStart} - ${timeEnd} น.`;
};

/**
 * Get status display text and color for a visit
 * @param status The visit status
 * @returns Object with text and color for the status
 */
export const getVisitStatusInfo = (
  status: string
): { text: string; color: string } => {
  switch (status) {
    case "upcoming":
      return { text: "กำลังจะถึง", color: "blue" };
    case "completed":
      return { text: "เสร็จสิ้นแล้ว", color: "green" };
    case "cancelled":
      return { text: "ยกเลิกแล้ว", color: "red" };
    default:
      return { text: "ไม่ระบุ", color: "gray" };
  }
};

/**
 * Get the Thai text for visit type
 * @param type The visit type
 * @returns Thai text for the visit type
 */
export const getVisitTypeText = (type: string): string => {
  switch (type) {
    case "onsite":
      return "การนิเทศที่แหล่งฝึกงาน";
    case "online":
      return "การนิเทศออนไลน์";
    default:
      return "ไม่ระบุ";
  }
};

/**
 * Get performance level text and color
 * @param performance The performance level string
 * @returns Object with text and color for the performance level
 */
export const getPerformanceInfo = (
  performance: string
): { text: string; color: string } => {
  switch (performance) {
    case "excellent":
      return { text: "ดีเยี่ยม", color: "green" };
    case "good":
      return { text: "ดี", color: "blue" };
    case "satisfactory":
      return { text: "พอใช้", color: "orange" };
    case "needsImprovement":
      return { text: "ต้องปรับปรุง", color: "red" };
    default:
      return { text: "ไม่ระบุ", color: "gray" };
  }
};
