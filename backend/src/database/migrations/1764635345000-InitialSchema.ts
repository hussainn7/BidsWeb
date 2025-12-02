import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1764635345000 implements MigrationInterface {
    name = 'InitialSchema1764635345000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enums first
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'partner', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'paid', 'cancelled', 'refunded')`);
        await queryRunner.query(`CREATE TYPE "public"."balance_transactions_type_enum" AS ENUM('click_reward', 'order_payment', 'refund', 'manual_adjustment', 'payout')`);

        // Create tables
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "fullName" character varying,
                "balance" numeric(10,2) NOT NULL DEFAULT '0',
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
                "partnerId" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )`
        );

        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "minPrice" numeric(10,2) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "isSold" boolean NOT NULL DEFAULT false,
                "imageUrl" character varying,
                "clickCount" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "partnerId" uuid,
                CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"),
                CONSTRAINT "FK_6b2d9c7b3f3e3e3e3e3e3e3e3e3" FOREIGN KEY ("partnerId") REFERENCES "users"("id") ON DELETE CASCADE
            )`
        );

        await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "orderNumber" character varying NOT NULL,
                "amount" numeric(10,2) NOT NULL,
                "balanceUsed" numeric(10,2) NOT NULL DEFAULT '0',
                "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending',
                "paymentId" character varying,
                "receiptUrl" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "paidAt" TIMESTAMP,
                "userId" uuid,
                "productId" uuid,
                CONSTRAINT "UQ_3e1e12ed5e0251830a9d8e283b8" UNIQUE ("orderNumber"),
                CONSTRAINT "PK_710e2d4957aa5878dfe0e9b3b36" PRIMARY KEY ("id"),
                CONSTRAINT "FK_151b79a83ba240b0cb31b2302d4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_28faa6f6a5dda9c3a8c7e3e3e3e3" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
            )`
        );

        await queryRunner.query(`
            CREATE TABLE "clicks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "priceBefore" numeric(10,2) NOT NULL,
                "priceAfter" numeric(10,2) NOT NULL,
                "amountPaid" numeric(10,2) NOT NULL,
                "paymentId" character varying,
                "isPaid" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                "productId" uuid,
                CONSTRAINT "PK_27f99ed1b3b1b8da2f9a9c3f1a9" PRIMARY KEY ("id"),
                CONSTRAINT "FK_9b9b3c2b3e3e3e3e3e3e3e3e3e3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_9b9b3c2b3e3e3e3e3e3e3e3e3e4" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
            )`
        );

        await queryRunner.query(`
            CREATE TABLE "balance_transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" "public"."balance_transactions_type_enum" NOT NULL,
                "amount" numeric(10,2) NOT NULL,
                "balanceBefore" numeric(10,2) NOT NULL,
                "balanceAfter" numeric(10,2) NOT NULL,
                "referenceId" character varying,
                "description" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_9b9b3c2b3e3e3e3e3e3e3e3e3e3" PRIMARY KEY ("id"),
                CONSTRAINT "FK_9b9b3c2b3e3e3e3e3e3e3e3e3e5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balance_transactions" DROP CONSTRAINT "FK_9b9b3c2b3e3e3e3e3e3e3e3e3e5"`);
        await queryRunner.query(`ALTER TABLE "clicks" DROP CONSTRAINT "FK_9b9b3c2b3e3e3e3e3e3e3e3e3e4"`);
        await queryRunner.query(`ALTER TABLE "clicks" DROP CONSTRAINT "FK_9b9b3c2b3e3e3e3e3e3e3e3e3e3"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_28faa6f6a5dda9c3a8c7e3e3e3e3"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d4"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_6b2d9c7b3f3e3e3e3e3e3e3e3e3"`);
        
        await queryRunner.query(`DROP TABLE "balance_transactions"`);
        await queryRunner.query(`DROP TABLE "clicks"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "users"`);
        
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."balance_transactions_type_enum"`);
    }
}
