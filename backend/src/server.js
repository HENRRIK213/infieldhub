require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

// ============================================================
// ROUTE IMPORTS
// ============================================================
const { setupSockets } = require('./sockets/monitor.socket');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const quotationRoutes = require('./routes/quotation.routes');
const customerRoutes = require('./routes/customer.routes');
const paymentRoutes = require('./routes/payment.routes');
const logRoutes = require('./routes/log.routes');
const userRoutes = require('./routes/user.routes');
const reportRoutes = require('./routes/report.routes');
const inviteRoutes = require('./routes/invite.routes');

// ============================================================
// ENSURE UPLOAD FOLDERS EXIST
// ============================================================
['uploads/tmp', 'uploads/products', 'uploads/quotations'].forEach((p) => {
  const full = path.join(__dirname, '..', p);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

// ============================================================
// APP + SERVER SETUP
// ============================================================
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.set('io', io);
app.set('trust proxy', 1);

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'https://infieldhub.vercel.app',
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// ============================================================
// STATIC FILE SERVING (images + PDFs)
// ============================================================
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ============================================================
// API ROUTES
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/invites', inviteRoutes);

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/', (req, res) =>
  res.json({
    service: 'InfieldHub API',
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
);

// ============================================================
// SOCKET.IO
// ============================================================
setupSockets(io);

// ============================================================
// START SERVER — Koyeb provides the port via process.env.PORT
// ============================================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ InfieldHub backend running on port ${PORT}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});