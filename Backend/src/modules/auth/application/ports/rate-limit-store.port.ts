export abstract class RateLimitStorePort {
  // 🔢 Get current attempts
  abstract getAttempts(identifier: string): Promise<number>;

  // ➕ Increment attempts
  abstract increment(identifier: string): Promise<number>;

  // 🔁 Reset attempts (optional)
  abstract reset(identifier: string): Promise<void>;

  // 🚫 Block user (set block TTL)
  abstract block(identifier: string): Promise<void>;

  // ⏱ Get block TTL (if blocked)
  abstract getBlockTtl(identifier: string): Promise<number>;
}
