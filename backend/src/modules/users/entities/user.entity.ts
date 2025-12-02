import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from '../../orders/entities/order.entity';
import { Click } from '../../products/entities/click.entity';
import { BalanceTransaction } from '../../balance/entities/balance-transaction.entity';
import { Product } from '../../products/entities/product.entity';

export enum UserRole {
  USER = 'user',
  PARTNER = 'partner',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  partnerId: string;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => Click, click => click.user)
  clicks: Click[];

  @OneToMany(() => BalanceTransaction, transaction => transaction.user)
  balanceTransactions: BalanceTransaction[];

  @OneToMany(() => Product, product => product.partner)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
