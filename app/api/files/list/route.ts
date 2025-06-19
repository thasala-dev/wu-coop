import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "";
    const limit = Number(searchParams.get("limit") || "100");

    // ดึงรายการไฟล์จาก Vercel Blob
    const blobs = await list({
      prefix,
      limit,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      files: blobs.blobs,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to list files: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
