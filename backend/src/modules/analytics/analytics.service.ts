import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Click } from '../products/entities/click.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { BalanceTransaction, TransactionType } from '../balance/entities/balance-transaction.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Click)
    private clicksRepository: Repository<Click>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(BalanceTransaction)
    private balanceTransactionsRepository: Repository<BalanceTransaction>,
  ) {}

  async getOverallStats() {
    const [
      totalClicks,
      totalOrders,
      totalRevenue,
      totalBonuses,
      totalProducts,
      soldProducts,
    ] = await Promise.all([
      this.clicksRepository.count({ where: { isPaid: true } }),
      this.ordersRepository.count({ where: { status: OrderStatus.PAID } }),
      this.ordersRepository
        .createQueryBuilder('order')
        .select('SUM(order.amount)', 'total')
        .where('order.status = :status', { status: OrderStatus.PAID })
        .getRawOne(),
      this.balanceTransactionsRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.type = :type', { type: TransactionType.CLICK_REWARD })
        .getRawOne(),
      this.productsRepository.count(),
      this.productsRepository.count({ where: { isSold: true } }),
    ]);

    const conversionRate =
      totalClicks > 0 ? ((totalOrders / totalClicks) * 100).toFixed(2) : '0.00';

    return {
      clicks: totalClicks,
      orders: totalOrders,
      revenue: Number(totalRevenue?.total || 0),
      bonuses: Number(totalBonuses?.total || 0),
      products: totalProducts,
      soldProducts,
      conversionRate: parseFloat(conversionRate),
    };
  }

  async getProductStats(productId: string) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['clicks', 'orders'],
    });

    if (!product) {
      return null;
    }

    const paidClicks = product.clicks.filter((c) => c.isPaid).length;
    const orders = product.orders.filter((o) => o.status === OrderStatus.PAID);
    const revenue = orders.reduce((sum, o) => sum + Number(o.amount), 0);

    return {
      productId: product.id,
      productName: product.name,
      clicks: paidClicks,
      orders: orders.length,
      revenue,
      conversionRate: paidClicks > 0 ? ((orders.length / paidClicks) * 100).toFixed(2) : '0.00',
    };
  }

  async getPartnerStats(partnerId: string) {
    const products = await this.productsRepository.find({
      where: { partner: { id: partnerId } },
      relations: ['clicks', 'orders'],
    });

    const totalClicks = products.reduce(
      (sum, p) => sum + p.clicks.filter((c) => c.isPaid).length,
      0,
    );
    const totalOrders = products.reduce(
      (sum, p) => sum + p.orders.filter((o) => o.status === OrderStatus.PAID).length,
      0,
    );
    const totalRevenue = products.reduce(
      (sum, p) =>
        sum +
        p.orders
          .filter((o) => o.status === OrderStatus.PAID)
          .reduce((s, o) => s + Number(o.amount), 0),
      0,
    );

    return {
      partnerId,
      products: products.length,
      clicks: totalClicks,
      orders: totalOrders,
      revenue: totalRevenue,
      conversionRate: totalClicks > 0 ? ((totalOrders / totalClicks) * 100).toFixed(2) : '0.00',
    };
  }
}


