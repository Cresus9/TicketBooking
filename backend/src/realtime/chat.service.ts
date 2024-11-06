import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessage } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: {
    userId: string;
    eventId: string;
    content: string;
  }): Promise<ChatMessage> {
    return this.prisma.chatMessage.create({
      data: {
        content: data.content,
        user: { connect: { id: data.userId } },
        event: { connect: { id: data.eventId } },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async getEventMessages(eventId: string, params: {
    skip?: number;
    take?: number;
  }): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    await this.prisma.chatMessage.deleteMany({
      where: {
        id: messageId,
        userId,
      },
    });
  }
}