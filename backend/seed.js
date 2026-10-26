require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Master Data: Every category has researched brands and types
const masterProducts = [
  // --- WATER METERS ---
  { name: '1.25" WATER METER', price: 9000, category: 'Water Meters', type: 'Brass Body', brand: 'Davis & Shirtliff', size: '1.25"' },
  { name: '1.5" WATER METER', price: 11000, category: 'Water Meters', type: 'Brass Body', brand: 'Davis & Shirtliff', size: '1.5"' },
  { name: '2" WATER METER', price: 16000, category: 'Water Meters', type: 'Brass Body', brand: 'Zenner', size: '2"' },
  { name: '2.5" WATER METER', price: 35000, category: 'Water Meters', type: 'Brass Body', brand: 'Zenner', size: '2.5"' },
  { name: '3" WATER METER', price: 38000, category: 'Water Meters', type: 'Cast Iron', brand: 'Kent', size: '3"' },
  { name: '4" WATER METER', price: 45000, category: 'Water Meters', type: 'Woltman', brand: 'Diehl', size: '4"' },

  // --- PUMP ENDS ---
  { name: '4" SUBMERSIBLE PUMP END', price: 44000, category: 'Pump Ends', type: '4" Multistage', brand: 'Dayliff', size: '0.75KW' },
  { name: '4" SUBMERSIBLE PUMP END', price: 72000, category: 'Pump Ends', type: '4" Multistage', brand: 'Pedrollo', size: '1.5KW' },
  { name: '6" SUBMERSIBLE PUMP END', price: 145000, category: 'Pump Ends', type: '6" Multistage', brand: 'Grundfos', size: '4.0KW' },

  // --- SUB-MOTORS ---
  { name: '4" SUBMERSIBLE MOTOR', price: 48000, category: 'Sub-Motors', type: 'Water Filled', brand: 'Dayliff', size: '1.1KW' },
  { name: '4" SUBMERSIBLE MOTOR', price: 72000, category: 'Sub-Motors', type: 'Water Filled', brand: 'Dayliff', size: '2.2KW' },
  { name: '4" SUBMERSIBLE MOTOR', price: 38000, category: 'Sub-Motors', type: 'Oil Filled', brand: 'Vinco', size: '1.1KW' },

  // --- CABLES ---
  { name: '3 CORE SUBMERSIBLE CABLE', price: 380, category: 'Submersible Cables', type: '3 Core Flat', brand: 'Finolex', size: '1.5MM2' },
  { name: '3 CORE SUBMERSIBLE CABLE', price: 560, category: 'Submersible Cables', type: '3 Core Flat', brand: 'Finolex', size: '2.5MM2' },
  { name: '4 CORE SUBMERSIBLE CABLE', price: 760, category: 'Submersible Cables', type: '4 Core Round', brand: 'Kenya Cables', size: '4.0MM2' },
  { name: '4 CORE SUBMERSIBLE CABLE', price: 1160, category: 'Submersible Cables', type: '4 Core Round', brand: 'V-Guard', size: '6.0MM2' },

  // --- UPVC DROP PIPES ---
  { name: 'UPVC 3M DROP PIPE', price: 2000, category: 'UPVC Drop Pipes', type: '26BAR', brand: 'Apex Piping', size: '1.25"' },
  { name: 'UPVC 3M DROP PIPE', price: 2400, category: 'UPVC Drop Pipes', type: '26BAR', brand: 'Apex Piping', size: '1.5"' },
  { name: 'UPVC 3M DROP PIPE', price: 3600, category: 'UPVC Drop Pipes', type: '21 BAR', brand: 'Simba Plastics', size: '2"' },
  { name: 'UPVC 3M DROP PIPE', price: 5800, category: 'UPVC Drop Pipes', type: '35 BAR', brand: 'Kenpoly', size: '3"' },

  // --- BOREHOLE COVERS ---
  { name: 'BOREHOLE COVER WITH SUNDRIES', price: 14000, category: 'Borehole Covers', type: 'Heavy Duty', brand: 'Generic', size: '1.25"' },
  { name: 'BOREHOLE COVER WITH SUNDRIES', price: 17200, category: 'Borehole Covers', type: 'Heavy Duty', brand: 'Generic', size: '2"' },
  { name: 'BOREHOLE COVER WITH SUNDRIES', price: 31400, category: 'Borehole Covers', type: 'Heavy Duty', brand: 'Generic', size: '3"' },

  // --- NRV ---
  { name: 'NON-RETURN VALVE', price: 3400, category: 'Non-Return Valves', type: 'Brass', brand: 'Pegler', size: '1.25"' },
  { name: 'NON-RETURN VALVE', price: 4000, category: 'Non-Return Valves', type: 'Brass', brand: 'Pegler', size: '1.5"' },
  { name: 'NON-RETURN VALVE', price: 5000, category: 'Non-Return Valves', type: 'Brass', brand: 'Varte', size: '2.5"' },
  { name: 'NON-RETURN VALVE', price: 11000, category: 'Non-Return Valves', type: 'Cast Iron', brand: 'Varte', size: '3"' },

  // --- SOLAR INVERTERS ---
  { name: 'SOLAR PUMPING INVERTER', price: 68000, category: 'Solar Pumping Inverters', type: 'VFD500-PV', brand: 'VEIKONG', size: '2.2KW' },
  { name: 'SOLAR PUMPING INVERTER', price: 84000, category: 'Solar Pumping Inverters', type: 'VFD500-PV', brand: 'VEIKONG', size: '4.0KW' },
  { name: 'SOLAR PUMPING INVERTER', price: 95000, category: 'Solar Pumping Inverters', type: 'PS2 Controller', brand: 'Lorentz', size: '1.5KW' },
  { name: 'SOLAR PUMPING INVERTER', price: 120000, category: 'Solar Pumping Inverters', type: 'Grid-Tie', brand: 'Solis', size: '5.0KW' },

  // --- CONTROL PANELS ---
  { name: 'DIGITAL CONTROL PANEL', price: 36000, category: 'Control Panels', type: 'DOL Starter', brand: 'Schneider', size: '2.2KW' },
  { name: 'DIGITAL CONTROL PANEL', price: 48000, category: 'Control Panels', type: 'Soft Starter', brand: 'ABB', size: '5.5KW' },

  // --- PV DISCONNECTS & SURGE ---
  { name: 'PV DISCONNECT SWITCH', price: 12000, category: 'PV Disconnects', type: 'SISO Switch', brand: 'JVSG', size: '32A' },
  { name: 'AC SURGE PROTECTOR', price: 8000, category: 'Surge Protection', type: 'AC Surge', brand: 'Schneider', size: '3PH/415V' },
  { name: 'LIGHTNING ARRESTOR', price: 4400, category: 'Surge Protection', type: '2FT Arrestor', brand: 'Generic', size: '2FT' },

  // --- ACCESSORIES ---
  { name: 'SPLICING KIT', price: 2000, category: 'Accessories', type: 'Fast Dry', brand: '3M', size: 'MM11' },
  { name: 'SPLICING KIT', price: 4000, category: 'Accessories', type: 'Fast Dry', brand: '3M', size: 'MM12' },
  { name: 'FLOAT SWITCH', price: 3000, category: 'Accessories', type: 'Standard', brand: 'Grundfos', size: 'Standard' }
];

async function main() {
  console.log('🧹 Wiping old data...');
  await prisma.product.deleteMany({});
  
  await prisma.user.deleteMany({ where: { email: 'admin@infieldhub.com' } });
  await prisma.user.create({
    data: { email: 'admin@infieldhub.com', password: await bcrypt.hash('Admin@InfieldHub2020!', 10), role: 'ADMIN', name: 'Super Admin', active: true }
  });

  console.log(`📦 Adding ${masterProducts.length} products...`);
  for (const item of masterProducts) {
    await prisma.product.create({ 
      data: {
        ...item,
        description: `High quality ${item.brand} ${item.category} for professional installations.`,
        longDescription: `This ${item.name} is a top-tier solution for your needs.`,
        stock: 10,
        status: 'APPROVED'
      }
    });
  }
  console.log('✅ Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
