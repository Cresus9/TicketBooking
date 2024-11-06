import { IsString, IsNumber, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentMethod {
  CARD = 'card',
  MOBILE_MONEY = 'mobile_money'
}

export class ProcessPaymentDto {
  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsObject()
  details: Record<string, any>;
}

export class CardPaymentDetailsDto {
  @ApiProperty()
  @IsString()
  cardNumber: string;

  @ApiProperty()
  @IsString()
  expiryMonth: string;

  @ApiProperty()
  @IsString()
  expiryYear: string;

  @ApiProperty()
  @IsString()
  cvv: string;
}

export class MobileMoneyDetailsDto {
  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty()
  @IsString()
  phone: string;
}