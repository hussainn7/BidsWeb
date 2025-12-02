import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YooKassaService } from './yookassa.service';
import { WebhookController } from './webhook.controller';
import { PaymentsController } from './payments.controller';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { Click } from '../products/entities/click.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Click]),
    forwardRef(() => ProductsModule),
    forwardRef(() => OrdersModule),
  ],
  controllers: [WebhookController, PaymentsController],
  providers: [YooKassaService],
  exports: [YooKassaService],
})
export class PaymentsModule {}

