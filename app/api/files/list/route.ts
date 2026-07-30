import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";

// พึ่ง HTTP Cache-Control ให้ browser/CDN cache แทน in-memory cache
const CACHE_CONTROL = "public, max-age=60, stale-while-revalidate=300";

export async function GET(request: Request) {
  try {
    const session = await requireSession(request);
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const prefix = (searchParams.get("prefix") || "").replace(/\.\./g, "");
    const rawLimit = Number(searchParams.get("limit") || "100");
    const limit = Math.min(
      Math.max(Number.isFinite(rawLimit) ? rawLimit : 100, 1),
      1000
    );
    const cursor = searchParams.get("cursor") || undefined;

    const blobs = await list({
      prefix,
      limit,
      cursor,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json(
      {
        success: true,
        files: blobs.blobs,
        cursor: blobs.cursor,
        hasMore: blobs.hasMore,
      },
      {
        headers: { "Cache-Control": CACHE_CONTROL },
      }
    );
  } catch (error: any) {
    console.error("[/api/files/list] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to list files." },
      { status: 500 }
    );
  }
}
