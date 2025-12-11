import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Get a specific file by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);

    const data = await sql.query(
      `SELECT * FROM advisor_visit_files WHERE id = $1`,
      [fileId]
    );

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลไฟล์" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ดำเนินการสำเร็จ",
      data: data[0],
    });
  } catch (error) {
    console.error("Error in GET /api/advisor/visits/files/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

// Delete a file
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Get file info
    const fileInfo = await sql.query(
      `SELECT * FROM advisor_visit_files WHERE id = $1`,
      [fileId]
    );

    if (fileInfo.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลไฟล์" },
        { status: 404 }
      );
    }

    // Delete the file from storage
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "visits",
      fileInfo[0].filename
    );

    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Delete from database
    await sql.query(
      `DELETE FROM advisor_visit_files WHERE id = $1`,
      [fileId]
    );

    return NextResponse.json({
      success: true,
      message: "ลบไฟล์สำเร็จ",
    });
  } catch (error) {
    console.error("Error in DELETE /api/advisor/visits/files/[id]:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการลบไฟล์" },
      { status: 500 }
    );
  }
}
