import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MonitoringService } from '../monitoring/monitoring.service';
import { LoggingService } from '../logging/logging.service';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
})
@UseGuards(WsAuthGuard)
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private monitoringService: MonitoringService,
    private loggingService: LoggingService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const user = await this.validateToken(client);
      if (!user) {
        client.disconnect();
        return;
      }

      // Store socket connection
      if (!this.userSockets.has(user.id)) {
        this.userSockets.set(user.id, new Set());
      }
      this.userSockets.get(user.id)?.add(client.id);

      // Join user's room
      client.join(`user:${user.id}`);

      // Update metrics
      this.monitoringService.setActiveUsers(this.userSockets.size);
      
      // Log connection
      this.loggingService.logAudit('websocket_connect', user.id, {
        socketId: client.id,
        ip: client.handshake.address
      });
    } catch (error) {
      this.loggingService.logError(error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      // Find and remove socket from user's connections
      for (const [userId, sockets] of this.userSockets.entries()) {
        if (sockets.has(client.id)) {
          sockets.delete(client.id);
          if (sockets.size === 0) {
            this.userSockets.delete(userId);
          }
          
          // Update metrics
          this.monitoringService.setActiveUsers(this.userSockets.size);
          
          // Log disconnection
          this.loggingService.logAudit('websocket_disconnect', userId, {
            socketId: client.id
          });
          
          break;
        }
      }
    } catch (error) {
      this.loggingService.logError(error);
    }
  }

  @SubscribeMessage('joinEvent')
  handleJoinEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() eventId: string
  ) {
    client.join(`event:${eventId}`);
  }

  @SubscribeMessage('leaveEvent')
  handleLeaveEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() eventId: string
  ) {
    client.leave(`event:${eventId}`);
  }

  private async validateToken(client: Socket): Promise<any> {
    try {
      const token = client.handshake.auth.token;
      if (!token) return null;
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }

  // Helper methods for broadcasting updates
  broadcastEventUpdate(eventId: string, update: any) {
    this.server.to(`event:${eventId}`).emit('eventUpdate', update);
  }

  broadcastTicketUpdate(eventId: string, update: any) {
    this.server.to(`event:${eventId}`).emit('ticketUpdate', update);
  }

  sendNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }
}