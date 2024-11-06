import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Ip,
} from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { VerifyRecaptchaDto, ReportActivityDto } from './dto/security.dto';

@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('recaptcha')
  @ApiOperation({ summary: 'Verify reCAPTCHA token' })
  async verifyRecaptcha(@Body() data: VerifyRecaptchaDto) {
    const isValid = await this.securityService.verifyRecaptcha(data.token);
    return { success: isValid };
  }

  @Post('report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report suspicious activity' })
  async reportActivity(@Body() data: ReportActivityDto, @Ip() ip: string) {
    await this.securityService.logSecurityEvent({
      ...data,
      ip,
    });
    return { success: true };
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get security logs (admin only)' })
  async getSecurityLogs(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('severity') severity?: 'LOW' | 'MEDIUM' | 'HIGH',
  ) {
    return this.securityService.getSecurityLogs({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      severity,
    });
  }

  @Get('blocked-ips')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get blocked IPs (admin only)' })
  async getBlockedIPs() {
    return this.securityService.getBlockedIPs();
  }
}