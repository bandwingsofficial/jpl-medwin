import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { StockNotificationStatus } from '@prisma/client';
import { SubscribeStockNotificationDto } from './dto/subscribe-stock-notification.dto';

export interface RestockTriggerParams {
  productId: string;
  variantId?: string;
  newQuantity?: number;
  oldQuantity?: number;
}

@Injectable()
export class StockNotificationService {
  private readonly logger = new Logger(StockNotificationService.name);
  private readonly brevo: BrevoClient | null = null;
  private readonly senderEmail: string;
  private readonly senderName: string;
  private readonly appUrl: string;
  private readonly logoUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey =
      this.configService.get<string>('BREVO_API_KEY_NOTIFY') ||
      this.configService.get<string>('BREVO_API_KEY_ORDER') ||
      this.configService.get<string>('BREVO_API_KEY') ||
      '';

    this.senderEmail =
      this.configService.get<string>('BREVO_SENDER_EMAIL_NOTIFY') ||
      this.configService.get<string>('BREVO_SENDER_EMAIL') ||
      this.configService.get<string>('BREVO_SENDER_EMAIL_ORDER') ||
      'connect@jplmedwin.com';

    this.senderName =
      this.configService.get<string>('BREVO_SENDER_NAME_NOTIFY') ||
      this.configService.get<string>('BREVO_SENDER_NAME') ||
      'JPL Medwin';

    this.appUrl =
      this.configService.get<string>('APP_FRONTEND_URL') ||
      this.configService.get<string>('FRONTEND_URL') ||
      'https://jplmedwin.com';

    this.logoUrl =
      this.configService.get<string>('NEXT_PUBLIC_APP_URL_LOGO') ||
      'https://jplmedwin.com/Logo/jpl_logo.png';

