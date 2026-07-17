import { Session } from '../entities/session.entity';
import { SESSION_POLICY } from '../policies/session.policy';

export class SessionDomainService {
  // =======================
  // VALIDATE
  // =======================

  validateSession(session: Session): void {
    session.ensureActive();
  }

  // =======================
  // REVOKE
  // =======================

  revokeSession(session: Session): void {
    session.revoke('LOGOUT');
  }

  // =======================
  // TOUCH (LAST USED)
  // =======================

  touch(session: Session): void {
    if (SESSION_POLICY.UPDATE_LAST_USED_ON_ACCESS) {
      session.touch(); // ✅ FIXED
    }
  }

  // =======================
  // ROTATE TOKEN
  // =======================

  rotateSession(session: Session, newTokenHash: string): void {
    if (SESSION_POLICY.ROTATE_ON_REFRESH) {
      session.rotate(newTokenHash);

      // 🔥 IMPORTANT: update active hash
      session.updateRefreshTokenHash(newTokenHash);
    }
  }

  // =======================
  // CHECK ACTIVE
  // =======================

  isSessionActive(session: Session): boolean {
    return session.isActive();
  }

  // =======================
  // 🔥 OPTIONAL (SECURITY)
  // =======================

  isReuseDetected(session: Session, incomingHash: string): boolean {
    return incomingHash !== session.refreshTokenHash;
  }
}
