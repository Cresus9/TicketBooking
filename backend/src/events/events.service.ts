import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { Event, Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async create(data: Prisma.EventCreateInput): Promise<Event> {
    const event = await this.prisma.event.create({ data });
    await this.invalidateCache();
    return event;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
  }): Promise<Event[]> {
    const cacheKey = this.cacheService.generateKey('events', params);
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.prisma.event.findMany(params),
      3600 // Cache for 1 hour
    );
  }

  async findOne(id: string): Promise<Event> {
    const cacheKey = `event:${id}`;
    const event = await this.cacheService.getOrSet(
      cacheKey,
      () => this.prisma.event.findUnique({ where: { id } }),
      3600
    );

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, data: Prisma.EventUpdateInput): Promise<Event> {
    try {
      const event = await this.prisma.event.update({
        where: { id },
        data,
      });
      await this.invalidateCache(id);
      return event;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Event with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.event.delete({ where: { id } });
      await this.invalidateCache(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Event with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async updateTicketInventory(eventId: string, ticketType: string, quantity: number): Promise<void> {
    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        ticketsSold: {
          increment: quantity
        }
      }
    });
    await this.invalidateCache(eventId);
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.del(`event:${id}`);
    }
    await this.cacheService.del('events:*');
  }
}