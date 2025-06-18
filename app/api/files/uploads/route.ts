import {
  IncomingForm,
  Fields,
  Files,
  File as FormidableFile,
} from "formidable";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { Readable, PassThrough } from "stream";

export const config = {
  api: { bodyParser: false },
};

export async function POST(request: Request) {
  try {
    const baseUploadDir = path.join(process.cwd(), "public", "uploads");

    // === Step 1: Prepare formidable form ===
    const form = new IncomingForm({
      uploadDir: baseUploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
      maxFiles: 1,
      multiples: false,
    });

    // === Step 2: Pipe body to formidable ===
    const webReadableStream = request.body;
    if (!webReadableStream) {
      return NextResponse.json(
        { message: "Request body is empty.", success: false },
        { status: 400 }
      );
    }
    const nodeReadable = new PassThrough();
    Readable.fromWeb(webReadableStream as any).pipe(nodeReadable);
    const mockReq = Object.assign(nodeReadable, {
      headers: Object.fromEntries(request.headers.entries()),
      method: request.method,
      url: request.url,
    });

    // === Step 3: Parse with formidable ===
    const { fields, files } = await new Promise<{
      fields: Fields;
      files: Files;
    }>((resolve, reject) => {
      form.parse(mockReq as any, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    // === Step 4: Find the file ===
    const uploadedFileArray = files.file;
    if (
      !uploadedFileArray ||
      !Array.isArray(uploadedFileArray) ||
      uploadedFileArray.length === 0
    ) {
      return NextResponse.json(
        { message: "No file uploaded or file field missing.", success: false },
        { status: 400 }
      );
    }
    const uploadedFile: FormidableFile = uploadedFileArray[0];
    if (!uploadedFile.filepath) {
      return NextResponse.json(
        { message: "Uploaded file data is incomplete.", success: false },
        { status: 500 }
      );
    }

    // === Step 5: Get custom path from fields ===
    // fields.path อาจเป็น string หรือ string[]
    let customPath = "";
    if (fields.path) {
      if (Array.isArray(fields.path)) {
        customPath = fields.path[0] || "";
      } else {
        customPath = fields.path as string;
      }
    }
    // sanitize customPath (prevent directory traversal)
    customPath = customPath.replace(/(\.\.(\/|\\|$))+/g, "");

    // === Step 6: Create directory if needed ===
    const uploadDir = customPath
      ? path.join(baseUploadDir, customPath)
      : baseUploadDir;

    if (!fsSync.existsSync(uploadDir)) {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // === Step 7: Move file to correct folder ===
    const oldPath = uploadedFile.filepath;
    const originalFilename = uploadedFile.originalFilename || "untitled";
    const fileName = `${Date.now()}-${originalFilename}`;
    const newPath = path.join(uploadDir, fileName);

    await fs.rename(oldPath, newPath);

    const relativePath = customPath
      ? `/uploads/${customPath}/${fileName}`
      : `/uploads/${fileName}`;
    return NextResponse.json({
      message: "File uploaded successfully!",
      filePath: relativePath,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error processing file upload.",
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
