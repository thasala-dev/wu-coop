import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

function sanitizePath(p: string): string {
  return p
    .replace(/\.\./g, "")
    .replace(/[^\w\-/]/g, "")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "")
    .slice(0, 200);
}

function sanitizeFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const rawBase = dot > 0 ? name.slice(0, dot) : name;
  const rawExt = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const base =
    rawBase.replace(/[^\w\-]/g, "_").slice(0, 100) || "file";
  const ext = rawExt.replace(/[^\w.]/g, "").slice(0, 10);
  return base + ext;
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    if (session instanceof NextResponse) return session;

    const formData = await request.formData();
    const file = formData.get("file");
    const rawPath = formData.get("path")?.toString() || "";

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: "No file uploaded.", success: false },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        {
          message: "Invalid file type. Only JPEG, PNG, and PDF are allowed.",
          success: false,
        },
        { status: 400 }
      );
    }

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

    const safePath = sanitizePath(rawPath);
    const safeFilename = sanitizeFilename(
      (file as File).name || "untitled"
    );
    const fullPath = safePath ? `${safePath}/${safeFilename}` : safeFilename;

    const blob = await put(fullPath, file as Blob, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      message: "File uploaded successfully!",
      filePath: blob.url,
      success: true,
    });
  } catch (error: any) {
    console.error("[/api/files/uploads] error:", error);
    return NextResponse.json(
      {
        message: "Error processing file upload.",
        success: false,
      },
      { status: 500 }
    );
  }
}
