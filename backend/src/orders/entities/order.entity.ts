import { Prisma } from '@prisma/client';

export class Order implements Prisma.OrderCreateInput {
  id: string;
  user: Prisma.UserCreateNestedOneWithoutOrdersInput;
  event: Prisma.EventCreateNestedOneWithoutOrdersInput;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  tickets: Prisma.TicketCreateNestedManyWithoutOrderInput;
}