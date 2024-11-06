import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard analytics' })
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get analytics for specific event' })
  getEventAnalytics(@Param('id') id: string) {
    return this.analyticsService.getEventAnalytics(id);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics by period' })
  getRevenueByPeriod(
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ) {
    return this.analyticsService.getRevenueByPeriod(period);
  }
}