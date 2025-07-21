import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// GET - ดึงข่าวสารตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          success: false,
          message: "ID ไม่ถูกต้อง",
        },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    const query = `
      SELECT 
        id,
        title,
        detail,
        status,
        news_date
      FROM news 
      WHERE id = $1
    `;

    const result = await sql(query, [parseInt(id)]);

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข่าวสารที่ระบุ",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลข่าวสาร",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - แก้ไขข่าวสาร
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, detail, status, news_date } = body;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          success: false,
          message: "ID ไม่ถูกต้อง",
        },
        { status: 400 }
      );
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณาระบุชื่อเรื่อง",
        },
        { status: 400 }
      );
    }

    if (!detail?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณาระบุรายละเอียด",
        },
        { status: 400 }
      );
    }

    if (status === undefined || status === null) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณาระบุสถานะ",
        },
        { status: 400 }
      );
    }

    if (!news_date) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณาระบุวันที่ข่าว",
        },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // ตรวจสอบว่าข่าวสารนี้มีอยู่หรือไม่
    const checkQuery = `SELECT id FROM news WHERE id = $1`;
    const existing = await sql(checkQuery, [parseInt(id)]);

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข่าวสารที่ต้องการแก้ไข",
        },
        { status: 404 }
      );
    }

    // อัปเดตข่าวสาร
    const updateQuery = `
      UPDATE news 
      SET 
        title = $1,
        detail = $2,
        status = $3,
        news_date = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING id, title, detail, status, news_date, created_at, updated_at
    `;

    const result = await sql(updateQuery, [
      title.trim(),
      detail.trim(),
      parseInt(status),
      news_date,
      parseInt(id),
    ]);

    return NextResponse.json({
      success: true,
      message: "แก้ไขข่าวสารเรียบร้อยแล้ว",
      data: result[0],
    });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการแก้ไขข่าวสาร",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - ลบข่าวสาร
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          success: false,
          message: "ID ไม่ถูกต้อง",
        },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // ตรวจสอบว่าข่าวสารนี้มีอยู่หรือไม่
    const checkQuery = `SELECT id, title FROM news WHERE id = $1`;
    const existing = await sql(checkQuery, [parseInt(id)]);

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบข่าวสารที่ต้องการลบ",
        },
        { status: 404 }
      );
    }

    // ลบข่าวสาร
    const deleteQuery = `DELETE FROM news WHERE id = $1`;
    await sql(deleteQuery, [parseInt(id)]);

    return NextResponse.json({
      success: true,
      message: "ลบข่าวสารเรียบร้อยแล้ว",
      data: {
        id: parseInt(id),
        title: existing[0].title,
      },
    });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการลบข่าวสาร",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
