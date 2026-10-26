require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Wiping old data to remove duplicates...');
  await prisma.product.deleteMany({});
  
  // Create Admin
  await prisma.user.deleteMany({ where: { email: 'admin@infieldhub.com' } });
  await prisma.user.create({
    data: { email: 'admin@infieldhub.com', password: await bcrypt.hash('Admin@InfieldHub2020!', 10), role: 'ADMIN', name: 'Super Admin', active: true }
  });

  console.log('📦 Adding full product list from PDF...');
  
  const products = [
    // --- PUMPS & MOTORS ---
    { name: 'BENAX 4SP 1/42 1.1KW PUMP END', price: 96600, category: 'Water Solutions', type: 'Pump End', brand: 'BENAX', size: '1.1KW', stock: 5, status: 'APPROVED' },
    { name: 'BENAX 4SP 1/57 1.5KW PUMP END', price: 124600, category: 'Water Solutions', type: 'Pump End', brand: 'BENAX', size: '1.5KW', stock: 5, status: 'APPROVED' },
    { name: 'EMPOWER DP4RFF 02/18 0.75KW PUMP END', price: 44000, category: 'Water Solutions', type: 'Pump End', brand: 'EMPOWER', size: '0.75KW', stock: 10, status: 'APPROVED' },
    { name: 'EMPOWER DP4RFF 02/23 1.1KW PUMP END', price: 56000, category: 'Water Solutions', type: 'Pump End', brand: 'EMPOWER', size: '1.1KW', stock: 10, status: 'APPROVED' },
    { name: 'EMPOWER DP4RFF 02/33 1.5KW PUMP END', price: 72000, category: 'Water Solutions', type: 'Pump End', brand: 'EMPOWER', size: '1.5KW', stock: 10, status: 'APPROVED' },
    { name: 'EMPOWER DP4RFF 08/66 11KW PUMP END', price: 340000, category: 'Water Solutions', type: 'Pump End', brand: 'EMPOWER', size: '11KW', stock: 2, status: 'APPROVED' },
    { name: 'EMPOWER DP6MFF 46/7 11KW PUMP END', price: 170000, category: 'Water Solutions', type: 'Pump End', brand: 'EMPOWER', size: '11KW', stock: 3, status: 'APPROVED' },
    { name: 'EMPOWER DSMO4 1.1KW 1PH O/F SUB-MOTOR', price: 44000, category: 'Water Solutions', type: 'Sub-Motor', brand: 'EMPOWER', size: '1.1KW', stock: 8, status: 'APPROVED' },
    { name: 'EMPOWER DSMO4 2.2KW 1PH W/F SUB-MOTOR', price: 72000, category: 'Water Solutions', type: 'Sub-Motor', brand: 'EMPOWER', size: '2.2KW', stock: 5, status: 'APPROVED' },
    { name: 'VINCO 1.1KW 1PH SUB-MOTOR', price: 38000, category: 'Water Solutions', type: 'Sub-Motor', brand: 'VINCO', size: '1.1KW', stock: 6, status: 'APPROVED' },
    { name: 'VINCO 1.5KW 3PH SUB-MOTOR', price: 43500, category: 'Water Solutions', type: 'Sub-Motor', brand: 'VINCO', size: '1.5KW', stock: 6, status: 'APPROVED' },
    
    // --- SOLAR & INVERTERS ---
    { name: 'VEIKONG 2.2KW 1PH PUMPING INVERTER', price: 68000, category: 'Solar Solutions', type: 'Inverter', brand: 'VEIKONG', size: '2.2KW', stock: 4, status: 'APPROVED' },
    { name: 'VEIKONG 4KW 1PH PUMPING INVERTER', price: 84000, category: 'Solar Solutions', type: 'Inverter', brand: 'VEIKONG', size: '4KW', stock: 4, status: 'APPROVED' },
    { name: 'VEIKONG 7.5KW 3PH LCD PUMPING INVERTER', price: 100000, category: 'Solar Solutions', type: 'Inverter', brand: 'VEIKONG', size: '7.5KW', stock: 3, status: 'APPROVED' },
    { name: 'VEIKONG 15KW 3PH LCD PUMPING INVERTER', price: 144000, category: 'Solar Solutions', type: 'Inverter', brand: 'VEIKONG', size: '15KW', stock: 2, status: 'APPROVED' },
    { name: 'PV DISCONNECT SISO SWITCH 32A', price: 12000, category: 'Solar Solutions', type: 'Protection', brand: 'Generic', size: '32A', stock: 15, status: 'APPROVED' },
    { name: 'AC SURGE PROTECTOR - 3PH/415V', price: 8000, category: 'Solar Solutions', type: 'Protection', brand: 'Generic', size: '3PH', stock: 20, status: 'APPROVED' },
    { name: 'AC OUTPUT REACTOR 5.5KW 3PH', price: 22000, category: 'Solar Solutions', type: 'Reactor', brand: 'Generic', size: '5.5KW', stock: 10, status: 'APPROVED' },
    { name: 'EMPOWER EMP3SP 2.2KW DIGITAL CONTROL PANEL', price: 36000, category: 'Solar Solutions', type: 'Panel', brand: 'EMPOWER', size: '2.2KW', stock: 5, status: 'APPROVED' },

    // --- PIPES, CABLES & CABLES ---
    { name: '1.25" UPVC 3M DROP PIPES - 26BAR', price: 2000, category: 'Water Solutions', type: 'Pipes', brand: 'UPVC', size: '1.25 Inch', stock: 100, status: 'APPROVED' },
    { name: '1.5" UPVC 3M DROP PIPES - 26BAR', price: 2400, category: 'Water Solutions', type: 'Pipes', brand: 'UPVC', size: '1.5 Inch', stock: 100, status: 'APPROVED' },
    { name: '2" UPVC 3M DROP PIPES - 21 BAR', price: 3600, category: 'Water Solutions', type: 'Pipes', brand: 'UPVC', size: '2 Inch', stock: 80, status: 'APPROVED' },
    { name: '2.5" UPVC 3M DROP PIPES - 18 BAR', price: 4600, category: 'Water Solutions', type: 'Pipes', brand: 'UPVC', size: '2.5 Inch', stock: 50, status: 'APPROVED' },
    { name: '1.5MM2 4 CORE SUBMERSIBLE CABLE', price: 380, category: 'Electrical', type: 'Cable', brand: 'Generic', size: '1.5MM2', stock: 200, status: 'APPROVED' },
    { name: '2.5MM2 4 CORE SUBMERSIBLE CABLE', price: 560, category: 'Electrical', type: 'Cable', brand: 'Generic', size: '2.5MM2', stock: 200, status: 'APPROVED' },
    { name: '4MM2 4 CORE SUBMERSIBLE CABLE', price: 760, category: 'Electrical', type: 'Cable', brand: 'Generic', size: '4MM2', stock: 150, status: 'APPROVED' },
    { name: '6.0MM2 4 CORE U/G CABLE', price: 1340, category: 'Electrical', type: 'Cable', brand: 'Generic', size: '6.0MM2', stock: 100, status: 'APPROVED' },

    // --- ACCESSORIES ---
    { name: '1.25" SUPER WATER METER', price: 9000, category: 'Water Solutions', type: 'Meter', brand: 'Generic', size: '1.25 Inch', stock: 20, status: 'APPROVED' },
    { name: '1.5" SUPER WATER METER', price: 11000, category: 'Water Solutions', type: 'Meter', brand: 'Generic', size: '1.5 Inch', stock: 15, status: 'APPROVED' },
    { name: '2" SUPER WATER METER', price: 16000, category: 'Water Solutions', type: 'Meter', brand: 'Generic', size: '2 Inch', stock: 10, status: 'APPROVED' },
    { name: '1.25" BOREHOLE COVER WITH SUNDRIES', price: 14000, category: 'Water Solutions', type: 'Cover', brand: 'Generic', size: '1.25 Inch', stock: 12, status: 'APPROVED' },
    { name: '2" BOREHOLE COVER WITH SUNDRIES', price: 17200, category: 'Water Solutions', type: 'Cover', brand: 'Generic', size: '2 Inch', stock: 8, status: 'APPROVED' },
    { name: 'SPLICING KIT - CELL PACK MM11 FAST DRY', price: 2000, category: 'Electrical', type: 'Accessory', brand: 'Generic', size: 'Standard', stock: 30, status: 'APPROVED' },
    { name: 'LIGHTNING ARRESTOR - 2FT', price: 4400, category: 'Electrical', type: 'Protection', brand: 'Generic', size: '2FT', stock: 25, status: 'APPROVED' }
  ];

  // Insert all
  for (const item of products) {
    await prisma.product.create({ 
      data: {
        ...item,
        description: `High quality ${item.brand} ${item.type} for professional installations.`,
        longDescription: `This ${item.name} is a top-tier solution for your ${item.category.toLowerCase()}. Built for durability and high performance.`
      }
    });
  }
  
  console.log(`✅ Successfully added ${products.length} unique products!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });