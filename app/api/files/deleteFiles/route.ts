import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  let fileName = searchParams.get("fileName");

  if (!fileName || typeof fileName !== "string") {
    return NextResponse.json(
      { success: false, message: "Missing or invalid fileName." },
      { status: 400 }
    );
  }

  // Remove leading /uploads/ if exists
  if (fileName.startsWith("/uploads/")) {
    fileName = fileName.substring("/uploads/".length);
  }
  // Remove leading slash if exists
  if (fileName.startsWith("/")) {
    fileName = fileName.substring(1);
  }
  // Prevent path traversal (../)
  if (fileName.includes("..")) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid fileName (path traversal not allowed).",
      },
      { status: 400 }
    );
  }

  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  try {
    await fs.unlink(filePath);
    return NextResponse.json(
      {
        success: true,
        message: `File ${fileName} deleted successfully.`,
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
