const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const catalog = {
  "DC ISOLATORS": [
    { name: "DC Isolator Switch", size: "32A", brand: "CHINT", price: 8500 },
    { name: "DC Isolator Switch", size: "63A", brand: "CHINT", price: 12000 }
  ],
  "SOLAR STREET LIGHTS": [
    { name: "All-in-One Street Light", size: "60W", brand: "SOLARMAX", price: 12000 },
    { name: "All-in-One Street Light", size: "100W", brand: "SOLARMAX", price: 18000 }
  ],
  "SOLAR MODULES": [
    { name: "Monocrystalline Panel", size: "350W", brand: "JINKO", price: 13650 },
    { name: "Monocrystalline Panel", size: "450W", brand: "LONGI", price: 18500 },
    { name: "Monocrystalline Panel", size: "550W", brand: "CANADIAN SOLAR", price: 22000 }
  ],
  "SUBMERSIBLE PUMPS": [
    { name: "4SP Pump End", size: "1.1KW", brand: "BENAX", price: 96600 },
    { name: "4SP Pump End", size: "1.5KW", brand: "BENAX", price: 124600 },
    { name: "DP4RFF Pump End", size: "1.1KW", brand: "EMPOWER", price: 56000 }
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
        description: `Select a specific size and brand for our ${category.toLowerCase()}.`,
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
  }
  console.log('✅ Database seeded perfectly!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
