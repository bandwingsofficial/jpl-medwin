import { VerifyOtpUseCase } from './verify-otp.usecase';
import { OtpDomainService } from '@/domain/services/otp.domain.service';
import { RateLimitDomainService } from '@/domain/services/ratelimit.domain.service';
import { ProfileDomainService } from '@/modules/profile/domain/services/profile-domain.service';
import { AuthMethod } from '@/domain/enums/auth-method.enum';
import { User } from '@/domain/entities/user.entity';
import { AuthIdentity } from '@/domain/entities/auth-identity.entity';
import { Profile } from '@/modules/profile/domain/entities/profile.entity';
import { Session } from '@/domain/entities/session.entity';

describe('VerifyOtpUseCase - Identity & Profile Synchronization', () => {
  let useCase: VerifyOtpUseCase;

  let otpService: OtpDomainService;
  let rateLimitService: RateLimitDomainService;
  let profileDomainService: ProfileDomainService;

  let otpStore: any;
  let rateLimitStore: any;
  let userRepo: any;
  let identityRepo: any;
  let sessionRepo: any;
  let tokenPort: any;
  let walletRepo: any;
  let profileRepo: any;

  beforeEach(() => {
    otpService = new OtpDomainService();
    rateLimitService = new RateLimitDomainService();
    profileDomainService = new ProfileDomainService();

    otpStore = {
      get: jest.fn().mockResolvedValue({
        code: '123456',
        expiresAt: new Date(Date.now() + 60000),
      }),
      incrementAttempts: jest.fn().mockResolvedValue(1),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    rateLimitStore = {
      getBlockTtl: jest.fn().mockResolvedValue(0),
      increment: jest.fn().mockResolvedValue(1),
      reset: jest.fn().mockResolvedValue(undefined),
    };

    userRepo = {
      create: jest.fn().mockImplementation(async (user: User) => user),
      findById: jest.fn(),
    };

    identityRepo = {
      findActiveByTypeAndValue: jest.fn(),
      findActiveByUserId: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation(async (id: AuthIdentity) => id),
      update: jest.fn().mockImplementation(async (id: AuthIdentity) => id),
    };

    sessionRepo = {
      deleteByUserIdAndDeviceId: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(async (session: Session) => session),
    };

    tokenPort = {
      generateRefreshToken: jest.fn().mockResolvedValue('refresh-token-123'),
      generateAccessToken: jest.fn().mockResolvedValue('access-token-123'),
    };

    walletRepo = {
      create: jest.fn().mockResolvedValue(undefined),
    };

    profileRepo = {
      findByUserId: jest.fn(),
      findByPhoneNumber: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn().mockImplementation(async (p: Profile) => p),
      save: jest.fn().mockImplementation(async (p: Profile) => p),
    };

    useCase = new VerifyOtpUseCase(
      otpService,
      rateLimitService,
      otpStore,
      rateLimitStore,
      userRepo,
      identityRepo,
      sessionRepo,
      tokenPort,
      walletRepo,
      profileRepo,
      profileDomainService,
    );
  });

  it('1. New user email OTP login creates User, Wallet, EMAIL AuthIdentity, and Profile', async () => {
    identityRepo.findActiveByTypeAndValue.mockResolvedValue(null);
    profileRepo.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute({
      email: 'user@example.com',
      code: '123456',
      deviceId: 'dev-1',
    });

    expect(result.user).toBeDefined();
    expect(userRepo.create).toHaveBeenCalledTimes(1);
    expect(walletRepo.create).toHaveBeenCalledTimes(1);
    expect(identityRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AuthMethod.EMAIL,
        value: 'user@example.com',
        isVerified: true,
      }),
    );
    expect(profileRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        phoneNumber: undefined,
      }),
    );
  });

  it('2. New user phone OTP login creates User, Wallet, PHONE AuthIdentity, and Profile', async () => {
    identityRepo.findActiveByTypeAndValue.mockResolvedValue(null);
    profileRepo.findByPhoneNumber.mockResolvedValue(null);

    const result = await useCase.execute({
      phone: '9988776655',
      code: '123456',
      deviceId: 'dev-1',
    });

    expect(result.user).toBeDefined();
    expect(userRepo.create).toHaveBeenCalledTimes(1);
    expect(walletRepo.create).toHaveBeenCalledTimes(1);
    expect(identityRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AuthMethod.PHONE,
        value: '9988776655',
        isVerified: true,
      }),
    );
    expect(profileRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        phoneNumber: '9988776655',
        email: undefined,
      }),
    );
  });

  it('3. Existing email user verifies phone via OTP -> links PHONE AuthIdentity to same user without duplicate User/Wallet', async () => {
    const existingUser = new User('user-u1');
    const existingProfile = new Profile(
      'prof-1',
      'user-u1',
      'User One',
      'user@example.com',
      '9988776655',
    );
    const existingEmailIdentity = new AuthIdentity(
      'ident-email',
      'user-u1',
      AuthMethod.EMAIL,
      'user@example.com',
      true,
    );

    identityRepo.findActiveByTypeAndValue.mockResolvedValue(null);
    profileRepo.findByPhoneNumber.mockResolvedValue(existingProfile);
    userRepo.findById.mockResolvedValue(existingUser);
    identityRepo.findActiveByUserId.mockResolvedValue([existingEmailIdentity]);

    const result = await useCase.execute({
      phone: '9988776655',
      code: '123456',
      deviceId: 'dev-1',
    });

    expect(result.user.id).toBe('user-u1');
    expect(userRepo.create).not.toHaveBeenCalled();
    expect(walletRepo.create).not.toHaveBeenCalled();
    expect(identityRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-u1',
        type: AuthMethod.PHONE,
        value: '9988776655',
        isVerified: true,
      }),
    );
  });

  it('4. Existing phone user verifies email via OTP -> links EMAIL AuthIdentity to same user without duplicate User/Wallet', async () => {
    const existingUser = new User('user-u1');
    const existingProfile = new Profile(
      'prof-1',
      'user-u1',
      'User One',
      'user@example.com',
      '9988776655',
    );
    const existingPhoneIdentity = new AuthIdentity(
      'ident-phone',
      'user-u1',
      AuthMethod.PHONE,
      '9988776655',
      true,
    );

    identityRepo.findActiveByTypeAndValue.mockResolvedValue(null);
    profileRepo.findByEmail.mockResolvedValue(existingProfile);
    userRepo.findById.mockResolvedValue(existingUser);
    identityRepo.findActiveByUserId.mockResolvedValue([existingPhoneIdentity]);

    const result = await useCase.execute({
      email: 'user@example.com',
      code: '123456',
      deviceId: 'dev-1',
    });

    expect(result.user.id).toBe('user-u1');
    expect(userRepo.create).not.toHaveBeenCalled();
    expect(walletRepo.create).not.toHaveBeenCalled();
    expect(identityRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-u1',
        type: AuthMethod.EMAIL,
        value: 'user@example.com',
        isVerified: true,
      }),
    );
  });

  it('5. Existing user logs in with email when AuthIdentity already exists', async () => {
    const existingUser = new User('user-u1');
    const existingEmailIdentity = new AuthIdentity(
      'ident-email',
      'user-u1',
      AuthMethod.EMAIL,
      'user@example.com',
      true,
    );
    const existingProfile = new Profile(
      'prof-1',
      'user-u1',
      'User One',
      'user@example.com',
      '9988776655',
    );

    identityRepo.findActiveByTypeAndValue.mockResolvedValue(existingEmailIdentity);
    userRepo.findById.mockResolvedValue(existingUser);
    profileRepo.findByUserId.mockResolvedValue(existingProfile);

    const result = await useCase.execute({
      email: 'user@example.com',
      code: '123456',
      deviceId: 'dev-1',
    });

    expect(result.user.id).toBe('user-u1');
    expect(userRepo.create).not.toHaveBeenCalled();
    expect(identityRepo.create).not.toHaveBeenCalled();
  });

  it('6. Existing user logs in with phone when AuthIdentity already exists', async () => {
    const existingUser = new User('user-u1');
    const existingPhoneIdentity = new AuthIdentity(
      'ident-phone',
      'user-u1',
      AuthMethod.PHONE,
      '9988776655',
      true,
    );
    const existingProfile = new Profile(
      'prof-1',
      'user-u1',
      'User One',
      'user@example.com',
      '9988776655',
    );

    identityRepo.findActiveByTypeAndValue.mockResolvedValue(existingPhoneIdentity);
    userRepo.findById.mockResolvedValue(existingUser);
    profileRepo.findByUserId.mockResolvedValue(existingProfile);

    const result = await useCase.execute({
      phone: '9988776655',
      code: '123456',
      deviceId: 'dev-1',
    });

    expect(result.user.id).toBe('user-u1');
    expect(userRepo.create).not.toHaveBeenCalled();
    expect(identityRepo.create).not.toHaveBeenCalled();
  });

  it('7. Changing phone number soft-deletes old phone AuthIdentity and creates new active AuthIdentity', async () => {
    const existingUser = new User('user-u1');
    const existingProfile = new Profile(
      'prof-1',
      'user-u1',
      'User One',
      'user@example.com',
      '9876543210',
    );
    const oldPhoneIdentity = new AuthIdentity(
      'ident-old-phone',
      'user-u1',
      AuthMethod.PHONE,
      '9988776655',
      true,
    );

    identityRepo.findActiveByTypeAndValue.mockResolvedValue(null);
    profileRepo.findByPhoneNumber.mockResolvedValue(existingProfile);
    userRepo.findById.mockResolvedValue(existingUser);
    identityRepo.findActiveByUserId.mockResolvedValue([oldPhoneIdentity]);

    const result = await useCase.execute({
      phone: '9876543210',
      code: '123456',
      deviceId: 'dev-1',
    });

    expect(result.user.id).toBe('user-u1');
    expect(identityRepo.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'ident-old-phone',
        deletedAt: expect.any(Date),
      }),
    );
    expect(identityRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-u1',
        type: AuthMethod.PHONE,
        value: '9876543210',
        isVerified: true,
      }),
    );
  });
});
