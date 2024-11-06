import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { RealtimeService } from './realtime.service';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: '/realtime',
})
@UseGuards(WsAuthGuard)
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private realtimeService: RealtimeService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const user = await this.validateToken(client);
      if (!user) {
        client.disconnect();
        return;
      }

      client.data.user = user;
      await this.realtimeService.handleUserConnect(user.id, client.id);
      
      // Join user's personal room
      client.join(`user:${user.id}`);
      
      // Join rooms for events user is interested in
      const userEvents = await this.realtimeService.getUserEvents(user.id);
      userEvents.forEach(eventId => {
        client.join(`event:${eventId}`);
      });
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.user?.id;
    if (userId) {
      await this.realtimeService.handleUserDisconnect(userId, client.id);
    }
  }

  @SubscribeMessage('joinEventRoom')
  async handleJoinEventRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() eventId: string,
  ) {
    client.join(`event:${eventId}`);
    await this.realtimeService.addUserToEvent(client.data.user.id, eventId);
  }

  @SubscribeMessage('leaveEventRoom')
  async handleLeaveEventRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() eventId: string,
  ) {
    client.leave(`event:${eventId}`);
    await this.realtimeService.removeUserFromEvent(client.data.user.id, eventId);
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { eventId: string; message: string },
  ) {
    const message = await this.chatService.createMessage({
      userId: client.data.user.id,
      eventId: data.eventId,
      content: data.message,
    });

    this.server.to(`event:${data.eventId}`).emit('newChatMessage', message);
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { eventId: string; isTyping: boolean },
  ) {
    client.broadcast
      .to(`event:${data.eventId}`)
      .emit('userTyping', {
        userId: client.data.user.id,
        username: client.data.user.name,
        isTyping: data.isTyping,
      });
  }

  private async validateToken(client: Socket): Promise<any> {
    const token = client.handshake.auth.token;
    if (!token) return null;

    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}