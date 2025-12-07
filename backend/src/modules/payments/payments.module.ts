import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YooKassaService } from './yookassa.service';
import { WebhookController } from './webhook.controller';
import { PaymentsController } from './payments.controller';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { BalanceModule } from '../balance/balance.module';
import { Click } from '../products/entities/click.entity';
import { BalanceTransaction } from '../balance/entities/balance-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Click, BalanceTransaction]),
    forwardRef(() => ProductsModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => BalanceModule),
  ],
  controllers: [WebhookController, PaymentsController],
  providers: [YooKassaService],
  exports: [YooKassaService],
})
export class PaymentsModule {}

