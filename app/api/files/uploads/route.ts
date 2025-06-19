import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { invalidateCacheByPrefix } from "@/lib/blob-cache";

// ขนาดไฟล์สูงสุดที่อนุญาตให้อัปโหลดได้ (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: Request) {
  try {
    // รับไฟล์จาก form-data
    const formData = await request.formData();
    const file = formData.get("file");
    const customPath = formData.get("path")?.toString() || "";
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: "No file uploaded.", success: false },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (การป้องกันเพิ่มเติม แม้ client จะควรตรวจสอบก่อนส่งมาแล้ว)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: `File too large. Maximum size is ${(
            MAX_FILE_SIZE /
            (1024 * 1024)
          ).toFixed(1)}MB.`,
          success: false,
        },
        { status: 400 }
      );
    }

    // สร้างชื่อไฟล์พร้อม path
    const originalFilename = (file as File).name || "untitled";
    const fileName = customPath
      ? `${customPath}/${Date.now()}-${originalFilename}`
      : `${Date.now()}-${originalFilename}`;
    // อัปโหลดไฟล์ไปยัง Vercel Blob
    const blob = await put(fileName, file as Blob, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // ล้าง cache list files ที่เกี่ยวข้อง
    invalidateCacheByPrefix("blob:list:" + (customPath || ""));

    return NextResponse.json({
      message: "File uploaded successfully!",
      filePath: blob.url,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error processing file upload.",
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
