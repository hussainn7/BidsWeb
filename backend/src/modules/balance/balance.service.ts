import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { BalanceTransaction, TransactionType } from './entities/balance-transaction.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(BalanceTransaction)
    private balanceTransactionsRepository: Repository<BalanceTransaction>,
    private dataSource: DataSource,
  ) {}

  async addBalance(
    userId: string,
    amount: number,
    type: TransactionType,
    referenceId?: string,
    description?: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const balanceBefore = Number(user.balance);
      const balanceAfter = balanceBefore + amount;

      user.balance = balanceAfter;
      await queryRunner.manager.save(user);

      const transaction = queryRunner.manager.create(BalanceTransaction, {
        type,
        amount,
        balanceBefore,
        balanceAfter,
        referenceId,
        description,
        user: { id: userId },
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return { balance: balanceAfter, transaction };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deductBalance(
    userId: string,
    amount: number,
    type: TransactionType,
    referenceId?: string,
    description?: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const balanceBefore = Number(user.balance);
      if (balanceBefore < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const balanceAfter = balanceBefore - amount;

      user.balance = balanceAfter;
      await queryRunner.manager.save(user);

      const transaction = queryRunner.manager.create(BalanceTransaction, {
        type,
        amount: -amount,
        balanceBefore,
        balanceAfter,
        referenceId,
        description,
        user: { id: userId },
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return { balance: balanceAfter, transaction };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getBalance(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return { balance: Number(user.balance) };
  }

  async getBalanceHistory(userId: string, limit: number = 50) {
    return this.balanceTransactionsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}

