import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balanceToUse?: number;
}

