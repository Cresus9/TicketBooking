import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchFiltersDto } from './dto/search-filters.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchEvents(filters: SearchFiltersDto) {
    const where: Prisma.EventWhereInput = {};
    const orderBy: Prisma.EventOrderByWithRelationInput = {};

    // Apply filters
    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    if (filters.date) {
      where.date = {
        gte: new Date(filters.date),
        lt: new Date(new Date(filters.date).setDate(new Date(filters.date).getDate() + 1)),
      };
    }

    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    if (filters.category) {
      where.categories = { has: filters.category };
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      where.price = {
        gte: min,
        ...(max && { lte: max }),
      };
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'popularity':
        orderBy.ticketsSold = 'desc';
        break;
      default:
        orderBy.date = 'asc';
    }

    // Calculate pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    // Execute queries
    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: { tickets: true },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      events,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPopularSearches(): Promise<string[]> {
    const searches = await this.prisma.searchLog.groupBy({
      by: ['query'],
      _count: {
        query: true,
      },
      orderBy: {
        _count: {
          query: 'desc',
        },
      },
      take: 10,
    });

    return searches.map((s) => s.query);
  }

  async getSuggestions(query: string): Promise<string[]> {
    const events = await this.prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { title: true },
      take: 5,
    });

    return events.map((e) => e.title);
  }

  async getFilterOptions() {
    const [categories, locations, events] = await Promise.all([
      this.prisma.event.groupBy({
        by: ['categories'],
      }),
      this.prisma.event.groupBy({
        by: ['location'],
      }),
      this.prisma.event.findMany({
        select: { price: true },
        orderBy: { price: 'asc' },
      }),
    ]);

    const prices = events.map((e) => e.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const priceRanges = [
      { min: 0, max: 50 },
      { min: 50, max: 100 },
      { min: 100, max: 200 },
      { min: 200, max: null },
    ].filter((range) => range.min <= maxPrice);

    return {
      categories: Array.from(new Set(categories.flatMap((c) => c.categories))),
      locations: locations.map((l) => l.location),
      priceRanges,
    };
  }

  async logSearch(query: string, userId?: string) {
    await this.prisma.searchLog.create({
      data: {
        query,
        userId,
      },
    });
  }
}