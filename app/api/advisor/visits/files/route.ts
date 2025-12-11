import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const visitId = url.searchParams.get("visitId");
    const fileType = url.searchParams.get("fileType");

    if (!visitId) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุรหัสการนิเทศ" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    let query = `
      SELECT * 
      FROM advisor_visit_files
      WHERE visit_id = $1
    `;

    const params = [visitId];

    if (fileType) {
      query += ` AND file_type = $2`;
      params.push(fileType);
    }

    query += ` ORDER BY created_at DESC`;

    const data = await sql.query(query, params);

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data,
    });
  } catch (error) {
    console.error("Error in GET /api/advisor/visits/files:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const visitId = formData.get("visitId") as string;
    const fileType = formData.get("fileType") as string;
    const file = formData.get("file") as File;

    if (!visitId || !file || !fileType) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุข้อมูลที่จำเป็น" },
        { status: 400 }
      );
    }

    // Check if visit exists
    const sql = neon(`${process.env.DATABASE_URL}`);
    const visit = await sql.query(
      `SELECT * FROM advisor_visits WHERE id = $1`,
      [visitId]
    );

    if (visit.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการนิเทศ" },
        { status: 404 }
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const originalFilename = file.name;
    const fileExtension = path.extname(originalFilename);
    const filename = `visit_${visitId}_${timestamp}${fileExtension}`;

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", "visits");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save the file
    const filePath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save file info to database
    const fileData = await sql.query(
      `INSERT INTO advisor_visit_files 
        (visit_id, file_type, filename, original_filename, file_size, mime_type) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        visitId,
        fileType,
        filename,
        originalFilename,
        file.size,
        file.type
      ]
    );

    return NextResponse.json({
      success: true,
      message: "อัปโหลดไฟล์สำเร็จ",
      data: fileData[0],
    });
  } catch (error) {
    console.error("Error in POST /api/advisor/visits/files:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" },
      { status: 500 }
    );
  }
}
