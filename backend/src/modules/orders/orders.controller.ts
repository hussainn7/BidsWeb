import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  async findAll(@Request() req) {
    // Regular users see only their orders, admins see all
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.ordersService.findOne(id, userId);
  }

  @Post(':id/confirm-payment')
  async confirmPayment(@Param('id') id: string, @Body() body: { paymentId: string }) {
    return this.ordersService.confirmPayment(id, body.paymentId);
  }
}


