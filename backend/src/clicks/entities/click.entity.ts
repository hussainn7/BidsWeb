import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('clicks')
export class Click {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceBefore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAfter: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.clicks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, product => product.clicks)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
