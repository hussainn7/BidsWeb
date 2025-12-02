import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TransactionType {
  CLICK_REWARD = 'click_reward',
  ORDER_PAYMENT = 'order_payment',
  REFUND = 'refund',
  MANUAL_ADJUSTMENT = 'manual_adjustment',
  PAYOUT = 'payout',
}

@Entity('balance_transactions')
export class BalanceTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceBefore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceAfter: number;

  @Column({ nullable: true })
  referenceId: string; // Can be orderId, clickId, etc.

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, user => user.balanceTransactions, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
