export abstract class TokenPort {
  // 🔥 Access token (short-lived)
  abstract generateAccessToken(payload: {
    userId: string;
    sessionId: string;
    tokenVersion: number;
    role: string; // 🔥 ADD THIS
  }): Promise<string>;

  // 🔁 Refresh token (long-lived)
  abstract generateRefreshToken(payload: {
    userId: string;
    sessionId: string;
    tokenVersion: number;
  }): Promise<string>;

  // 🔍 Verify token (VERY IMPORTANT)
  abstract verifyAccessToken(token: string): Promise<{
    userId: string;
    sessionId: string;
    tokenVersion: number;
    role: string; // 🔥 ADD THIS
  }>;

  abstract verifyRefreshToken(token: string): Promise<{
    userId: string;
    sessionId: string;
    tokenVersion: number;
  }>;
}
