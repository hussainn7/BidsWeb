import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('balance')
@UseGuards(JwtAuthGuard)
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async getBalance(@Request() req) {
    return this.balanceService.getBalance(req.user.id);
  }

  @Get('history')
  async getBalanceHistory(@Request() req, @Query('limit') limit?: string) {
    return this.balanceService.getBalanceHistory(req.user.id, limit ? parseInt(limit) : 50);
  }
}

