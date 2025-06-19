import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

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
