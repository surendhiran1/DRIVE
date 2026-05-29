import { io } from 'socket.io-client';

const socketUrl = (import.meta.env.VITE_SOCKET_URL as string) || 'http://localhost:5001';

export const socket = io(socketUrl, {
  autoConnect: true,
  withCredentials: true
});
