import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001'; // URL del backend
const socket: Socket = io(SOCKET_URL);

export default socket;