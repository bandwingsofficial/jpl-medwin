export abstract class NotificationPort {
  abstract sendSms(phone: string, message: string): Promise<void>;

  abstract sendEmail(email: string, subject: string, body: string): Promise<void>;

  // 🔥 Optional future-proofing
  abstract sendOtp?(identifier: string, message: string): Promise<void>;
}
