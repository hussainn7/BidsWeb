import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Product } from '../modules/products/entities/product.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { Click } from '../modules/products/entities/click.entity';
import { BalanceTransaction } from '../modules/balance/entities/balance-transaction.entity';
import { UserRole } from '../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'figma_replica',
    entities: [User, Product, Order, Click, BalanceTransaction],
    synchronize: false,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const productRepository = dataSource.getRepository(Product);

  // Create admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  let admin = await userRepository.findOne({ where: { email: adminEmail } });
  
  if (!admin) {
    admin = userRepository.create({
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      fullName: 'Admin User',
      role: UserRole.ADMIN,
      balance: 0,
    });
    admin = await userRepository.save(admin);
    console.log('✅ Admin user created:', adminEmail);
  }

  // Create partner user
  const partnerEmail = process.env.SEED_PARTNER_EMAIL || 'partner@example.com';
  const partnerPassword = process.env.SEED_PARTNER_PASSWORD || 'partner123';
  let partner = await userRepository.findOne({ where: { email: partnerEmail } });
  
  if (!partner) {
    partner = userRepository.create({
      email: partnerEmail,
      password: await bcrypt.hash(partnerPassword, 10),
      fullName: 'Partner User',
      role: UserRole.PARTNER,
      balance: 0,
    });
    partner = await userRepository.save(partner);
    console.log('✅ Partner user created:', partnerEmail);
  }

  // Create test products
  const productCount = await productRepository.count();
  
  if (productCount === 0) {
    const products = [
      {
        name: 'КОЛЬЦО С ДРАГОЦЕННЫМ КАМНЕМ 1 КАРАТ 14К ЗОЛОТО',
        description: 'Красивое золотое кольцо с драгоценным камнем. Идеальный подарок для особого случая.',
        price: 4600,
        minPrice: 2844,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'СЕРЕБРЯНЫЕ СЕРЬГИ С ЖЕМЧУГОМ',
        description: 'Элегантные серебряные серьги с натуральным жемчугом. Классический дизайн.',
        price: 3200,
        minPrice: 2000,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ЗОЛОТОЙ БРАСЛЕТ С ГРАВИРОВКОЙ',
        description: 'Стильный золотой браслет с возможностью гравировки. Уникальный дизайн.',
        price: 5500,
        minPrice: 3500,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ПЛАТИНОВОЕ ОЖЕРЕЛЬЕ С БРИЛЛИАНТАМИ',
        description: 'Роскошное платиновое ожерелье с бриллиантами. Эксклюзивное украшение.',
        price: 12000,
        minPrice: 8000,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ЗОЛОТЫЕ ЧАСЫ ШВЕЙЦАРСКИЕ',
        description: 'Элитные швейцарские золотые часы. Точность и стиль в одном изделии.',
        price: 8500,
        minPrice: 5500,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'СЕРЕБРЯНЫЙ КУЛОН С ИЗУМРУДОМ',
        description: 'Изысканный серебряный кулон с натуральным изумрудом. Уникальный дизайн.',
        price: 2800,
        minPrice: 1800,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ЗОЛОТОЙ ПЕРСТЕНЬ С РУБИНОМ',
        description: 'Великолепный золотой перстень с рубином. Символ роскоши и элегантности.',
        price: 4200,
        minPrice: 2600,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ЖЕМЧУЖНОЕ ОЖЕРЕЛЬЕ ДЛИННОЕ',
        description: 'Классическое длинное жемчужное ожерелье. Вечная классика.',
        price: 3800,
        minPrice: 2400,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
    ];

    for (const productData of products) {
      const product = productRepository.create(productData);
      await productRepository.save(product);
      console.log('✅ Product created:', product.name);
    }
  } else {
    console.log('ℹ️  Products already exist, skipping product creation');
  }

  await dataSource.destroy();
  console.log('✅ Seeding completed!');
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});

