import { Module } from '@nestjs/common';
import { UploadImageUseCase } from './application/upload-image.usecase';
import { S3Service } from './infrastructure/s3.service';

@Module({
  providers: [UploadImageUseCase, S3Service],
  exports: [UploadImageUseCase, S3Service],
})
export class UploadModule {}
