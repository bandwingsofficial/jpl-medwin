export type OtpRecord = {
  identifier: string;
  code: string;
  expiresIn: number; // seconds
};

export type OtpData = {
  code: string;
  attempts: number;
  expiresAt: Date;
};

export abstract class OtpStorePort {
  // 🔐 Save OTP (with expiry + cooldown)
  abstract save(record: OtpRecord): Promise<void>;

  // 🔍 Get OTP data
  abstract get(identifier: string): Promise<OtpData | null>;

  // 🗑 Delete OTP (on success / reset)
  abstract delete(identifier: string): Promise<void>;

  // 🔁 Increment attempts
  abstract incrementAttempts(identifier: string): Promise<number>;

  // ⏱ Get cooldown TTL (NOT OTP TTL)
  abstract getCooldownTtl(identifier: string): Promise<number>;
}
