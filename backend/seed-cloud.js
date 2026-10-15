require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Force the cloud DB URL, ignore local .env
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_rKDB6Z1YpOoN@ep-sparkling-wave-b4sm98w9-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const prisma = new PrismaClient();

(async () => {
  console.log('Connecting to cloud DB...');
  console.log('Host:', process.env.DATABASE_URL.split('@')[1].split('/')[0]);
  console.log('');

  const adminEmail = 'admin@infieldhub.com';
  const adminPass = 'Admin@InfieldHub2020!';
  const empEmail = 'employee@infieldhub.com';
  const empPass = 'Employee@2020!!';

  // Wipe any existing users (fresh start)
  await prisma.user.deleteMany({});
  console.log('🧹 Cleared existing users');

  const adminHashed = await bcrypt.hash(adminPass, 10);
  const empHashed = await bcrypt.hash(empPass, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: adminHashed,
      role: 'ADMIN',
      name: 'Super Admin',
      active: true,
    },
  });
  console.log('✅ Admin created');

  await prisma.user.create({
    data: {
      email: empEmail,
      password: empHashed,
      role: 'EMPLOYEE',
      name: 'Staff One',
      active: true,
    },
  });
  console.log('✅ Employee created');

  // Verify
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  const check = await bcrypt.compare(adminPass, admin.password);
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('   ADMIN SETUP COMPLETE');
  console.log('═══════════════════════════════════════════');
  console.log('   Email:    admin@infieldhub.com');
  console.log('   Password: Admin@InfieldHub2020!');
  console.log('   Verifies: ' + (check ? 'YES ✅' : 'NO ❌'));
  console.log('   Role:     ' + admin.role);
  console.log('   Active:   ' + admin.active);
  console.log('═══════════════════════════════════════════');

  process.exit(0);
})().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
