import { Controller, Get, Post, Body, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { YooKassaService } from '../payments/yookassa.service';
import { TransactionType } from './entities/balance-transaction.entity';

@Controller('balance')
@UseGuards(JwtAuthGuard)
export class BalanceController {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly yooKassaService: YooKassaService,
  ) {}

  @Get()
  async getBalance(@Request() req) {
    return this.balanceService.getBalance(req.user.id);
  }

  @Get('history')
  async getBalanceHistory(@Request() req, @Query('limit') limit?: string) {
    return this.balanceService.getBalanceHistory(req.user.id, limit ? parseInt(limit) : 50);
  }

  @Post('topup')
  async topUpBalance(@Request() req, @Body() body: { amount: number }) {
    const { amount } = body;
    
    if (!amount || amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    if (amount < 1) {
      throw new BadRequestException('Minimum top-up amount is 1 ₽');
    }

    if (amount > 1000000) {
      throw new BadRequestException('Maximum top-up amount is 1,000,000 ₽');
    }

    const userId = req.user.id;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const returnUrl = `${frontendUrl}/payment/callback?type=balance_topup`;

    // Create payment via YooKassa
    const payment = await this.yooKassaService.createPayment(
      amount,
      `Пополнение баланса на ${amount} ₽`,
      `balance_topup_${userId}_${Date.now()}`,
      returnUrl,
    );

    return {
      paymentId: payment.id,
      confirmationUrl: payment.confirmationUrl,
      amount,
      isMock: payment.id?.startsWith('mock_'),
    };
  }

  @Post('topup/confirm')
  async confirmTopUp(@Request() req, @Body() body: { paymentId: string; amount?: number }) {
    const { paymentId, amount: providedAmount } = body;
    const userId = req.user.id;

    if (!paymentId) {
      throw new BadRequestException('Payment ID is required');
    }

    // Check if payment is a mock payment
    if (paymentId.startsWith('mock_')) {
      // For mock payments, use provided amount or get from payment status
      let amount = providedAmount;
      if (!amount || amount <= 0) {
        const paymentStatus = await this.yooKassaService.getPaymentStatus(paymentId, providedAmount);
        amount = parseFloat(paymentStatus.amount?.value || '0');
      }

      if (amount > 0) {
        await this.balanceService.addBalance(
          userId,
          amount,
          TransactionType.BALANCE_TOPUP,
          paymentId,
          `Пополнение баланса на ${amount} ₽`,
        );
        return { success: true, balance: (await this.balanceService.getBalance(userId)).balance };
      }
    }

    // For real payments, webhook will handle it
    // This endpoint is mainly for mock payments
    return { success: true, message: 'Payment will be processed by webhook' };
  }
}


