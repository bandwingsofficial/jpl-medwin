interface OutOfStockNotificationPayload {
  phoneNumber: string;
  productName: string;
  productId: string;
  variantId?: string;
  variantName?: string;
}

interface BrevoEmailResponse {
  messageId?: string;
}

export async function sendOutOfStockNotification(
  payload: OutOfStockNotificationPayload,
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY_NOTIFY;

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL_NOTIFY;

  const senderName =
    process.env.BREVO_SENDER_NAME_NOTIFY;

  if (!apiKey) {
    throw new Error(
      "BREVO_API_KEY_NOTIFY is not configured",
    );
  }

  if (!senderEmail) {
    throw new Error(
      "BREVO_SENDER_EMAIL_NOTIFY is not configured",
    );
  }

  if (!senderName) {
    throw new Error(
      "BREVO_SENDER_NAME_NOTIFY is not configured",
    );
  }

  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",

      headers: {
        accept: "application/json",

        "content-type":
          "application/json",

        "api-key": apiKey,
      },

      body: JSON.stringify({
        sender: {
          email: senderEmail,
          name: senderName,
        },

        to: [
          {
            email: senderEmail,
            name: senderName,
          },
        ],

        subject:
          `Out of Stock Notification Request - ${payload.productName}`,

        htmlContent: `
          <h2>Out of Stock Notification Request</h2>

          <p>
            A customer wants to be notified when this product is back in stock.
          </p>

          <hr />

          <p>
            <strong>Product:</strong>
            ${payload.productName}
          </p>

          <p>
            <strong>Product ID:</strong>
            ${payload.productId}
          </p>

          ${
            payload.variantName
              ? `
                <p>
                  <strong>Variant:</strong>
                  ${payload.variantName}
                </p>
              `
              : ""
          }

          ${
            payload.variantId
              ? `
                <p>
                  <strong>Variant ID:</strong>
                  ${payload.variantId}
                </p>
              `
              : ""
          }

          <p>
            <strong>Customer Phone Number:</strong>
            ${payload.phoneNumber}
          </p>

          <hr />

          <p>
            Please notify this customer when the product is back in stock.
          </p>
        `,
      }),
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Failed to send Brevo notification: ${errorText}`,
    );
  }

  await response.json() as BrevoEmailResponse;
}