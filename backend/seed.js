require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const masterProducts = [
  // --- WATER METERS (Grouped by Type & Size) ---
  { name: 'Dayliff MJ Multijet Water Meter', price: 8500, category: 'Water Meters', type: 'Multijet (MJ)', brand: 'Dayliff', size: '1/2" (DN15)' },
  { name: 'Dayliff MJ Multijet Water Meter', price: 12500, category: 'Water Meters', type: 'Multijet (MJ)', brand: 'Dayliff', size: '3/4" (DN20)' },
  { name: 'Dayliff MJ Multijet Water Meter', price: 18000, category: 'Water Meters', type: 'Multijet (MJ)', brand: 'Dayliff', size: '1" (DN25)' },
  { name: 'Dayliff WP Woltman Water Meter', price: 38000, category: 'Water Meters', type: 'Woltman (WP)', brand: 'Dayliff', size: '2" (DN50)' },
  { name: 'Dayliff WP Woltman Water Meter', price: 45000, category: 'Water Meters', type: 'Woltman (WP)', brand: 'Dayliff', size: '3" (DN80)' },
  { name: 'Baylan Volumetric Water Meter', price: 16500, category: 'Water Meters', type: 'Volumetric Piston', brand: 'Baylan', size: '2"' },
  { name: 'Diehl Woltman Water Meter', price: 52000, category: 'Water Meters', type: 'Woltman Flanged', brand: 'Diehl', size: '4"' },

  // --- PUMP ENDS ---
  { name: 'Dayliff DSD Multistage Pump End', price: 42000, category: 'Pump Ends', type: 'DSD 3"', brand: 'Dayliff', size: '0.37KW (0.5HP)' },
  { name: 'Dayliff DSD Multistage Pump End', price: 56000, category: 'Pump Ends', type: 'DSD 3"', brand: 'Dayliff', size: '0.75KW (1.0HP)' },
  { name: 'Dayliff DSD Multistage Pump End', price: 72000, category: 'Pump Ends', type: 'DSD 3"', brand: 'Dayliff', size: '1.1KW (1.5HP)' },
  { name: 'Grundfos SP Submersible Pump End', price: 145000, category: 'Pump Ends', type: 'SP 4"', brand: 'Grundfos', size: '2.2KW (3.0HP)' },
  { name: 'Pedrollo 4SR Submersible Pump End', price: 88000, category: 'Pump Ends', type: '4SR 4"', brand: 'Pedrollo', size: '1.5KW (2.0HP)' },
  { name: 'Lorentz PS2 Solar Pump End', price: 165000, category: 'Pump Ends', type: 'PS2 Solar', brand: 'Lorentz', size: '1.5KW' },

  // --- SUB-MOTORS ---
  { name: 'Dayliff 4" Water Filled Motor', price: 38000, category: 'Sub-Motors', type: 'Water Filled', brand: 'Dayliff', size: '1.1KW (1.5HP)' },
  { name: 'Dayliff 4" Water Filled Motor', price: 52000, category: 'Sub-Motors', type: 'Water Filled', brand: 'Dayliff', size: '2.2KW (3.0HP)' },
  { name: 'Vinco 4" Oil Filled Motor', price: 44000, category: 'Sub-Motors', type: 'Oil Filled', brand: 'Vinco', size: '1.5KW (2.0HP)' },
  { name: 'Empower 6" Water Filled Motor', price: 185000, category: 'Sub-Motors', type: 'Water Filled 6"', brand: 'Empower', size: '7.5KW (10HP)' },

  // --- SUBMERSIBLE CABLES ---
  { name: 'Finolex Flat Submersible Cable', price: 380, category: 'Submersible Cables', type: '3 Core Flat', brand: 'Finolex', size: '1.5MM²' },
  { name: 'Finolex Flat Submersible Cable', price: 560, category: 'Submersible Cables', type: '3 Core Flat', brand: 'Finolex', size: '2.5MM²' },
  { name: 'Finolex Flat Submersible Cable', price: 950, category: 'Submersible Cables', type: '3 Core Flat', brand: 'Finolex', size: '4.0MM²' },
  { name: 'Kenya Cables Round Submersible Cable', price: 1160, category: 'Submersible Cables', type: '4 Core Round', brand: 'Kenya Cables', size: '6.0MM²' },
  { name: 'V-Guard Flat Submersible Cable', price: 2200, category: 'Submersible Cables', type: '4 Core Flat', brand: 'V-Guard', size: '10.0MM²' },

  // --- UPVC DROP PIPES ---
  { name: 'Apex UPVC Drop Pipe 3m', price: 2000, category: 'UPVC Drop Pipes', type: 'Class C (12.5 Bar)', brand: 'Apex Piping', size: '1¼"' },
  { name: 'Apex UPVC Drop Pipe 3m', price: 2400, category: 'UPVC Drop Pipes', type: 'Class C (12.5 Bar)', brand: 'Apex Piping', size: '1½"' },
  { name: 'Simba Plastics UPVC Drop Pipe 3m', price: 3600, category: 'UPVC Drop Pipes', type: 'Class D (16 Bar)', brand: 'Simba Plastics', size: '2"' },
  { name: 'Kenpoly UPVC Drop Pipe 3m', price: 5800, category: 'UPVC Drop Pipes', type: 'Class E (20 Bar)', brand: 'Kenpoly', size: '3"' },

  // --- BOREHOLE COVERS ---
  { name: 'Heavy Duty Steel Borehole Cover', price: 14000, category: 'Borehole Covers', type: 'With Adapter Set', brand: 'Generic', size: '1¼"' },
  { name: 'Heavy Duty Steel Borehole Cover', price: 17200, category: 'Borehole Covers', type: 'With Adapter Set', brand: 'Generic', size: '2"' },
  { name: 'Heavy Duty Steel Borehole Cover', price: 31400, category: 'Borehole Covers', type: 'With Adapter Set', brand: 'Generic', size: '4"' },

  // --- NON-RETURN VALVES (NRV) ---
  { name: 'Pegler Brass Non-Return Valve', price: 3400, category: 'Non-Return Valves', type: 'Brass Spring', brand: 'Pegler', size: '1¼"' },
  { name: 'Pegler Brass Non-Return Valve', price: 4000, category: 'Non-Return Valves', type: 'Brass Spring', brand: 'Pegler', size: '1½"' },
  { name: 'Pegler Brass Non-Return Valve', price: 5000, category: 'Non-Return Valves', type: 'Brass Spring', brand: 'Pegler', size: '2"' },
  { name: 'Varte Cast Iron Non-Return Valve', price: 11000, category: 'Non-Return Valves', type: 'Cast Iron Flanged', brand: 'Varte', size: '3"' },

  // --- SOLAR PUMPING INVERTERS ---
  { name: 'Veikong VFD500-PV Solar Pump Inverter', price: 68000, category: 'Solar Pumping Inverters', type: 'VFD500 Series', brand: 'Veikong', size: '2.2KW 1PH' },
  { name: 'Veikong VFD500M-PV MPPT Solar Inverter', price: 84000, category: 'Solar Pumping Inverters', type: 'VFD500M Series', brand: 'Veikong', size: '4.0KW 3PH' },
  { name: 'Lorentz PS2 Solar Pump Controller', price: 95000, category: 'Solar Pumping Inverters', type: 'PS2 Controller', brand: 'Lorentz', size: '1.5KW' },
  { name: 'Solis Grid-Tie Solar Inverter', price: 120000, category: 'Solar Pumping Inverters', type: 'Grid-Tie', brand: 'Solis', size: '5.0KW' },
  { name: 'Growatt Hybrid Solar Inverter', price: 180000, category: 'Solar Pumping Inverters', type: 'Hybrid', brand: 'Growatt', size: '10KW 3PH' },

  // --- CONTROL PANELS ---
  { name: 'Schneider DOL Motor Starter Panel', price: 36000, category: 'Control Panels', type: 'DOL Starter', brand: 'Schneider', size: '2.2KW' },
  { name: 'ABB Soft Starter Panel', price: 48000, category: 'Control Panels', type: 'Soft Starter', brand: 'ABB', size: '5.5KW' },
  { name: 'Dayliff SVB Analog Pump Controller', price: 52000, category: 'Control Panels', type: 'SVB Controller', brand: 'Dayliff', size: '7.5KW' },
  { name: 'Dayliff SV3 Digital Pump Controller', price: 64000, category: 'Control Panels', type: 'SV3 Controller', brand: 'Dayliff', size: '11KW' },

  // --- PV DISCONNECTS & SURGE ---
  { name: 'JVSG DC Solar Disconnect Switch', price: 12000, category: 'PV Disconnects', type: 'DC SISO', brand: 'JVSG', size: '32A/1000V' },
  { name: 'Schneider AC Surge Protector', price: 8000, category: 'Surge Protection', type: 'AC Surge (iPRD)', brand: 'Schneider', size: '3PH/415V' },
  { name: 'ABB DC Surge Protector', price: 8500, category: 'Surge Protection', type: 'DC Surge', brand: 'ABB', size: '3 Pole' },
  { name: 'Copper Lightning Arrestor', price: 4400, category: 'Surge Protection', type: 'Solid Copper', brand: 'Generic', size: '2FT' },

  // --- ACCESSORIES ---
  { name: '3M Scotchcast Cable Joint Kit', price: 2000, category: 'Accessories', type: 'Resin Splice (MM11)', brand: '3M', size: '1.5 - 4.0MM²' },
  { name: '3M Scotchcast Cable Joint Kit', price: 4000, category: 'Accessories', type: 'Resin Splice (MM12)', brand: '3M', size: '6.0 - 10.0MM²' },
  { name: 'Grundfos Float Switch', price: 3000, category: 'Accessories', type: 'Level Control (MS1)', brand: 'Grundfos', size: '10m Cable' }
];

async function main() {
  console.log('🧹 Wiping old data...');
  await prisma.product.deleteMany({});
  
  await prisma.user.deleteMany({ where: { email: 'admin@infieldhub.com' } });
  await prisma.user.create({
    data: { email: 'admin@infieldhub.com', password: await bcrypt.hash('Admin@InfieldHub2020!', 10), role: 'ADMIN', name: 'Super Admin', active: true }
  });

  console.log(`📦 Adding ${masterProducts.length} products with researched brands/types...`);
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
