require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('Admin@InfieldHub2020!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@infieldhub.com' },
    update: {},
    create: {
      email: 'admin@infieldhub.com',
      password: adminPass,
      role: 'ADMIN',
      name: 'Super Admin',
    },
  });

  const empPass = await bcrypt.hash('Employee@2020!!', 10);
  await prisma.user.upsert({
    where: { email: 'employee@infieldhub.com' },
    update: {},
    create: {
      email: 'employee@infieldhub.com',
      password: empPass,
      role: 'EMPLOYEE',
      name: 'Staff One',
    },
  });

  console.log('✅ Admin: admin@infieldhub.com / Admin@InfieldHub2020!');
  console.log('✅ Employee: employee@infieldhub.com / Employee@2020!!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());