    if (apiKey) {
      this.brevo = new BrevoClient({
        apiKey,
        timeoutInSeconds: 15,
        maxRetries: 2,
      });
      this.logger.log(
        `Brevo client initialized for stock notifications (Sender: ${this.senderName} <${this.senderEmail}>)`,
      );
    } else {
      this.logger.warn(
        'Brevo API key is not configured. Stock restock emails will not be dispatched.',
      );
    }
  }

  /**
   * Subscribes a customer to back-in-stock alerts.
   */
  async subscribe(dto: SubscribeStockNotificationDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedPhone = dto.whatsappNumber.trim();

    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      select: { id: true, name: true, deletedAt: true },
    });

    if (!product || product.deletedAt) {
      throw new NotFoundException('Product not found');
    }

    // Verify variant if provided
    if (dto.variantId) {
      const variant = await this.prisma.variant.findUnique({
        where: { id: dto.variantId },
        select: { id: true, productId: true, deletedAt: true },
      });

      if (!variant || variant.deletedAt || variant.productId !== product.id) {
        throw new NotFoundException('Variant not found for this product');
      }
    }

    // Check if an existing PENDING subscription exists
    const existing = await this.prisma.stockNotification.findFirst({
      where: {
        productId: dto.productId,
        variantId: dto.variantId || null,
        email: normalizedEmail,
        status: StockNotificationStatus.PENDING,
      },
    });

    if (existing) {
      // Update phone number in case they provided a newer one
      await this.prisma.stockNotification.update({
        where: { id: existing.id },
        data: {
          whatsappNumber: normalizedPhone,
        },
      });

      return {
        success: true,
        message:
          "You're already registered! We'll email you as soon as this item is back in stock.",
        subscriptionId: existing.id,
      };
    }

    // Create new subscription record
    const subscription = await this.prisma.stockNotification.create({
      data: {
        productId: dto.productId,
        variantId: dto.variantId || null,
        email: normalizedEmail,
        whatsappNumber: normalizedPhone,
        status: StockNotificationStatus.PENDING,
      },
    });

    this.logger.log(
      `Saved stock notification request: Product=${dto.productId}, Email=${normalizedEmail}, Phone=${normalizedPhone}`,
    );

    return {
      success: true,
      message:
        "You're on the notification list! We'll email you when this product is back in stock.",
      subscriptionId: subscription.id,
    };
  }

  /**
   * Handles restock event when a product/variant quantity increases.
   */
  async handleRestock(params: RestockTriggerParams): Promise<number> {
    const { productId, variantId, newQuantity, oldQuantity } = params;

    // Only notify if current quantity is positive and previous was out of stock (or unspecified)
    if (newQuantity !== undefined && newQuantity <= 0) {
      return 0;
    }

    this.logger.log(
      `Processing restock notifications: Product=${productId}, Variant=${variantId ?? 'all'}, Qty=${oldQuantity ?? 0} -> ${newQuantity ?? 'available'}`,
    );

    try {
      // Fetch product with images and brand
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: {
            where: { deletedAt: null },
            orderBy: { sortOrder: 'asc' },
            take: 1,
          },
          variants: {
            where: { deletedAt: null },
            include: {
              images: {
                where: { deletedAt: null },
                take: 1,
              },
            },
          },
        },
      });

      if (!product || product.deletedAt) {
        this.logger.warn(`Product ${productId} not found during restock notification`);
        return 0;
      }

      let variantName: string | undefined;
      let variantPrice: number | undefined;
      let variantImageUrl: string | undefined;

      if (variantId) {
        const variant = product.variants.find((v) => v.id === variantId);
        if (variant) {
          variantName = variant.name;
          variantPrice = variant.sellingPrice;
          variantImageUrl =
            variant.images?.[0]?.url || product.images?.[0]?.url;
        }
      }

      const displayPrice =
        variantPrice !== undefined
          ? variantPrice
          : product.minPrice !== null && product.minPrice !== undefined
            ? product.minPrice
            : product.variants?.[0]?.sellingPrice;

      const displayImage =
        variantImageUrl ||
        product.images?.[0]?.url ||
        '';

      // Find pending subscribers
      // If variant was restocked: notify users who subscribed to this specific variant OR to the general product
      const whereCondition = variantId
        ? {
            productId,
            status: StockNotificationStatus.PENDING,
            OR: [{ variantId: variantId }, { variantId: null }],
          }
        : {
            productId,
            status: StockNotificationStatus.PENDING,
          };

      const pendingSubscribers = await this.prisma.stockNotification.findMany({
        where: whereCondition,
      });

      if (!pendingSubscribers.length) {
        this.logger.log(
          `No pending subscribers found for restocked product: ${product.name}`,
        );
        return 0;
      }

      this.logger.log(
        `Found ${pendingSubscribers.length} subscribers to notify for product: ${product.name}`,
      );

      let successCount = 0;
      const productUrl = `${this.appUrl.replace(/\/+$/, '')}/products/${product.slug}`;

      for (const subscriber of pendingSubscribers) {
        try {
          if (this.brevo) {
            const htmlEmail = this.generateRestockEmailHtml({
              productName: product.name,
              variantName,
              price: displayPrice,
              imageUrl: displayImage,
              productUrl,
              logoUrl: this.logoUrl,
            });

            const subject = `Back in Stock: ${product.name}${variantName ? ` (${variantName})` : ''} is now available!`;

            await this.brevo.transactionalEmails.sendTransacEmail({
              sender: {
                email: this.senderEmail,
                name: this.senderName,
              },
              to: [
                {
                  email: subscriber.email,
                },
              ],
              subject,
              htmlContent: htmlEmail,
            });
          }

          // Update subscription status to NOTIFIED
          await this.prisma.stockNotification.update({
            where: { id: subscriber.id },
            data: {
              status: StockNotificationStatus.NOTIFIED,
              notifiedAt: new Date(),
            },
          });

          successCount++;
        } catch (emailError) {
          this.logger.error(
            `Failed to send restock email to ${subscriber.email} for product ${product.name}:`,
            emailError instanceof Error ? emailError.stack : String(emailError),
          );
        }
      }

      this.logger.log(
        `Successfully sent ${successCount}/${pendingSubscribers.length} restock emails for product ${product.name}`,
      );

      return successCount;
    } catch (error) {
      this.logger.error(
        `Error during handleRestock for product ${productId}:`,
        error instanceof Error ? error.stack : String(error),
      );
      return 0;
    }
  }

  /**
   * Generates clean, responsive HTML email for restock notification.
   */
  private generateRestockEmailHtml(params: {
    productName: string;
    variantName?: string;
    price?: number;
    imageUrl?: string;
    productUrl: string;
    logoUrl: string;
  }): string {
    const { productName, variantName, price, imageUrl, productUrl, logoUrl } = params;

    const formattedPrice =
      price !== undefined
        ? `₹${Number(price).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : '';

    const currentYear = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Back in Stock - ${productName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background-color: #0f766e;
      padding: 24px;
      text-align: center;
    }
    .header img {
      max-height: 48px;
      max-width: 180px;
    }
    .content {
      padding: 32px 24px;
    }
    .badge {
      display: inline-block;
      background-color: #ecfdf5;
      color: #047857;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      color: #111827;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      margin: 0 0 20px 0;
    }
    .product-card {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 20px;
      background-color: #fafafa;
      margin: 24px 0;
      text-align: center;
    }
    .product-img {
      max-width: 220px;
      max-height: 220px;
      object-fit: contain;
      border-radius: 8px;
      margin: 0 auto 16px auto;
      display: block;
    }
    .product-title {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      margin: 8px 0;
    }
    .variant-label {
      font-size: 14px;
      color: #0d9488;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .price {
      font-size: 20px;
      font-weight: 800;
      color: #0f766e;
      margin: 8px 0;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 16px 0;
    }
    .btn {
      display: inline-block;
      background-color: #0d9488;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      padding: 14px 36px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }
    .btn:hover {
      background-color: #0f766e;
    }
    .footer {
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
      padding: 20px 24px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="JPL Medwin Logo" />
    </div>

    <div class="content">
      <div style="text-align: center;">
        <span class="badge">Back In Stock</span>
        <h1>Good news! Your item is back in stock</h1>
        <p>
          You asked us to let you know when <strong>${productName}</strong> was available again.
          It is back in stock and ready to order!
        </p>
      </div>

      <div class="product-card">
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="${productName}" class="product-img" />`
            : ''
        }
        <div class="product-title">${productName}</div>
        ${
          variantName
            ? `<div class="variant-label">Variant: ${variantName}</div>`
            : ''
        }
        ${
          formattedPrice
            ? `<div class="price">${formattedPrice}</div>`
            : ''
        }
      </div>

      <p style="text-align: center; font-size: 14px; color: #dc2626; font-weight: 600;">
        Hurry, stock is limited and may sell out quickly!
      </p>

      <div class="btn-container">
        <a href="${productUrl}" class="btn" target="_blank" rel="noopener noreferrer">
          BUY NOW / VIEW PRODUCT
        </a>
      </div>
    </div>

    <div class="footer">
      <p style="margin-bottom: 8px;">
        &copy; ${currentYear} JPL Medwin. All rights reserved.
      </p>
      <p style="margin: 0;">
        You received this email because you requested a restock notification for this product.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}
