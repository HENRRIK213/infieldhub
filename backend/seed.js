require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const masterProducts = [
  // --- WATER METERS ---
  { name: 'Dayliff MJ Multijet Water Meter', price: 8500, category: 'Water Meters', type: 'Multijet (MJ)', brand: 'Dayliff', size: '1/2"' },
  { name: 'Dayliff MJ Multijet Water Meter', price: 12500, category: 'Water Meters', type: 'Multijet (MJ)', brand: 'Dayliff', size: '3/4"' },
  { name: 'Dayliff MJ Multijet Water Meter', price: 18000, category: 'Water Meters', type: 'Multijet (MJ)', brand: 'Dayliff', size: '1"' },
  { name: 'Dayliff WP Woltman Water Meter', price: 25000, category: 'Water Meters', type: 'Woltman (WP)', brand: 'Dayliff', size: '1.5"' },
  { name: 'Dayliff WP Woltman Water Meter', price: 38000, category: 'Water Meters', type: 'Woltman (WP)', brand: 'Dayliff', size: '2"' },
  { name: 'Dayliff WP Woltman Water Meter', price: 45000, category: 'Water Meters', type: 'Woltman (WP)', brand: 'Dayliff', size: '3"' },
  { name: 'Baylan Volumetric Water Meter', price: 16500, category: 'Water Meters', type: 'Volumetric', brand: 'Baylan', size: '1/2"' },
  { name: 'Baylan Volumetric Water Meter', price: 18500, category: 'Water Meters', type: 'Volumetric', brand: 'Baylan', size: '3/4"' },
  { name: 'Diehl Woltman Flanged Water Meter', price: 40000, category: 'Water Meters', type: 'Woltman Flanged', brand: 'Diehl', size: '2"' },
  { name: 'Diehl Woltman Flanged Water Meter', price: 50000, category: 'Water Meters', type: 'Woltman Flanged', brand: 'Diehl', size: '3"' },
  { name: 'Diehl Woltman Flanged Water Meter', price: 52000, category: 'Water Meters', type: 'Woltman Flanged', brand: 'Diehl', size: '4"' },

  // --- PUMP ENDS ---
  { name: 'EMPOWER DP4RFF 02/18 0.75KW PUMP END', price: 44000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '0.75KW' },
  { name: 'EMPOWER DP4RFF 02/23 1.1KW PUMP END', price: 56000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DP4RFF 02/33 1.5KW PUMP END', price: 72000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DP4RFF 02/48 2.2KW PUMP END', price: 102000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DP4RFF 02/65 3KW PUMP END', price: 142000, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '3KW' },
  { name: 'EMPOWER DP4RFF 03/60 4KW PUMP END', price: 126600, category: 'Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DP6MFF 17/7 4KW PUMP END', price: 92000, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DP6MFF 17/10 5.5KW PUMP END', price: 80000, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DP6MFF 17/13 7.5KW PUMP END', price: 114600, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP6MFF 46/7 11KW PUMP END', price: 170000, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '11KW' },
  { name: 'EMPOWER DP6MFF 46/10 15KW PUMP END', price: 200000, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '15KW' },
  { name: 'EMPOWER DP6MFF 46/15 22KW PUMP END', price: 220000, category: 'Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '22KW' },
  { name: 'BENAX 4SP 1/42 1.1KW PUMP END', price: 96600, category: 'Pump Ends', type: '4SP', brand: 'BENAX', size: '1.1KW' },
  { name: 'BENAX 4SP 1/57 1.5KW PUMP END', price: 124600, category: 'Pump Ends', type: '4SP', brand: 'BENAX', size: '1.5KW' },
  { name: 'Dayliff DSD 3" 0.37KW PUMP END', price: 42000, category: 'Pump Ends', type: 'DSD 3"', brand: 'Dayliff', size: '0.37KW' },
  { name: 'Dayliff DSD 3" 0.75KW PUMP END', price: 56000, category: 'Pump Ends', type: 'DSD 3"', brand: 'Dayliff', size: '0.75KW' },
  { name: 'Dayliff DSD 3" 1.1KW PUMP END', price: 72000, category: 'Pump Ends', type: 'DSD 3"', brand: 'Dayliff', size: '1.1KW' },
  { name: 'Grundfos SP 4" 2.2KW PUMP END', price: 145000, category: 'Pump Ends', type: 'SP 4"', brand: 'Grundfos', size: '2.2KW' },

  // --- SUB-MOTORS ---
  { name: 'EMPOWER DSMO4 1.1KW 1PH O/F SUB-MOTOR', price: 44000, category: 'Sub-Motors', type: 'DSMO4 1PH O/F', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 1.5KW 1PH O/F SUB-MOTOR', price: 50000, category: 'Sub-Motors', type: 'DSMO4 1PH O/F', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DSMO4 2.2KW 1PH O/F SUB-MOTOR', price: 62000, category: 'Sub-Motors', type: 'DSMO4 1PH O/F', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DSMO4 0.75KW 1PH W/F SUB-MOTOR', price: 42000, category: 'Sub-Motors', type: 'DSMO4 1PH W/F', brand: 'EMPOWER', size: '0.75KW' },
  { name: 'EMPOWER DSMO4 1.1KW 1PH W/F SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: 'DSMO4 1PH W/F', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 1.5KW 1PH W/F SUB-MOTOR', price: 52000, category: 'Sub-Motors', type: 'DSMO4 1PH W/F', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DSMO4 2.2KW 1PH W/F SUB-MOTOR', price: 72000, category: 'Sub-Motors', type: 'DSMO4 1PH W/F', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DSMO4 1.1KW 3PH SUB-MOTOR', price: 56000, category: 'Sub-Motors', type: 'DSMO4 3PH', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 1.5KW 3PH SUB-MOTOR', price: 58000, category: 'Sub-Motors', type: 'DSMO4 3PH', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DSMO4 2.2KW 3PH SUB-MOTOR', price: 70000, category: 'Sub-Motors', type: 'DSMO4 3PH', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DSMO4 3KW 3PH SUB-MOTOR', price: 78000, category: 'Sub-Motors', type: 'DSMO4 3PH', brand: 'EMPOWER', size: '3KW' },
  { name: 'EMPOWER DSMO4 4KW 3PH SUB-MOTOR', price: 93000, category: 'Sub-Motors', type: 'DSMO4 3PH', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DSMO4 5.5KW 3PH SUB-MOTOR', price: 104000, category: 'Sub-Motors', type: 'DSMO4 3PH', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DSMO4 7.5KW 3PH SUB-MOTOR', price: 132000, category: 'Sub-Motors', type: 'DSMO4 3PH', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DSMO5/6 7.5KW 3PH SUB-MOTOR', price: 154000, category: 'Sub-Motors', type: 'DSMO5/6 3PH', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DSMO5/6 9.3KW 3PH SUB-MOTOR', price: 194000, category: 'Sub-Motors', type: 'DSMO5/6 3PH', brand: 'EMPOWER', size: '9.3KW' },
  { name: 'EMPOWER DSMO5/6 11KW 3PH SUB-MOTOR', price: 204000, category: 'Sub-Motors', type: 'DSMO5/6 3PH', brand: 'EMPOWER', size: '11KW' },
  { name: 'EMPOWER DSMO5/6 13KW 3PH SUB-MOTOR', price: 220600, category: 'Sub-Motors', type: 'DSMO5/6 3PH', brand: 'EMPOWER', size: '13KW' },
  { name: 'EMPOWER DSMO5/6 15KW 3PH SUB-MOTOR', price: 256800, category: 'Sub-Motors', type: 'DSMO5/6 3PH', brand: 'EMPOWER', size: '15KW' },
  { name: 'VINCO 1.1KW 1PH SUB-MOTOR', price: 38000, category: 'Sub-Motors', type: '1PH Motors', brand: 'VINCO', size: '1.1KW' },
  { name: 'VINCO 1.5KW 1PH SUB-MOTOR', price: 42000, category: 'Sub-Motors', type: '1PH Motors', brand: 'VINCO', size: '1.5KW' },
  { name: 'VINCO 2.2KW 1PH SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: '1PH Motors', brand: 'VINCO', size: '2.2KW' },
  { name: 'VINCO 1.1KW 3PH SUB-MOTOR', price: 38000, category: 'Sub-Motors', type: '3PH Motors', brand: 'VINCO', size: '1.1KW' },
  { name: 'VINCO 1.5KW 3PH SUB-MOTOR', price: 43500, category: 'Sub-Motors', type: '3PH Motors', brand: 'VINCO', size: '1.5KW' },
  { name: 'VINCO 2.2KW 3PH SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: '3PH Motors', brand: 'VINCO', size: '2.2KW' },
  { name: 'VINCO 3KW 3PH SUB-MOTOR', price: 60000, category: 'Sub-Motors', type: '3PH Motors', brand: 'VINCO', size: '3KW' },
  { name: 'VINCO 4KW 3PH SUB-MOTOR', price: 72000, category: 'Sub-Motors', type: '3PH Motors', brand: 'VINCO', size: '4KW' },
  { name: 'VINCO 5.5KW 3PH SUB-MOTOR', price: 84000, category: 'Sub-Motors', type: '3PH Motors', brand: 'VINCO', size: '5.5KW' },
  { name: 'VINCO 7.5KW 6" 3PH SUB-MOTOR', price: 130000, category: 'Sub-Motors', type: '3PH Motors', brand: 'VINCO', size: '7.5KW' },

  // --- SUBMERSIBLE CABLES ---
  { name: '1.5MM2 4 CORE SUBMERSIBLE CABLE', price: 380, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '1.5MM2' },
  { name: '2.5MM2 4 CORE SUBMERSIBLE CABLE', price: 560, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '2.5MM2' },
  { name: '4MM2 4 CORE SUBMERSIBLE CABLE', price: 760, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '4MM2' },
  { name: '6MM2 4 CORE SUBMERSIBLE CABLE', price: 1160, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '6MM2' },
  { name: '10MM2 4 CORE SUBMERSIBLE CABLE', price: 2200, category: 'Submersible Cables', type: '4 Core', brand: 'Generic', size: '10MM2' },

  // --- UPVC DROP PIPES ---
  { name: '1.25" UPVC 3M DROP PIPES', price: 2000, category: 'UPVC Drop Pipes', type: 'Class C (26BAR)', brand: 'Generic', size: '1.25"' },
  { name: '1.5" UPVC 3M DROP PIPES', price: 2400, category: 'UPVC Drop Pipes', type: 'Class C (26BAR)', brand: 'Generic', size: '1.5"' },
  { name: '2" UPVC 3M DROP PIPES', price: 3600, category: 'UPVC Drop Pipes', type: 'Class D (21-27BAR)', brand: 'Generic', size: '2"' },
  { name: '2.5" UPVC 3M DROP PIPES', price: 4600, category: 'UPVC Drop Pipes', type: 'Class D (21-27BAR)', brand: 'Generic', size: '2.5"' },
  { name: '3" UPVC 3M DROP PIPES', price: 7600, category: 'UPVC Drop Pipes', type: 'Class E (35BAR)', brand: 'Generic', size: '3"' },

  // --- SOLAR PUMP INVERTERS ---
  { name: 'VEIKONG 2.2KW SOLAR PUMP INVERTER', price: 68000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '2.2KW' },
  { name: 'VEIKONG 4KW SOLAR PUMP INVERTER', price: 84000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '4KW' },
  { name: 'VEIKONG 5.5KW SOLAR PUMP INVERTER', price: 90000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '5.5KW' },
  { name: 'VEIKONG 7.5KW SOLAR PUMP INVERTER', price: 100000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '7.5KW' },
  { name: 'VEIKONG 11KW SOLAR PUMP INVERTER', price: 130000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '11KW' },
  { name: 'VEIKONG 15KW SOLAR PUMP INVERTER', price: 144000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '15KW' },
  { name: 'VEIKONG 22KW SOLAR PUMP INVERTER', price: 210000, category: 'Solar Pump Inverters', type: '1PH / 3PH', brand: 'VEIKONG', size: '22KW' },

  // --- CONTROL PANELS ---
  { name: 'EMPOWER EMP3SP 2.2KW DIGITAL CONTROL PANEL', price: 36000, category: 'Control Panels', type: 'Digital', brand: 'EMPOWER', size: 'EMP3SP 2.2KW' },
  { name: 'EMPOWER EMP7.5DOL 5.5KW DIGITAL CONTROL PANEL', price: 44000, category: 'Control Panels', type: 'Digital', brand: 'EMPOWER', size: 'EMP7.5DOL 5.5KW' },
  { name: 'EMPOWER EMP10DOL 7.5KW DIGITAL CONTROL PANEL', price: 50000, category: 'Control Panels', type: 'Digital', brand: 'EMPOWER', size: 'EMP10DOL 7.5KW' },
  { name: 'EMPOWER EMP20DOL 15KW DIGITAL CONTROL PANEL', price: 64000, category: 'Control Panels', type: 'Digital', brand: 'EMPOWER', size: 'EMP20DOL 15KW' },

  // --- AC OUTPUT REACTORS ---
  { name: 'AC OUTPUT REACTOR 4KW', price: 20000, category: 'AC Output Reactors', type: '1PH / 3PH', brand: 'Generic', size: '4KW' },
  { name: 'AC OUTPUT REACTOR 5.5KW', price: 22000, category: 'AC Output Reactors', type: '1PH / 3PH', brand: 'Generic', size: '5.5KW' },
  { name: 'AC OUTPUT REACTOR 7.5KW', price: 24000, category: 'AC Output Reactors', type: '1PH / 3PH', brand: 'Generic', size: '7.5KW' },
  { name: 'AC OUTPUT REACTOR 11KW', price: 27000, category: 'AC Output Reactors', type: '1PH / 3PH', brand: 'Generic', size: '11KW' },
  { name: 'AC OUTPUT REACTOR 15KW', price: 32000, category: 'AC Output Reactors', type: '1PH / 3PH', brand: 'Generic', size: '15KW' },
  { name: 'AC OUTPUT REACTOR 22KW', price: 36000, category: 'AC Output Reactors', type: '1PH / 3PH', brand: 'Generic', size: '22KW' },

  // --- PV DISCONNECTS ---
  { name: 'PV DISCONNECT 32A', price: 12000, category: 'PV Disconnects', type: 'SISO / C/W Breaker', brand: 'Generic', size: '32A' },
  { name: 'PV DISCONNECT 16A', price: 24000, category: 'PV Disconnects', type: 'SISO / C/W Breaker', brand: 'Generic', size: '16A' },
  { name: 'PV DISCONNECT 20A', price: 25000, category: 'PV Disconnects', type: 'SISO / C/W Breaker', brand: 'Generic', size: '20A' },
  { name: 'PV DISCONNECT 40A', price: 27000, category: 'PV Disconnects', type: 'SISO / C/W Breaker', brand: 'Generic', size: '40A' },
  { name: 'PV DISCONNECT 63A', price: 30000, category: 'PV Disconnects', type: 'SISO / C/W Breaker', brand: 'Generic', size: '63A' },

  // --- SURGE PROTECTORS ---
  { name: 'SURGE PROTECTOR 1PH/275V', price: 6000, category: 'Surge Protectors', type: 'AC / DC', brand: 'Generic', size: '1PH/275V' },
  { name: 'SURGE PROTECTOR 3PH/415V', price: 8000, category: 'Surge Protectors', type: 'AC / DC', brand: 'Generic', size: '3PH/415V' },
  { name: 'SURGE PROTECTOR 3POLE', price: 8000, category: 'Surge Protectors', type: 'AC / DC', brand: 'Generic', size: '3POLE' },

  // --- NON-RETURN VALVES ---
  { name: '1.25" NRV', price: 3400, category: 'Non-Return Valves', type: 'Brass / Cast Iron', brand: 'Generic', size: '1.25"' },
  { name: '1.5" NRV', price: 4000, category: 'Non-Return Valves', type: 'Brass / Cast Iron', brand: 'Generic', size: '1.5"' },
  { name: '2.5" NRV', price: 5000, category: 'Non-Return Valves', type: 'Brass / Cast Iron', brand: 'Generic', size: '2.5"' },
  { name: '3" NRV', price: 11000, category: 'Non-Return Valves', type: 'Brass / Cast Iron', brand: 'Generic', size: '3"' },

  // --- BOREHOLE COVERS ---
  { name: '1.25" BOREHOLE COVER WITH SUNDRIES', price: 14000, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '1.25"' },
  { name: '1.5" BOREHOLE COVER WITH SUNDRIES', price: 15000, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '1.5"' },
  { name: '2" BOREHOLE COVER WITH SUNDRIES', price: 17200, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '2"' },
  { name: '2.5" BOREHOLE COVER WITH SUNDRIES', price: 25600, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '2.5"' },
  { name: '3" BOREHOLE COVER WITH SUNDRIES', price: 31400, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '3"' },

  // --- ACCESSORIES ---
  { name: 'SPLICING KIT MM11', price: 2000, category: 'Accessories', type: 'Splicing Kit', brand: 'Generic', size: 'MM11' },
  { name: 'SPLICING KIT MM12', price: 4000, category: 'Accessories', type: 'Splicing Kit', brand: 'Generic', size: 'MM12' },
  { name: 'FLOAT SWITCH', price: 3000, category: 'Accessories', type: 'Misc', brand: 'Generic', size: 'Float Switch' },
  { name: 'GPRS DONGLE', price: 32000, category: 'Accessories', type: 'Misc', brand: 'Generic', size: 'GPRS Dongle' },
  { name: 'EARTH ROD', price: 1600, category: 'Accessories', type: 'Misc', brand: 'Generic', size: 'Earth Rod' }
];

async function main() {
  console.log('🧹 Wiping users and products for a clean slate...');
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('👤 Creating Admin and Employee accounts...');
  await prisma.user.create({
    data: { 
      email: 'admin@infieldhub.com', 
      password: await bcrypt.hash('Admin@InfieldHub2020!', 10), 
      role: 'ADMIN', 
      name: 'Super Admin', 
      active: true 
    }
  });

  await prisma.user.create({
    data: { 
      email: 'employee@infieldhub.com', 
      password: await bcrypt.hash('Employee@InfieldHub2020!', 10), 
      role: 'EMPLOYEE', 
      name: 'Sales Employee', 
      active: true 
    }
  });

  console.log(`📦 Adding ${masterProducts.length} exact products...`);
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
