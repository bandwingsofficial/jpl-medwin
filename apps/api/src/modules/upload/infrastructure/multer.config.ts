import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const multerConfig = {
  storage: memoryStorage(),

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },

  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(new BadRequestException('Only image files are allowed'), false);
    }
    cb(null, true);
  },
};
