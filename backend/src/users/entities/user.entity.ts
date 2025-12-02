import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Click } from '../../clicks/entities/click.entity';
import { Order } from '../../orders/entities/order.entity';
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
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  partnerId: string;

  @OneToMany(() => Click, click => click.user)
  clicks: Click[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => BalanceTransaction, transaction => transaction.user)
  transactions: BalanceTransaction[];

  @OneToMany(() => Product, product => product.partner)
  products: Product[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
