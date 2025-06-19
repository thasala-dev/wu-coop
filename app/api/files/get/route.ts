import { head } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getCacheItem, setCacheItem } from "@/lib/blob-cache";

// Cache time in seconds for client-side (in Response headers)
const CLIENT_CACHE_MAX_AGE = 3600; // 1 hour for single file metadata

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const skipCache = searchParams.get("skipCache") === "true";

    if (!url) {
      return NextResponse.json(
        { success: false, message: "Missing URL parameter" },
        { status: 400 }
      );
    }

    // สร้าง cache key
    const cacheKey = `blob:file:${url}`;

    // ลองดึงจาก cache ก่อน
    if (!skipCache) {
      const cachedFile = getCacheItem(cacheKey);
      if (cachedFile) {
        return NextResponse.json(
          {
            success: true,
            file: cachedFile,
            cached: true,
          },
          {
            headers: {
              "Cache-Control": `public, max-age=${CLIENT_CACHE_MAX_AGE}`,
            },
          }
        );
      }
    }

    // ถ้าไม่มีใน cache หรือ skipCache เป็น true ก็ดึงข้อมูลจาก Vercel Blob
    const file = await head(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    // บันทึกลง cache
    setCacheItem(cacheKey, file);

    return NextResponse.json(
      {
        success: true,
        file,
        cached: false,
      },
      {
        headers: {
          "Cache-Control": `public, max-age=${CLIENT_CACHE_MAX_AGE}`,
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to get file: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
