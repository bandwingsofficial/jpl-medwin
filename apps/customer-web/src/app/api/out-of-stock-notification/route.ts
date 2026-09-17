import {
  NextRequest,
  NextResponse,
} from "next/server";

interface OutOfStockNotificationRequest {
  email: string;
  phoneNumber: string;
  productId: string;
  variantId?: string;
  productName?: string;
  variantName?: string;
}

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX =
  /^[0-9+\-\s()]{7,20}$/;

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as OutOfStockNotificationRequest;

    const {
      email,
      phoneNumber,
      productId,
      variantId,
    } = body;

    if (
      !email?.trim() ||
      !phoneNumber?.trim() ||
      !productId?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email, WhatsApp number, and Product are required",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();
    const normalizedPhone =
      phoneNumber.trim();

    if (
      !EMAIL_REGEX.test(normalizedEmail)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !PHONE_REGEX.test(normalizedPhone)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid WhatsApp / phone number",
        },
        {
          status: 400,
        },
      );
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:4000";

    const backendResponse = await fetch(
      `${apiUrl}/stock-notifications/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          whatsappNumber: normalizedPhone,
          productId: productId.trim(),
          ...(variantId?.trim()
            ? {
                variantId:
                  variantId.trim(),
              }
            : {}),
        }),
      },
    );

    const responseData =
      await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            responseData.message ||
            "Failed to register notification request",
        },
        {
          status: backendResponse.status,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          responseData.message ||
          "You are on the notification list! We'll email you when it's back in stock.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "OUT OF STOCK NOTIFICATION ROUTE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit notification request",
      },
      {
        status: 500,
      },
    );
  }
}
