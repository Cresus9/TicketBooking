import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  async create(userId: string, data: {
    eventId: string;
    tickets: { type: string; quantity: number }[];
    total: number;
    paymentMethod: string;
  }): Promise<Order> {
    const event = await this.eventsService.findOne(data.eventId);
    
    // Check if event exists and has available capacity
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const totalTickets = data.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    if (event.ticketsSold + totalTickets > event.capacity) {
      throw new BadRequestException('Not enough tickets available');
    }

    // Create order and tickets in a transaction
    return this.prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          userId,
          eventId: data.eventId,
          total: data.total,
          status: 'PENDING',
          paymentMethod: data.paymentMethod,
          tickets: {
            create: data.tickets.map(ticket => ({
              type: ticket.type,
              eventId: data.eventId,
              userId,
              qrCode: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              status: 'VALID'
            }))
          }
        },
        include: {
          tickets: true
        }
      });

      // Update event ticket sales
      await this.eventsService.updateTicketInventory(
        data.eventId,
        data.tickets[0].type,
        totalTickets
      );

      return order;
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }): Promise<Order[]> {
    return this.prisma.order.findMany({
      ...params,
      include: {
        tickets: true,
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        tickets: true,
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data,
        include: {
          tickets: true
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Order with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        tickets: true,
        event: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}