import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export interface UserRepository {
  // =======================
  // BASIC CRUD
  // =======================

  findById(id: string): Promise<User | null>;

  create(user: User): Promise<User>;

  update(user: User): Promise<User>;

  // =======================
  // 🔥 ROLE SUPPORT
  // =======================

  findByRole(role: UserRole): Promise<User[]>;

  // =======================
  // 🔥 ADMIN / LISTING
  // =======================

  findAll(options?: { limit?: number; offset?: number }): Promise<User[]>;

  // =======================
  // 🔥 OPTIONAL (FUTURE)
  // =======================

  // findByIds(ids: string[]): Promise<User[]>;
}
