import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { BalanceTransaction, TransactionType } from '../balance/entities/balance-transaction.entity';

@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(BalanceTransaction)
    private balanceTransactionsRepository: Repository<BalanceTransaction>,
    private dataSource: DataSource,
  ) {}

  async processPayouts() {
    this.logger.log('Starting payout processing...');

    // Find all paid orders that haven't been paid out yet
    const paidOrders = await this.ordersRepository.find({
      where: { status: OrderStatus.PAID },
      relations: ['product', 'product.partner'],
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    let processedCount = 0;

    for (const order of paidOrders) {
      // Check if payout already processed
      const existingPayout = await this.balanceTransactionsRepository.findOne({
        where: {
          type: TransactionType.PAYOUT,
          referenceId: order.id,
        },
      });

      if (existingPayout) {
        continue; // Already processed
      }

      if (!order.product.partner) {
        this.logger.warn(`Order ${order.id} has no partner, skipping`);
        continue;
      }

      try {
        await queryRunner.startTransaction();

        const salePrice = Number(order.amount);
        const minPrice = Number(order.product.minPrice);
        let partnerPayout = 0;

        if (salePrice > minPrice) {
          // 50/50 split of profit
          const profit = salePrice - minPrice;
          partnerPayout = minPrice + profit / 2;
        } else if (salePrice === minPrice) {
          // Partner receives only min_price
          partnerPayout = minPrice;
        }

        if (partnerPayout > 0) {
          const partner = await queryRunner.manager.findOne(User, {
            where: { id: order.product.partner.id },
          });

          if (partner) {
            const balanceBefore = Number(partner.balance);
            const balanceAfter = balanceBefore + partnerPayout;

            partner.balance = balanceAfter;
            await queryRunner.manager.save(partner);

            const payoutTransaction = queryRunner.manager.create(BalanceTransaction, {
              type: TransactionType.PAYOUT,
              amount: partnerPayout,
              balanceBefore,
              balanceAfter,
              referenceId: order.id,
              description: `Payout for order ${order.orderNumber} - Product: ${order.product.name}`,
              user: { id: partner.id },
            });

            await queryRunner.manager.save(payoutTransaction);
            this.logger.log(
              `Processed payout of ${partnerPayout} ₽ to partner ${partner.id} for order ${order.id}`,
            );
          }
        }

        await queryRunner.commitTransaction();
        processedCount++;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        this.logger.error(`Error processing payout for order ${order.id}`, error);
      }
    }

    await queryRunner.release();
    this.logger.log(`Payout processing completed. Processed ${processedCount} orders.`);
  }

  async getPayoutHistory(partnerId?: string) {
    const where: any = { type: TransactionType.PAYOUT };
    if (partnerId) {
      where.user = { id: partnerId };
    }

    return this.balanceTransactionsRepository.find({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}


