// pages/api/deleteFile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  return NextResponse.json(
    { message: "Request body is empty.", success: false },
    { status: 400 }
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { fileName } = req.query;

    if (!fileName || typeof fileName !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid fileName." });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    try {
      await fs.unlink(filePath);
      return res.status(200).json({
        success: true,
        message: `File ${fileName} deleted successfully.`,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: `Failed to delete file: ${error.message}`,
      });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed.` });
  }
}
