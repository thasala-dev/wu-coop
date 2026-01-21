import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { use } from 'react';

// Define the upload directory
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'activities');

export async function POST(request: NextRequest, { params }: any) {
  try {
    const activityId = params.id;

    // Check if activity exists
    const sql = neon(`${process.env.DATABASE_URL}`);
    const activityCheck = await sql.query(
      `SELECT id FROM student_activities WHERE id = $1`,
      [activityId]
    );

    if (!activityCheck || activityCheck.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลกิจกรรม" },
        { status: 404 }
      );
    }

    // Get the form data with the file
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "ไม่พบไฟล์ที่อัปโหลด" },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const originalFilename = file.name;
    const fileExtension = originalFilename.split('.').pop() || '';
    const uniqueFilename = `activity_${activityId}_${Date.now()}.${fileExtension}`;

    // Make sure upload directory exists
    const activityUploadDir = join(UPLOAD_DIR, activityId);
    if (!existsSync(activityUploadDir)) {
      await mkdir(activityUploadDir, { recursive: true });
    }

    // Save the file
    const filePath = join(activityUploadDir, uniqueFilename);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);

    // Save file info to database
    const fileData = await sql.query(
      `INSERT INTO activity_files 
        (activity_id, filename, original_filename, file_size, file_type) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        activityId,
        uniqueFilename,
        originalFilename,
        file.size,
        file.type
      ]
    );

    return NextResponse.json({
      success: true,
      message: "อัปโหลดไฟล์สำเร็จ",
      data: {
        id: fileData[0].id,
        filename: uniqueFilename,
        originalFilename: originalFilename,
        fileSize: file.size,
        fileType: file.type,
        url: `/uploads/activities/${activityId}/${uniqueFilename}`
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" },
      { status: 500 }
    );
  }
}
