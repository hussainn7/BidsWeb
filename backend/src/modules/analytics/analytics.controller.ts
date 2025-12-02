import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getOverallStats() {
    return this.analyticsService.getOverallStats();
  }

  @Get('product/:id')
  async getProductStats(@Param('id') id: string, @Request() req) {
    // Partners can see stats for their own products, admins can see all
    return this.analyticsService.getProductStats(id);
  }

  @Get('partner/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PARTNER, UserRole.ADMIN)
  async getPartnerStats(@Param('id') id: string, @Request() req) {
    // Partners can only see their own stats
    if (req.user.role === UserRole.PARTNER && req.user.id !== id) {
      throw new Error('Forbidden');
    }
    return this.analyticsService.getPartnerStats(id);
  }

  @Get('my-stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PARTNER)
  async getMyStats(@Request() req) {
    return this.analyticsService.getPartnerStats(req.user.id);
  }
}

