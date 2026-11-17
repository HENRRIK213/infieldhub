const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  // --- MOTORS (SINGLE PHASE) ---
  { name: '0.37kW / 0.5HP Single Phase Submersible Motor', description: 'Max Full Load Current: 3.5A. O/L Rating: 2.5-4A. C/B Rating: 6A.', price: 15000, category: 'Submersible Motors', type: 'Single Phase 240V', size: '0.37kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '0.55kW / 0.75HP Single Phase Submersible Motor', description: 'Max Full Load Current: 5.0A. O/L Rating: 5.5-8A. C/B Rating: 10A.', price: 18000, category: 'Submersible Motors', type: 'Single Phase 240V', size: '0.55kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '0.75kW / 1.0HP Single Phase Submersible Motor', description: 'Max Full Load Current: 6.0A. O/L Rating: 7-10A. C/B Rating: 15A.', price: 22000, category: 'Submersible Motors', type: 'Single Phase 240V', size: '0.75kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '1.10kW / 1.5HP Single Phase Submersible Motor', description: 'Max Full Load Current: 8.8A. O/L Rating: 9-13A. C/B Rating: 16A.', price: 28000, category: 'Submersible Motors', type: 'Single Phase 240V', size: '1.10kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '1.50kW / 2.0HP Single Phase Submersible Motor', description: 'Max Full Load Current: 11.0A. O/L Rating: 12-18A. C/B Rating: 25A.', price: 35000, category: 'Submersible Motors', type: 'Single Phase 240V', size: '1.50kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '2.25kW / 3.0HP Single Phase Submersible Motor', description: 'Max Full Load Current: 17.0A. O/L Rating: 17-25A. C/B Rating: 32A.', price: 48000, category: 'Submersible Motors', type: 'Single Phase 240V', size: '2.25kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '3.0kW / 4.0HP Single Phase Submersible Motor', description: 'Max Full Load Current: 21.0A. O/L Rating: 17-25A. C/B Rating: 32A.', price: 65000, category: 'Submersible Motors', type: 'Single Phase 240V', size: '3.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },

  // --- MOTORS (THREE PHASE) ---
  { name: '1.1kW / 1.5HP Three Phase Submersible Motor', description: 'Max Full Load Current: 2.7A. DOL O/L: 2.5-4A. C/B: 6A.', price: 25000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '1.1kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '1.5kW / 2.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 3.6A. DOL O/L: 2.5-4A. C/B: 6A.', price: 28000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '1.5kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '2.25kW / 3.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 5.3A. DOL O/L: 4-6A. C/B: 10A.', price: 35000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '2.25kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '3.0kW / 4.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 7.0A. DOL O/L: 5.5-8A. C/B: 16A.', price: 45000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '3.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '4.0kW / 5.5HP Three Phase Submersible Motor', description: 'Max Full Load Current: 9.2A. DOL O/L: 7-10A. C/B: 16A.', price: 75000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '4.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '5.5kW / 7.5HP Three Phase Submersible Motor', description: 'Max Full Load Current: 12.0A. DOL O/L: 9-13A. C/B: 16A.', price: 95000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '5.5kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '7.5kW / 10.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 16.0A. DOL O/L: 12-18A. C/B: 20A.', price: 120000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '7.5kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '9.2kW / 12.5HP Three Phase Submersible Motor', description: 'Max Full Load Current: 20.0A. DOL O/L: 17-25A. C/B: 32A. Star/Delta O/L: 9-13A.', price: 145000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '9.2kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '11.0kW / 15.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 23.0A. DOL O/L: 17-25A. C/B: 32A.', price: 165000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '11.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '15.0kW / 20.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 29.0A. DOL O/L: 23-32A. C/B: 40A.', price: 210000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '15.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '18.5kW / 25.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 36.0A. DOL O/L: 28-36A. C/B: 50A.', price: 260000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '18.5kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '22.0kW / 30.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 42.0A. DOL O/L: 37-50A. C/B: 63A.', price: 310000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '22.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '30.0kW / 40.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 56.0A. DOL O/L: 48-65A. C/B: 80A.', price: 420000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '30.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '37.0kW / 50.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 69.0A. DOL O/L: 55-70A. C/B: 100A.', price: 520000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '37.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '45.0kW / 60.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 82.0A. DOL O/L: 80-125A. C/B: 125A.', price: 650000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '45.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '55.0kW / 75.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 100.0A. DOL O/L: 80-125A. C/B: 175A.', price: 780000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '55.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },
  { name: '75.0kW / 100.0HP Three Phase Submersible Motor', description: 'Max Full Load Current: 134.0A. DOL O/L: 100-160A. C/B: 225A.', price: 950000, category: 'Submersible Motors', type: 'Three Phase 415V', size: '75.0kW', brand: 'Standard', imageUrl: '/products/motor.jpg' },

  // --- BOREHOLE DROP CABLES ---
  { name: '1.5mm² 3-Core Borehole Drop Cable', description: 'Max length at 240V: 130m. Max length at 415V: 300m.', price: 450, category: 'Borehole Drop Cables', type: 'Submersible', size: '1.5mm²', brand: 'Standard', imageUrl: '/products/drop_cable.jpg' },
  { name: '2.5mm² 3-Core Borehole Drop Cable', description: 'Max length at 240V: 220m. Max length at 415V: 510m.', price: 650, category: 'Borehole Drop Cables', type: 'Submersible', size: '2.5mm²', brand: 'Standard', imageUrl: '/products/drop_cable.jpg' },
  { name: '4.0mm² 3-Core Borehole Drop Cable', description: 'Max length at 240V: 350m. Max length at 415V: 520m.', price: 950, category: 'Borehole Drop Cables', type: 'Submersible', size: '4.0mm²', brand: 'Standard', imageUrl: '/products/drop_cable.jpg' },
  { name: '6.0mm² 3-Core Borehole Drop Cable', description: 'Max length at 240V: 360m. Max length at 415V: 520m.', price: 1400, category: 'Borehole Drop Cables', type: 'Submersible', size: '6.0mm²', brand: 'Standard', imageUrl: '/products/drop_cable.jpg' },
  { name: '10.0mm² 3-Core Borehole Drop Cable', description: 'Max length at 240V: 430m. Max length at 415V: 510m.', price: 2200, category: 'Borehole Drop Cables', type: 'Submersible', size: '10.0mm²', brand: 'Standard', imageUrl: '/products/drop_cable.jpg' },
  { name: '16.0mm² 3-Core Borehole Drop Cable', description: 'Max length at 240V: 490m. Max length at 415V: 500m.', price: 3500, category: 'Borehole Drop Cables', type: 'Submersible', size: '16.0mm²', brand: 'Standard', imageUrl: '/products/drop_cable.jpg' },
  { name: '25.0mm² 3-Core Borehole Drop Cable', description: 'Max length at 240V: 600m. Max length at 415V: 620m.', price: 5200, category: 'Borehole Drop Cables', type: 'Submersible', size: '25.0mm²', brand: 'Standard', imageUrl: '/products/drop_cable.jpg' },
  { name: '35.0mm² 3-Core Borehole Drop Cable', description: 'Max length at 415V: 500m.', price: 7500, category: 'Borehole Drop Cables', type: 'Submersible', size: '35.0mm²', brand: 'Standard', imageUrl: '/products/drop_cable.jpg' },

  // --- ARMOURED CABLES ---
  { name: '1.5mm² 4-Core Armoured Cable (600/1000V)', description: 'Stranded Copper Conductors. Overall Diameter: 13.0mm. Weight: 0.7 kg/m.', price: 850, category: 'Armoured Cables', type: '4-Core', size: '1.5mm²', brand: 'Standard', imageUrl: '/products/armoured_cable.jpg' },
  { name: '2.5mm² 4-Core Armoured Cable (600/1000V)', description: 'Stranded Copper Conductors. Overall Diameter: 14.5mm. Weight: 0.7 kg/m.', price: 1200, category: 'Armoured Cables', type: '4-Core', size: '2.5mm²', brand: 'Standard', imageUrl: '/products/armoured_cable.jpg' },
  { name: '4.0mm² 4-Core Armoured Cable (600/1000V)', description: 'Stranded Copper Conductors. Overall Diameter: 17.8mm. Weight: 0.8 kg/m.', price: 1800, category: 'Armoured Cables', type: '4-Core', size: '4.0mm²', brand: 'Standard', imageUrl: '/products/armoured_cable.jpg' },
  { name: '6.0mm² 4-Core Armoured Cable (600/1000V)', description: 'Stranded Copper Conductors. Overall Diameter: 19.2mm. Weight: 0.9 kg/m.', price: 2500, category: 'Armoured Cables', type: '4-Core', size: '6.0mm²', brand: 'Standard', imageUrl: '/products/armoured_cable.jpg' },
  { name: '10.0mm² 4-Core Armoured Cable (600/1000V)', description: 'Stranded Copper Conductors. Overall Diameter: 22.8mm. Weight: 1.3 kg/m.', price: 4200, category: 'Armoured Cables', type: '4-Core', size: '10.0mm²', brand: 'Standard', imageUrl: '/products/armoured_cable.jpg' },
  { name: '16.0mm² 4-Core Armoured Cable (600/1000V)', description: 'Stranded Copper Conductors. Overall Diameter: 23.9mm. Weight: 1.5 kg/m.', price: 6500, category: 'Armoured Cables', type: '4-Core', size: '16.0mm²', brand: 'Standard', imageUrl: '/products/armoured_cable.jpg' },
  { name: '25.0mm² 4-Core Armoured Cable (600/1000V)', description: 'Stranded Copper Conductors. Overall Diameter: 27.8mm. Weight: 2.1 kg/m.', price: 9500, category: 'Armoured Cables', type: '4-Core', size: '25.0mm²', brand: 'Standard', imageUrl: '/products/armoured_cable.jpg' },
  { name: '35.0mm² 4-Core Armoured Cable (600/1000V)', description: 'Stranded Copper Conductors. Overall Diameter: 30.5mm. Weight: 2.6 kg/m.', price: 13500, category: 'Armoured Cables', type: '4-Core', size: '35.0mm²', brand: 'Standard', imageUrl: '/products/armoured_cable.jpg' },
  { name: '50.0mm² 4-Core Armoured Cable (600/1000V)', description: 'Stranded Copper Conductors. Overall Diameter: 35.4mm. Weight: 3.4 kg/m.', price: 19500, category: 'Armoured Cables', type: '4-Core', size: '50.0mm²', brand: 'Standard', imageUrl: '/products/armoured_cable.jpg' },

  // --- GI PIPES ---
  { name: '1/2" GI Pipe (Class A)', description: 'Nominal Bore: 1/2 inch. OD: 21.4mm. Wall: 2.0mm. Max Pressure: 100m.', price: 1200, category: 'GI Pipes', type: 'Class A', size: '1/2"', brand: 'Standard', imageUrl: '/products/gi_pipe.jpg' },
  { name: '1/2" GI Pipe (Class B)', description: 'Nominal Bore: 1/2 inch. OD: 21.4mm. Wall: 2.6mm. Max Pressure: 200m.', price: 1500, category: 'GI Pipes', type: 'Class B', size: '1/2"', brand: 'Standard', imageUrl: '/products/gi_pipe.jpg' },
  { name: '3/4" GI Pipe (Class C)', description: 'Nominal Bore: 3/4 inch. OD: 27.0mm. Wall: 3.7mm. Max Pressure: 250m.', price: 2000, category: 'GI Pipes', type: 'Class C', size: '3/4"', brand: 'Standard', imageUrl: '/products/gi_pipe.jpg' },
  { name: '1" GI Pipe (Class C)', description: 'Nominal Bore: 1 inch. OD: 34.1mm. Wall: 4.1mm. Max Pressure: 250m.', price: 2800, category: 'GI Pipes', type: 'Class C', size: '1"', brand: 'Standard', imageUrl: '/products/gi_pipe.jpg' },
  { name: '1.25" GI Pipe (Class A)', description: 'Nominal Bore: 1.25 inch. OD: 42.9mm. Wall: 2.6mm. Max Pressure: 85m.', price: 3200, category: 'GI Pipes', type: 'Class A', size: '1.25"', brand: 'Standard', imageUrl: '/products/gi_pipe.jpg' },
  { name: '1.5" GI Pipe (Class B)', description: 'Nominal Bore: 1.5 inch. OD: 48.4mm. Wall: 4.1mm. Max Pressure: 175m.', price: 3800, category: 'GI Pipes', type: 'Class B', size: '1.5"', brand: 'Standard', imageUrl: '/products/gi_pipe.jpg' },
  { name: '2" GI Pipe (Class A)', description: 'Nominal Bore: 2 inch. OD: 60.3mm. Wall: 2.9mm. Max Pressure: 70m.', price: 4500, category: 'GI Pipes', type: 'Class A', size: '2"', brand: 'Standard', imageUrl: '/products/gi_pipe.jpg' },
  { name: '3" GI Pipe (Class B)', description: 'Nominal Bore: 3 inch. OD: 88.9mm. Wall: 4.5mm. Max Pressure: 140m.', price: 8500, category: 'GI Pipes', type: 'Class B', size: '3"', brand: 'Standard', imageUrl: '/products/gi_pipe.jpg' },
  { name: '6" GI Pipe (Class C)', description: 'Nominal Bore: 6 inch. OD: 165.1mm. Wall: 5.4mm. Max Pressure: 100m.', price: 18000, category: 'GI Pipes', type: 'Class C', size: '6"', brand: 'Standard', imageUrl: '/products/gi_pipe.jpg' },

  // --- PVC PIPES ---
  { name: 'D25 (3/4") PVC Pipe Class C', description: 'Nominal Diameter: 25mm. OD: 25.2mm. Wall: 1.6mm. Max Pressure: 9 Bar.', price: 800, category: 'PVC Pipes', type: 'Class C', size: 'D25', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' },
  { name: 'D32 (1") PVC Pipe Class C', description: 'Nominal Diameter: 32mm. OD: 32.0mm. Wall: 1.9mm. Max Pressure: 9 Bar.', price: 1200, category: 'PVC Pipes', type: 'Class C', size: 'D32', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' },
  { name: 'D40 (1 1/4") PVC Pipe Class D', description: 'Nominal Diameter: 40mm. OD: 40.2mm. Wall: 2.4mm. Max Pressure: 12 Bar.', price: 1800, category: 'PVC Pipes', type: 'Class D', size: 'D40', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' },
  { name: 'D50 (1 1/2") PVC Pipe Class E', description: 'Nominal Diameter: 50mm. OD: 50.2mm. Wall: 3.5mm. Max Pressure: 15 Bar.', price: 2500, category: 'PVC Pipes', type: 'Class E', size: 'D50', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' },
  { name: 'D63 (2") PVC Pipe Class C', description: 'Nominal Diameter: 63mm. OD: 63.2mm. Wall: 2.8mm. Max Pressure: 9 Bar.', price: 3200, category: 'PVC Pipes', type: 'Class C', size: 'D63', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' },
  { name: 'D75 (2 1/2") PVC Pipe Class D', description: 'Nominal Diameter: 75mm. OD: 75.2mm. Wall: 3.3mm. Max Pressure: 12 Bar.', price: 4500, category: 'PVC Pipes', type: 'Class D', size: 'D75', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' },
  { name: 'D90 (3") PVC Pipe Class D', description: 'Nominal Diameter: 90mm. OD: 90.2mm. Wall: 5.1mm. Max Pressure: 12 Bar.', price: 5500, category: 'PVC Pipes', type: 'Class D', size: 'D90', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' },
  { name: 'D110 (4") PVC Pipe Class E', description: 'Nominal Diameter: 110mm. OD: 110.2mm. Wall: 7.55mm. Max Pressure: 15 Bar.', price: 7800, category: 'PVC Pipes', type: 'Class E', size: 'D110', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' },
  { name: 'D160 (6") PVC Pipe Class C', description: 'Nominal Diameter: 160mm. OD: 160.3mm. Wall: 6.8mm. Max Pressure: 9 Bar.', price: 12000, category: 'PVC Pipes', type: 'Class C', size: 'D160', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' },
  { name: 'D200 (7") PVC Pipe Class E', description: 'Nominal Diameter: 200mm. OD: 200.3mm. Wall: 12.3mm. Max Pressure: 15 Bar.', price: 22000, category: 'PVC Pipes', type: 'Class E', size: 'D200', brand: 'Standard', imageUrl: '/products/pvc_pipe.jpg' }
];

async function main() {
  let addedCount = 0;
  
  console.log("Starting insertion of PDF products into LIVE database...");

  // First, clear out any partial/failed attempts from the previous run for these specific categories
  await prisma.product.deleteMany({
    where: { category: { in: ['Submersible Motors', 'Borehole Drop Cables', 'Armoured Cables', 'GI Pipes', 'PVC Pipes'] } }
  });

  // Insert all products fresh
  for (const item of products) {
    await prisma.product.create({
      data: {
        ...item,
        stock: 10,
        status: 'APPROVED'
      }
    });
    addedCount++;
  }

  console.log(`✅ SUCCESS: Added ${addedCount} products from PDF directly into the LIVE database.`);
}
main().finally(() => prisma.$disconnect());
