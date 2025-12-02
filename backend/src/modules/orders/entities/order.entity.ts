import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balanceUsed: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, product => product.orders, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  paidAt: Date;
}
