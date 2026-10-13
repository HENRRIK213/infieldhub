import { io } from 'socket.io-client';
import { BACKEND_URL } from './api';

export const socket = io(BACKEND_URL, {
  autoConnect: false,
  transports: ['websocket'],
  auth: (cb) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    cb({ token });
  },
});

export function connectAdminSocket(onEvent: (event: string, data: any) => void) {
  socket.connect();
  socket.emit('joinAdmin');
  [
    'product:new',
    'product:approved',
    'quotation:new',
    'payment:approved',
    'payment:received',
  ].forEach((ev) => {
    socket.on(ev, (data) => onEvent(ev, data));
  });
}

export function disconnectSocket() {
  socket.disconnect();
}