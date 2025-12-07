import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YooKassaService } from './yookassa.service';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { BalanceService } from '../balance/balance.service';
import { BalanceTransaction, TransactionType } from '../balance/entities/balance-transaction.entity';
import { Click } from '../products/entities/click.entity';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private yooKassaService: YooKassaService,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private balanceService: BalanceService,
    @InjectRepository(Click)
    private clicksRepository: Repository<Click>,
  ) {}

  @Post('yookassa')
  async handleYooKassaWebhook(@Body() payload: any, @Headers() headers: any) {
    this.logger.log('Received YooKassa webhook', payload);

    try {
      const webhookData = await this.yooKassaService.handleWebhook(payload);

      if (!webhookData) {
        return { status: 'ignored' };
      }

      if (webhookData.status === 'succeeded') {
        const metadata = payload.object.metadata;
        const amount = parseFloat(webhookData.amount?.value || '0');

        // Check if it's a balance top-up payment (orderId format: balance_topup_{userId}_{timestamp})
        if (metadata?.orderId?.startsWith('balance_topup_')) {
          const parts = metadata.orderId.split('_');
          if (parts.length >= 3) {
            const userId = parts[2]; // Extract userId from orderId
            await this.balanceService.addBalance(
              userId,
              amount,
              TransactionType.BALANCE_TOPUP,
              webhookData.paymentId,
              `Пополнение баланса на ${amount} ₽`,
            );
            this.logger.log(`Balance top-up processed: ${amount} ₽ for user ${userId}`);
          }
        }
        // Check if it's a click payment (orderId format: click-{productId}-{userId}-{timestamp})
        else if (metadata?.orderId?.startsWith('click-')) {
          // Find click by paymentId
          const click = await this.clicksRepository.findOne({
            where: { paymentId: webhookData.paymentId },
          });
          if (click) {
            await this.productsService.confirmClickPayment(click.id, webhookData.paymentId);
          }
        } else if (metadata?.orderId) {
          // It's an order payment
          await this.ordersService.confirmPayment(metadata.orderId, webhookData.paymentId);
        }
      }

      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Error processing webhook', error);
      return { status: 'error', message: error.message };
    }
  }
}

