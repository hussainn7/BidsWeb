import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from './product.entity';

@Entity('clicks')
export class Click {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceBefore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAfter: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountPaid: number;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ default: false })
  isPaid: boolean;

  @ManyToOne(() => User, user => user.clicks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, product => product.clicks, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
