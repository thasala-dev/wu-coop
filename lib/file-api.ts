// src/lib/file-api.ts
// นี่คือไฟล์ที่จะ import เข้าไปใน Client Component ของคุณ

interface UploadResponse {
  message: string;
  filePath?: string;
  error?: string;
}

interface DeleteResponse {
  message: string;
  error?: string;
}

export async function callUploadApi(
  file: File,
  path: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  const response = await fetch("/api/files/uploads", {
    // เรียกไปยัง Next.js API Route
    method: "POST",
    body: formData,
  });

  return response.json();
}

export async function callDeleteApi(fileName: string): Promise<DeleteResponse> {
  const response = await fetch(
    `/api/files/deleteFiles?fileName=${encodeURIComponent(fileName)}`,
    {
      // เรียกไปยัง Next.js API Route
      method: "DELETE",
    }
  );

  return response.json();
}
