const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const allProducts = [
  // --- PUMP ENDS ---
  { name: 'BENAX 4SP 1/42 1.1KW PUMP END', price: 96600, category: 'Pump Ends', type: '4SP', size: '1.1KW', brand: 'BENAX' },
  { name: 'BENAX 4SP 1/57 1.5KW PUMP END', price: 124600, category: 'Pump Ends', type: '4SP', size: '1.5KW', brand: 'BENAX' },
  { name: 'EMPOWER DP4RFF 02/18 0.75KW PUMP END', price: 44000, category: 'Pump Ends', type: 'DP4RFF', size: '0.75KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 02/23 1.1KW PUMP END', price: 56000, category: 'Pump Ends', type: 'DP4RFF', size: '1.1KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 02/33 1.5KW PUMP END', price: 72000, category: 'Pump Ends', type: 'DP4RFF', size: '1.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 02/48 2.2KW PUMP END', price: 102000, category: 'Pump Ends', type: 'DP4RFF', size: '2.2KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 02/65 3KW PUMP END', price: 142000, category: 'Pump Ends', type: 'DP4RFF', size: '3KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 03/18 1.1KW PUMP END', price: 44000, category: 'Pump Ends', type: 'DP4RFF', size: '1.1KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 03/25 1.5KW PUMP END', price: 56000, category: 'Pump Ends', type: 'DP4RFF', size: '1.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 03/33 2.2KW PUMP END', price: 80000, category: 'Pump Ends', type: 'DP4RFF', size: '2.2KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 03/45 3KW PUMP END', price: 100000, category: 'Pump Ends', type: 'DP4RFF', size: '3KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 03/60 4KW PUMP END', price: 126600, category: 'Pump Ends', type: 'DP4RFF', size: '4KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 05/12 1.1KW PUMP END', price: 36000, category: 'Pump Ends', type: 'DP4RFF', size: '1.1KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 05/17 1.5KW PUMP END', price: 41000, category: 'Pump Ends', type: 'DP4RFF', size: '1.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 05/25 2.2KW PUMP END', price: 60500, category: 'Pump Ends', type: 'DP4RFF', size: '2.2KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 05/33 3KW PUMP END', price: 80000, category: 'Pump Ends', type: 'DP4RFF', size: '3KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 05/44 4KW PUMP END', price: 98000, category: 'Pump Ends', type: 'DP4RFF', size: '4KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 05/50 5.5KW PUMP END', price: 120000, category: 'Pump Ends', type: 'DP4RFF', size: '5.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 05/75 7.5KW PUMP END', price: 194000, category: 'Pump Ends', type: 'DP4RFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 05/85 7.5KW PUMP END', price: 208000, category: 'Pump Ends', type: 'DP4RFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/10 1.5KW PUMP END', price: 52000, category: 'Pump Ends', type: 'DP4RFF', size: '1.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/15 2.2KW PUMP END', price: 72000, category: 'Pump Ends', type: 'DP4RFF', size: '2.2KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/25 4KW PUMP END', price: 100000, category: 'Pump Ends', type: 'DP4RFF', size: '4KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/30 5.5KW PUMP END', price: 120000, category: 'Pump Ends', type: 'DP4RFF', size: '5.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/37 5.5KW PUMP END', price: 141000, category: 'Pump Ends', type: 'DP4RFF', size: '5.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/44 7.5KW PUMP END', price: 156600, category: 'Pump Ends', type: 'DP4RFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/50 4" 7.5KW PUMP END', price: 208000, category: 'Pump Ends', type: 'DP4RFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/50 6" 7.5KW PUMP END', price: 224000, category: 'Pump Ends', type: 'DP4RFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/66 11KW PUMP END (4" x 6")', price: 340000, category: 'Pump Ends', type: 'DP4RFF', size: '11KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 08/73 11KW PUMP END (4" x 6")', price: 364000, category: 'Pump Ends', type: 'DP4RFF', size: '11KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 14/13 4KW PUMP END', price: 90000, category: 'Pump Ends', type: 'DP4RFF', size: '4KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 14/15 5.5KW PUMP END', price: 104000, category: 'Pump Ends', type: 'DP4RFF', size: '5.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP4RFF 14/25 7.5KW PUMP END', price: 150000, category: 'Pump Ends', type: 'DP4RFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/7 4KW PUMP END (6"4)', price: 92000, category: 'Pump Ends', type: 'DP6MFF', size: '4KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/7 4KW PUMP END (6"6)', price: 92000, category: 'Pump Ends', type: 'DP6MFF', size: '4KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/10 5.5KW PUMP END (6"4)', price: 80000, category: 'Pump Ends', type: 'DP6MFF', size: '5.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/10 5.5KW PUMP END (6"6)', price: 80000, category: 'Pump Ends', type: 'DP6MFF', size: '5.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/13 7.5KW PUMP END (6"4)', price: 114600, category: 'Pump Ends', type: 'DP6MFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/13 7.5KW PUMP END (6"6)', price: 114600, category: 'Pump Ends', type: 'DP6MFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/19 9.2KW PUMP END', price: 154600, category: 'Pump Ends', type: 'DP6MFF', size: '9.2KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/20 6" 11KW PUMP END', price: 202000, category: 'Pump Ends', type: 'DP6MFF', size: '11KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/24 6" 13KW PUMP END', price: 210000, category: 'Pump Ends', type: 'DP6MFF', size: '13KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/27 6" 15KW PUMP END', price: 220000, category: 'Pump Ends', type: 'DP6MFF', size: '15KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/33 18.5KW PUMP END', price: 260000, category: 'Pump Ends', type: 'DP6MFF', size: '18.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 17/40 22KW PUMP END', price: 270000, category: 'Pump Ends', type: 'DP6MFF', size: '22KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 30/8 7.5KW PUMP END (6"4)', price: 132000, category: 'Pump Ends', type: 'DP6MFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 30/8 7.5KW PUMP END (6"6)', price: 132000, category: 'Pump Ends', type: 'DP6MFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 30/13 11KW PUMP END', price: 180000, category: 'Pump Ends', type: 'DP6MFF', size: '11KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 30/17 15KW PUMP END', price: 225000, category: 'Pump Ends', type: 'DP6MFF', size: '15KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 30/21 18.5KW PUMP END', price: 280000, category: 'Pump Ends', type: 'DP6MFF', size: '18.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 30/26 22KW PUMP END', price: 290000, category: 'Pump Ends', type: 'DP6MFF', size: '22KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 46/5 7.5KW PUMP END (6"4)', price: 140000, category: 'Pump Ends', type: 'DP6MFF', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 46/7 11KW PUMP END', price: 170000, category: 'Pump Ends', type: 'DP6MFF', size: '11KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 46/10 15KW PUMP END', price: 200000, category: 'Pump Ends', type: 'DP6MFF', size: '15KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 46/15 22KW PUMP END', price: 220000, category: 'Pump Ends', type: 'DP6MFF', size: '22KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DP6MFF 46/19 30KW PUMP END', price: 280000, category: 'Pump Ends', type: 'DP6MFF', size: '30KW', brand: 'EMPOWER' },

  // --- SUB-MOTORS (EMPOWER & VINCO) ---
  { name: 'EMPOWER DSMO4 1.1KW 1PH O/F SUB-MOTOR', price: 44000, category: 'Sub-Motors', type: '1PH O/F', size: '1.1KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 1.5KW 1PH O/F SUB-MOTOR', price: 50000, category: 'Sub-Motors', type: '1PH O/F', size: '1.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 2.2KW 1PH O/F SUB-MOTOR', price: 62000, category: 'Sub-Motors', type: '1PH O/F', size: '2.2KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 0.75KW 1PH W/F SUB-MOTOR', price: 42000, category: 'Sub-Motors', type: '1PH W/F', size: '0.75KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 1.1KW 1PH W/F SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: '1PH W/F', size: '1.1KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 1.5KW 1PH W/F SUB-MOTOR', price: 52000, category: 'Sub-Motors', type: '1PH W/F', size: '1.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 2.2KW 1PH W/F SUB-MOTOR', price: 72000, category: 'Sub-Motors', type: '1PH W/F', size: '2.2KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 1.1KW 3PH SUB-MOTOR', price: 56000, category: 'Sub-Motors', type: '3PH', size: '1.1KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 1.5KW 3PH SUB-MOTOR', price: 58000, category: 'Sub-Motors', type: '3PH', size: '1.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 2.2KW 3PH SUB-MOTOR', price: 70000, category: 'Sub-Motors', type: '3PH', size: '2.2KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 3KW 3PH SUB-MOTOR', price: 78000, category: 'Sub-Motors', type: '3PH', size: '3KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 4KW 3PH SUB-MOTOR', price: 93000, category: 'Sub-Motors', type: '3PH', size: '4KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 5.5KW 3PH SUB-MOTOR', price: 104000, category: 'Sub-Motors', type: '3PH', size: '5.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO4 7.5KW 3PH SUB-MOTOR', price: 132000, category: 'Sub-Motors', type: '3PH', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO5 7.5KW 3PH SUB-MOTOR (6" JOINING)', price: 154000, category: 'Sub-Motors', type: '3PH (6" Joining)', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO5 9.3KW 3PH SUB-MOTOR (6" JOINING)', price: 194000, category: 'Sub-Motors', type: '3PH (6" Joining)', size: '9.3KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO5 11KW 3PH SUB-MOTOR (6" JOINING)', price: 204000, category: 'Sub-Motors', type: '3PH (6" Joining)', size: '11KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO6 7.5KW 3PH SUB-MOTOR (6")', price: 154000, category: 'Sub-Motors', type: '3PH (6")', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO6 9.3KW 3PH SUB-MOTOR', price: 194000, category: 'Sub-Motors', type: '3PH', size: '9.3KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO6 11KW 3PH SUB-MOTOR', price: 204000, category: 'Sub-Motors', type: '3PH', size: '11KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO6 13KW 3PH SUB-MOTOR', price: 220600, category: 'Sub-Motors', type: '3PH', size: '13KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO6 15KW 3PH SUB-MOTOR', price: 256800, category: 'Sub-Motors', type: '3PH', size: '15KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO6 18.5KW 3PH W/F SUB-MOTOR', price: 270000, category: 'Sub-Motors', type: '3PH W/F', size: '18.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO6 22KW 3PH W/F SUB-MOTOR', price: 300000, category: 'Sub-Motors', type: '3PH W/F', size: '22KW', brand: 'EMPOWER' },
  { name: 'EMPOWER DSMO6 30KW 3PH W/F SUB-MOTOR', price: 320000, category: 'Sub-Motors', type: '3PH W/F', size: '30KW', brand: 'EMPOWER' },
  { name: 'VINCO 1.1KW 1PH SUB-MOTOR', price: 38000, category: 'Sub-Motors', type: '1PH', size: '1.1KW', brand: 'VINCO' },
  { name: 'VINCO 1.5KW 1PH SUB-MOTOR', price: 42000, category: 'Sub-Motors', type: '1PH', size: '1.5KW', brand: 'VINCO' },
  { name: 'VINCO 2.2KW 1PH SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: '1PH', size: '2.2KW', brand: 'VINCO' },
  { name: 'VINCO 1.1KW 3PH SUB-MOTOR', price: 38000, category: 'Sub-Motors', type: '3PH', size: '1.1KW', brand: 'VINCO' },
  { name: 'VINCO 1.5KW 3PH SUB-MOTOR', price: 43500, category: 'Sub-Motors', type: '3PH', size: '1.5KW', brand: 'VINCO' },
  { name: 'VINCO 2.2KW 3PH SUB-MOTOR', price: 48000, category: 'Sub-Motors', type: '3PH', size: '2.2KW', brand: 'VINCO' },
  { name: 'VINCO 3KW 3PH SUB-MOTOR', price: 60000, category: 'Sub-Motors', type: '3PH', size: '3KW', brand: 'VINCO' },
  { name: 'VINCO 4KW 3PH SUB-MOTOR', price: 72000, category: 'Sub-Motors', type: '3PH', size: '4KW', brand: 'VINCO' },
  { name: 'VINCO 5.5KW 3PH SUB-MOTOR', price: 84000, category: 'Sub-Motors', type: '3PH', size: '5.5KW', brand: 'VINCO' },
  { name: 'VINCO 7.5KW 4" 3PH SUB-MOTOR', price: 108000, category: 'Sub-Motors', type: '3PH 4"', size: '7.5KW', brand: 'VINCO' },
  { name: 'VINCO 7.5KW 6" 3PH SUB-MOTOR', price: 130000, category: 'Sub-Motors', type: '3PH 6"', size: '7.5KW', brand: 'VINCO' },

  // --- CONTROL PANELS ---
  { name: 'EMPOWER EMP3SP 2.2KW DIGITAL CONTROL PANEL', price: 36000, category: 'Control Panels', type: 'Digital', size: '2.2KW', brand: 'EMPOWER' },
  { name: 'EMPOWER EMP7.5DOL 5.5KW DIGITAL CONTROL PANEL', price: 44000, category: 'Control Panels', type: 'Digital', size: '5.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER EMP10DOL 7.5KW DIGITAL CONTROL PANEL', price: 50000, category: 'Control Panels', type: 'Digital', size: '7.5KW', brand: 'EMPOWER' },
  { name: 'EMPOWER EMP20DOL 15KW DIGITAL CONTROL PANEL', price: 64000, category: 'Control Panels', type: 'Digital', size: '15KW', brand: 'EMPOWER' },

  // --- UPVC DROP PIPES ---
  { name: '1.25" UPVC 3M DROP PIPES - 26BAR', price: 2000, category: 'UPVC Drop Pipes', type: '26BAR', size: '1.25"', brand: 'Generic' },
  { name: '1.5" UPVC 3M DROP PIPES - 26BAR', price: 2400, category: 'UPVC Drop Pipes', type: '26BAR', size: '1.5"', brand: 'Generic' },
  { name: '2" UPVC 3M DROP PIPES - 21 BAR', price: 3600, category: 'UPVC Drop Pipes', type: '21 BAR', size: '2"', brand: 'Generic' },
  { name: '2" UPVC 3M DROP PIPES - 27 BAR', price: 4600, category: 'UPVC Drop Pipes', type: '27 BAR', size: '2"', brand: 'Generic' },
  { name: '2.5" UPVC 3M DROP PIPES - 18 BAR', price: 4600, category: 'UPVC Drop Pipes', type: '18 BAR', size: '2.5"', brand: 'Generic' },
  { name: '2.5" UPVC 3M DROP PIPES - 27 BAR', price: 5500, category: 'UPVC Drop Pipes', type: '27 BAR', size: '2.5"', brand: 'Generic' },
  { name: '3" UPVC 3M DROP PIPES - 18 BAR', price: 5800, category: 'UPVC Drop Pipes', type: '18 BAR', size: '3"', brand: 'Generic' },
  { name: '3" UPVC 3M DROP PIPES - 35 BAR', price: 7600, category: 'UPVC Drop Pipes', type: '35 BAR', size: '3"', brand: 'Generic' },

  // --- ADAPTER SETS ---
  { name: 'HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 1.25"', price: 3200, category: 'Adapter Sets', type: 'Heavy Duty C.I', size: '1.25"', brand: 'Generic' },
  { name: 'HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 1.5"', price: 4000, category: 'Adapter Sets', type: 'Heavy Duty C.I', size: '1.5"', brand: 'Generic' },
  { name: 'HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 2"', price: 5600, category: 'Adapter Sets', type: 'Heavy Duty C.I', size: '2"', brand: 'Generic' },
  { name: 'HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 2.5"', price: 11400, category: 'Adapter Sets', type: 'Heavy Duty C.I', size: '2.5"', brand: 'Generic' },
  { name: 'HEAVY DUTY C.I TOP AND BOTTOM ADAPTER SETS 3"', price: 17200, category: 'Adapter Sets', type: 'Heavy Duty C.I', size: '3"', brand: 'Generic' },
  { name: 'HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 1.25"', price: 7000, category: 'Adapter Sets', type: 'Heavy Duty Top C.I / SS', size: '1.25"', brand: 'Generic' },
  { name: 'HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 1.5"', price: 8000, category: 'Adapter Sets', type: 'Heavy Duty Top C.I / SS', size: '1.5"', brand: 'Generic' },
  { name: 'HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 2"', price: 9500, category: 'Adapter Sets', type: 'Heavy Duty Top C.I / SS', size: '2"', brand: 'Generic' },
  { name: 'HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 2.5"', price: 17200, category: 'Adapter Sets', type: 'Heavy Duty Top C.I / SS', size: '2.5"', brand: 'Generic' },
  { name: 'HEAVY DUTY TOP C.I / SS BOTTOM ADAPTER SETS 3"', price: 24000, category: 'Adapter Sets', type: 'Heavy Duty Top C.I / SS', size: '3"', brand: 'Generic' },
  { name: 'SUPER HEAVY DUTY TOP MS / CI BOTTOM ADAPTER SETS 3"', price: 19600, category: 'Adapter Sets', type: 'Super Heavy Duty MS/CI', size: '3"', brand: 'Generic' },
  { name: 'SUPER HEAVY DUTY TOP MS / SS BOTTOM ADAPTER SETS 3"', price: 28400, category: 'Adapter Sets', type: 'Super Heavy Duty MS/SS', size: '3"', brand: 'Generic' },

  // --- ACCESSORIES ---
  { name: 'SPLICING KIT - CELL PACK MM11 FAST DRY', price: 2000, category: 'Accessories', type: 'Splicing Kit', size: 'MM11', brand: 'Generic' },
  { name: 'SPLICING KIT - CELL PACK MM12 FAST DRY', price: 4000, category: 'Accessories', type: 'Splicing Kit', size: 'MM12', brand: 'Generic' },
  { name: 'GPRS DONGLE', price: 32000, category: 'Accessories', type: 'Smart', size: 'Standard', brand: 'Generic' },
  { name: 'EARTH ROD 1M C/W CLAMP', price: 1600, category: 'Accessories', type: 'Earthing', size: '1M', brand: 'Generic' },
  { name: 'LIGHTNING ARRESTOR - 2FT', price: 4400, category: 'Accessories', type: 'Lightning Arrestor', size: '2FT', brand: 'Generic' },
  { name: 'LIGHTNING ARRESTOR - 3FT', price: 6000, category: 'Accessories', type: 'Lightning Arrestor', size: '3FT', brand: 'Generic' },
  { name: 'ELECTRODE PENCIL', price: 1200, category: 'Accessories', type: 'Earthing', size: 'Standard', brand: 'Generic' },
  { name: 'WELL PROBE SENSORS (SWITCH-TYPE)', price: 6000, category: 'Accessories', type: 'Sensor', size: 'Switch-Type', brand: 'Generic' },
  { name: 'FLOAT SWITCH', price: 3000, category: 'Accessories', type: 'Switch', size: 'Standard', brand: 'Generic' },

  // --- PV DISCONNECTS ---
  { name: 'PV DISCONNECT SISO SWITCH 32A', price: 12000, category: 'PV Disconnects', type: 'SISO Switch', size: '32A', brand: 'Generic' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 16A/1000VDC', price: 24000, category: 'PV Disconnects', type: 'C/W Breaker & SPD', size: '16A', brand: 'Generic' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 20A/1000VDC', price: 25000, category: 'PV Disconnects', type: 'C/W Breaker & SPD', size: '20A', brand: 'Generic' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 32A/1000VDC', price: 26000, category: 'PV Disconnects', type: 'C/W Breaker & SPD', size: '32A', brand: 'Generic' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 40A/1000VDC', price: 27000, category: 'PV Disconnects', type: 'C/W Breaker & SPD', size: '40A', brand: 'Generic' },
  { name: 'PV DISCONNECT C/W BREAKER & SURGE PROTECTOR 63A/1000VDC', price: 30000, category: 'PV Disconnects', type: 'C/W Breaker & SPD', size: '63A', brand: 'Generic' },

  // --- SURGE PROTECTORS & BREAKERS ---
  { name: 'AC SURGE PROTECTOR - 1PH/275V 20-40KA 2P', price: 6000, category: 'Surge Protectors', type: 'AC', size: '1PH/275V', brand: 'Generic' },
  { name: 'AC SURGE PROTECTOR - 3PH/415V 20-40KA 3P', price: 8000, category: 'Surge Protectors', type: 'AC', size: '3PH/415V', brand: 'Generic' },
  { name: 'DC SURGE PROTECTOR - 3POLE 20-40KA', price: 8000, category: 'Surge Protectors', type: 'DC', size: '3POLE', brand: 'Generic' },
  { name: 'DC ISOLATOR FOR DIN RAIL - 32A', price: 8000, category: 'DC Breakers', type: 'DC Isolator', size: '32A', brand: 'Generic' },
  { name: 'DC BREAKER 40A/1000VDC - 4P', price: 8000, category: 'DC Breakers', type: 'DC Breaker', size: '40A', brand: 'Generic' },
  { name: 'DC BREAKER 63A/1000VDC - 4P', price: 8000, category: 'DC Breakers', type: 'DC Breaker', size: '63A', brand: 'Generic' },
  { name: 'DC BREAKER 100A/1000VDC - 2POLE', price: 19000, category: 'DC Breakers', type: 'DC Breaker', size: '100A', brand: 'Generic' },

  // --- INVERTER ENCLOSURES ---
  { name: 'INVERTER ENCLOSURE BOX C/W DC SPD & 16A/20A DC BREAKER', price: 44000, category: 'Inverter Enclosures', type: 'C/W DC SPD', size: '16A/20A', brand: 'Generic' },
  { name: 'INVERTER ENCLOSURE BOX C/W DC SPD & 32A DC', price: 50000, category: 'Inverter Enclosures', type: 'C/W DC SPD', size: '32A', brand: 'Generic' },
  { name: 'INVERTER ENCLOSURE BOX C/W DC SPD & 63A DC', price: 54000, category: 'Inverter Enclosures', type: 'C/W DC SPD', size: '63A', brand: 'Generic' },

  // --- SOLAR INVERTERS (VEIKONG) ---
  { name: 'VEIKONG 2.2KW 1PH PUMPING INVERTER', price: 68000, category: 'Solar Inverters', type: '1PH', size: '2.2KW', brand: 'VEIKONG' },
  { name: 'VEIKONG 4KW 1PH PUMPING INVERTER', price: 84000, category: 'Solar Inverters', type: '1PH', size: '4KW', brand: 'VEIKONG' },
  { name: 'VEIKONG 2.2KW 3PH PUMPING INVERTER', price: 68000, category: 'Solar Inverters', type: '3PH', size: '2.2KW', brand: 'VEIKONG' },
  { name: 'VEIKONG 4KW 3PH LCD PUMPING INVERTER', price: 84000, category: 'Solar Inverters', type: '3PH LCD', size: '4KW', brand: 'VEIKONG' },
  { name: 'VEIKONG 5.5KW 3PH LCD PUMPING INVERTER', price: 90000, category: 'Solar Inverters', type: '3PH LCD', size: '5.5KW', brand: 'VEIKONG' },
  { name: 'VEIKONG 7.5KW 3PH LCD PUMPING INVERTER', price: 100000, category: 'Solar Inverters', type: '3PH LCD', size: '7.5KW', brand: 'VEIKONG' },
  { name: 'VEIKONG 11KW 3PH LCD PUMPING INVERTER', price: 130000, category: 'Solar Inverters', type: '3PH LCD', size: '11KW', brand: 'VEIKONG' },
  { name: 'VEIKONG 15KW 3PH LCD PUMPING INVERTER', price: 144000, category: 'Solar Inverters', type: '3PH LCD', size: '15KW', brand: 'VEIKONG' },
  { name: 'VEIKONG 22KW 3PH LCD PUMPING INVERTER', price: 210000, category: 'Solar Inverters', type: '3PH LCD', size: '22KW', brand: 'VEIKONG' },

  // --- AC OUTPUT REACTORS ---
  { name: 'AC OUTPUT REACTOR 4KW 1PH', price: 20000, category: 'AC Output Reactors', type: '1PH', size: '4KW', brand: 'Generic' },
  { name: 'AC OUTPUT REACTOR 4KW 3PH', price: 20000, category: 'AC Output Reactors', type: '3PH', size: '4KW', brand: 'Generic' },
  { name: 'AC OUTPUT REACTOR 5.5KW 3PH', price: 22000, category: 'AC Output Reactors', type: '3PH', size: '5.5KW', brand: 'Generic' },
  { name: 'AC OUTPUT REACTOR 7.5KW 3PH', price: 24000, category: 'AC Output Reactors', type: '3PH', size: '7.5KW', brand: 'Generic' },
  { name: 'AC OUTPUT REACTOR 11KW 3PH', price: 27000, category: 'AC Output Reactors', type: '3PH', size: '11KW', brand: 'Generic' },
  { name: 'AC OUTPUT REACTOR 15KW 3PH', price: 32000, category: 'AC Output Reactors', type: '3PH', size: '15KW', brand: 'Generic' },
  { name: 'AC OUTPUT REACTOR 22KW 3PH', price: 36000, category: 'AC Output Reactors', type: '3PH', size: '22KW', brand: 'Generic' },

  // --- CABLES ---
  { name: '1.5MM2 4 CORE SUBMERSIBLE CABLE', price: 380, category: 'Cables', type: 'Submersible', size: '1.5MM2', brand: 'Generic' },
  { name: '2.5MM2 4 CORE SUBMERSIBLE CABLE', price: 560, category: 'Cables', type: 'Submersible', size: '2.5MM2', brand: 'Generic' },
  { name: '4MM2 4 CORE SUBMERSIBLE CABLE', price: 760, category: 'Cables', type: 'Submersible', size: '4MM2', brand: 'Generic' },
  { name: '6MM2 4 CORE SUBMERSIBLE CABLE', price: 1160, category: 'Cables', type: 'Submersible', size: '6MM2', brand: 'Generic' },
  { name: '10MM2 4 CORE SUBMERSIBLE CABLE', price: 2200, category: 'Cables', type: 'Submersible', size: '10MM2', brand: 'Generic' },
  { name: 'DUAL LONDEX CABLE', price: 130, category: 'Cables', type: 'Londex', size: 'Standard', brand: 'Generic' },
  { name: '1.5MM2 4 CORE U/G CABLE', price: 560, category: 'Cables', type: 'Armoured U/G', size: '1.5MM2', brand: 'Generic' },
  { name: '4.0MM2 4 CORE U/G CABLE', price: 1000, category: 'Cables', type: 'Armoured U/G', size: '4.0MM2', brand: 'Generic' },
  { name: '6.0MM2 4 CORE U/G CABLE', price: 1340, category: 'Cables', type: 'Armoured U/G', size: '6.0MM2', brand: 'Generic' },
  { name: '10.0MM2 4 CORE U/G CABLE', price: 2200, category: 'Cables', type: 'Armoured U/G', size: '10.0MM2', brand: 'Generic' },

  // --- WATER METERS ---
  { name: '1.25" SUPER WATER METER', price: 9000, category: 'Water Meters', type: 'Super Water Meter', size: '1.25"', brand: 'Generic' },
  { name: '1.5" SUPER WATER METER', price: 11000, category: 'Water Meters', type: 'Super Water Meter', size: '1.5"', brand: 'Generic' },
  { name: '2" SUPER WATER METER', price: 16000, category: 'Water Meters', type: 'Super Water Meter', size: '2"', brand: 'Generic' },
  { name: '2.5" SUPER WATER METER', price: 35000, category: 'Water Meters', type: 'Super Water Meter', size: '2.5"', brand: 'Generic' },
  { name: '3" SUPER WATER METER', price: 38000, category: 'Water Meters', type: 'Super Water Meter', size: '3"', brand: 'Generic' },

  // --- BOREHOLE COVERS ---
  { name: '1.25" BOREHOLE COVER WITH SUNDRIES', price: 14000, category: 'Borehole Covers', type: 'With Sundries', size: '1.25"', brand: 'Generic' },
  { name: '1.5" BOREHOLE COVER WITH SUNDRIES', price: 15000, category: 'Borehole Covers', type: 'With Sundries', size: '1.5"', brand: 'Generic' },
  { name: '2" BOREHOLE COVER WITH SUNDRIES', price: 17200, category: 'Borehole Covers', type: 'With Sundries', size: '2"', brand: 'Generic' },
  { name: '2.5" BOREHOLE COVER WITH SUNDRIES', price: 25600, category: 'Borehole Covers', type: 'With Sundries', size: '2.5"', brand: 'Generic' },
  { name: '3" BOREHOLE COVER WITH SUNDRIES', price: 31400, category: 'Borehole Covers', type: 'With Sundries', size: '3"', brand: 'Generic' },

  // --- NON-RETURN VALVES ---
  { name: '1.25" NRV', price: 3400, category: 'Non-Return Valves', type: 'Standard', size: '1.25"', brand: 'Generic' },
  { name: '1.5" NRV', price: 4000, category: 'Non-Return Valves', type: 'Standard', size: '1.5"', brand: 'Generic' },
  { name: '2.5" NRV', price: 5000, category: 'Non-Return Valves', type: 'Standard', size: '2.5"', brand: 'Generic' },
  { name: '3" NRV', price: 11000, category: 'Non-Return Valves', type: 'Standard', size: '3"', brand: 'Generic' }
];

async function main() {
  console.log('🧹 Wiping old dummy products...');
  await prisma.product.deleteMany({});
  
  console.log(`📦 Adding ${allProducts.length} real products from the PDF...`);
  for (const item of allProducts) {
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
  console.log('✅ Database seeded perfectly with all PDF products!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
