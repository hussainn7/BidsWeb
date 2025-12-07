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

  // Create test products - add products if count is less than 30
  const productCount = await productRepository.count();
  
  if (productCount < 30) {
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
      {
        name: 'СМАРТФОН APPLE IPHONE 15 PRO MAX',
        description: 'Новейший смартфон с процессором A17 Pro, камерой 48 МП и дисплеем Super Retina XDR.',
        price: 129900,
        minPrice: 99900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'НОУТБУК MACBOOK PRO 16 ДЮЙМОВ',
        description: 'Мощный ноутбук с чипом M3 Max, 32 ГБ памяти и дисплеем Liquid Retina XDR.',
        price: 249900,
        minPrice: 199900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'НАУШНИКИ AIRPODS PRO 2',
        description: 'Беспроводные наушники с активным шумоподавлением и пространственным звуком.',
        price: 24900,
        minPrice: 18900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ПЛАНШЕТ IPAD AIR 11 ДЮЙМОВ',
        description: 'Универсальный планшет с чипом M2, дисплеем Liquid Retina и поддержкой Apple Pencil.',
        price: 69900,
        minPrice: 54900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'УМНЫЕ ЧАСЫ APPLE WATCH SERIES 9',
        description: 'Спортивные умные часы с датчиком пульса, GPS и защитой от воды до 50 метров.',
        price: 44900,
        minPrice: 34900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'КРОССОВКИ NIKE AIR MAX 90',
        description: 'Классические кроссовки с технологией Air для максимального комфорта при ходьбе.',
        price: 12900,
        minPrice: 9900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'КУРТКА THE NORTH FACE DOWN',
        description: 'Теплая пуховая куртка с водонепроницаемым покрытием. Идеальна для холодной погоды.',
        price: 18900,
        minPrice: 14900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'СУМКА LOUIS VUITTON NEVERFULL',
        description: 'Элегантная сумка из натуральной кожи с фирменным логотипом. Классический дизайн.',
        price: 159000,
        minPrice: 129000,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ОЧКИ RAY-BAN AVIATOR',
        description: 'Легендарные солнцезащитные очки с поляризованными линзами и металлической оправой.',
        price: 12900,
        minPrice: 9900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ДУХИ CHANEL N°5',
        description: 'Классический аромат с нотами иланг-иланга, нероли и ванили. Объем 100 мл.',
        price: 12900,
        minPrice: 9900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'КОФЕМАШИНА DELONGHI ESPRESSO',
        description: 'Профессиональная кофемашина для приготовления эспрессо и капучино дома.',
        price: 45900,
        minPrice: 34900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'РОБОТ-ПЫЛЕСОС IROBOT ROOMBA',
        description: 'Умный робот-пылесос с навигацией и автоматической зарядкой. Работает до 2 часов.',
        price: 39900,
        minPrice: 29900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ТЕЛЕВИЗОР SAMSUNG QLED 65 ДЮЙМОВ',
        description: '4K телевизор с технологией QLED, HDR10+ и встроенным искусственным интеллектом.',
        price: 129900,
        minPrice: 99900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ИГРОВАЯ КОНСОЛЬ PLAYSTATION 5',
        description: 'Новейшая игровая консоль с поддержкой 4K, ray tracing и SSD накопителем.',
        price: 69900,
        minPrice: 54900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ВЕЛОСИПЕД TREK MOUNTAIN BIKE',
        description: 'Горный велосипед с алюминиевой рамой, дисковыми тормозами и 21 передачей.',
        price: 89900,
        minPrice: 69900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ФОТОАППАРАТ CANON EOS R6',
        description: 'Зеркальная камера с матрицей 20 МП, стабилизацией изображения и 4K видеосъемкой.',
        price: 199900,
        minPrice: 159900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ГИТАРА FENDER STRATOCASTER',
        description: 'Легендарная электрогитара с тремя звукоснимателями и тремоло системой.',
        price: 89900,
        minPrice: 69900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'МАССАЖНОЕ КРЕСЛО OSIM',
        description: 'Электрическое массажное кресло с функциями разминания, постукивания и вибрации.',
        price: 149900,
        minPrice: 119900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'БЕГОВАЯ ДОРОЖКА PROFORM',
        description: 'Электрическая беговая дорожка с наклоном до 12%, дисплеем и встроенными программами.',
        price: 89900,
        minPrice: 69900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ХОЛОДИЛЬНИК BOSCH NO FROST',
        description: 'Двухкамерный холодильник с системой No Frost, объемом 350 литров и классом A+++.',
        price: 79900,
        minPrice: 59900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'СТИРАЛЬНАЯ МАШИНА LG FRONT LOAD',
        description: 'Стиральная машина с фронтальной загрузкой, объемом 8 кг и технологией Direct Drive.',
        price: 59900,
        minPrice: 44900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'МУЛЬТИВАРКА REDMOND',
        description: 'Универсальная мультиварка с объемом 5 литров, 15 программами и отложенным стартом.',
        price: 12900,
        minPrice: 9900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'МИКРОВОЛНОВКА SAMSUNG',
        description: 'Микроволновая печь с объемом 25 литров, грилем и функцией разморозки.',
        price: 8900,
        minPrice: 6900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ПЫЛЕСОС DYSON V15',
        description: 'Беспроводной пылесос с лазерной подсветкой, мощностью 230 AW и фильтром HEPA.',
        price: 69900,
        minPrice: 54900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'УВЛАЖНИТЕЛЬ ВОЗДУХА BONECO',
        description: 'Ультразвуковой увлажнитель воздуха с объемом 4.5 литра и ионизацией.',
        price: 12900,
        minPrice: 9900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'МАТРАС TEMPUR ORTHOPEDIC',
        description: 'Ортопедический матрас с эффектом памяти формы. Размер 160x200 см.',
        price: 129900,
        minPrice: 99900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ПОДУШКА TEMPUR COMFORT',
        description: 'Ортопедическая подушка с эффектом памяти формы для комфортного сна.',
        price: 8900,
        minPrice: 6900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ПОСТЕЛЬНОЕ БЕЛЬЕ ИЗ САТИНА',
        description: 'Роскошное постельное белье из сатина, комплект 1.5 спальное место. 100% хлопок.',
        price: 4900,
        minPrice: 3900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ПОЛОТЕНЦЕ БАННОЕ BAMBOO',
        description: 'Большое банное полотенце из бамбукового волокна, размер 100x150 см.',
        price: 2900,
        minPrice: 1900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ШАМПУНЬ KERASTASE',
        description: 'Профессиональный шампунь для волос с кератином. Объем 250 мл.',
        price: 2900,
        minPrice: 1900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'КРЕМ ДЛЯ ЛИЦА LA MER',
        description: 'Роскошный крем для лица с морскими водорослями. Объем 30 мл.',
        price: 15900,
        minPrice: 12900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'СЕРЬГИ С БРИЛЛИАНТАМИ 0.5 КАРАТ',
        description: 'Элегантные серьги с бриллиантами огранки круг. Белое золото 585 пробы.',
        price: 89000,
        minPrice: 69000,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
      {
        name: 'ЦЕПОЧКА ЗОЛОТАЯ 585 ПРОБЫ',
        description: 'Тонкая золотая цепочка длиной 50 см. Идеально подходит для подвесок.',
        price: 18900,
        minPrice: 14900,
        isActive: true,
        isSold: false,
        imageUrl: undefined,
        partner: partner,
      },
    ];

    // Only add products that don't exist yet
    for (const productData of products) {
      const existingProduct = await productRepository.findOne({ 
        where: { name: productData.name } 
      });
      
      if (!existingProduct) {
        const product = productRepository.create(productData);
        await productRepository.save(product);
        console.log('✅ Product created:', product.name);
      }
    }
    
    console.log(`✅ Total products in database: ${await productRepository.count()}`);
  } else {
    console.log('ℹ️  Products already exist (30+), skipping product creation');
  }

  await dataSource.destroy();
  console.log('✅ Seeding completed!');
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});

