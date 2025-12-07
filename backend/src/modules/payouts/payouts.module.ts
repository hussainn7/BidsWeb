import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayoutsService } from './payouts.service';
import { PayoutsController } from './payouts.controller';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { BalanceTransaction } from '../balance/entities/balance-transaction.entity';
import { PayoutsScheduler } from './payouts.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, User, BalanceTransaction])],
  controllers: [PayoutsController],
  providers: [PayoutsService, PayoutsScheduler],
  exports: [PayoutsService],
})
export class PayoutsModule {}


