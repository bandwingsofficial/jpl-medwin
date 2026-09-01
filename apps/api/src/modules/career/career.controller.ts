import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { CareerService } from './career.service';

import { CreateCareerApplicationDto } from './dto/create-career-application.dto';

@Controller('careers')
export class CareerController {
  constructor(
    private readonly careerService: CareerService,
  ) {}

  @Post('apply')
  @UseInterceptors(
    FileInterceptor('resume', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (
        _request,
        file,
        callback,
      ) => {
        const allowedMimeTypes = [
          'application/pdf',

          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (
          !allowedMimeTypes.includes(
            file.mimetype,
          )
        ) {
          callback(
            new Error(
              'Only PDF and DOCX files are allowed',
            ),
            false,
          );

          return;
        }

        callback(null, true);
      },
    }),
  )
  async apply(
    @Body()
    application: CreateCareerApplicationDto,

    @UploadedFile()
    resume: Express.Multer.File,
  ) {
    return this.careerService.submitApplication(
      application,
      resume,
    );
  }
}