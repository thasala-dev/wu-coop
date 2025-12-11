import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// GET - List ข่าวสาร
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const sql = neon(`${process.env.DATABASE_URL}`);

    // สร้าง WHERE clause
    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;

    // กรองตามสถานะ
    if (status !== null && status !== "all") {
      whereClause += ` AND status = $${paramIndex}`;
      queryParams.push(parseInt(status));
      paramIndex++;
    }

    // ค้นหาจากชื่อเรื่องหรือรายละเอียด
    if (search.trim() !== "") {
      whereClause += ` AND (title ILIKE $${paramIndex} OR detail ILIKE $${paramIndex + 1
        })`;
      queryParams.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    // ดึงข้อมูลข่าวสาร
    const newsQuery = `
      SELECT 
        id,
        title,
        detail,
        status,
        news_date
      FROM news 
      ${whereClause}
      ORDER BY news_date DESC
    `;

    const news = await sql.query(newsQuery, queryParams);

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: news,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
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

// POST - เพิ่มข่าวสารใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, detail, status, news_date } = body;

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

    // เพิ่มข่าวสารใหม่
    const insertQuery = `
      INSERT INTO news (title, detail, status, news_date)
      VALUES ($1, $2, $3, $4)
      RETURNING title, detail, status, news_date
    `;

    const result = await sql.query(insertQuery, [
      title.trim(),
      detail.trim(),
      parseInt(status),
      news_date,
    ]);

    return NextResponse.json({
      success: true,
      message: "เพิ่มข่าวสารเรียบร้อยแล้ว",
      data: result[0],
    });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการเพิ่มข่าวสาร",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
