require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const masterProducts = [
  // --- WATER METERS ---
  { name: '1.25" SUPER WATER METER', price: 9000, category: 'Water Meters', type: 'Brass Body', brand: 'Davis', size: '1.25"' },
  { name: '1.5" SUPER WATER METER', price: 11000, category: 'Water Meters', type: 'Brass Body', brand: 'Davis', size: '1.5"' },
  { name: '2" SUPER WATER METER', price: 16000, category: 'Water Meters', type: 'Brass Body', brand: 'Davis', size: '2"' },
  { name: '2.5" SUPER WATER METER', price: 35000, category: 'Water Meters', type: 'Brass Body', brand: 'Zenner', size: '2.5"' },
  { name: '3" SUPER WATER METER', price: 38000, category: 'Water Meters', type: 'Brass Body', brand: 'Zenner', size: '3"' },
  { name: '4" SUPER WATER METER', price: 45000, category: 'Water Meters', type: 'Cast Iron', brand: 'Kent', size: '4"' },
  // --- CABLES ---
  { name: '1.5MM2 4 CORE SUBMERSIBLE CABLE', price: 380, category: 'Submersible Cables', type: 'Copper Core', brand: 'Kenya Cables', size: '1.5MM2' },
  { name: '2.5MM2 4 CORE SUBMERSIBLE CABLE', price: 560, category: 'Submersible Cables', type: 'Copper Core', brand: 'Kenya Cables', size: '2.5MM2' },
  { name: '4MM2 4 CORE SUBMERSIBLE CABLE', price: 760, category: 'Submersible Cables', type: 'Copper Core', brand: 'Finolex', size: '4MM2' },
  { name: '6MM2 4 CORE SUBMERSIBLE CABLE', price: 1160, category: 'Submersible Cables', type: 'Copper Core', brand: 'Finolex', size: '6MM2' },
  { name: '10MM2 4 CORE SUBMERSIBLE CABLE', price: 2200, category: 'Submersible Cables', type: 'Copper Core', brand: 'V-Guard', size: '10MM2' },
  { name: '1.5MM2 4 CORE U/G CABLE', price: 560, category: 'Armoured Cables', type: 'Underground', brand: 'Kenya Cables', size: '1.5MM2' },
  { name: '4.0MM2 4 CORE U/G CABLE', price: 1000, category: 'Armoured Cables', type: 'Underground', brand: 'Kenya Cables', size: '4.0MM2' },
  { name: '6.0MM2 4 CORE U/G CABLE', price: 1340, category: 'Armoured Cables', type: 'Underground', brand: 'Finolex', size: '6.0MM2' },
  { name: '10.0MM2 4 CORE U/G CABLE', price: 2200, category: 'Armoured Cables', type: 'Underground', brand: 'V-Guard', size: '10.0MM2' },
  // --- PIPES ---
  { name: '1.25" UPVC 3M DROP PIPES', price: 2000, category: 'UPVC Drop Pipes', type: '26BAR', brand: 'Apex', size: '1.25"' },
  { name: '1.5" UPVC 3M DROP PIPES', price: 2400, category: 'UPVC Drop Pipes', type: '26BAR', brand: 'Apex', size: '1.5"' },
  { name: '2" UPVC 3M DROP PIPES', price: 3600, category: 'UPVC Drop Pipes', type: '21 BAR', brand: 'Simba Plastics', size: '2"' },
  { name: '2.5" UPVC 3M DROP PIPES', price: 4600, category: 'UPVC Drop Pipes', type: '18 BAR', brand: 'Simba Plastics', size: '2.5"' },
  { name: '3" UPVC 3M DROP PIPES', price: 5800, category: 'UPVC Drop Pipes', type: '35 BAR', brand: 'Kenpoly', size: '3"' },
  // --- BOREHOLE COVERS ---
  { name: '1.25" BOREHOLE COVER WITH SUNDRIES', price: 14000, category: 'Borehole Covers', type: 'Heavy Duty', brand: 'Generic', size: '1.25"' },
  { name: '1.5" BOREHOLE COVER WITH SUNDRIES', price: 15000, category: 'Borehole Covers', type: 'Heavy Duty', brand: 'Generic', size: '1.5"' },
  { name: '2" BOREHOLE COVER WITH SUNDRIES', price: 17200, category: 'Borehole Covers', type: 'Heavy Duty', brand: 'Generic', size: '2"' },
  { name: '2.5" BOREHOLE COVER WITH SUNDRIES', price: 25600, category: 'Borehole Covers', type: 'Heavy Duty', brand: 'Generic', size: '2.5"' },
  { name: '3" BOREHOLE COVER WITH SUNDRIES', price: 31400, category: 'Borehole Covers', type: 'Heavy Duty', brand: 'Generic', size: '3"' },
  // --- NRV ---
  { name: '1.25" NRV', price: 3400, category: 'Non-Return Valves', type: 'Brass', brand: 'Generic', size: '1.25"' },
  { name: '1.5" NRV', price: 4000, category: 'Non-Return Valves', type: 'Brass', brand: 'Generic', size: '1.5"' },
  { name: '2.5" NRV', price: 5000, category: 'Non-Return Valves', type: 'Brass', brand: 'Generic', size: '2.5"' },
  { name: '3" NRV', price: 11000, category: 'Non-Return Valves', type: 'Cast Iron', brand: 'Generic', size: '3"' },
  // --- PUMPS (EMPOWER & DAVIS) ---
  { name: 'EMPOWER DP4RFF 02/18 0.75KW PUMP END', price: 44000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '0.75KW' },
  { name: 'EMPOWER DP4RFF 02/23 1.1KW PUMP END', price: 56000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DP4RFF 02/33 1.5KW PUMP END', price: 72000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DP4RFF 02/48 2.2KW PUMP END', price: 102000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'DAVIS & SHIRTLIFF 4" 1.5KW PUMP END', price: 85000, category: 'Pump Ends', type: '4" Submersible', brand: 'Davis', size: '1.5KW' },
  { name: 'DAVIS & SHIRTLIFF 6" 4.0KW PUMP END', price: 145000, category: 'Pump Ends', type: '6" Submersible', brand: 'Davis', size: '4.0KW' },
  { name: 'BENAX 4SP 1/42 1.1KW PUMP END', price: 96600, category: 'Pump Ends', type: '4SP', brand: 'BENAX', size: '1.1KW' },
  // --- SUB-MOTORS ---
  { name: 'EMPOWER DSMO4 1.1KW 1PH SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: 'Water Filled', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 1.5KW 1PH SUB-MOTOR', price: 52000, category: 'Sub-Motors', type: 'Water Filled', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DSMO4 2.2KW 1PH SUB-MOTOR', price: 72000, category: 'Sub-Motors', type: 'Water Filled', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'VINCO 1.1KW 1PH SUB-MOTOR', price: 38000, category: 'Sub-Motors', type: 'Oil Filled', brand: 'VINCO', size: '1.1KW' },
  { name: 'VINCO 2.2KW 1PH SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: 'Oil Filled', brand: 'VINCO', size: '2.2KW' },
  { name: 'VINCO 4KW 3PH SUB-MOTOR', price: 72000, category: 'Sub-Motors', type: 'Oil Filled', brand: 'VINCO', size: '4KW' },
  // --- INVERTERS & SOLAR ---
  { name: 'VEIKONG 2.2KW 1PH PUMPING INVERTER', price: 68000, category: 'Solar Pumping Inverters', type: '1PH', brand: 'VEIKONG', size: '2.2KW' },
  { name: 'VEIKONG 4KW 3PH LCD PUMPING INVERTER', price: 84000, category: 'Solar Pumping Inverters', type: '3PH LCD', brand: 'VEIKONG', size: '4KW' },
  { name: 'VEIKONG 7.5KW 3PH LCD PUMPING INVERTER', price: 100000, category: 'Solar Pumping Inverters', type: '3PH LCD', brand: 'VEIKONG', size: '7.5KW' },
  { name: 'SOLIS 5KW 3PH SOLAR INVERTER', price: 120000, category: 'Solar Pumping Inverters', type: '3PH Grid-Tie', brand: 'Solis', size: '5KW' },
  { name: 'GROWATT 10KW 3PH SOLAR INVERTER', price: 180000, category: 'Solar Pumping Inverters', type: '3PH Hybrid', brand: 'Growatt', size: '10KW' },
  // --- PANELS ---
  { name: 'EMPOWER EMP3SP 2.2KW DIGITAL CONTROL PANEL', price: 36000, category: 'Control Panels', type: 'EMP3SP', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER EMP7.5DOL 5.5KW DIGITAL CONTROL PANEL', price: 44000, category: 'Control Panels', type: 'EMP7.5DOL', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'SCHNEIDER 7.5KW DOL STARTER PANEL', price: 48000, category: 'Control Panels', type: 'DOL Starter', brand: 'Schneider', size: '7.5KW' },
  { name: 'ABB 15KW SOFT STARTER PANEL', price: 85000, category: 'Control Panels', type: 'Soft Starter', brand: 'ABB', size: '15KW' },
  // --- PV & SURGE ---
  { name: 'PV DISCONNECT SISO SWITCH 32A', price: 12000, category: 'PV Disconnects', type: 'SISO Switch', brand: 'JVSG', size: '32A' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE 16A', price: 24000, category: 'PV Disconnects', type: 'C/W Breaker', brand: 'JVSG', size: '16A' },
  { name: 'AC SURGE PROTECTOR - 3PH/415V', price: 8000, category: 'Surge Protection', type: 'AC Surge', brand: 'Schneider', size: '3PH' },
  { name: 'DC SURGE PROTECTOR - 3POLE', price: 8000, category: 'Surge Protection', type: 'DC Surge', brand: 'ABB', size: '3POLE' },
  { name: 'LIGHTNING ARRESTOR - 2FT', price: 4400, category: 'Surge Protection', type: 'Arrestor', brand: 'Generic', size: '2FT' },
  // --- ACCESSORIES ---
  { name: 'SPLICING KIT - CELL PACK MM11 FAST DRY', price: 2000, category: 'Accessories', type: 'Splicing Kit', brand: '3M', size: 'MM11' },
  { name: 'SPLICING KIT - CELL PACK MM12 FAST DRY', price: 4000, category: 'Accessories', type: 'Splicing Kit', brand: '3M', size: 'MM12' },
  { name: 'FLOAT SWITCH', price: 3000, category: 'Accessories', type: 'Switch', brand: 'Grundfos', size: 'Standard' },
  { name: 'GPRS DONGLE', price: 32000, category: 'Accessories', type: 'Dongle', brand: 'VEIKONG', size: 'Standard' }
];

async function main() {
  console.log('🧹 Wiping old data...');
  await prisma.product.deleteMany({});
  
  await prisma.user.deleteMany({ where: { email: 'admin@infieldhub.com' } });
  await prisma.user.create({
    data: { email: 'admin@infieldhub.com', password: await bcrypt.hash('Admin@InfieldHub2020!', 10), role: 'ADMIN', name: 'Super Admin', active: true }
  });

  console.log(`📦 Adding ${masterProducts.length} products with realistic brands/types...`);
  for (const item of masterProducts) {
    await prisma.product.create({ 
      data: {
        ...item,
        description: `High quality ${item.brand} ${item.category} for professional installations.`,
        longDescription: `This ${item.name} is a top-tier solution for your needs. Built for durability and high performance.`,
        stock: 10,
        status: 'APPROVED'
      }
    });
  }
  console.log('✅ Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
