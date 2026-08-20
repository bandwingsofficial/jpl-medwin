import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateCareerApplicationDto } from './dto/create-career-application.dto';

interface BrevoEmailResponse {
  messageId?: string;
}

@Injectable()
export class CareerService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async submitApplication(
    application: CreateCareerApplicationDto,
    resume: Express.Multer.File,
  ) {
    if (!resume) {
      throw new BadRequestException(
        'Resume file is required',
      );
    }

    const apiKey = this.configService.get<string>(
      'BREVO_API_KEY_CAREER',
    );

    const senderEmail = this.configService.get<string>(
      'BREVO_SENDER_EMAIL_CAREER',
    );

    const senderName =
      this.configService.get<string>(
        'BREVO_SENDER_NAME_CAREER',
      ) ?? 'JPL Medwin';

    const notificationEmail =
      this.configService.get<string>(
        'CAREER_NOTIFICATION_EMAIL',
      ) ?? 'rgvt27320@gmail.com';

    if (!apiKey) {
      throw new InternalServerErrorException(
        'Career email service is not configured',
      );
    }

    if (!senderEmail) {
      throw new InternalServerErrorException(
        'Career sender email is not configured',
      );
    }

    const emailPayload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },

      to: [
        {
          email: notificationEmail,
          name: 'JPL Medwin Recruitment Team',
        },
      ],

      subject: `New Job Application: ${application.fullName} - ${application.appliedPosition}`,

      htmlContent: this.buildEmailContent(
        application,
      ),

      attachment: [
        {
          name: resume.originalname,
          content: resume.buffer.toString('base64'),
        },
      ],
    };

    try {
      const response = await fetch(
        'https://api.brevo.com/v3/smtp/email',
        {
          method: 'POST',

          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
          },

          body: JSON.stringify(emailPayload),
        },
      );

      const responseData =
        (await response.json()) as BrevoEmailResponse;

      if (!response.ok) {
        console.error(
          'Brevo career email failed:',
          responseData,
        );

        throw new InternalServerErrorException(
          'Unable to send career application',
        );
      }

      return {
        success: true,
        message:
          'Application submitted successfully',
        messageId: responseData.messageId ?? null,
      };
    } catch (error) {
      if (
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      console.error(
        'Career application submission failed:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to submit application. Please try again later.',
      );
    }
  }

  private buildEmailContent(
    application: CreateCareerApplicationDto,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <body
          style="
            font-family: Arial, sans-serif;
            color: #1e293b;
            padding: 20px;
          "
        >
          <h2>
            New Career Application
          </h2>

          <p>
            A new candidate has submitted a job application
            through the JPL Medwin website.
          </p>

          <table
            cellpadding="10"
            cellspacing="0"
            border="1"
            style="
              border-collapse: collapse;
              border-color: #e2e8f0;
              width: 100%;
              max-width: 700px;
            "
          >
            <tr>
              <td><strong>Full Name</strong></td>
              <td>
                ${this.escapeHtml(application.fullName)}
              </td>
            </tr>

            <tr>
              <td><strong>Mobile Number</strong></td>
              <td>
                ${this.escapeHtml(
                  application.mobileNumber,
                )}
              </td>
            </tr>

            <tr>
              <td><strong>Applied Position</strong></td>
              <td>
                ${this.escapeHtml(
                  application.appliedPosition,
                )}
              </td>
            </tr>

            <tr>
              <td><strong>Residential Address</strong></td>
              <td>
                ${this.escapeHtml(application.address)}
              </td>
            </tr>
          </table>

          <p style="margin-top: 24px;">
            <strong>
              The candidate's resume is attached to this email.
            </strong>
          </p>

          <hr
            style="
              margin-top: 30px;
              border: none;
              border-top: 1px solid #e2e8f0;
            "
          />

          <p
            style="
              color: #64748b;
              font-size: 12px;
            "
          >
            This application was submitted through the
            JPL Medwin Careers page.
          </p>
        </body>
      </html>
    `;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}