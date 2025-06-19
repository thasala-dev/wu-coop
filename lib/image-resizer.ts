// lib/image-resizer.ts
// ฟังก์ชันสำหรับลดขนาดรูปภาพที่ client-side
// หมายเหตุ: ไฟล์นี้ใช้ได้เฉพาะในฝั่ง client เท่านั้น เนื่องจากใช้ Browser API

/**
 * กำหนดคุณภาพของรูปภาพที่จะบีบอัด (0-1)
 * - 0.8 = 80% คุณภาพ (คุณภาพดี, ขนาดเล็กพอสมควร)
 * - 0.6 = 60% คุณภาพ (ขนาดเล็กกว่า แต่คุณภาพลดลง)
 */
const DEFAULT_QUALITY = 0.8;

/**
 * ขนาดสูงสุดของรูปภาพ (พิกเซล) สำหรับรูปที่ใหญ่เกินไป
 * - รูปที่มีความกว้างหรือสูงมากกว่านี้จะถูกปรับขนาด
 */
const MAX_IMAGE_DIMENSION = 1920;

/**
 * ขนาดไฟล์สูงสุดที่อนุญาต (bytes)
 * - 2MB = 2 * 1024 * 1024 = 2097152 bytes
 */
export const MAX_FILE_SIZE = 2 * 1024 * 1024;

/**
 * ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * ลดขนาดรูปภาพ โดยการย่อขนาดและลดคุณภาพ
 * @param imageFile ไฟล์รูปภาพที่ต้องการลดขนาด
 * @param maxSizeBytes ขนาดไฟล์สูงสุดที่ต้องการ (bytes)
 * @param quality คุณภาพของรูปภาพ (0-1)
 * @returns ไฟล์รูปภาพที่ถูกลดขนาดแล้ว
 */
export async function resizeImage(
  imageFile: File,
  maxSizeBytes: number = MAX_FILE_SIZE,
  quality: number = DEFAULT_QUALITY
): Promise<File> {
  // ถ้าขนาดไฟล์เล็กกว่าขนาดสูงสุด ไม่ต้องปรับขนาด
  if (imageFile.size <= maxSizeBytes) {
    return imageFile;
  }

  // สร้าง URL ของรูปภาพ
  const imageBitmap = await createImageBitmap(imageFile);
  
  // คำนวณอัตราส่วนการย่อขนาด
  let width = imageBitmap.width;
  let height = imageBitmap.height;
  
  // ถ้ารูปใหญ่เกินไป ให้ย่อตามขนาดสูงสุดที่กำหนด
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    const ratio = Math.min(
      MAX_IMAGE_DIMENSION / width,
      MAX_IMAGE_DIMENSION / height
    );
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }
  
  // สร้าง canvas เพื่อวาดรูป
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // วาดรูปลงใน canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  ctx.drawImage(imageBitmap, 0, 0, width, height);
  
  // แปลง canvas เป็น Blob
  // ลองลดคุณภาพลงทีละน้อย ถ้าขนาดยังใหญ่อยู่
  let currentQuality = quality;
  let blob: Blob | null = null;
  
  // วนลูปลดคุณภาพลง ถ้ายังใหญ่เกินไป
  for (let attempt = 0; attempt < 3; attempt++) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, imageFile.type, currentQuality);
    });
    
    if (!blob || blob.size <= maxSizeBytes) {
      break;
    }
    
    // ลดคุณภาพลง 20% ในแต่ละรอบ
    currentQuality *= 0.8;
  }
  
  if (!blob) {
    throw new Error('Failed to resize image');
  }
  
  // สร้างไฟล์ใหม่จาก Blob
  return new File([blob], imageFile.name, {
    type: imageFile.type,
    lastModified: Date.now(),
  });
}

/**
 * เตรียมไฟล์ก่อนอัปโหลด โดยตรวจสอบขนาดและประเภท
 * - ถ้าเป็นรูปภาพและขนาดใหญ่เกินไป จะลดขนาด
 * - ถ้าไม่ใช่รูปภาพและขนาดใหญ่เกินไป จะ throw error
 */
export async function prepareFileForUpload(file: File): Promise<File> {
  // ตรวจสอบขนาดไฟล์
  if (file.size > MAX_FILE_SIZE) {
    // ถ้าเป็นรูปภาพ ให้ลดขนาด
    if (isImageFile(file)) {
      return await resizeImage(file);
    } else {
      // ถ้าไม่ใช่รูปภาพ ให้แจ้งเตือน
      throw new Error(`File too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
    }
  }

  // ถ้าขนาดไม่เกิน ส่งไฟล์เดิมกลับไป
  return file;
}

/**
 * แปลงขนาดไฟล์เป็นหน่วยที่อ่านได้ง่าย (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
