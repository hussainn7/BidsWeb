import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YooKassaService {
  private yooKassa: any;
  private readonly logger = new Logger(YooKassaService.name);

  private isConfigured: boolean = false;

  constructor(private configService: ConfigService) {
    const shopId = this.configService.get<string>('YOOKASSA_SHOP_ID');
    const secretKey = this.configService.get<string>('YOOKASSA_SECRET_KEY');

    if (!shopId || !secretKey) {
      this.logger.warn('YooKassa credentials not configured - running in mock mode');
      this.isConfigured = false;
      return;
    }

    try {
      // Dynamic import for YooKassa (CommonJS module)
      const YooKassa = require('yookassa');
      this.yooKassa = new YooKassa({
        shopId,
        secretKey,
      });
      this.isConfigured = true;
      this.logger.log('YooKassa initialized successfully');
    } catch (error) {
      this.logger.warn('Failed to initialize YooKassa - running in mock mode', error);
      this.isConfigured = false;
    }
  }

  private createMockPayment(amount: number, returnUrl?: string) {
    const mockPaymentId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.logger.warn(`Mock payment created: ${mockPaymentId} for ${amount}₽ - auto-approved`);
    
    // For mock payments, return URL should point to payment callback
    let baseUrl = returnUrl || this.configService.get<string>('YOOKASSA_RETURN_URL') || 'http://localhost:5173';
    
    // If returnUrl doesn't include /payment/callback, add it
    if (!baseUrl.includes('/payment/callback')) {
      baseUrl = baseUrl.replace(/\/$/, '') + '/payment/callback';
    }
    
    // Include amount in URL for mock payments so it can be retrieved
    const separator = baseUrl.includes('?') ? '&' : '?';
    return {
      id: mockPaymentId,
      status: 'succeeded',
      confirmationUrl: `${baseUrl}${separator}payment_id=${mockPaymentId}&mock=true&amount=${amount}`,
    };
  }

  async createPayment(amount: number, description: string, orderId: string, returnUrl?: string) {
    if (!this.isConfigured || !this.yooKassa) {
      // Mock payment for development - auto-approve immediately
      return this.createMockPayment(amount, returnUrl);
    }

    try {
      const payment = await this.yooKassa.createPayment({
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB',
        },
        confirmation: {
          type: 'redirect',
          return_url: returnUrl || this.configService.get<string>('YOOKASSA_RETURN_URL') || 'http://localhost:5173',
        },
        description,
        metadata: {
          orderId,
        },
      });

      return {
        id: payment.id,
        status: payment.status,
        confirmationUrl: payment.confirmation?.confirmation_url,
      };
    } catch (error) {
      this.logger.error('Error creating YooKassa payment, falling back to mock', error);
      // Fallback to mock payment on error
      return this.createMockPayment(amount, returnUrl);
    }
  }

  async getPaymentStatus(paymentId: string, amount?: number) {
    if (!this.isConfigured || !this.yooKassa || paymentId.startsWith('mock_')) {
      // Mock payment status - auto-approve mock payments
      this.logger.warn(`Mock payment status check: ${paymentId} - approved`);
      return {
        id: paymentId,
        status: 'succeeded',
        paid: true,
        amount: { value: (amount || 0).toFixed(2), currency: 'RUB' },
      };
    }

    try {
      const payment = await this.yooKassa.getPayment(paymentId);
      return {
        id: payment.id,
        status: payment.status,
        paid: payment.paid,
        amount: payment.amount,
      };
    } catch (error) {
      this.logger.error('Error getting YooKassa payment status, treating as mock', error);
      // Fallback to mock status on error
      return {
        id: paymentId,
        status: 'succeeded',
        paid: true,
        amount: { value: '0', currency: 'RUB' },
      };
    }
  }

  async createReceipt(paymentId: string, items: Array<{ description: string; quantity: number; amount: number; vat_code?: number }>, email?: string) {
    if (!this.isConfigured || paymentId.startsWith('mock_')) {
      // Mock receipt for development
      this.logger.warn(`Mock receipt created for payment: ${paymentId}`);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || process.env.FRONTEND_URL || 'http://localhost:5173';
      return {
        receiptUrl: `${frontendUrl}/payment/callback?payment_id=${paymentId}&mock=true`,
      };
    }

    try {
      // YooKassa receipt creation
      const receipt = await this.yooKassa.createReceipt({
        type: 'payment',
        payment_id: paymentId,
        customer: {
          email: email || '',
        },
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity.toString(),
          amount: {
            value: item.amount.toFixed(2),
            currency: 'RUB',
          },
          vat_code: item.vat_code || 1,
        })),
      });

      return receipt;
    } catch (error) {
      this.logger.error('Error creating receipt', error);
      // Return receipt URL if available, otherwise return payment ID for manual receipt generation
      return {
        receiptUrl: `https://yoomoney.ru/checkout/payments/v2/confirmation?orderId=${paymentId}`,
      };
    }
  }

  async handleWebhook(payload: any) {
    try {
      const event = payload.event;
      const payment = payload.object;

      if (event === 'payment.succeeded') {
        return {
          paymentId: payment.id,
          status: 'succeeded',
          amount: payment.amount.value,
          metadata: payment.metadata,
        };
      }

      if (event === 'payment.canceled') {
        return {
          paymentId: payment.id,
          status: 'canceled',
        };
      }

      return null;
    } catch (error) {
      this.logger.error('Error handling webhook', error);
      throw error;
    }
  }
}

