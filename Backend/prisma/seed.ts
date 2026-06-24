import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = 'Admin@123';

  // =======================
  // 1. GENERATE TOTP SECRET
  // =======================
  const secret = speakeasy.generateSecret({
    name: 'YourApp Admin',
  });

  console.log('🔐 TOTP Secret:', secret.base32);
  console.log('📱 Scan URL:', secret.otpauth_url);

  // =======================
  // 2. HASH PASSWORD
  // =======================
  const passwordHash = await bcrypt.hash(password, 10);

  // =======================
  // 3. CREATE USER
  // =======================
  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      role: 'ADMIN',
      isActive: true,

      identities: {
        create: {
          type: 'EMAIL',
          value: email,
          isVerified: true,

          passwordHash,
          isTotpEnabled: true,
          totpSecret: secret.base32,
        },
      },
    },
  });

  console.log('✅ Admin created:', user.id);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });