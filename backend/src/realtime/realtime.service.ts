import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class RealtimeService {
  @WebSocketServer()
  private server: Server;

  private userConnections = new Map<string, Set<string>>();

  constructor(private prisma: PrismaService) {}

  async handleUserConnect(userId: string, socketId: string) {
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId).add(socketId);

    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });
  }

  async handleUserDisconnect(userId: string, socketId: string) {
    const userSockets = this.userConnections.get(userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        this.userConnections.delete(userId);
        await this.prisma.user.update({
          where: { id: userId },
          data: { isOnline: false, lastSeen: new Date() },
        });
      }
    }
  }

  async getUserEvents(userId: string): Promise<string[]> {
    const userEvents = await this.prisma.eventAttendee.findMany({
      where: { userId },
      select: { eventId: true },
    });
    return userEvents.map(event => event.eventId);
  }

  async addUserToEvent(userId: string, eventId: string) {
    await this.prisma.eventAttendee.upsert({
      where: {
        userId_eventId: { userId, eventId },
      },
      update: {},
      create: { userId, eventId },
    });
  }

  async removeUserFromEvent(userId: string, eventId: string) {
    await this.prisma.eventAttendee.delete({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
  }

  async broadcastEventUpdate(eventId: string, update: any) {
    this.server.to(`event:${eventId}`).emit('eventUpdate', update);
  }

  async broadcastTicketUpdate(eventId: string, update: any) {
    this.server.to(`event:${eventId}`).emit('ticketUpdate', update);
  }

  async broadcastEventChat(eventId: string, message: any) {
    this.server.to(`event:${eventId}`).emit('chatMessage', message);
  }

  isUserOnline(userId: string): boolean {
    return this.userConnections.has(userId);
  }

  getUserSocketCount(userId: string): number {
    return this.userConnections.get(userId)?.size || 0;
  }
}