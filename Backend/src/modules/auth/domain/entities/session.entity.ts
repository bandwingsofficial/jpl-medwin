import { Platform } from '../enums/platform.enum';
import { SessionType } from '../enums/session-type.enum';

import { SessionExpiredException } from '../exceptions/session/session-expired.exception';
import { SessionRevokedException } from '../exceptions/session/session-revoked.exception';

export class Session {
  constructor(
    public readonly id: string,

    public userId: string,
    public deviceId: string,

    // 🔐 store HASH only
    public refreshTokenHash: string,

    public expiresAt: Date,

    public isRevoked: boolean = false,
    public revokedAt?: Date,
    public replacedByToken?: string,

    public deviceName?: string,
    public platform?: Platform,

    public type?: SessionType,

    public ipAddress?: string,
    public userAgent?: string,

    public lastUsedAt?: Date,

    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  // =======================
  // 🧠 STATE
  // =======================

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isActive(): boolean {
    return !this.isRevoked && !this.isExpired();
  }

  isRotated(): boolean {
    return !!this.replacedByToken;
  }

  // =======================
  // 🔐 GUARDS
  // =======================

  ensureActive() {
    if (this.isRevoked) {
      throw new SessionRevokedException({
        userId: this.userId,
        sessionId: this.id,
        deviceId: this.deviceId,
      });
    }

    if (this.isExpired()) {
      throw new SessionExpiredException({
        userId: this.userId,
        sessionId: this.id,
        deviceId: this.deviceId,
      });
    }
  }

  // =======================
  // 🔁 LIFECYCLE
  // =======================

  revoke(reason: 'LOGOUT' | 'SECURITY' = 'LOGOUT') {
    this.isRevoked = true;
    this.revokedAt = new Date();
    this.updatedAt = new Date();

    // (optional) log reason externally
  }

  // 🔥 FIXED: DO NOT revoke on rotation
  rotate(newTokenHash: string) {
    this.replacedByToken = newTokenHash;
    this.updatedAt = new Date();
  }

  // =======================
  // ⏱ USAGE TRACKING
  // =======================

  touch() {
    this.lastUsedAt = new Date();
    this.updatedAt = new Date();
  }

  // =======================
  // 🔐 TOKEN MANAGEMENT
  // =======================

  updateRefreshTokenHash(newHash: string) {
    this.refreshTokenHash = newHash;
    this.updatedAt = new Date();
  }
}
