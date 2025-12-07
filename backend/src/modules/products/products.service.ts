import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { Click } from './entities/click.entity';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { YooKassaService } from '../payments/yookassa.service';
import { BalanceService } from '../balance/balance.service';
import { TransactionType, BalanceTransaction } from '../balance/entities/balance-transaction.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Click)
    private clicksRepository: Repository<Click>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private yooKassaService: YooKassaService,
    private balanceService: BalanceService,
    private dataSource: DataSource,
  ) {}

  async findAll(isActive?: boolean) {
    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    return this.productsRepository.find({
      where,
      relations: ['partner'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId?: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['partner', 'clicks'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user has clicked on this product (to determine if price should be visible)
    let hasClicked = false;
    if (userId) {
      const userClick = await this.clicksRepository.findOne({
        where: { product: { id }, user: { id: userId }, isPaid: true },
      });
      hasClicked = !!userClick;
    }

    return {
      ...product,
      priceVisible: hasClicked || product.isSold,
    };
  }

  async create(createProductDto: CreateProductDto, partnerId: string) {
    const partner = await this.usersRepository.findOne({ where: { id: partnerId } });
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    // Validate that price is greater than minPrice
    const price = Number(createProductDto.price);
    const minPrice = Number(createProductDto.minPrice);
    
    if (price <= minPrice) {
      throw new BadRequestException(`Product price (${price}₽) must be greater than minimum price (${minPrice}₽)`);
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      partner: partner,
    });

    return this.productsRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['partner'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.partner.id !== userId) {
      throw new ForbiddenException('You can only update your own products');
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async clickProduct(productId: string, userId: string) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.isSold) {
      throw new BadRequestException('Product is already sold');
    }

    // Convert to numbers for proper comparison (decimal types can cause issues)
    const currentPrice = Number(product.price);
    const minPrice = Number(product.minPrice);
    
    // Check if this user has already clicked (price is already revealed for them)
    const hasUserClicked = await this.clicksRepository.findOne({
      where: { 
        product: { id: productId }, 
        user: { id: userId }, 
        isPaid: true 
      },
    });
    
    this.logger.debug(`Click attempt - Product: ${product.name}, Current Price: ${currentPrice}, Min Price: ${minPrice}, Has User Clicked: ${!!hasUserClicked}`);
    
    // Only check minimum price constraint if user has already clicked (price is revealed)
    // Allow first click to reveal the price, then check minimum for subsequent clicks
    if (hasUserClicked && currentPrice <= minPrice) {
      this.logger.warn(`Product ${product.id} price (${currentPrice}) is at or below minimum (${minPrice}) after user's previous click`);
      throw new BadRequestException(`Product price (${currentPrice}₽) is already at minimum (${minPrice}₽). No more clicks available.`);
    }
    
    // Also validate that starting price is valid (should be > minPrice)
    // This prevents products from being created incorrectly, but allows first click
    if (product.clickCount === 0 && currentPrice <= minPrice) {
      this.logger.error(`Product ${product.id} has invalid starting price (${currentPrice}) <= minPrice (${minPrice})`);
      throw new BadRequestException(`Product has invalid price configuration. Starting price must be greater than minimum price.`);
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Use transaction to ensure atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const priceBefore = Number(product.price);
      const minPrice = Number(product.minPrice);
      const priceReduction = 30;
      const newPrice = Math.max(minPrice, priceBefore - priceReduction);
      const priceAfter = newPrice;

      // Create click record first (without paymentId)
      const click = queryRunner.manager.create(Click, {
        priceBefore,
        priceAfter,
        amountPaid: 30,
        paymentId: undefined,
        isPaid: false,
        user: { id: userId },
        product: { id: productId },
      });

      const savedClick = await queryRunner.manager.save(click);

      // Create payment for click (30 ₽)
      const clickOrderId = `click-${productId}-${userId}-${Date.now()}`;
      const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/callback?clickId=${savedClick.id}&productId=${productId}`;
      
      const payment = await this.yooKassaService.createPayment(
        30,
        `Click to reveal price for ${product.name}`,
        clickOrderId,
        returnUrl,
      );

      // Update click with paymentId
      savedClick.paymentId = payment.id;
      await queryRunner.manager.save(savedClick);

      // If it's a mock payment, auto-approve it immediately
      if (payment.id.startsWith('mock_')) {
        savedClick.isPaid = true;
        await queryRunner.manager.save(savedClick);
        
        // Add 40 ₽ to user balance within the same transaction
        const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
        if (user) {
          const balanceBefore = Number(user.balance);
          const balanceAfter = balanceBefore + 40;
          user.balance = balanceAfter;
          await queryRunner.manager.save(user);
          
          // Create balance transaction record
          const balanceTransaction = queryRunner.manager.create(BalanceTransaction, {
            type: TransactionType.CLICK_REWARD,
            amount: 40,
            balanceBefore,
            balanceAfter,
            referenceId: savedClick.id,
            description: `Reward for clicking on ${product.name}`,
            user: { id: userId },
          });
          await queryRunner.manager.save(balanceTransaction);
        }
      }

      // Update product price
      product.price = priceAfter;
      product.clickCount += 1;
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();

      // Add clickId and productId to confirmation URL
      // For mock payments, the URL already has payment_id and mock=true
      // For real YooKassa, payment_id will be added by YooKassa redirect
      let confirmationUrl: string | null = null;
      if (payment.confirmationUrl) {
        const separator = payment.confirmationUrl.includes('?') ? '&' : '?';
        confirmationUrl = `${payment.confirmationUrl}${separator}clickId=${savedClick.id}&productId=${productId}`;
      }

      return {
        clickId: savedClick.id,
        paymentId: payment.id,
        confirmationUrl,
        priceBefore,
        priceAfter,
        newPrice: priceAfter,
        isMock: payment.id.startsWith('mock_'),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error in clickProduct for product ${productId}, user ${userId}: ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async confirmClickPayment(clickId: string, paymentId: string): Promise<Click> {
    const click = await this.clicksRepository.findOne({
      where: { id: clickId },
      relations: ['user', 'product'],
    });

    if (!click) {
      throw new NotFoundException('Click not found');
    }

    if (click.isPaid) {
      return click; // Already processed
    }

    // Check payment status with YooKassa (or mock)
    const paymentStatus = await this.yooKassaService.getPaymentStatus(paymentId);

    // Auto-approve mock payments
    if (paymentId.startsWith('mock_') || (paymentStatus.status === 'succeeded' && paymentStatus.paid)) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Mark click as paid
        click.isPaid = true;
        click.paymentId = paymentId;
        await queryRunner.manager.save(click);

        // Add 40 ₽ to user balance
        await this.balanceService.addBalance(
          click.user.id,
          40,
          TransactionType.CLICK_REWARD,
          click.id,
          `Reward for clicking on ${click.product.name}`,
        );

        await queryRunner.commitTransaction();
        return click;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    throw new BadRequestException('Payment not confirmed');
  }

  async getPartnerProducts(partnerId: string) {
    return this.productsRepository.find({
      where: { partner: { id: partnerId } },
      relations: ['clicks', 'orders'],
      order: { createdAt: 'DESC' },
    });
  }
}

