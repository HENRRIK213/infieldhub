const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const catalog = {
  "Submersible Pumps": [
    { name: "BENAX 4SP 1/42 1.1KW PUMP END", price: 96600 },
    { name: "BENAX 4SP 1/57 1.5KW PUMP END", price: 124600 },
    { name: "EMPOWER DP4RFF 02/18 0.75KW PUMP END", price: 44000 },
    { name: "EMPOWER DP4RFF 02/23 1.1KW PUMP END", price: 56000 },
    { name: "EMPOWER DP4RFF 02/33 1.5KW PUMP END", price: 72000 },
    { name: "EMPOWER DP4RFF 02/48 2.2KW PUMP END", price: 102000 },
    { name: "EMPOWER DP4RFF 02/65 3KW PUMP END", price: 142000 },
    { name: "EMPOWER DP4RFF 03/18 1.1KW PUMP END", price: 44000 },
    { name: "EMPOWER DP4RFF 03/25 1.5KW PUMP END", price: 56000 },
    { name: "EMPOWER DP4RFF 03/33 2.2KW PUMP END", price: 80000 },
    { name: "EMPOWER DP4RFF 03/45 3KW PUMP END", price: 100000 },
    { name: "EMPOWER DP4RFF 03/60 4KW PUMP END", price: 126600 },
    { name: "EMPOWER DP4RFF 05/12 1.1KW PUMP END", price: 36000 },
    { name: "EMPOWER DP4RFF 05/17 1.5KW PUMP END", price: 41000 },
    { name: "EMPOWER DP4RFF 05/25 2.2KW PUMP END", price: 60500 },
    { name: "EMPOWER DP4RFF 05/33 3KW PUMP END", price: 80000 },
    { name: "EMPOWER DP4RFF 05/44 4KW PUMP END", price: 98000 },
    { name: "EMPOWER DP4RFF 05/50 5.5KW PUMP END", price: 120000 },
    { name: "EMPOWER DP4RFF 05/75 7.5KW PUMP END", price: 194000 },
    { name: "EMPOWER DP4RFF 05/85 7.5KW PUMP END", price: 208000 },
    { name: "EMPOWER DP4RFF 08/10 1.5KW PUMP END", price: 52000 },
    { name: "EMPOWER DP4RFF 08/15 2.2KW PUMP END", price: 72000 },
    { name: "EMPOWER DP4RFF 08/25 4KW PUMP END", price: 100000 },
    { name: "EMPOWER DP4RFF 08/30 5.5KW PUMP END", price: 120000 },
    { name: "EMPOWER DP4RFF 08/37 5.5KW PUMP END", price: 141000 },
    { name: "EMPOWER DP4RFF 08/44 7.5KW PUMP END", price: 156600 },
    { name: "EMPOWER DP4RFF 08/50 4\" 7.5KW PUMP END", price: 208000 },
    { name: "EMPOWER DP4RFF 08/50 6\" 7.5KW PUMP END", price: 224000 },
    { name: "EMPOWER DP4RFF 08/66 11KW PUMP END (4\"x6\")", price: 340000 },
    { name: "EMPOWER DP4RFF 08/73 11KW PUMP END (4\"x6\")", price: 364000 },
    { name: "EMPOWER DP4RFF 14/13 4KW PUMP END", price: 90000 },
    { name: "EMPOWER DP4RFF 14/15 5.5KW PUMP END", price: 104000 },
    { name: "EMPOWER DP4RFF 14/25 7.5KW PUMP END", price: 150000 },
    { name: "EMPOWER DP6MFF 17/7 4KW PUMP END (6\"4)", price: 92000 },
    { name: "EMPOWER DP6MFF 17/7 4KW PUMP END (6\"6)", price: 92000 },
    { name: "EMPOWER DP6MFF 17/10 5.5KW PUMP END (6\"4)", price: 80000 },
    { name: "EMPOWER DP6MFF 17/10 5.5KW PUMP END (6\"6)", price: 80000 },
    { name: "EMPOWER DP6MFF 17/13 7.5KW PUMP END (6\"4)", price: 114600 },
    { name: "EMPOWER DP6MFF 17/13 7.5KW PUMP END (6\"6)", price: 114600 },
    { name: "EMPOWER DP6MFF 17/19 9.2KW PUMP END", price: 154600 },
    { name: "EMPOWER DP6MFF 17/20 6\" 11KW PUMP END", price: 202000 },
    { name: "EMPOWER DP6MFF 17/24 6\" 13KW PUMP END", price: 210000 },
    { name: "EMPOWER DP6MFF 17/27 6\" 15KW PUMP END", price: 220000 },
    { name: "EMPOWER DP6MFF 17/33 18.5KW PUMP END", price: 260000 },
    { name: "EMPOWER DP6MFF 17/40 22KW PUMP END", price: 270000 },
    { name: "EMPOWER DP6MFF 30/8 7.5KW PUMP END (6\"4)", price: 132000 },
    { name: "EMPOWER DP6MFF 30/8 7.5KW PUMP END (6\"6)", price: 132000 },
    { name: "EMPOWER DP6MFF 30/13 11KW PUMP END", price: 180000 },
    { name: "EMPOWER DP6MFF 30/17 15KW PUMP END", price: 225000 },
    { name: "EMPOWER DP6MFF 30/21 18.5KW PUMP END", price: 280000 },
    { name: "EMPOWER DP6MFF 30/26 22KW PUMP END", price: 290000 },
    { name: "EMPOWER DP6MFF 46/5 7.5KW PUMP END (6\"4)", price: 140000 },
    { name: "EMPOWER DP6MFF 46/7 11KW PUMP END", price: 170000 },
    { name: "EMPOWER DP6MFF 46/10 15KW PUMP END", price: 200000 },
    { name: "EMPOWER DP6MFF 46/15 22KW PUMP END", price: 220000 },
    { name: "EMPOWER DP6MFF 46/19 30KW PUMP END", price: 280000 }
  ],
  "Sub-Motors": [
    { name: "EMPOWER DSMO4 1.1KW 1PH O/F SUB-MOTOR", price: 44000 },
    { name: "EMPOWER DSMO4 1.5KW 1PH O/F SUB-MOTOR", price: 50000 },
    { name: "EMPOWER DSMO4 2.2KW 1PH O/F SUB-MOTOR", price: 62000 },
    { name: "EMPOWER DSMO4 0.75KW 1PH W/F SUB-MOTOR", price: 42000 },
    { name: "EMPOWER DSMO4 1.1KW 1PH W/F SUB-MOTOR", price: 48000 },
    { name: "EMPOWER DSMO4 1.5KW 1PH W/F SUB-MOTOR", price: 52000 },
    { name: "EMPOWER DSMO4 2.2KW 1PH W/F SUB-MOTOR", price: 72000 },
    { name: "EMPOWER DSMO4 1.1KW 3PH SUB-MOTOR", price: 56000 },
    { name: "EMPOWER DSMO4 1.5KW 3PH SUB-MOTOR", price: 58000 },
    { name: "EMPOWER DSMO4 2.2KW 3PH SUB-MOTOR", price: 70000 },
    { name: "EMPOWER DSMO4 3KW 3PH SUB-MOTOR", price: 78000 },
    { name: "EMPOWER DSMO4 4KW 3PH SUB-MOTOR", price: 93000 },
    { name: "EMPOWER DSMO4 5.5KW 3PH SUB-MOTOR", price: 104000 },
    { name: "EMPOWER DSMO4 7.5KW 3PH SUB-MOTOR", price: 132000 },
    { name: "EMPOWER DSMO5 7.5KW 3PH SUB-MOTOR (6\" JOINING)", price: 154000 },
    { name: "EMPOWER DSMO5 9.3KW 3PH SUB-MOTOR (6\" JOINING)", price: 194000 },
    { name: "EMPOWER DSMO5 11KW 3PH SUB-MOTOR (6\" JOINING)", price: 204000 },
    { name: "EMPOWER DSMO6 7.5KW 3PH SUB-MOTOR", price: 154000 },
    { name: "EMPOWER DSMO6 9.3KW 3PH SUB-MOTOR", price: 194000 },
    { name: "EMPOWER DSMO6 11KW 3PH SUB-MOTOR", price: 204000 },
    { name: "EMPOWER DSMO6 13KW 3PH SUB-MOTOR", price: 220600 },
    { name: "EMPOWER DSMO6 15KW 3PH SUB-MOTOR", price: 256800 },
    { name: "EMPOWER DSMO6 18.5KW 3PH W/F SUB-MOTOR", price: 270000 },
    { name: "EMPOWER DSMO6 22KW 3PH W/F SUB-MOTOR", price: 300000 },
    { name: "EMPOWER DSMO6 30KW 3PH W/F SUB-MOTOR", price: 320000 },
    { name: "VINCO 1.1KW 1PH SUB-MOTOR", price: 38000 },
    { name: "VINCO 1.5KW 1PH SUB-MOTOR", price: 42000 },
    { name: "VINCO 2.2KW 1PH SUB-MOTOR", price: 48000 },
    { name: "VINCO 1.1KW 3PH SUB-MOTOR", price: 38000 },
    { name: "VINCO 1.5KW 3PH SUB-MOTOR", price: 43500 },
    { name: "VINCO 2.2KW 3PH SUB-MOTOR", price: 48000 },
    { name: "VINCO 3KW 3PH SUB-MOTOR", price: 60000 },
    { name: "VINCO 4KW 3PH SUB-MOTOR", price: 72000 },
    { name: "VINCO 5.5KW 3PH SUB-MOTOR", price: 84000 },
    { name: "VINCO 7.5KW 4\" 3PH SUB-MOTOR", price: 108000 },
    { name: "VINCO 7.5KW 6\" 3PH SUB-MOTOR", price: 130000 }
  ],
  "Digital Control Panels": [
    { name: "EMPOWER EMP3SP 2.2KW DIGITAL CONTROL PANEL", price: 36000 },
    { name: "EMPOWER EMP7.5DOL 5.5KW DIGITAL CONTROL PANEL", price: 44000 },
    { name: "EMPOWER EMP10DOL 7.5KW DIGITAL CONTROL PANEL", price: 50000 },
    { name: "EMPOWER EMP20DOL 15KW DIGITAL CONTROL PANEL", price: 64000 }
  ],
  "UPVC Submersible Borehole Pipes": [
    { name: "1.25\" UPVC 3M DROP PIPES - 26BAR", price: 2000 },
    { name: "1.5\" UPVC 3M DROP PIPES - 26BAR", price: 2400 },
    { name: "2\" UPVC 3M DROP PIPES - 21 BAR", price: 3600 },
    { name: "2\" UPVC 3M DROP PIPES - 27 BAR", price: 4600 },
    { name: "2.5\" UPVC 3M DROP PIPES - 18 BAR", price: 4600 },
    { name: "2.5\" UPVC 3M DROP PIPES - 27 BAR", price: 5500 },
    { name: "3\" UPVC 3M DROP PIPES - 18 BAR", price: 5800 },
    { name: "3\" UPVC 3M DROP PIPES - 35 BAR", price: 7600 }
  ],
  "Adapter Sets": [
    { name: "HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 1.25\"", price: 3200 },
    { name: "HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 1.5\"", price: 4000 },
    { name: "HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 2\"", price: 5600 },
    { name: "HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 2.5\"", price: 11400 },
    { name: "HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 3\"", price: 17200 },
    { name: "HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 1.25\"", price: 7000 },
    { name: "HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 1.5\"", price: 8000 },
    { name: "HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 2\"", price: 9500 },
    { name: "HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 2.5\"", price: 17200 },
    { name: "HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 3\"", price: 24000 },
    { name: "SUPER HEAVY DUTY TOP MS / CI BOTTOM ADAPTER SETS 3\"", price: 19600 },
    { name: "SUPER HEAVY DUTY TOP MS / SS BOTTOM ADAPTER SETS 3\"", price: 28400 }
  ],
  "Accessories": [
    { name: "SPLICING KIT - CELL PACK MM11 FAST DRY", price: 2000 },
    { name: "SPLICING KIT - CELL PACK MM12 FAST DRY", price: 4000 },
    { name: "PV DISCONNECT SISO SWITCH 32A", price: 12000 },
    { name: "PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 16A/1000VDC", price: 24000 },
    { name: "PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 20A/1000VDC", price: 25000 },
    { name: "PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 32A/1000VDC", price: 26000 },
    { name: "PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 40A/1000VDC", price: 27000 },
    { name: "PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 63A/1000VDC", price: 30000 },
    { name: "AC SURGE PROTECTOR - 1PH/275V 20-40KA 2P", price: 6000 },
    { name: "AC SURGE PROTECTOR - 3PH/415V 20-40KA 3P", price: 8000 },
    { name: "DC SURGE PROTECTOR - 3POLE 20-40KA", price: 8000 },
    { name: "DC ISOLATOR FOR DIN RAIL - 32A", price: 8000 },
    { name: "DC BREAKER 40A/1000VDC - 4P", price: 8000 },
    { name: "DC BREAKER 63A/1000VDC - 4P", price: 8000 },
    { name: "DC BREAKER 100A/1000VDC - 2POLE", price: 19000 },
    { name: "EARTH ROD 1M C/W CLAMP", price: 1600 },
    { name: "LIGHTNING ARRESTOR - 2FT", price: 4400 },
    { name: "LIGHTNING ARRESTOR - 3FT", price: 6000 },
    { name: "ELECTRODE PENCIL", price: 1200 },
    { name: "WELL PROBE SENSORS (SWITCH-TYPE)", price: 6000 },
    { name: "FLOAT SWITCH", price: 3000 }
  ],
  "Inverter Enclosure Boxes": [
    { name: "INVERTER ENCLOSURE BOX C/W DC SPD & 16A/20A DC BREAKER", price: 44000 },
    { name: "INVERTER ENCLOSURE BOX C/W DC SPD & 32A DC", price: 50000 },
    { name: "INVERTER ENCLOSURE BOX C/W DC SPD & 63A DC", price: 54000 }
  ],
  "Solar Pumping Inverters": [
    { name: "VEIKONG 2.2KW 1PH PUMPING INVERTER", price: 68000 },
    { name: "VEIKONG 4KW 1PH PUMPING INVERTER", price: 84000 },
    { name: "VEIKONG 2.2KW 3PH PUMPING INVERTER", price: 68000 },
    { name: "VEIKONG 4KW 3PH LCD PUMPING INVERTER", price: 84000 },
    { name: "VEIKONG 5.5KW 3PH LCD PUMPING INVERTER", price: 90000 },
    { name: "VEIKONG 7.5KW 3PH LCD PUMPING INVERTER", price: 100000 },
    { name: "VEIKONG 11KW 3PH LCD PUMPING INVERTER", price: 130000 },
    { name: "VEIKONG 15KW 3PH LCD PUMPING INVERTER", price: 144000 },
    { name: "VEIKONG 22KW 3PH LCD PUMPING INVERTER", price: 210000 }
  ],
  "AC Output Reactors": [
    { name: "AC OUTPUT REACTOR 4KW 1PH", price: 20000 },
    { name: "AC OUTPUT REACTOR 4KW 3PH", price: 20000 },
    { name: "AC OUTPUT REACTOR 5.5KW 3PH", price: 22000 },
    { name: "AC OUTPUT REACTOR 7.5KW 3PH", price: 24000 },
    { name: "AC OUTPUT REACTOR 11KW 3PH", price: 27000 },
    { name: "AC OUTPUT REACTOR 15KW 3PH", price: 32000 },
    { name: "AC OUTPUT REACTOR 22KW 3PH", price: 36000 },
    { name: "GPRS DONGLE", price: 32000 }
  ],
  "Submersible Cables": [
    { name: "1.5MM2 4 CORE SUBMERSIBLE CABLE", price: 380 },
    { name: "2.5MM2 4 CORE SUBMERSIBLE CABLE", price: 560 },
    { name: "4MM2 4 CORE SUBMERSIBLE CABLE", price: 760 },
    { name: "6MM2 4 CORE SUBMERSIBLE CABLE", price: 1160 },
    { name: "10MM2 4 CORE SUBMERSIBLE CABLE", price: 2200 },
    { name: "DUAL LONDEX CABLE", price: 130 }
  ],
  "Armoured Cables": [
    { name: "1.5MM2 4 CORE U/G CABLE", price: 560 },
    { name: "4.0MM2 4 CORE U/G CABLE", price: 1000 },
    { name: "6.0MM2 4 CORE U/G CABLE", price: 1340 },
    { name: "10.0MM2 4 CORE U/G CABLE", price: 2200 }
  ],
  "Water Meters": [
    { name: "1.25\" SUPER WATER METER", price: 9000 },
    { name: "1.5\" SUPER WATER METER", price: 11000 },
    { name: "2\" SUPER WATER METER", price: 16000 },
    { name: "2.5\" SUPER WATER METER", price: 35000 },
    { name: "3\" SUPER WATER METER", price: 38000 }
  ],
  "Borehole Covers": [
    { name: "1.25\" BOREHOLE COVER WITH SUNDRIES", price: 14000 },
    { name: "1.5\" BOREHOLE COVER WITH SUNDRIES", price: 15000 },
    { name: "2\" BOREHOLE COVER WITH SUNDRIES", price: 17200 },
    { name: "2.5\" BOREHOLE COVER WITH SUNDRIES", price: 25600 },
    { name: "3\" BOREHOLE COVER WITH SUNDRIES", price: 31400 }
  ],
  "Non-Return Valves": [
    { name: "1.25\" NRV", price: 3400 },
    { name: "1.5\" NRV", price: 4000 },
    { name: "2.5\" NRV", price: 5000 },
    { name: "3\" NRV", price: 11000 }
  ]
};

async function main() {
  console.log('Wiping old products to remove duplicates...');
  await prisma.product.deleteMany({});
  
  console.log('Seeding fresh catalog with ALL 150+ products...');
  for (const [category, items] of Object.entries(catalog)) {
    const mainProduct = await prisma.product.create({
      data: {
        name: category,
        description: `Explore our complete range of high-quality ${category.toLowerCase()}.`,
        price: Math.min(...items.map(i => i.price)),
        category: "Equipment",
        status: 'APPROVED',
        createdBy: 'system',
      },
    });

    for (const item of items) {
      await prisma.product.create({
        data: {
          name: item.name,
          description: `Genuine ${item.name} from our authorized partners.`,
          price: item.price,
          category: "Equipment",
          status: 'APPROVED',
          createdBy: 'system',
          parentId: mainProduct.id,
        },
      });
    }
  }
  console.log('✅ ALL products successfully added to the database!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
