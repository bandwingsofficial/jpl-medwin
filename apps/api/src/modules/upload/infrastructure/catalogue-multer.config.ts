import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { extname } from 'path';

const ALLOWED_MIME_TYPES = new Set([
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
]);

const BLOCKED_EXTENSIONS = new Set([
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.bin',
  '.js',
  '.ts',
  '.py',
  '.php',
  '.vbs',
  '.msi',
  '.com',
  '.scr',
  '.jar',
  '.ps1',
  '.apk',
]);

export const productAndCatalogueMulterConfig = {
  storage: memoryStorage(),

  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max for catalogue files
  },

  fileFilter: (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const ext = extname(file.originalname).toLowerCase();

    // Explicitly reject dangerous executable extensions
    if (BLOCKED_EXTENSIONS.has(ext)) {
      return cb(new BadRequestException(`File type ${ext} is not allowed for security reasons`), false);
    }

    // For image fields (mainImage, images, variantMainImages, variantImages) enforce image types
    if (['mainImage', 'images', 'variantMainImages', 'variantImages'].includes(file.fieldname)) {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|svg\+xml)$/)) {
        return cb(new BadRequestException('Only image files (JPG, PNG, WEBP, SVG) are allowed for product images'), false);
      }
      return cb(null, true);
    }

    // For catalogueFile allow safe documents, images, and videos
    if (file.fieldname === 'catalogueFile') {
      if (ALLOWED_MIME_TYPES.has(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('application/pdf')) {
        return cb(null, true);
      }

      // Check extension fallback
      const safeExtensions = new Set([
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv',
        '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif',
        '.mp4', '.webm', '.mov', '.mkv',
      ]);

      if (safeExtensions.has(ext)) {
        return cb(null, true);
      }

      return cb(new BadRequestException(`Unsupported file format (${ext || file.mimetype}) for product catalogue. Supported formats: PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, Images, Videos.`), false);
    }

    // Default accept safe files
    cb(null, true);
  },
};
