import { UserInactiveException } from '../exceptions/user/user-inactive.exception';
import { UserRole } from '../enums/user-role.enum';

export class User {
  constructor(
    public readonly id: string,

    public name?: string,
    public profilePic?: string,

    public isActive: boolean = true,
    public tokenVersion: number = 0,
    public role: UserRole = UserRole.USER,

    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date,
  ) {}

  // =======================
  // 🔐 Business Rules
  // =======================

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  softDelete() {
    this.deletedAt = new Date();
    this.isActive = false;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  // =======================
  // 🔥 ROLE LOGIC
  // =======================

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isUser(): boolean {
    return this.role === UserRole.USER;
  }

  promoteToAdmin() {
    this.role = UserRole.ADMIN;
  }

  demoteToUser() {
    this.role = UserRole.USER;
  }

  ensureAdmin() {
    if (!this.isAdmin()) {
      throw new Error('Admin access required'); // replace later
    }
  }

  // =======================
  // 🔥 TOKEN CONTROL
  // =======================

  incrementTokenVersion() {
    this.tokenVersion += 1;
  }

  // =======================
  // 🧠 Guard
  // =======================

  ensureActive() {
    if (!this.isActive || this.deletedAt) {
      throw new UserInactiveException({
        userId: this.id,
      });
    }
  }
}
