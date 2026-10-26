require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const masterProducts = [
  // --- WATER METERS (Dayliff, Baylan, Diehl, BMetes) ---
  { name: '1.25" DAYLIFF PREPAID WATER METER', price: 9500, category: 'Water Meters', type: 'Prepaid STS', brand: 'Dayliff', size: '1.25"' },
  { name: '1.5" DAYLIFF PREPAID WATER METER', price: 11500, category: 'Water Meters', type: 'Prepaid STS', brand: 'Dayliff', size: '1.5"' },
  { name: '2" DAYLIFF PREPAID WATER METER', price: 16500, category: 'Water Meters', type: 'Prepaid STS', brand: 'Dayliff', size: '2"' },
  { name: '2.5" BAYLAN VOLUMETRIC WATER METER', price: 35000, category: 'Water Meters', type: 'Volumetric', brand: 'Baylan', size: '2.5"' },
  { name: '3" DIEHL WOLTMAN WATER METER', price: 38000, category: 'Water Meters', type: 'Woltman', brand: 'Diehl', size: '3"' },
  { name: '4" BMETERS SINGLE JET WATER METER', price: 45000, category: 'Water Meters', type: 'Single Jet', brand: 'BMeters', size: '4"' },
  // --- PUMP ENDS (Dayliff, Grundfos, Pedrollo, Lorentz) ---
  { name: 'DAYLIFF D3SP 0.75KW PUMP END', price: 44000, category: 'Pump Ends', type: 'D3SP 3"', brand: 'Dayliff', size: '0.75KW' },
  { name: 'DAYLIFF DSD 1.5KW PUMP END', price: 72000, category: 'Pump Ends', type: 'DSD 4"', brand: 'Dayliff', size: '1.5KW' },
  { name: 'GRUNDFOS SP 2.2KW PUMP END', price: 102000, category: 'Pump Ends', type: 'SP 4"', brand: 'Grundfos', size: '2.2KW' },
  { name: 'PEDROLLO 4SR 1.1KW PUMP END', price: 56000, category: 'Pump Ends', type: '4SR 4"', brand: 'Pedrollo', size: '1.1KW' },
  { name: 'LORENTZ PS2-1500 PUMP END', price: 145000, category: 'Pump Ends', type: 'PS2 Solar', brand: 'Lorentz', size: '1.5KW' },
  // --- SUB-MOTORS (Empower, Vinco, Dayliff) ---
  { name: 'EMPOWER DSMO4 1.1KW 1PH SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: 'Water Filled', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 2.2KW 1PH SUB-MOTOR', price: 72000, category: 'Sub-Motors', type: 'Water Filled', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'VINCO 1.1KW 1PH SUB-MOTOR', price: 38000, category: 'Sub-Motors', type: 'Oil Filled', brand: 'VINCO', size: '1.1KW' },
  { name: 'VINCO 4KW 3PH SUB-MOTOR', price: 72000, category: 'Sub-Motors', type: 'Oil Filled', brand: 'VINCO', size: '4KW' },
  { name: 'DAYLIFF 1.5KW 1PH SUB-MOTOR', price: 52000, category: 'Sub-Motors', type: 'Water Filled', brand: 'Dayliff', size: '1.5KW' },
  // --- CABLES (Finolex, Kenya Cables, V-Guard) ---
  { name: '1.5MM2 3 CORE SUBMERSIBLE CABLE', price: 380, category: 'Submersible Cables', type: '3 Core', brand: 'Finolex', size: '1.5MM2' },
  { name: '2.5MM2 3 CORE SUBMERSIBLE CABLE', price: 560, category: 'Submersible Cables', type: '3 Core', brand: 'Finolex', size: '2.5MM2' },
  { name: '4MM2 4 CORE SUBMERSIBLE CABLE', price: 760, category: 'Submersible Cables', type: '4 Core', brand: 'Kenya Cables', size: '4MM2' },
  { name: '6MM2 4 CORE SUBMERSIBLE CABLE', price: 1160, category: 'Submersible Cables', type: '4 Core', brand: 'Kenya Cables', size: '6MM2' },
  { name: '10MM2 4 CORE SUBMERSIBLE CABLE', price: 2200, category: 'Submersible Cables', type: '4 Core', brand: 'V-Guard', size: '10MM2' },
  // --- UPVC PIPES (Apex, Simba Plastics, Kenpoly) ---
  { name: '1.25" UPVC 3M DROP PIPE - 26BAR', price: 2000, category: 'UPVC Drop Pipes', type: '26BAR', brand: 'Apex Piping', size: '1.25"' },
  { name: '1.5" UPVC 3M DROP PIPE - 26BAR', price: 2400, category: 'UPVC Drop Pipes', type: '26BAR', brand: 'Apex Piping', size: '1.5"' },
  { name: '2" UPVC 3M DROP PIPE - 21 BAR', price: 3600, category: 'UPVC Drop Pipes', type: '21 BAR', brand: 'Simba Plastics', size: '2"' },
  { name: '2.5" UPVC 3M DROP PIPE - 18 BAR', price: 4600, category: 'UPVC Drop Pipes', type: '18 BAR', brand: 'Kenpoly', size: '2.5"' },
  { name: '3" UPVC 3M DROP PIPE - 35 BAR', price: 5800, category: 'UPVC Drop Pipes', type: '35 BAR', brand: 'Apex Piping', size: '3"' },
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
  // --- SOLAR INVERTERS (Veikong, Solis, Growatt, Lorentz) ---
  { name: 'VEIKONG 2.2KW 1PH PUMPING INVERTER', price: 68000, category: 'Solar Pumping Inverters', type: 'VFD500-PV', brand: 'VEIKONG', size: '2.2KW' },
  { name: 'VEIKONG 4KW 3PH LCD PUMPING INVERTER', price: 84000, category: 'Solar Pumping Inverters', type: 'VFD500M-PV', brand: 'VEIKONG', size: '4KW' },
  { name: 'SOLIS 5KW 3PH SOLAR INVERTER', price: 120000, category: 'Solar Pumping Inverters', type: 'Grid-Tie', brand: 'Solis', size: '5KW' },
  { name: 'GROWATT 10KW 3PH HYBRID INVERTER', price: 180000, category: 'Solar Pumping Inverters', type: 'Hybrid', brand: 'Growatt', size: '10KW' },
  { name: 'LORENTZ PS2-1500 SOLAR INVERTER', price: 95000, category: 'Solar Pumping Inverters', type: 'PS2 Controller', brand: 'Lorentz', size: '1.5KW' },
  // --- CONTROL PANELS (Empower, Schneider, ABB) ---
  { name: 'EMPOWER EMP3SP 2.2KW CONTROL PANEL', price: 36000, category: 'Control Panels', type: 'EMP3SP', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'SCHNEIDER 7.5KW DOL STARTER PANEL', price: 48000, category: 'Control Panels', type: 'DOL Starter', brand: 'Schneider', size: '7.5KW' },
  { name: 'ABB 15KW SOFT STARTER PANEL', price: 85000, category: 'Control Panels', type: 'Soft Starter', brand: 'ABB', size: '15KW' },
  // --- PV DISCONNECTS & SURGE ---
  { name: 'PV DISCONNECT SISO SWITCH 32A', price: 12000, category: 'PV Disconnects', type: 'SISO Switch', brand: 'JVSG', size: '32A' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE 16A', price: 24000, category: 'PV Disconnects', type: 'C/W Breaker', brand: 'JVSG', size: '16A' },
  { name: 'AC SURGE PROTECTOR - 3PH/415V', price: 8000, category: 'Surge Protection', type: 'AC Surge', brand: 'Schneider', size: '3PH' },
  { name: 'DC SURGE PROTECTOR - 3POLE', price: 8000, category: 'Surge Protection', type: 'DC Surge', brand: 'ABB', size: '3POLE' },
  { name: 'LIGHTNING ARRESTOR - 2FT', price: 4400, category: 'Surge Protection', type: 'Arrestor', brand: 'Generic', size: '2FT' },
  // --- ACCESSORIES ---
  { name: 'SPLICING KIT - CELL PACK MM11', price: 2000, category: 'Accessories', type: 'Splicing Kit', brand: '3M', size: 'MM11' },
  { name: 'SPLICING KIT - CELL PACK MM12', price: 4000, category: 'Accessories', type: 'Splicing Kit', brand: '3M', size: 'MM12' },
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
