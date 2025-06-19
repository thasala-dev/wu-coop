// lib/blob-cache.ts
// เก็บ cache ของข้อมูลจาก Vercel Blob เพื่อลดการใช้ transaction

import { cache } from "react";

export interface BlobCache {
  timestamp: number; // เวลาที่เก็บข้อมูล (timestamp)
  data: any; // ข้อมูลที่เก็บไว้
}

// คงค่า cache ไว้นาน 5 นาที (300000 ms)
const CACHE_DURATION = 300000; 

// memory cache object
const cacheStore: Record<string, BlobCache> = {};

/**
 * เก็บข้อมูลลง cache
 */
export function setCacheItem(key: string, data: any): void {
  cacheStore[key] = {
    timestamp: Date.now(),
    data
  };
}

/**
 * ดึงข้อมูลจาก cache ถ้าข้อมูลยังไม่หมดอายุ
 * @returns ข้อมูลจาก cache หรือ null ถ้าไม่มีหรือหมดอายุ
 */
export function getCacheItem(key: string): any | null {
  const item = cacheStore[key];
  if (!item) return null;
  
  // ตรวจสอบว่า cache หมดอายุหรือยัง
  if (Date.now() - item.timestamp > CACHE_DURATION) {
    // ลบ cache ที่หมดอายุ
    delete cacheStore[key];
    return null;
  }
  
  return item.data;
}

/**
 * ล้าง cache ของ key นี้
 */
export function invalidateCache(key: string): void {
  delete cacheStore[key];
}

/**
 * ล้าง cache ทั้งหมดที่ขึ้นต้นด้วย prefix นี้
 */
export function invalidateCacheByPrefix(prefix: string): void {
  Object.keys(cacheStore).forEach(key => {
    if (key.startsWith(prefix)) {
      delete cacheStore[key];
    }
  });
}

/**
 * ล้าง cache ทั้งหมด
 */
export function clearAllCache(): void {
  Object.keys(cacheStore).forEach(key => delete cacheStore[key]);
}

/**
 * สร้าง cache key สำหรับการ list files
 */
export function createListCacheKey(prefix: string, limit: number): string {
  return `blob:list:${prefix}:${limit}`;
}

// ใช้ `cache` จาก React เพื่อ deduplicate requests ภายใน request เดียวกัน (Server Components)
export const getListCached = cache(async (prefix: string, limit: number, fetcher: () => Promise<any>) => {
  const cacheKey = createListCacheKey(prefix, limit);
  const cached = getCacheItem(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const result = await fetcher();
  setCacheItem(cacheKey, result);
  return result;
});
