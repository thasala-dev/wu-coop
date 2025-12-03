import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// GET /api/supervision/[id] - ดึงข้อมูลการนิเทศตาม ID
export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id } = params;
    const sql = neon(`${process.env.DATABASE_URL}`);

    // ดึงข้อมูลการนิเทศพร้อมข้อมูลที่เกี่ยวข้อง
    const data = await sql(
      `SELECT sup.*, 
             com.name AS company_name, com.location AS company_location,
             adv.fullname AS advisor_name
      FROM supervisions sup
      JOIN user_company com ON sup.regist_intern_id = com.id
      JOIN user_advisor adv ON sup.advisor_id = adv.id
       WHERE sup.id = $1`,
      [id]
    );

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการนิเทศ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ดึงข้อมูลการนิเทศสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error fetching supervision:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

// PUT /api/supervision/[id] - อัปเดตข้อมูลการนิเทศ
export async function PUT(request: NextRequest, { params }: any) {
  try {
    const { id } = params;
    const body = await request.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    // สร้าง query สำหรับอัปเดตข้อมูล
    const updateFields = [];
    const queryParams = [id]; // พารามิเตอร์แรกคือ ID
    let paramCount = 2;

    // เพิ่มฟิลด์ที่ต้องการอัปเดต
    if (body.advisor_id !== undefined) {
      updateFields.push(`advisor_id = $${paramCount++}`);
      queryParams.push(body.advisor_id);
    }

    if (body.regist_intern_id !== undefined) {
      updateFields.push(`regist_intern_id = $${paramCount++}`);
      queryParams.push(body.regist_intern_id);
    }

    if (body.scheduled_date !== undefined) {
      updateFields.push(`scheduled_date = $${paramCount++}`);
      queryParams.push(body.scheduled_date);
    }

    if (body.start_time !== undefined) {
      updateFields.push(`start_time = $${paramCount++}`);
      queryParams.push(body.start_time);
    }

    if (body.end_time !== undefined) {
      updateFields.push(`end_time = $${paramCount++}`);
      queryParams.push(body.end_time);
    }

    if (body.status !== undefined) {
      updateFields.push(`status = $${paramCount++}`);
      queryParams.push(body.status);
    }

    if (body.visit_type !== undefined) {
      updateFields.push(`visit_type = $${paramCount++}`);
      queryParams.push(body.visit_type);
    }

    if (body.type !== undefined) {
      updateFields.push(`type = $${paramCount++}`);
      queryParams.push(body.type);
    }

    if (body.comments !== undefined) {
      updateFields.push(`comments = $${paramCount++}`);
      queryParams.push(body.comments);
    }
    if (body.calendar_id !== undefined) {
      updateFields.push(`calendar_id = $${paramCount++}`);
      queryParams.push(body.calendar_id);
    }

    // เพิ่ม updated_at timestamp
    updateFields.push("updated_at = CURRENT_TIMESTAMP");

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่มีข้อมูลที่จะอัปเดต" },
        { status: 400 }
      );
    }

    // สร้าง query สำหรับอัปเดต
    const query = `UPDATE supervisions SET ${updateFields.join(
      ", "
    )} WHERE id = $1 RETURNING *`;
    const data = await sql(query, queryParams);

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการนิเทศที่ต้องการอัปเดต" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "อัปเดตข้อมูลการนิเทศสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error updating supervision:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    );
  }
}

// DELETE /api/supervision/[id] - ลบข้อมูลการนิเทศ
export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { id } = params;
    const sql = neon(`${process.env.DATABASE_URL}`);

    // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
    const checkData = await sql("SELECT id FROM supervisions WHERE id = $1", [
      id,
    ]);

    if (checkData.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการนิเทศที่ต้องการลบ" },
        { status: 404 }
      );
    }

    // ลบข้อมูลการนิเทศ
    await sql("DELETE FROM supervisions WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลการนิเทศสำเร็จ",
    });
  } catch (error) {
    console.error("Error deleting supervision:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
