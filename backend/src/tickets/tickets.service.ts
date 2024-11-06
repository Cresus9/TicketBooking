import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EventsService } from '../events/events.service';
import { Ticket, TicketType, Prisma } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
    private notificationsService: NotificationsService,
  ) {}

  async createTicketType(eventId: string, data: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    maxPerOrder: number;
  }): Promise<TicketType> {
    // Verify event exists
    await this.eventsService.findOne(eventId);

    return this.prisma.ticketType.create({
      data: {
        ...data,
        eventId,
        available: data.quantity
      }
    });
  }

  async updateTicketType(id: string, data: {
    price?: number;
    quantity?: number;
    maxPerOrder?: number;
  }): Promise<TicketType> {
    const ticketType = await this.prisma.ticketType.findUnique({
      where: { id }
    });

    if (!ticketType) {
      throw new NotFoundException('Ticket type not found');
    }

    // If increasing quantity, increase available tickets too
    let availableAdjustment = 0;
    if (data.quantity && data.quantity > ticketType.quantity) {
      availableAdjustment = data.quantity - ticketType.quantity;
    }

    return this.prisma.ticketType.update({
      where: { id },
      data: {
        ...data,
        available: {
          increment: availableAdjustment
        }
      }
    });
  }

  async checkAvailability(ticketTypeId: string, quantity: number): Promise<{
    available: boolean;
    remaining: number;
  }> {
    const ticketType = await this.prisma.ticketType.findUnique({
      where: { id: ticketTypeId }
    });

    if (!ticketType) {
      throw new NotFoundException('Ticket type not found');
    }

    return {
      available: ticketType.available >= quantity,
      remaining: ticketType.available
    };
  }

  async reserveTickets(ticketTypeId: string, quantity: number): Promise<void> {
    const ticketType = await this.prisma.ticketType.findUnique({
      where: { id: ticketTypeId }
    });

    if (!ticketType) {
      throw new NotFoundException('Ticket type not found');
    }

    if (ticketType.available < quantity) {
      throw new BadRequestException('Not enough tickets available');
    }

    if (quantity > ticketType.maxPerOrder) {
      throw new BadRequestException(`Maximum ${ticketType.maxPerOrder} tickets per order`);
    }

    await this.prisma.ticketType.update({
      where: { id: ticketTypeId },
      data: {
        available: {
          decrement: quantity
        }
      }
    });
  }

  async validateTicket(ticketId: string): Promise<{
    valid: boolean;
    ticket: Ticket | null;
    message: string;
  }> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
        ticketType: true
      }
    });

    if (!ticket) {
      return {
        valid: false,
        ticket: null,
        message: 'Ticket not found'
      };
    }

    if (ticket.status === 'USED') {
      return {
        valid: false,
        ticket,
        message: 'Ticket has already been used'
      };
    }

    if (ticket.status === 'CANCELLED') {
      return {
        valid: false,
        ticket,
        message: 'Ticket has been cancelled'
      };
    }

    const now = new Date();
    if (new Date(ticket.event.date) < now) {
      return {
        valid: false,
        ticket,
        message: 'Event has already passed'
      };
    }

    return {
      valid: true,
      ticket,
      message: 'Ticket is valid'
    };
  }

  async markTicketAsUsed(ticketId: string): Promise<Ticket> {
    const validation = await this.validateTicket(ticketId);
    
    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    const ticket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'USED' }
    });

    // Send notification to ticket owner
    await this.notificationsService.create({
      userId: ticket.userId,
      type: 'TICKET_USED',
      title: 'Ticket Used',
      message: 'Your ticket has been successfully scanned and validated.',
      metadata: {
        ticketId,
        eventId: ticket.eventId
      }
    });

    return ticket;
  }

  async cancelTicket(ticketId: string): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        ticketType: true
      }
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.status === 'USED') {
      throw new BadRequestException('Cannot cancel a used ticket');
    }

    if (ticket.status === 'CANCELLED') {
      throw new BadRequestException('Ticket is already cancelled');
    }

    // Increase available tickets in ticket type
    await this.prisma.ticketType.update({
      where: { id: ticket.ticketTypeId },
      data: {
        available: {
          increment: 1
        }
      }
    });

    const cancelledTicket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'CANCELLED' }
    });

    // Send notification to ticket owner
    await this.notificationsService.create({
      userId: ticket.userId,
      type: 'TICKET_CANCELLED',
      title: 'Ticket Cancelled',
      message: 'Your ticket has been cancelled.',
      metadata: {
        ticketId,
        eventId: ticket.eventId
      }
    });

    return cancelledTicket;
  }
}