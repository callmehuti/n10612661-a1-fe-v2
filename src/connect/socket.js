import { io } from 'socket.io-client';
// const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const socket = io(import.meta.env.VITE_BACKEND_SOCKET_URL);