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

/**
 * อัปโหลดไฟล์ไปยัง Vercel Blob Storage
 * @param file ไฟล์ที่ต้องการอัปโหลด
 * @param path (optional) โฟลเดอร์เสมือนที่ต้องการเก็บไฟล์
 */
export async function callUploadApi(
  file: File,
  path: string = ""
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  const response = await fetch("/api/files/uploads", {
    method: "POST",
    body: formData,
  });

  return response.json();
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
 */
export async function callListApi(
  prefix: string = "",
  limit: number = 100
): Promise<ListResponse> {
  const response = await fetch(
    `/api/files/list?prefix=${encodeURIComponent(prefix)}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  return response.json();
}
