import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

// Load environment variables from .env file
dotenv.config({ path: __dirname + '/../../.env' });
import { User } from '../modules/users/entities/user.entity';
import { Product } from '../modules/products/entities/product.entity';
import { Click } from '../modules/products/entities/click.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { BalanceTransaction } from '../modules/balance/entities/balance-transaction.entity';

// For NestJS application
export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_NAME', 'figma_replica'),
  entities: [
    User,
    Product,
    Click,
    Order,
    BalanceTransaction,
  ],
  synchronize: configService.get<string>('NODE_ENV', 'development') !== 'production',
  logging: configService.get<string>('NODE_ENV', 'development') === 'development',
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
});

// For TypeORM CLI migrations
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'braftedr',
  database: process.env.DB_NAME || 'figma_replica',
  entities: [
    User,
    Product,
    Click,
    Order,
    BalanceTransaction,
  ],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
