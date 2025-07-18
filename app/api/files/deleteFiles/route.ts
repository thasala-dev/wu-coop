import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { invalidateCacheByPrefix } from "@/lib/blob-cache";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  let fileUrl = searchParams.get("url");

  if (!fileUrl || typeof fileUrl !== "string") {
    return NextResponse.json(
      { success: false, message: "Missing or invalid file URL." },
      { status: 400 }
    );
  }

  try {
    // ลบไฟล์ใน Vercel Blob Storage
    await del(fileUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // ล้าง cache list files ทั้งหมด เพราะเราไม่รู้ว่าไฟล์นี้อยู่ใน path ไหน
    invalidateCacheByPrefix("blob:list");

    return NextResponse.json(
      {
        success: true,
        message: `File deleted successfully.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to delete file: ${error.message}` },
      { status: 500 }
    );
  }
}
