const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();
(async () => {
  await p.user.deleteMany({});
  await p.user.create({ data: { email: 'admin@infieldhub.com', password: await bcrypt.hash('Admin@InfieldHub2020!', 10), role: 'ADMIN', name: 'Super Admin', active: true }});
  await p.user.create({ data: { email: 'employee@infieldhub.com', password: await bcrypt.hash('Employee@2020!!', 10), role: 'EMPLOYEE', name: 'Staff One', active: true }});
  console.log('SEEDED'); process.exit(0);
})();
