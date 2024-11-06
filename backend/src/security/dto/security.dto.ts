import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyRecaptchaDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class ReportActivityDto {
  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  @IsString()
  details: string;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH'] })
  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  severity: 'LOW' | 'MEDIUM' | 'HIGH';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}