import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import {
  getCacheItem,
  setCacheItem,
  createListCacheKey,
} from "@/lib/blob-cache";

// Cache time in seconds for client-side (in Response headers)
const CLIENT_CACHE_MAX_AGE = 300; // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "";
    const limit = Number(searchParams.get("limit") || "100");
    const skipCache = searchParams.get("skipCache") === "true";

    // สร้าง cache key
    const cacheKey = createListCacheKey(prefix, limit);

    // ลองดึงข้อมูลจาก cache ก่อน (ถ้าไม่ได้ระบุ skipCache)
    let files;
    if (!skipCache) {
      const cachedData = getCacheItem(cacheKey);
      if (cachedData) {
        // ส่ง response พร้อมบอกว่าเป็น cached data
        return NextResponse.json(
          {
            success: true,
            files: cachedData.files,
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

    // ถ้าไม่มี cache หรือระบุ skipCache ก็ดึงข้อมูลจาก Vercel Blob
    const blobs = await list({
      prefix,
      limit,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // เก็บข้อมูลลง cache
    setCacheItem(cacheKey, { files: blobs.blobs });

    return NextResponse.json(
      {
        success: true,
        files: blobs.blobs,
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
        message: `Failed to list files: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
