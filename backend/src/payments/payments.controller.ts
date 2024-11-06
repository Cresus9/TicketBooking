import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':orderId/process')
  @ApiOperation({ summary: 'Process payment for order' })
  async processPayment(
    @Param('orderId') orderId: string,
    @Body() paymentData: {
      method: string;
      amount: number;
      currency: string;
      details: any;
    },
  ) {
    try {
      const result = await this.paymentsService.processPayment(
        orderId,
        paymentData
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}