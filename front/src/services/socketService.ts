import { io, Socket } from 'socket.io-client';
import { config } from '../config';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io(config.apiUrl, {
      path: '/socket.io',
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Conectado al WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService(); 