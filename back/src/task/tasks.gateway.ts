import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
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
    console.log('Received moveTask event with data:', data); // Log para depurar
    this.server.emit('taskMoved', data); // Emitir el evento a todos los clientes
  }
}