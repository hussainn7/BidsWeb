import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Click } from '../../clicks/entities/click.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minPrice: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSold: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  clickCount: number;

  @ManyToOne(() => User, user => user.products)
  @JoinColumn({ name: 'partnerId' })
  partner: User;

  @OneToMany(() => Click, click => click.product)
  clicks: Click[];

  @OneToMany(() => Order, order => order.product)
  orders: Order[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
