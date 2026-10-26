require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const masterProducts = [
  // --- WATER METERS ---
  { name: '1.25" SUPER WATER METER', price: 9000, category: 'Water Meters', type: '1.25"', brand: 'Generic', size: '1.25"' },
  { name: '1.5" SUPER WATER METER', price: 11000, category: 'Water Meters', type: '1.5"', brand: 'Generic', size: '1.5"' },
  { name: '2" SUPER WATER METER', price: 16000, category: 'Water Meters', type: '2"', brand: 'Generic', size: '2"' },
  { name: '2.5" SUPER WATER METER', price: 35000, category: 'Water Meters', type: '2.5"', brand: 'Generic', size: '2.5"' },
  { name: '3" SUPER WATER METER', price: 38000, category: 'Water Meters', type: '3"', brand: 'Generic', size: '3"' },
  // --- CABLES ---
  { name: '1.5MM2 4 CORE SUBMERSIBLE CABLE', price: 380, category: 'Submersible Cables', type: 'Submersible', brand: 'Generic', size: '1.5MM2' },
  { name: '2.5MM2 4 CORE SUBMERSIBLE CABLE', price: 560, category: 'Submersible Cables', type: 'Submersible', brand: 'Generic', size: '2.5MM2' },
  { name: '4MM2 4 CORE SUBMERSIBLE CABLE', price: 760, category: 'Submersible Cables', type: 'Submersible', brand: 'Generic', size: '4MM2' },
  { name: '6MM2 4 CORE SUBMERSIBLE CABLE', price: 1160, category: 'Submersible Cables', type: 'Submersible', brand: 'Generic', size: '6MM2' },
  { name: '10MM2 4 CORE SUBMERSIBLE CABLE', price: 2200, category: 'Submersible Cables', type: 'Submersible', brand: 'Generic', size: '10MM2' },
  { name: '1.5MM2 4 CORE U/G CABLE', price: 560, category: 'Armoured Cables', type: 'Underground', brand: 'Generic', size: '1.5MM2' },
  { name: '4.0MM2 4 CORE U/G CABLE', price: 1000, category: 'Armoured Cables', type: 'Underground', brand: 'Generic', size: '4.0MM2' },
  { name: '6.0MM2 4 CORE U/G CABLE', price: 1340, category: 'Armoured Cables', type: 'Underground', brand: 'Generic', size: '6.0MM2' },
  { name: '10.0MM2 4 CORE U/G CABLE', price: 2200, category: 'Armoured Cables', type: 'Underground', brand: 'Generic', size: '10.0MM2' },
  // --- PIPES ---
  { name: '1.25" UPVC 3M DROP PIPES - 26BAR', price: 2000, category: 'UPVC Drop Pipes', type: '26BAR', brand: 'Generic', size: '1.25"' },
  { name: '1.5" UPVC 3M DROP PIPES - 26BAR', price: 2400, category: 'UPVC Drop Pipes', type: '26BAR', brand: 'Generic', size: '1.5"' },
  { name: '2" UPVC 3M DROP PIPES - 21 BAR', price: 3600, category: 'UPVC Drop Pipes', type: '21 BAR', brand: 'Generic', size: '2"' },
  { name: '2" UPVC 3M DROP PIPES - 27 BAR', price: 4600, category: 'UPVC Drop Pipes', type: '27 BAR', brand: 'Generic', size: '2"' },
  { name: '2.5" UPVC 3M DROP PIPES - 18 BAR', price: 4600, category: 'UPVC Drop Pipes', type: '18 BAR', brand: 'Generic', size: '2.5"' },
  { name: '2.5" UPVC 3M DROP PIPES - 27 BAR', price: 5500, category: 'UPVC Drop Pipes', type: '27 BAR', brand: 'Generic', size: '2.5"' },
  { name: '3" UPVC 3M DROP PIPES - 18 BAR', price: 5800, category: 'UPVC Drop Pipes', type: '18 BAR', brand: 'Generic', size: '3"' },
  { name: '3" UPVC 3M DROP PIPES - 35 BAR', price: 7600, category: 'UPVC Drop Pipes', type: '35 BAR', brand: 'Generic', size: '3"' },
  // --- BOREHOLE COVERS ---
  { name: '1.25" BOREHOLE COVER WITH SUNDRIES', price: 14000, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '1.25"' },
  { name: '1.5" BOREHOLE COVER WITH SUNDRIES', price: 15000, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '1.5"' },
  { name: '2" BOREHOLE COVER WITH SUNDRIES', price: 17200, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '2"' },
  { name: '2.5" BOREHOLE COVER WITH SUNDRIES', price: 25600, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '2.5"' },
  { name: '3" BOREHOLE COVER WITH SUNDRIES', price: 31400, category: 'Borehole Covers', type: 'With Sundries', brand: 'Generic', size: '3"' },
  // --- NRV ---
  { name: '1.25" NRV', price: 3400, category: 'Non-Return Valves', type: 'NRV', brand: 'Generic', size: '1.25"' },
  { name: '1.5" NRV', price: 4000, category: 'Non-Return Valves', type: 'NRV', brand: 'Generic', size: '1.5"' },
  { name: '2.5" NRV', price: 5000, category: 'Non-Return Valves', type: 'NRV', brand: 'Generic', size: '2.5"' },
  { name: '3" NRV', price: 11000, category: 'Non-Return Valves', type: 'NRV', brand: 'Generic', size: '3"' },
  // --- PUMPS (EMPOWER) ---
  { name: 'EMPOWER DP4RFF 02/18 0.75KW PUMP END', price: 44000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '0.75KW' },
  { name: 'EMPOWER DP4RFF 02/23 1.1KW PUMP END', price: 56000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DP4RFF 02/33 1.5KW PUMP END', price: 72000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DP4RFF 02/48 2.2KW PUMP END', price: 102000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DP4RFF 02/65 3KW PUMP END', price: 142000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '3KW' },
  { name: 'EMPOWER DP4RFF 03/18 1.1KW PUMP END', price: 44000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DP4RFF 03/25 1.5KW PUMP END', price: 56000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DP4RFF 03/33 2.2KW PUMP END', price: 80000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DP4RFF 03/45 3KW PUMP END', price: 100000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '3KW' },
  { name: 'EMPOWER DP4RFF 03/60 4KW PUMP END', price: 126600, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DP4RFF 05/12 1.1KW PUMP END', price: 36000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DP4RFF 05/17 1.5KW PUMP END', price: 41000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DP4RFF 05/25 2.2KW PUMP END', price: 60500, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DP4RFF 05/33 3KW PUMP END', price: 80000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '3KW' },
  { name: 'EMPOWER DP4RFF 05/44 4KW PUMP END', price: 98000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DP4RFF 05/50 5.5KW PUMP END', price: 120000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DP4RFF 05/75 7.5KW PUMP END', price: 194000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP4RFF 05/85 7.5KW PUMP END', price: 208000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP4RFF 08/10 1.5KW PUMP END', price: 52000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DP4RFF 08/15 2.2KW PUMP END', price: 72000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DP4RFF 08/25 4KW PUMP END', price: 100000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DP4RFF 08/30 5.5KW PUMP END', price: 120000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DP4RFF 08/37 5.5KW PUMP END', price: 141000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DP4RFF 08/44 7.5KW PUMP END', price: 156600, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP4RFF 08/50 4" 7.5KW PUMP END', price: 208000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP4RFF 08/50 6" 7.5KW PUMP END', price: 224000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP4RFF 08/66 11KW PUMP END (4" x 6")', price: 340000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '11KW' },
  { name: 'EMPOWER DP4RFF 08/73 11KW PUMP END (4" x 6")', price: 364000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '11KW' },
  { name: 'EMPOWER DP4RFF 14/13 4KW PUMP END', price: 90000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DP4RFF 14/15 5.5KW PUMP END', price: 104000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DP4RFF 14/25 7.5KW PUMP END', price: 150000, category: 'Empower Pump Ends', type: 'DP4RFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP6MFF 17/7 4KW PUMP END (6"4)', price: 92000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DP6MFF 17/7 4KW PUMP END (6"6)', price: 92000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DP6MFF 17/10 5.5KW PUMP END (6"4)', price: 80000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DP6MFF 17/10 5.5KW PUMP END (6"6)', price: 80000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DP6MFF 17/13 7.5KW PUMP END (6"4)', price: 114600, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP6MFF 17/13 7.5KW PUMP END (6"6)', price: 114600, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP6MFF 17/19 9.2KW PUMP END', price: 154600, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '9.2KW' },
  { name: 'EMPOWER DP6MFF 17/20 6" 11KW PUMP END', price: 202000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '11KW' },
  { name: 'EMPOWER DP6MFF 17/24 6" 13KW PUMP END', price: 210000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '13KW' },
  { name: 'EMPOWER DP6MFF 17/27 6" 15KW PUMP END', price: 220000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '15KW' },
  { name: 'EMPOWER DP6MFF 17/33 18.5KW PUMP END', price: 260000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '18.5KW' },
  { name: 'EMPOWER DP6MFF 17/40 22KW PUMP END', price: 270000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '22KW' },
  { name: 'EMPOWER DP6MFF 30/8 7.5KW PUMP END (6"4)', price: 132000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP6MFF 30/8 7.5KW PUMP END (6"6)', price: 132000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP6MFF 30/13 11KW PUMP END', price: 180000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '11KW' },
  { name: 'EMPOWER DP6MFF 30/17 15KW PUMP END', price: 225000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '15KW' },
  { name: 'EMPOWER DP6MFF 30/21 18.5KW PUMP END', price: 280000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '18.5KW' },
  { name: 'EMPOWER DP6MFF 30/26 22KW PUMP END', price: 290000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '22KW' },
  { name: 'EMPOWER DP6MFF 46/5 7.5KW PUMP END (6"4)', price: 140000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DP6MFF 46/7 11KW PUMP END', price: 170000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '11KW' },
  { name: 'EMPOWER DP6MFF 46/10 15KW PUMP END', price: 200000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '15KW' },
  { name: 'EMPOWER DP6MFF 46/15 22KW PUMP END', price: 220000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '22KW' },
  { name: 'EMPOWER DP6MFF 46/19 30KW PUMP END', price: 280000, category: 'Empower Pump Ends', type: 'DP6MFF', brand: 'EMPOWER', size: '30KW' },
  // --- BENAX PUMP ENDS ---
  { name: 'BENAX 4SP 1/42 1.1KW PUMP END', price: 96600, category: 'Benax Pump Ends', type: '4SP', brand: 'BENAX', size: '1.1KW' },
  { name: 'BENAX 4SP 1/57 1.5KW PUMP END', price: 124600, category: 'Benax Pump Ends', type: '4SP', brand: 'BENAX', size: '1.5KW' },
  // --- SUB-MOTORS (EMPOWER) ---
  { name: 'EMPOWER DSMO4 0.75KW 1PH W/F SUB-MOTOR', price: 42000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '0.75KW' },
  { name: 'EMPOWER DSMO4 1.1KW 1PH W/F SUB-MOTOR', price: 48000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 1.5KW 1PH W/F SUB-MOTOR', price: 52000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DSMO4 2.2KW 1PH W/F SUB-MOTOR', price: 72000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DSMO4 1.1KW 1PH O/F SUB-MOTOR', price: 44000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 1.5KW 1PH O/F SUB-MOTOR', price: 50000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DSMO4 2.2KW 1PH O/F SUB-MOTOR', price: 62000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DSMO4 1.1KW 3PH SUB-MOTOR', price: 56000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '1.1KW' },
  { name: 'EMPOWER DSMO4 1.5KW 3PH SUB-MOTOR', price: 58000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '1.5KW' },
  { name: 'EMPOWER DSMO4 2.2KW 3PH SUB-MOTOR', price: 70000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER DSMO4 3KW 3PH SUB-MOTOR', price: 78000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '3KW' },
  { name: 'EMPOWER DSMO4 4KW 3PH SUB-MOTOR', price: 93000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '4KW' },
  { name: 'EMPOWER DSMO4 5.5KW 3PH SUB-MOTOR', price: 104000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER DSMO4 7.5KW 3PH SUB-MOTOR', price: 132000, category: 'Empower Sub-Motors', type: 'DSMO4', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DSMO5 7.5KW 3PH SUB-MOTOR (6" JOINING)', price: 154000, category: 'Empower Sub-Motors', type: 'DSMO5', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DSMO5 9.3KW 3PH SUB-MOTOR (6" JOINING)', price: 194000, category: 'Empower Sub-Motors', type: 'DSMO5', brand: 'EMPOWER', size: '9.3KW' },
  { name: 'EMPOWER DSMO5 11KW 3PH SUB-MOTOR (6" JOINING)', price: 204000, category: 'Empower Sub-Motors', type: 'DSMO5', brand: 'EMPOWER', size: '11KW' },
  { name: 'EMPOWER DSMO6 7.5KW 3PH SUB-MOTOR (6")', price: 154000, category: 'Empower Sub-Motors', type: 'DSMO6', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER DSMO6 9.3KW 3PH SUB-MOTOR', price: 194000, category: 'Empower Sub-Motors', type: 'DSMO6', brand: 'EMPOWER', size: '9.3KW' },
  { name: 'EMPOWER DSMO6 11KW 3PH SUB-MOTOR', price: 204000, category: 'Empower Sub-Motors', type: 'DSMO6', brand: 'EMPOWER', size: '11KW' },
  { name: 'EMPOWER DSMO6 13KW 3PH SUB-MOTOR', price: 220600, category: 'Empower Sub-Motors', type: 'DSMO6', brand: 'EMPOWER', size: '13KW' },
  { name: 'EMPOWER DSMO6 15KW 3PH SUB-MOTOR', price: 256800, category: 'Empower Sub-Motors', type: 'DSMO6', brand: 'EMPOWER', size: '15KW' },
  { name: 'EMPOWER DSMO6 18.5KW 3PH W/F SUB-MOTOR', price: 270000, category: 'Empower Sub-Motors', type: 'DSMO6', brand: 'EMPOWER', size: '18.5KW' },
  { name: 'EMPOWER DSMO6 22KW 3PH W/F SUB-MOTOR', price: 300000, category: 'Empower Sub-Motors', type: 'DSMO6', brand: 'EMPOWER', size: '22KW' },
  { name: 'EMPOWER DSMO6 30KW 3PH W/F SUB-MOTOR', price: 320000, category: 'Empower Sub-Motors', type: 'DSMO6', brand: 'EMPOWER', size: '30KW' },
  // --- VINCO SUB-MOTORS ---
  { name: 'VINCO 1.1KW 1PH SUB-MOTOR', price: 38000, category: 'Vinco Sub-Motors', type: '1PH', brand: 'VINCO', size: '1.1KW' },
  { name: 'VINCO 1.5KW 1PH SUB-MOTOR', price: 42000, category: 'Vinco Sub-Motors', type: '1PH', brand: 'VINCO', size: '1.5KW' },
  { name: 'VINCO 2.2KW 1PH SUB-MOTOR', price: 48000, category: 'Vinco Sub-Motors', type: '1PH', brand: 'VINCO', size: '2.2KW' },
  { name: 'VINCO 1.1KW 3PH SUB-MOTOR', price: 38000, category: 'Vinco Sub-Motors', type: '3PH', brand: 'VINCO', size: '1.1KW' },
  { name: 'VINCO 1.5KW 3PH SUB-MOTOR', price: 43500, category: 'Vinco Sub-Motors', type: '3PH', brand: 'VINCO', size: '1.5KW' },
  { name: 'VINCO 2.2KW 3PH SUB-MOTOR', price: 48000, category: 'Vinco Sub-Motors', type: '3PH', brand: 'VINCO', size: '2.2KW' },
  { name: 'VINCO 3KW 3PH SUB-MOTOR', price: 60000, category: 'Vinco Sub-Motors', type: '3PH', brand: 'VINCO', size: '3KW' },
  { name: 'VINCO 4KW 3PH SUB-MOTOR', price: 72000, category: 'Vinco Sub-Motors', type: '3PH', brand: 'VINCO', size: '4KW' },
  { name: 'VINCO 5.5KW 3PH SUB-MOTOR', price: 84000, category: 'Vinco Sub-Motors', type: '3PH', brand: 'VINCO', size: '5.5KW' },
  { name: 'VINCO 7.5KW 4" 3PH SUB-MOTOR', price: 108000, category: 'Vinco Sub-Motors', type: '3PH', brand: 'VINCO', size: '7.5KW' },
  { name: 'VINCO 7.5KW 6" 3PH SUB-MOTOR', price: 130000, category: 'Vinco Sub-Motors', type: '3PH', brand: 'VINCO', size: '7.5KW' },
  // --- INVERTERS & SOLAR ---
  { name: 'VEIKONG 2.2KW 1PH PUMPING INVERTER', price: 68000, category: 'Veikong Inverters', type: '1PH', brand: 'VEIKONG', size: '2.2KW' },
  { name: 'VEIKONG 4KW 1PH PUMPING INVERTER', price: 84000, category: 'Veikong Inverters', type: '1PH', brand: 'VEIKONG', size: '4KW' },
  { name: 'VEIKONG 2.2KW 3PH PUMPING INVERTER', price: 68000, category: 'Veikong Inverters', type: '3PH', brand: 'VEIKONG', size: '2.2KW' },
  { name: 'VEIKONG 4KW 3PH LCD PUMPING INVERTER', price: 84000, category: 'Veikong Inverters', type: '3PH LCD', brand: 'VEIKONG', size: '4KW' },
  { name: 'VEIKONG 5.5KW 3PH LCD PUMPING INVERTER', price: 90000, category: 'Veikong Inverters', type: '3PH LCD', brand: 'VEIKONG', size: '5.5KW' },
  { name: 'VEIKONG 7.5KW 3PH LCD PUMPING INVERTER', price: 100000, category: 'Veikong Inverters', type: '3PH LCD', brand: 'VEIKONG', size: '7.5KW' },
  { name: 'VEIKONG 11KW 3PH LCD PUMPING INVERTER', price: 130000, category: 'Veikong Inverters', type: '3PH LCD', brand: 'VEIKONG', size: '11KW' },
  { name: 'VEIKONG 15KW 3PH LCD PUMPING INVERTER', price: 144000, category: 'Veikong Inverters', type: '3PH LCD', brand: 'VEIKONG', size: '15KW' },
  { name: 'VEIKONG 22KW 3PH LCD PUMPING INVERTER', price: 210000, category: 'Veikong Inverters', type: '3PH LCD', brand: 'VEIKONG', size: '22KW' },
  // --- PANELS ---
  { name: 'EMPOWER EMP3SP 2.2KW DIGITAL CONTROL PANEL', price: 36000, category: 'Control Panels', type: 'EMP3SP', brand: 'EMPOWER', size: '2.2KW' },
  { name: 'EMPOWER EMP7.5DOL 5.5KW DIGITAL CONTROL PANEL', price: 44000, category: 'Control Panels', type: 'EMP7.5DOL', brand: 'EMPOWER', size: '5.5KW' },
  { name: 'EMPOWER EMP10DOL 7.5KW DIGITAL CONTROL PANEL', price: 50000, category: 'Control Panels', type: 'EMP10DOL', brand: 'EMPOWER', size: '7.5KW' },
  { name: 'EMPOWER EMP20DOL 15KW DIGITAL CONTROL PANEL', price: 64000, category: 'Control Panels', type: 'EMP20DOL', brand: 'EMPOWER', size: '15KW' },
  // --- PV & SURGE ---
  { name: 'PV DISCONNECT SISO SWITCH 32A', price: 12000, category: 'PV Disconnects', type: 'SISO Switch', brand: 'Generic', size: '32A' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 16A', price: 24000, category: 'PV Disconnects', type: 'C/W Breaker', brand: 'Generic', size: '16A' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 20A', price: 25000, category: 'PV Disconnects', type: 'C/W Breaker', brand: 'Generic', size: '20A' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 32A', price: 26000, category: 'PV Disconnects', type: 'C/W Breaker', brand: 'Generic', size: '32A' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 40A', price: 27000, category: 'PV Disconnects', type: 'C/W Breaker', brand: 'Generic', size: '40A' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 63A', price: 30000, category: 'PV Disconnects', type: 'C/W Breaker', brand: 'Generic', size: '63A' },
  { name: 'AC SURGE PROTECTOR - 1PH/275V', price: 6000, category: 'Surge Protection', type: 'AC Surge', brand: 'Generic', size: '1PH' },
  { name: 'AC SURGE PROTECTOR - 3PH/415V', price: 8000, category: 'Surge Protection', type: 'AC Surge', brand: 'Generic', size: '3PH' },
  { name: 'DC SURGE PROTECTOR - 3POLE', price: 8000, category: 'Surge Protection', type: 'DC Surge', brand: 'Generic', size: '3POLE' },
  { name: 'LIGHTNING ARRESTOR - 2FT', price: 4400, category: 'Surge Protection', type: 'Arrestor', brand: 'Generic', size: '2FT' },
  { name: 'LIGHTNING ARRESTOR - 3FT', price: 6000, category: 'Surge Protection', type: 'Arrestor', brand: 'Generic', size: '3FT' },
  // --- ACCESSORIES ---
  { name: 'SPLICING KIT - CELL PACK MM11 FAST DRY', price: 2000, category: 'Accessories', type: 'Splicing Kit', brand: 'Generic', size: 'MM11' },
  { name: 'SPLICING KIT - CELL PACK MM12 FAST DRY', price: 4000, category: 'Accessories', type: 'Splicing Kit', brand: 'Generic', size: 'MM12' },
  { name: 'FLOAT SWITCH', price: 3000, category: 'Accessories', type: 'Switch', brand: 'Generic', size: 'Standard' },
  { name: 'GPRS DONGLE', price: 32000, category: 'Accessories', type: 'Dongle', brand: 'Generic', size: 'Standard' }
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
        longDescription: `This ${item.name} is a top-tier solution for your needs. Built for durability and high performance.`,
        stock: 10,
        status: 'APPROVED'
      }
    });
  }
  console.log('✅ Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());