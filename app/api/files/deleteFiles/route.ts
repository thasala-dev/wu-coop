import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";

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

export async function DELETE(request: Request) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl || !isVercelBlobUrl(fileUrl)) {
    return NextResponse.json(
      { success: false, message: "Missing or invalid file URL." },
      { status: 400 }
    );
  }

  try {
    await del(fileUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json(
      {
        success: true,
        message: "File deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[/api/files/deleteFiles] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete file." },
      { status: 500 }
    );
  }
}
