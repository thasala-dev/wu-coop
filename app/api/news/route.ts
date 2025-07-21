import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// GET - List ข่าวสาร
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const offset = (page - 1) * pageSize;
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
      whereClause += ` AND (title ILIKE $${paramIndex} OR detail ILIKE $${
        paramIndex + 1
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
        news_date,
        created_at,
        updated_at
      FROM news 
      ${whereClause}
      ORDER BY news_date DESC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(pageSize, offset);

    const news = await sql(newsQuery, queryParams);

    // นับจำนวนทั้งหมด
    const countQuery = `
      SELECT COUNT(*) as total
      FROM news 
      ${whereClause}
    `;
    const countParams = queryParams.slice(0, paramIndex - 2); // ไม่รวม LIMIT และ OFFSET
    const countResult = await sql(countQuery, countParams);
    const total = parseInt(countResult[0].total);

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: {
        news,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
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
      INSERT INTO news (title, detail, status, news_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, title, detail, status, news_date, created_at, updated_at
    `;

    const result = await sql(insertQuery, [
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
