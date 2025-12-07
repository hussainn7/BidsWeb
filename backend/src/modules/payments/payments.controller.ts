import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { YooKassaService } from './yookassa.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly yooKassaService: YooKassaService) {}

  @Get('status/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.yooKassaService.getPaymentStatus(paymentId);
  }
}


