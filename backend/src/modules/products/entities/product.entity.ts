import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { Click } from './click.entity';

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

  @ManyToOne(() => User, user => user.products, { onDelete: 'CASCADE' })
  partner: User;

  @OneToMany(() => Order, order => order.product)
  orders: Order[];

  @OneToMany(() => Click, click => click.product)
  clicks: Click[];

  @Column({ default: 0 })
  clickCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
