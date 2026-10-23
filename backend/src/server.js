require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.set('io', io);

app.use(cors({
  origin: ['https://infieldhub.vercel.app', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MOUNT ROUTES
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes')); // <--- THIS IS CRITICAL
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/documents', require('./routes/document.routes'));

app.get('/', (req, res) => res.json({ status: 'ok', message: 'InfieldHub Backend' }));

io.on('connection', (socket) => {
  socket.on('join', (room) => socket.join(room));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
