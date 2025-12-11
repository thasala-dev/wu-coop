import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { unlink } from 'fs/promises';
import { join } from 'path';
import { use } from 'react';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'activities');

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const activityId = params.id;
    const fileId = params.fileId;

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Get file information
    const fileData = await sql.query(
      `SELECT filename FROM activity_files WHERE id = $1 AND activity_id = $2`,
      [fileId, activityId]
    );

    if (!fileData || fileData.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบไฟล์ที่ต้องการลบ" },
        { status: 404 }
      );
    }

    // Delete file from database
    await sql.query(
      `DELETE FROM activity_files WHERE id = $1`,
      [fileId]
    );

    // Delete file from disk
    try {
      const filePath = join(UPLOAD_DIR, activityId, fileData[0].filename);
      await unlink(filePath);
    } catch (error) {
      console.error("Error deleting file from disk:", error);
    }

    return NextResponse.json({
      success: true,
      message: "ลบไฟล์สำเร็จ",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
