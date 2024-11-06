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
} from '@nestjs/common';
import { CMSService } from './cms.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('cms')
@Controller('cms')
export class CMSController {
  constructor(private readonly cmsService: CMSService) {}

  // Pages
  @Post('pages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new page' })
  createPage(@Body() data: CreatePageDto) {
    return this.cmsService.createPage(data);
  }

  @Put('pages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a page' })
  updatePage(@Param('id') id: string, @Body() data: UpdatePageDto) {
    return this.cmsService.updatePage(id, data);
  }

  @Delete('pages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a page' })
  deletePage(@Param('id') id: string) {
    return this.cmsService.deletePage(id);
  }

  @Get('pages')
  @ApiOperation({ summary: 'Get all pages' })
  getAllPages() {
    return this.cmsService.getAllPages();
  }

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Get page by slug' })
  getPageBySlug(@Param('slug') slug: string) {
    return this.cmsService.getPageBySlug(slug);
  }

  // Banners
  @Post('banners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new banner' })
  createBanner(@Body() data: CreateBannerDto) {
    return this.cmsService.createBanner(data);
  }

  @Put('banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a banner' })
  updateBanner(@Param('id') id: string, @Body() data: UpdateBannerDto) {
    return this.cmsService.updateBanner(id, data);
  }

  @Delete('banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a banner' })
  deleteBanner(@Param('id') id: string) {
    return this.cmsService.deleteBanner(id);
  }

  @Get('banners')
  @ApiOperation({ summary: 'Get all banners' })
  getAllBanners(@Query('active') active?: boolean) {
    return active ? this.cmsService.getActiveBanners() : this.cmsService.getAllBanners();
  }

  // FAQs
  @Post('faqs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new FAQ' })
  createFaq(@Body() data: CreateFaqDto) {
    return this.cmsService.createFaq(data);
  }

  @Put('faqs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a FAQ' })
  updateFaq(@Param('id') id: string, @Body() data: UpdateFaqDto) {
    return this.cmsService.updateFaq(id, data);
  }

  @Delete('faqs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a FAQ' })
  deleteFaq(@Param('id') id: string) {
    return this.cmsService.deleteFaq(id);
  }

  @Get('faqs')
  @ApiOperation({ summary: 'Get all FAQs' })
  getAllFaqs(@Query('category') category?: string) {
    return category ? this.cmsService.getFaqsByCategory(category) : this.cmsService.getAllFaqs();
  }
}