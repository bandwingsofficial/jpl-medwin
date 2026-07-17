import { Session } from '../entities/session.entity';

export interface SessionRepository {
  // =======================
  // CREATE / UPDATE
  // =======================

  create(session: Session): Promise<Session>;

  update(session: Session): Promise<Session>;

  // =======================
  // FIND
  // =======================

  findById(id: string): Promise<Session | null>;

  findByRefreshTokenHash(hash: string): Promise<Session | null>;

  findByUserId(userId: string): Promise<Session[]>;

  // 🔥 ACTIVE ONLY (VERY IMPORTANT)
  findActiveByUserId(userId: string): Promise<Session[]>;

  // 🔥 OPTIONAL (if needed)
  findLatestByUserIdAndDeviceId(userId: string, deviceId: string): Promise<Session | null>;

  // =======================
  // DELETE / REPLACE
  // =======================

  deleteByUserIdAndDeviceId(userId: string, deviceId: string): Promise<void>;

  // =======================
  // REVOKE
  // =======================

  revoke(sessionId: string): Promise<void>;

  revokeAllByUserId(userId: string): Promise<void>;

  // 🔥 OPTIONAL (SECURITY)
  revokeAllExcept(userId: string, sessionId: string): Promise<void>;
}
