const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const catalog = {
  "Submersible Pumps": [
    { name: "BENAX 4SP 1/42 PUMP END", size: "1.1KW", brand: "BENAX", price: 96600 },
    { name: "BENAX 4SP 1/57 PUMP END", size: "1.5KW", brand: "BENAX", price: 124600 },
    { name: "EMPOWER DP4RFF 02/18", size: "0.75KW", brand: "EMPOWER", price: 44000 },
    { name: "EMPOWER DP4RFF 02/23", size: "1.1KW", brand: "EMPOWER", price: 56000 },
    { name: "EMPOWER DP4RFF 02/33", size: "1.5KW", brand: "EMPOWER", price: 72000 },
    { name: "EMPOWER DP4RFF 02/48", size: "2.2KW", brand: "EMPOWER", price: 102000 },
    { name: "EMPOWER DP4RFF 02/65", size: "3KW", brand: "EMPOWER", price: 142000 },
    { name: "EMPOWER DP6MFF 46/7", size: "11KW", brand: "EMPOWER", price: 170000 },
    { name: "EMPOWER DP6MFF 46/10", size: "15KW", brand: "EMPOWER", price: 200000 }
  ],
  "Sub-Motors": [
    { name: "EMPOWER DSMO4 1PH O/F", size: "1.1KW", brand: "EMPOWER", price: 44000 },
    { name: "EMPOWER DSMO4 1PH O/F", size: "1.5KW", brand: "EMPOWER", price: 50000 },
    { name: "EMPOWER DSMO4 1PH O/F", size: "2.2KW", brand: "EMPOWER", price: 62000 },
    { name: "EMPOWER DSMO4 3PH", size: "3KW", brand: "EMPOWER", price: 78000 },
    { name: "VINCO 1PH SUB-MOTOR", size: "1.1KW", brand: "VINCO", price: 38000 },
    { name: "VINCO 3PH SUB-MOTOR", size: "1.5KW", brand: "VINCO", price: 43500 },
    { name: "VINCO 3PH SUB-MOTOR", size: "2.2KW", brand: "VINCO", price: 48000 }
  ],
  "Submersible Cables": [
    { name: "4 CORE SUBMERSIBLE CABLE", size: "1.5MM2", brand: "Generic", price: 380 },
    { name: "4 CORE SUBMERSIBLE CABLE", size: "2.5MM2", brand: "Generic", price: 560 },
    { name: "4 CORE SUBMERSIBLE CABLE", size: "4MM2", brand: "Generic", price: 760 },
    { name: "4 CORE SUBMERSIBLE CABLE", size: "6MM2", brand: "Generic", price: 1160 },
    { name: "4 CORE SUBMERSIBLE CABLE", size: "10MM2", brand: "Generic", price: 2200 }
  ],
  "Solar Inverters": [
    { name: "VEIKONG 1PH PUMPING INVERTER", size: "2.2KW", brand: "VEIKONG", price: 68000 },
    { name: "VEIKONG 1PH PUMPING INVERTER", size: "4KW", brand: "VEIKONG", price: 84000 },
    { name: "VEIKONG 3PH LCD INVERTER", size: "5.5KW", brand: "VEIKONG", price: 90000 },
    { name: "VEIKONG 3PH LCD INVERTER", size: "7.5KW", brand: "VEIKONG", price: 100000 }
  ],
  "Solar Panels": [
    { name: "MONOCRYSTALLINE SOLAR PANEL", size: "350W", brand: "Generic", price: 13650 },
    { name: "MONOCRYSTALLINE SOLAR PANEL", size: "450W", brand: "Generic", price: 18500 },
    { name: "MONOCRYSTALLINE SOLAR PANEL", size: "550W", brand: "Generic", price: 22000 }
  ],
  "Accessories": [
    { name: "PV DISCONNECT SISO SWITCH", size: "32A", brand: "Generic", price: 12000 },
    { name: "AC SURGE PROTECTOR", size: "275V", brand: "Generic", price: 6000 },
    { name: "LIGHTNING ARRESTOR", size: "2FT", brand: "Generic", price: 4400 },
    { name: "WELL PROBE SENSORS", size: "Standard", brand: "Generic", price: 6000 }
  ]
};

async function main() {
  console.log('Wiping old products...');
  await prisma.product.deleteMany({});
  
  console.log('Seeding fresh catalog...');
  for (const [category, items] of Object.entries(catalog)) {
    const mainProduct = await prisma.product.create({
      data: {
        name: category, 
        description: `Explore our complete range of ${category.toLowerCase()}.`,
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
          description: `Genuine ${item.brand} ${category}.`,
          price: item.price, 
          brand: item.brand,
          size: item.size,
          category: "Equipment", 
          status: 'APPROVED', 
          createdBy: 'system', 
          parentId: mainProduct.id,
        },
      });
    }
  }
  console.log('✅ Database seeded perfectly!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
