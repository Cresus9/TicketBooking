import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  getUserNotifications(
    @Request() req: any,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('type') type?: NotificationType,
    @Query('read') read?: boolean,
  ) {
    return this.notificationsService.getUserNotifications(req.user.id, {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      type,
      read,
    });
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  deleteNotification(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(id, req.user.id);
  }

  @Post('push-token')
  @ApiOperation({ summary: 'Save push notification token' })
  savePushToken(@Request() req: any, @Body('token') token: string) {
    return this.notificationsService.savePushToken(req.user.id, token);
  }

  @Delete('push-token')
  @ApiOperation({ summary: 'Remove push notification token' })
  removePushToken(@Body('token') token: string) {
    return this.notificationsService.removePushToken(token);
  }
}