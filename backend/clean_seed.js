const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const catalog = {
  "Solar Panels": [
    { name: "MONOCRYSTALLINE SOLAR PANEL", size: "350W", brand: "JINKO", price: 13650 },
    { name: "MONOCRYSTALLINE SOLAR PANEL", size: "350W", brand: "LONGI", price: 14000 },
    { name: "MONOCRYSTALLINE SOLAR PANEL", size: "450W", brand: "JINKO", price: 18500 },
    { name: "MONOCRYSTALLINE SOLAR PANEL", size: "450W", brand: "LONGI", price: 19000 },
    { name: "MONOCRYSTALLINE SOLAR PANEL", size: "550W", brand: "JINKO", price: 22000 },
    { name: "MONOCRYSTALLINE SOLAR PANEL", size: "550W", brand: "CANADIAN SOLAR", price: 23500 }
  ],
  "Submersible Pumps": [
    { name: "4SP PUMP END", size: "1.1KW", brand: "BENAX", price: 96600 },
    { name: "DP4RFF PUMP END", size: "1.1KW", brand: "EMPOWER", price: 56000 },
    { name: "3PH SUB PUMP", size: "1.1KW", brand: "VINCO", price: 38000 },
    { name: "4SP PUMP END", size: "1.5KW", brand: "BENAX", price: 124600 },
    { name: "DP4RFF PUMP END", size: "1.5KW", brand: "EMPOWER", price: 72000 },
    { name: "3PH SUB PUMP", size: "1.5KW", brand: "VINCO", price: 43500 }
  ],
  "Submersible Cables": [
    { name: "4 CORE SUBMERSIBLE CABLE", size: "1.5MM2", brand: "GENERIC", price: 380 },
    { name: "4 CORE SUBMERSIBLE CABLE", size: "2.5MM2", brand: "GENERIC", price: 560 },
    { name: "4 CORE SUBMERSIBLE CABLE", size: "4MM2", brand: "GENERIC", price: 760 },
    { name: "4 CORE SUBMERSIBLE CABLE", size: "6MM2", brand: "GENERIC", price: 1160 },
    { name: "4 CORE SUBMERSIBLE CABLE", size: "10MM2", brand: "GENERIC", price: 2200 }
  ],
  "Solar Inverters": [
    { name: "PUMPING INVERTER", size: "2.2KW", brand: "VEIKONG", price: 68000 },
    { name: "PUMPING INVERTER", size: "4KW", brand: "VEIKONG", price: 84000 },
    { name: "LCD PUMPING INVERTER", size: "5.5KW", brand: "VEIKONG", price: 90000 },
    { name: "LCD PUMPING INVERTER", size: "7.5KW", brand: "VEIKONG", price: 100000 }
  ],
  "Electrical Accessories": [
    { name: "DC ISOLATOR", size: "32A", brand: "CHINT", price: 8500 },
    { name: "DC ISOLATOR", size: "63A", brand: "CHINT", price: 12000 },
    { name: "AC SURGE PROTECTOR", size: "1PH", brand: "SCHNEIDER", price: 6000 },
    { name: "AC SURGE PROTECTOR", size: "3PH", brand: "SCHNEIDER", price: 8000 },
    { name: "LIGHTNING ARRESTOR", size: "2FT", brand: "GENERIC", price: 4400 },
    { name: "WELL PROBE SENSOR", size: "STANDARD", brand: "GENERIC", price: 6000 }
  ]
};

async function main() {
  console.log('1. Wiping ALL old products to remove duplicates...');
  await prisma.product.deleteMany({});
  
  console.log('2. Seeding fresh catalog with perfect grouping...');
  for (const [category, items] of Object.entries(catalog)) {
    
    // Create Main Category
    const mainProduct = await prisma.product.create({
      data: {
        name: category, 
        description: `Select a specific size and brand for our ${category.toLowerCase()}.`,
        price: Math.min(...items.map(i => i.price)), 
        category: "Equipment", 
        status: 'APPROVED', 
        createdBy: 'system',
      },
    });

    // Create Children with Size and Brand
    for (const item of items) {
      await prisma.product.create({
        data: {
          name: item.name, 
          description: `Genuine ${item.brand} ${category}. Model: ${item.size}.`,
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
    console.log(`✅ Added ${category} with ${items.length} sub-products.`);
  }
  console.log('🎉 ALL products successfully added and linked!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
