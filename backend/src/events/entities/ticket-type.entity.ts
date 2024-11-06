import { Prisma } from '@prisma/client';

export class TicketType implements Prisma.TicketTypeCreateInput {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  maxPerOrder: number;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}