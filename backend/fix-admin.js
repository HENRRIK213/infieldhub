require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  const email = 'admin@infieldhub.com';
  const password = 'Admin@InfieldHub2020!';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.deleteMany({ where: { email } });
  await prisma.user.create({
    data: { email, password: hashed, role: 'ADMIN', name: 'Super Admin', active: true },
  });

  const check = await prisma.user.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, check.password);
  console.log('DB:', process.env.DATABASE_URL?.split('@')[1]?.split('?')[0]);
  console.log('Password hash verifies:', ok ? 'YES ✅' : 'NO ❌');
  process.exit(0);
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
