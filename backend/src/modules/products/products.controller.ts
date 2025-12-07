import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClickProductDto } from './dto/click-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('isActive') isActive?: string) {
    return this.productsService.findAll(isActive === 'true');
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.productsService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER, UserRole.ADMIN)
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productsService.create(createProductDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER, UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productsService.update(id, updateProductDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/click')
  async clickProduct(@Param('id') id: string, @Request() req) {
    return this.productsService.clickProduct(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/click/:clickId/confirm')
  async confirmClickPayment(
    @Param('id') id: string,
    @Param('clickId') clickId: string,
    @Body() body: { paymentId: string },
  ) {
    return this.productsService.confirmClickPayment(clickId, body.paymentId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER, UserRole.ADMIN)
  @Get('partner/my-products')
  async getMyProducts(@Request() req) {
    return this.productsService.getPartnerProducts(req.user.id);
  }
}
