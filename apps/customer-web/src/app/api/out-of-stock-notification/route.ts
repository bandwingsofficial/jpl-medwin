import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  sendOutOfStockNotification,
} from "@/shared/lib/brevo/out-of-stock-notification";

interface OutOfStockNotificationRequest {
  phoneNumber: string;
  productName: string;
  productId: string;
  variantId?: string;
  variantName?: string;
}

const PHONE_REGEX =
  /^[0-9+\-\s()]{7,20}$/;

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as OutOfStockNotificationRequest;

    const {
      phoneNumber,
      productName,
      productId,
      variantId,
      variantName,
    } = body;

    if (
      !phoneNumber?.trim() ||
      !productName?.trim() ||
      !productId?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Required fields are missing",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedPhoneNumber =
      phoneNumber.trim();

    if (
      !PHONE_REGEX.test(
        normalizedPhoneNumber,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid phone number",
        },
        {
          status: 400,
        },
      );
    }

    await sendOutOfStockNotification({
      phoneNumber:
        normalizedPhoneNumber,

      productName,

      productId,

      variantId,

      variantName,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Notification request sent successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "OUT OF STOCK NOTIFICATION ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send notification request",
      },
      {
        status: 500,
      },
    );
  }
}