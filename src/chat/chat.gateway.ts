import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(4000, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    this.server.emit('user-joined', {
      message: `New user joined the chat: ${client.id}`,
    });
  }

  handleDisconnect(client: Socket): any {
    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`,
    });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, message: any) {
    this.server.emit('reply', message);
  }
}
