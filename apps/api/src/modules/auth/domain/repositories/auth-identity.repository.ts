import { AuthIdentity } from '../entities/auth-identity.entity';
import { AuthMethod } from '../enums/auth-method.enum';

export interface AuthIdentityRepository {
  // =======================
  // BASIC
  // =======================

  findById(id: string): Promise<AuthIdentity | null>;

  findByUserId(userId: string): Promise<AuthIdentity[]>;

  create(identity: AuthIdentity): Promise<AuthIdentity>;

  update(identity: AuthIdentity): Promise<AuthIdentity>;

  // =======================
  // 🔐 LOGIN / LOOKUPS
  // =======================

  findByTypeAndValue(type: AuthMethod, value: string): Promise<AuthIdentity | null>;

  // 🔥 MUST: only active (non-deleted)
  findActiveByTypeAndValue(type: AuthMethod, value: string): Promise<AuthIdentity | null>;

  // 🔥 ADMIN LOGIN (email-specific)
  findByEmail(email: string): Promise<AuthIdentity | null>;

  // =======================
  // 🔐 FILTERED QUERIES
  // =======================

  findActiveByUserId(userId: string): Promise<AuthIdentity[]>;

  // optional (future)
  // findVerifiedByUserId(userId: string): Promise<AuthIdentity[]>;
}
