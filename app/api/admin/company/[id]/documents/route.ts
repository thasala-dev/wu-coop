import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// GET: ดึงเอกสารทั้งหมดของแหล่งฝึกงาน
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const companyId = url.pathname.split("/").slice(-2, -1)[0];

    const sql = neon(`${process.env.DATABASE_URL}`);
    const documents = await sql.query(
      `
      SELECT 
        id,
        name,
        description,
        file_path,
        file_type,
        file_size,
        mime_type,
        category,
        status,
        uploaded_at,
        updated_at
      FROM company_documents 
      WHERE company_id = $1 AND flag_del = 0
      ORDER BY uploaded_at DESC
    `,
      [companyId]
    );

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

// POST: เพิ่มเอกสารใหม่
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const companyId = url.pathname.split("/").slice(-2, -1)[0];
    const body = await request.json();

    const sql = neon(`${process.env.DATABASE_URL}`);

    const result = await sql.query(
      `
      INSERT INTO company_documents (
        company_id, name, description, file_path, file_type, 
        file_size, mime_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        companyId,
        body.name,
        body.description || null,
        body.file_path,
        body.file_type,
        body.file_size,
        body.mime_type,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "เพิ่มเอกสารสำเร็จ",
      data: result[0],
    });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
