require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

const { setupSockets } = require('./sockets/monitor.socket');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const quotationRoutes = require('./routes/quotation.routes');
const customerRoutes = require('./routes/customer.routes');
const paymentRoutes = require('./routes/payment.routes');
const logRoutes = require('./routes/log.routes');
const userRoutes = require('./routes/user.routes');
const reportRoutes = require('./routes/report.routes');

['uploads/tmp', 'uploads/products', 'uploads/quotations'].forEach((p) => {
  const full = path.join(__dirname, '..', p);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

app.set('io', io);
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => res.json({ service: 'InfieldHub API', status: 'ok' }));

setupSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ InfieldHub backend running on port ${PORT}`);
});