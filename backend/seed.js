require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const masterProducts = [
  // WATER METERS
  { name: 'Dayliff MJ Multijet Water Meter', price: 8500, category: 'Water Meters', type: 'Multijet (MJ)', brand: 'Dayliff', size: '1/2"' },
  { name: 'Dayliff MJ Multijet Water Meter', price: 12500, category: 'Water Meters', type: 'Multijet (MJ)', brand: 'Dayliff', size: '3/4"' },
  { name: 'Dayliff MJ Multijet Water Meter', price: 18000, category: 'Water Meters', type: 'Multijet (MJ)', brand: 'Dayliff', size: '1"' },
  { name: 'Dayliff WP Woltman Water Meter', price: 38000, category: 'Water Meters', type: 'Woltman (WP)', brand: 'Dayliff', size: '2"' },
  { name: 'Dayliff WP Woltman Water Meter', price: 45000, category: 'Water Meters', type: 'Woltman (WP)', brand: 'Dayliff', size: '3"' },
  { name: 'Baylan Volumetric Water Meter', price: 16500, category: 'Water Meters', type: 'Volumetric', brand: 'Baylan', size: '1/2"' },
  { name: 'Baylan Volumetric Water Meter', price: 18500, category: 'Water Meters', type: 'Volumetric', brand: 'Baylan', size: '3/4"' },
  { name: 'Diehl Woltman Flanged Water Meter', price: 52000, category: 'Water Meters', type: 'Woltman Flanged', brand: 'Diehl', size: '4"' },

  // PUMP ENDS
  { name: 'EMPOWER DP4RFF 02/18 0.75KW PUMP END', price: 44000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '0.75KW' },
  { name: 'EMPOWER DP4RFF 02/23 1.1KW PUMP END', price: 56000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DP4RFF 02/33 1.5KW PUMP END', price: 72000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DP4RFF 02/48 2.2KW PUMP END', price: 102000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DP4RFF 05/50 5.5KW PUMP END', price: 120000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DP6MFF 17/7 4KW PUMP END', price: 92000, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DP6MFF 17/10 5.5KW PUMP END', price: 80000, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DP6MFF 17/13 7.5KW PUMP END', price: 114600, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP6MFF 46/7 11KW PUMP END', price: 170000, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '11KW' },
  { name: 'BENAX 4SP 1/42 1.1KW PUMP END', price: 96600, category: 'Pump Ends', type: '4SP', brand: 'BENAX', size: '1.1KW' },
  { name: 'BENAX 4SP 1/57 1.5KW PUMP END', price: 124600, category: 'Pump Ends', type: '4SP', brand: 'BENAX', size: '1.5KW' },

  // SUB-MOTORS
  { name: 'EMPOWER DSMO4 1.1KW 1PH O/F SUB-MOTOR', price: 44000, category: 'Sub-Motors', type: 'DSMO4 1PH O/F', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 1.5KW 1PH O/F SUB-MOTOR', price: 50000, category: 'Sub-Motors', type: 'DSMO4 1PH O/F', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DSMO4 2.2KW 1PH O/F SUB-MOTOR', price: 62000, category: 'Sub-Motors', type: 'DSMO4 1PH O/F', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DSMO4 0.75KW 1PH W/F SUB-MOTOR', price: 42000, category: 'Sub-Motors', type: 'DSMO4 1PH W/F', brand: 'EMPOWER', size: '0.75KW' },
  { name: 'EMPOWER DSMO4 1.1KW 1PH W/F SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: 'DSMO4 1PH W/F', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 2.2KW 3PH SUB-MOTOR', price: 70000, category: 'Sub-Motors', type: 'DSMO4 3PH', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DSMO5 7.5KW 3PH SUB-MOTOR', price: 154000, category: 'Sub-Motors', type: 'DSMO5/6 3PH', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'VINCO 1.1KW 1PH SUB-MOTOR', price: 38000, category: 'Sub-Motors', type: '1PH Motors', brand: 'VINCO', size: '1.1KW' },
  { name: 'VINCO 1.5KW 3PH SUB-MOTOR', price: 43500, category: 'Sub-Motors', type: '3PH Motors', brand: 'VINCO', size: '1.5KW' },
  { name: 'VINCO 7.5KW 6" 3PH SUB-MOTOR', price: 130000, category: 'Sub-Motors', type: '3PH Motors', brand: 'VINCO', size: '7.5KW' },

  // CABLES
  { name: '1.5MM2 4 CORE SUBMERSIBLE CABLE', price: 380, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '1.5MM2' },
  { name: '2.5MM2 4 CORE SUBMERSIBLE CABLE', price: 560, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '2.5MM2' },
  { name: '4MM2 4 CORE SUBMERSIBLE CABLE', price: 760, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '4MM2' },
  { name: '6MM2 4 CORE SUBMERSIBLE CABLE', price: 1160, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '6MM2' },
  { name: '10MM2 4 CORE SUBMERSIBLE CABLE', price: 2200, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '10MM2' },

  // PIPES
  { name: '1.25" UPVC 3M DROP PIPES - 26BAR', price: 2000, category: 'UPVC Drop Pipes', type: 'Class C (26BAR)', brand: 'Generic', size: '1.25"' },
  { name: '1.5" UPVC 3M DROP PIPES - 26BAR', price: 2400, category: 'UPVC Drop Pipes', type: 'Class C (26BAR)', brand: 'Generic', size: '1.5"' },
  { name: '2" UPVC 3M DROP PIPES - 21 BAR', price: 3600, category: 'UPVC Drop Pipes', type: 'Class D (21-27BAR)', brand: 'Generic', size: '2"' },
  { name: '2" UPVC 3M DROP PIPES - 27 BAR', price: 4600, category: 'UPVC Drop Pipes', type: 'Class D (21-27BAR)', brand: 'Generic', size: '2"' },
  { name: '2.5" UPVC 3M DROP PIPES - 18 BAR', price: 4600, category: 'UPVC Drop Pipes', type: 'Class D (21-27BAR)', brand: 'Generic', size: '2.5"' },
  { name: '3" UPVC 3M DROP PIPES - 35 BAR', price: 7600, category: 'UPVC Drop Pipes', type: 'Class E (35BAR)', brand: 'Generic', size: '3"' },

  // INVERTERS & PANELS
  { name: 'VEIKONG 2.2KW 1PH PUMPING INVERTER', price: 68000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '2.2KW' },
  { name: 'VEIKONG 4KW 1PH PUMPING INVERTER', price: 84000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '4KW' },
  { name: 'VEIKONG 7.5KW 3PH LCD PUMPING INVERTER', price: 100000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '7.5KW' },
  { name: 'EMPOWER EMP3SP 2.2KW DIGITAL CONTROL PANEL', price: 36000, category: 'Control Panels', type: 'Digital', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER EMP7.5DOL 5.5KW DIGITAL CONTROL PANEL', price: 44000, category: 'Control Panels', type: 'Digital', brand: 'EMPOWER', size: '5.5KW' },

  // REACTORS, PV, SURGE
  { name: 'AC OUTPUT REACTOR 4KW 1PH', price: 20000, category: 'AC Output Reactors', type: '1PH / 3PH', brand: 'Generic', size: '4KW' },
  { name: 'AC OUTPUT REACTOR 5.5KW 3PH', price: 22000, category: 'AC Output Reactors', type: '1PH / 3PH', brand: 'Generic', size: '5.5KW' },
  { name: 'PV DISCONNECT SISO SWITCH 32A', price: 12000, category: 'PV Disconnects', type: 'SISO / C/W Breaker', brand: 'Generic', size: '32A' },
  { name: 'AC SURGE PROTECTOR - 3PH/415V', price: 8000, category: 'Surge Protectors', type: 'AC / DC', brand: 'Generic', size: '3PH/415V' },

  // NRV, COVERS, ACCESSORIES
  { name: '1.25" NRV', price: 3400, category: 'Non-Return Valves', type: 'Brass / Cast Iron', brand: 'Generic', size: '1.25"' },
  { name: '1.5" NRV', price: 4000, category: 'Non-Return Valves', type: 'Brass / Cast Iron', brand: 'Generic', size: '1.5"' },
  { name: '1.25" BOREHOLE COVER WITH SUNDRIES', price: 14000, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '1.25"' },
  { name: '2" BOREHOLE COVER WITH SUNDRIES', price: 17200, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '2"' },
  { name: 'SPLICING KIT - CELL PACK MM11', price: 2000, category: 'Accessories', type: 'Splicing Kit', brand: 'Generic', size: 'MM11' },
  { name: 'SPLICING KIT - CELL PACK MM12', price: 4000, category: 'Accessories', type: 'Splicing Kit', brand: 'Generic', size: 'MM12' },
  { name: 'GPRS DONGLE', price: 32000, category: 'Accessories', type: 'Misc', brand: 'Generic', size: 'Standard' }
];

async function main() {
  // 🛡️ PERSISTENCE GUARANTEE: Check if DB has data before wiping
  const count = await prisma.product.count();
  if (count > 0) {
    console.log('✅ Database already has products. Skipping seed to protect your images and edits.');
    return;
  }

  console.log('🧹 First time run: Wiping empty/old data...');
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
