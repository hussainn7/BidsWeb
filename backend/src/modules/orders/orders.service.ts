import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { YooKassaService } from '../payments/yookassa.service';
import { BalanceService } from '../balance/balance.service';
import { BalanceTransaction, TransactionType } from '../balance/entities/balance-transaction.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private yooKassaService: YooKassaService,
    private balanceService: BalanceService,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const product = await this.productsRepository.findOne({
      where: { id: createOrderDto.productId },
      relations: ['partner'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.isSold) {
      throw new BadRequestException('Product is already sold');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentPrice = Number(product.price);
    const balanceToUse = createOrderDto.balanceToUse || 0;
    const userBalance = Number(user.balance);

    if (balanceToUse > userBalance) {
      throw new BadRequestException('Insufficient balance');
    }

    if (balanceToUse > currentPrice) {
      throw new BadRequestException('Balance to use cannot exceed product price');
    }

    const amountToPay = currentPrice - balanceToUse;

    // Use transaction to ensure atomicity of order creation and balance deduction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lock the product
      product.isSold = true;
      await queryRunner.manager.save(product);

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order
      const order = queryRunner.manager.create(Order, {
        orderNumber,
        amount: currentPrice,
        balanceUsed: balanceToUse,
        status: OrderStatus.PENDING,
        user: { id: userId },
        product: { id: product.id },
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Deduct balance if used (within the same transaction)
      if (balanceToUse > 0) {
        const userInTransaction = await queryRunner.manager.findOne(User, { where: { id: userId } });
        if (!userInTransaction) {
          throw new NotFoundException('User not found');
        }

        const balanceBefore = Number(userInTransaction.balance);
        if (balanceBefore < balanceToUse) {
          throw new BadRequestException(`Insufficient balance. Available: ${balanceBefore}₽, Required: ${balanceToUse}₽`);
        }

        const balanceAfter = balanceBefore - balanceToUse;
        userInTransaction.balance = balanceAfter;
        await queryRunner.manager.save(userInTransaction);

        // Create balance transaction record
        const balanceTransaction = queryRunner.manager.create(BalanceTransaction, {
          type: TransactionType.ORDER_PAYMENT,
          amount: -balanceToUse,
          balanceBefore,
          balanceAfter,
          referenceId: savedOrder.id,
          description: `Payment for order ${orderNumber}`,
          user: { id: userId },
        });
        await queryRunner.manager.save(balanceTransaction);

        // Log balance deduction
        console.log(`[Order ${orderNumber}] Balance deducted: ${balanceBefore}₽ → ${balanceAfter}₽ (deducted ${balanceToUse}₽)`);
      }

      await queryRunner.commitTransaction();

      // Create payment if amount to pay > 0 (outside transaction since it's external)
      let payment: { id: string; confirmationUrl?: string } | null = null;
      if (amountToPay > 0) {
        const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/callback?orderId=${savedOrder.id}`;
        
        payment = await this.yooKassaService.createPayment(
          amountToPay,
          `Purchase: ${product.name}`,
          savedOrder.id,
          returnUrl,
        );

        savedOrder.paymentId = payment.id;
        await this.ordersRepository.save(savedOrder);
        
        // Add orderId to confirmation URL
        if (payment.confirmationUrl) {
          const separator = payment.confirmationUrl.includes('?') ? '&' : '?';
          payment.confirmationUrl = `${payment.confirmationUrl}${separator}orderId=${savedOrder.id}`;
        }
      } else {
        // If fully paid with balance, mark as paid immediately
        savedOrder.status = OrderStatus.PAID;
        savedOrder.paidAt = new Date();
        await this.ordersRepository.save(savedOrder);
      }

      return {
        order: savedOrder,
        payment: payment ? {
          id: payment.id,
          confirmationUrl: payment.confirmationUrl,
        } : null,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async confirmPayment(orderId: string, paymentId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['product', 'user', 'product.partner'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.PAID) {
      // Verify balance was deducted (for logging/debugging)
      if (order.balanceUsed > 0) {
        const user = await this.usersRepository.findOne({ where: { id: order.user.id } });
        console.log(`[Order ${order.orderNumber}] Already paid. Balance used: ${order.balanceUsed}₽, User balance: ${user?.balance}₽`);
      }
      return order; // Already processed
    }

    // Check payment status with YooKassa (or mock)
    const paymentStatus = await this.yooKassaService.getPaymentStatus(paymentId);

    // Auto-approve mock payments
    if (paymentId.startsWith('mock_') || (paymentStatus.status === 'succeeded' && paymentStatus.paid)) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Verify balance was already deducted at order creation
        if (order.balanceUsed > 0) {
          const userInTransaction = await queryRunner.manager.findOne(User, { where: { id: order.user.id } });
          console.log(`[Order ${order.orderNumber}] Payment confirmed. Balance was deducted at creation: ${order.balanceUsed}₽. Current user balance: ${userInTransaction?.balance}₽`);
        }

        // Update order status
        order.status = OrderStatus.PAID;
        order.paidAt = new Date();
        order.paymentId = paymentId;
        await queryRunner.manager.save(order);

        // Generate receipt
        const receipt = await this.yooKassaService.createReceipt(
          paymentId,
          [{
            description: order.product.name,
            quantity: 1,
            amount: Number(order.amount),
          }],
          order.user.email,
        );

        order.receiptUrl = receipt.receiptUrl || `https://yoomoney.ru/checkout/payments/v2/confirmation?orderId=${paymentId}`;
        await queryRunner.manager.save(order);

        await queryRunner.commitTransaction();

        console.log(`[Order ${order.orderNumber}] Payment confirmed and receipt generated`);

        // Note: Partner payout will be handled by CRON job
        return order;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    throw new BadRequestException('Payment not confirmed');
  }

  async findAll(userId?: string) {
    const where: any = {};
    if (userId) {
      where.user = { id: userId };
    }

    return this.ordersRepository.find({
      where,
      relations: ['product', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId?: string) {
    const where: any = { id };
    if (userId) {
      where.user = { id: userId };
    }

    const order = await this.ordersRepository.findOne({
      where,
      relations: ['product', 'user', 'product.partner'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}

