// lib/file-api.ts
// Client Component API สำหรับจัดการไฟล์ด้วย @vercel/blob

export interface BlobFile {
  url: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  contentLength: number;
  uploadedAt: string;
}

export interface UploadResponse {
  message: string;
  filePath?: string;
  success: boolean;
  error?: string;
}

export interface DeleteResponse {
  message: string;
  success: boolean;
  error?: string;
}

export interface ListResponse {
  files: BlobFile[];
  success: boolean;
  error?: string;
}

export interface FileResponse {
  file?: BlobFile;
  success: boolean;
  cached?: boolean;
  error?: string;
}

/**
 * อัปโหลดไฟล์ไปยัง Vercel Blob Storage
 * @param file ไฟล์ที่ต้องการอัปโหลด
 * @param path (optional) โฟลเดอร์เสมือนที่ต้องการเก็บไฟล์
 * @param processImage (optional) ลดขนาดไฟล์รูปอัตโนมัติหรือไม่ (true = ทำ, false = ไม่ทำ)
 */
export async function callUploadApi(
  file: File,
  path: string = "",
  processImage: boolean = true
): Promise<UploadResponse> {
  try {
    // นำเข้า module ด้วย dynamic import เพื่อให้ใช้ในฝั่ง client ได้
    const { prepareFileForUpload, MAX_FILE_SIZE } = await import('./image-resizer');
    
    // ตรวจสอบขนาดไฟล์และลดขนาดถ้าจำเป็น
    let processedFile: File;
    if (processImage) {
      processedFile = await prepareFileForUpload(file);
    } else {
      // ถ้าไม่ต้องการประมวลผลรูปภาพ แค่ตรวจสอบขนาด
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is 2MB.`);
      }
      processedFile = file;
    }
    
    const formData = new FormData();
    formData.append("file", processedFile);
    formData.append("path", path);
    
    const response = await fetch("/api/files/uploads", {
      method: "POST",
      body: formData,
    });
    
    return response.json();
  } catch (error: any) {
    // ส่งค่า error กลับในรูปแบบที่มีโครงสร้างเหมือนกับ response ปกติ
    return {
      success: false,
      message: "Upload failed",
      error: error.message || "Unknown error",
    };
  }
}

/**
 * ลบไฟล์จาก Vercel Blob Storage
 * @param url URL ของไฟล์ที่ต้องการลบ
 */
export async function callDeleteApi(url: string): Promise<DeleteResponse> {
  const response = await fetch(
    `/api/files/deleteFiles?url=${encodeURIComponent(url)}`,
    {
      method: "DELETE",
    }
  );

  return response.json();
}

/**
 * ดึงรายการไฟล์จาก Vercel Blob Storage
 * @param prefix (optional) ดึงเฉพาะไฟล์ที่ขึ้นต้นด้วยคำนี้
 * @param limit (optional) จำนวนไฟล์สูงสุดที่จะดึงมา (default: 100)
 * @param skipCache (optional) ข้าม cache และเรียกข้อมูลจาก Vercel Blob โดยตรง
 */
export async function callListApi(
  prefix: string = "",
  limit: number = 100,
  skipCache: boolean = false
): Promise<ListResponse> {
  // ใช้ SWR pattern: stale-while-revalidate
  const url = `/api/files/list?prefix=${encodeURIComponent(prefix)}&limit=${limit}${
    skipCache ? "&skipCache=true" : ""
  }`;
  
  // ตั้งค่าให้ใช้ cache ที่กำหนดโดย server
  const response = await fetch(url, {
    method: "GET",
    cache: skipCache ? "no-store" : "default",
    next: { revalidate: skipCache ? 0 : 300 }, // 5 นาที (สำหรับ Next.js App Router)
  });

  return response.json();
}

/**
 * ดึงข้อมูลไฟล์เดี่ยวจาก Vercel Blob Storage
 * @param url URL ของไฟล์ที่ต้องการข้อมูล
 * @param skipCache (optional) ข้าม cache และเรียกข้อมูลจาก Vercel Blob โดยตรง
 */
export async function callGetFileApi(
  url: string,
  skipCache: boolean = false
): Promise<FileResponse> {
  const response = await fetch(
    `/api/files/get?url=${encodeURIComponent(url)}${
      skipCache ? "&skipCache=true" : ""
    }`,
    {
      method: "GET",
      cache: skipCache ? "no-store" : "default",
      next: { revalidate: skipCache ? 0 : 3600 }, // 1 hour
    }
  );

  return response.json();
}
