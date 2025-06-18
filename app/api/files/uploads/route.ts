// app/api/files/uploads/route.ts
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
import { Readable, PassThrough } from "stream"; // Import PassThrough

// IMPORTANT: This is crucial for formidable to work correctly.
// It tells Next.js NOT to parse the body, so formidable can do it.
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fsSync.existsSync(uploadDir)) {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 1, // Expecting only one file
      multiples: false,
    });

    // === CRITICAL: Create a Node.js Readable stream compatible with formidable ===
    // 1. Get the Web ReadableStream from the request body
    const webReadableStream = request.body;

    if (!webReadableStream) {
      return NextResponse.json(
        { message: "Request body is empty.", success: false },
        { status: 400 }
      );
    }

    // 2. Convert Web ReadableStream to Node.js ReadableStream using PassThrough
    //    and a wrapper for stream events/methods.
    //    We need a stream that behaves like http.IncomingMessage.
    const nodeReadable = new PassThrough();
    // Pipe the web stream to the PassThrough stream.
    // Readable.fromWeb will convert a standard Web ReadableStream to a Node.js ReadableStream
    // which can then be piped.
    Readable.fromWeb(webReadableStream as any).pipe(nodeReadable); // Cast to any due to type differences

    // 3. Create a mock Node.js IncomingMessage object
    //    This object must have the 'headers' property and also *be* a Readable stream.
    const mockReq = Object.assign(nodeReadable, {
      headers: Object.fromEntries(request.headers.entries()),
      method: request.method,
      url: request.url,
    });

    // 4. Parse the mock Node.js request object with formidable
    const { fields, files } = await new Promise<{
      fields: Fields;
      files: Files;
    }>((resolve, reject) => {
      // Pass the mock Node.js request object to formidable
      // formidable expects this to be a Node.js IncomingMessage.
      form.parse(mockReq as any, (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    // === Remaining logic (same as before) ===
    const uploadedFileArray = files.file; // 'file' is the name of your input field

    if (
      !uploadedFileArray ||
      !Array.isArray(uploadedFileArray) ||
      uploadedFileArray.length === 0
    ) {
      console.error(
        "No file uploaded or 'file' field is missing/empty in files object."
      );
      return NextResponse.json(
        { message: "No file uploaded or file field missing.", success: false },
        { status: 400 }
      );
    }

    const uploadedFile: FormidableFile = uploadedFileArray[0];

    if (!uploadedFile.filepath) {
      console.error("Uploaded file has no filepath.");
      return NextResponse.json(
        { message: "Uploaded file data is incomplete.", success: false },
        { status: 500 }
      );
    }

    const oldPath = uploadedFile.filepath;
    const originalFilename = uploadedFile.originalFilename || "untitled";
    const fileName = `${Date.now()}-${originalFilename}`;
    const newPath = path.join(uploadDir, fileName);

    await fs.rename(oldPath, newPath);

    const relativePath = `/uploads/${fileName}`;
    return NextResponse.json({
      message: "File uploaded successfully!",
      filePath: relativePath,
      success: true,
    });
  } catch (error: any) {
    console.error("Error in file upload route:", error);
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
