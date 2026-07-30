import { head } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";

const CACHE_CONTROL = "public, max-age=3600";

function isVercelBlobUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireSession(request);
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url || !isVercelBlobUrl(url)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid URL parameter" },
        { status: 400 }
      );
    }

    const file = await head(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, file },
      { headers: { "Cache-Control": CACHE_CONTROL } }
    );
  } catch (error: any) {
    console.error("[/api/files/get] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get file." },
      { status: 500 }
    );
  }
}
