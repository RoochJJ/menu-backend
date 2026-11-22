import { Body, Controller, Get, Param, ParseEnumPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order';
import { UpdateOrderStatusDto } from './dto/update-order-status';
import { Order, OrderStatus } from './entities/order.entity';
import { GuestCheckStatus } from '../guest-checks/guest-check.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.service.create(dto);
  }

  // Filtros opcionais: ?status=NEW  ?guestCheckId=<uuid>  ?guestCheckStatus=OPENED
  @Get()
  findAll(
    @Query('status', new ParseEnumPipe(OrderStatus, { optional: true }))
    status?: OrderStatus,
    @Query('guestCheckId', new ParseUUIDPipe({ optional: true }))
    guestCheckId?: string,
    @Query('guestCheckStatus', new ParseEnumPipe(GuestCheckStatus, { optional: true }))
    guestCheckStatus?: GuestCheckStatus,
  ): Promise<Order[]> {
    return this.service.findAll({ status, guestCheckId, guestCheckStatus });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return this.service.findOne(id);
  }

  // PATCH /orders/:id/status  body: { "status": "PREPARING" }
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.service.updateStatus(id, dto);
  }
}