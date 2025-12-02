import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { User } from '../users/entities/user.entity';
import { BalanceTransaction } from './entities/balance-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BalanceTransaction])],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}

