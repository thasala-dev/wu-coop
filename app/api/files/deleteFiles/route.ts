// pages/api/deleteFile.ts
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("fileName");

  if (!fileName || typeof fileName !== "string") {
    return NextResponse.json(
      { success: false, message: "Missing or invalid fileName." },
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
