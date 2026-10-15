require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPass = await bcrypt.hash('Admin@InfieldHub2020!', 10);
  const empPass   = await bcrypt.hash('Employee@2020!!', 10);

  // Force-wipe users so credentials always match — no stale hashes
  await prisma.user.deleteMany({});
  console.log('Cleared existing users');

  await prisma.user.create({
    data: {
      email: 'admin@infieldhub.com',
      password: adminPass,
      role: 'ADMIN',
      name: 'Super Admin',
      active: true,
    },
  });
  console.log('OK Admin created');

  await prisma.user.create({
    data: {
      email: 'employee@infieldhub.com',
      password: empPass,
      role: 'EMPLOYEE',
      name: 'Staff One',
      active: true,
    },
  });
  console.log('OK Employee created');

  const admin = await prisma.user.findUnique({ where: { email: 'admin@infieldhub.com' } });
  const ok = await bcrypt.compare('Admin@InfieldHub2020!', admin.password);
  console.log('Password verifies:', ok ? 'YES' : 'NO');
  console.log('=======================================');
  console.log('Admin:    admin@infieldhub.com');
  console.log('Password: Admin@InfieldHub2020!');
  console.log('=======================================');
}

main()
  .catch((e) => { console.error('Seed failed:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
