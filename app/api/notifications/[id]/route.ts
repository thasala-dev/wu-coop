import { NextResponse } from "next/server";

// PUT /api/notifications/[id] - อัปเดตสถานะการแจ้งเตือน (เช่น อ่านแล้ว)
export async function PUT(
  request: Request,
  { params }: any
) {
  try {
    const id = params.id;
    const body = await request.json();

    // ในอนาคตอัปเดตสถานะการแจ้งเตือนในฐานข้อมูล
    // const result = await db.query(
    //   'UPDATE notifications SET is_read = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    //   [body.is_read, id]
    // );

    // สำหรับการทดสอบ
    console.log(`Updating notification ${id}:`, body);

    return NextResponse.json(
      {
        success: true,
        message: "อัปเดตสถานะการแจ้งเตือนสำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการอัปเดตสถานะการแจ้งเตือน",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] - ลบการแจ้งเตือน
export async function DELETE(
  request: Request,
  { params }: any
) {
  try {
    const id = params.id;

    // ในอนาคตลบการแจ้งเตือนจากฐานข้อมูล
    // const result = await db.query('DELETE FROM notifications WHERE id = $1', [id]);

    // สำหรับการทดสอบ
    console.log(`Deleting notification ${id}`);

    return NextResponse.json(
      {
        success: true,
        message: "ลบการแจ้งเตือนสำเร็จ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการลบการแจ้งเตือน",
      },
      { status: 500 }
    );
  }
}
