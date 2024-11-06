import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateTicketTypeDto, UpdateTicketTypeDto } from './dto/ticket.dto';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('types')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new ticket type' })
  async createTicketType(
    @Body() createTicketTypeDto: CreateTicketTypeDto
  ) {
    return this.ticketsService.createTicketType(
      createTicketTypeDto.eventId,
      createTicketTypeDto
    );
  }

  @Put('types/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a ticket type' })
  async updateTicketType(
    @Param('id') id: string,
    @Body() updateTicketTypeDto: UpdateTicketTypeDto
  ) {
    return this.ticketsService.updateTicketType(id, updateTicketTypeDto);
  }

  @Get('types/:id/availability')
  @ApiOperation({ summary: 'Check ticket availability' })
  async checkAvailability(
    @Param('id') id: string,
    @Query('quantity') quantity: number
  ) {
    return this.ticketsService.checkAvailability(id, quantity);
  }

  @Post(':id/validate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Validate a ticket' })
  async validateTicket(@Param('id') id: string) {
    return this.ticketsService.validateTicket(id);
  }

  @Post(':id/use')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mark a ticket as used' })
  async markTicketAsUsed(@Param('id') id: string) {
    return this.ticketsService.markTicketAsUsed(id);
  }

  @Post(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cancel a ticket' })
  async cancelTicket(@Param('id') id: string) {
    return this.ticketsService.cancelTicket(id);
  }
}