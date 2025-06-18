import { unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

/**
 * Handles file uploads for advisor visits (server only)
 */
export const advisorVisitFiles = {
  /**
   * Get the file URL for a visit file
   * @param filename The filename stored in the database
   * @returns The full URL to access the file
   */
  getFileUrl: (filename: string): string => {
    return `/uploads/visits/${filename}`;
  },

  /**
   * Delete a file from the filesystem
   * @param filename The filename to delete
   * @returns Promise that resolves when the file is deleted
   */
  deleteFile: async (filename: string): Promise<boolean> => {
    try {
      const filePath = path.join(
        process.cwd(),
        'public',
        'uploads',
        'visits',
        filename
      );
      if (existsSync(filePath)) {
        await unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
};
