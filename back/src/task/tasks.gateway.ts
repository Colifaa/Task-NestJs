import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // o mejor aún: ['https://tufrontend.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/',
})
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('moveTask')
  handleMoveTask(client: any, data: { taskId: string; newColumnId: string }) {
    console.log('Task moved:', data);
    this.server.emit('taskMoved', data);
  }
}