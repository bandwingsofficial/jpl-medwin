import { BadRequestException } from '@nestjs/common';

import { memoryStorage } from 'multer';

export const excelMulterConfig = {
  storage: memoryStorage(),

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

      'application/vnd.ms-excel',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new BadRequestException('Only Excel files are allowed'), false);
    }

    cb(null, true);
  },
};
