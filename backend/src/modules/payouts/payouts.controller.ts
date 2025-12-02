import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('payouts')
@UseGuards(JwtAuthGuard)
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PARTNER)
  async getPayoutHistory(@Request() req) {
    const partnerId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.payoutsService.getPayoutHistory(partnerId);
  }
}

