import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { BalanceModule } from './modules/balance/balance.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    BalanceModule,
    AnalyticsModule,
    PayoutsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
