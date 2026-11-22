import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order';
import { UpdateOrderStatusDto } from './dto/update-order-status';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { GuestCheckService } from '../guest-checks/guest-check.service';
import { GuestCheckStatus } from '../guest-checks/guest-check.entity';
import { ProductService } from '../products/product.service';

type OrderFilters = {
  status?: OrderStatus;
  guestCheckId?: string;
  guestCheckStatus?: GuestCheckStatus;
};

// Arredonda para 2 casas decimais (centavos)
const round2 = (value: number) => Math.round(value * 100) / 100;

@Injectable()
export class OrderService {
  constructor(
    private readonly guestCheckService: GuestCheckService,
    private readonly productService: ProductService,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  // Monta um item do pedido com o preço atual do produto
  private async prepareItem(dto: CreateOrderItemDto): Promise<OrderItem> {
    const product = await this.productService.findOne(dto.productId);

    if (!product.active) {
      throw new BadRequestException(`O produto "${product.name}" está inativo`);
    }

    return this.orderItemRepository.create({
      product,
      quantity: dto.quantity,
      price: product.price,
      subtotal: round2(dto.quantity * product.price),
    });
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    // Regra 1: usa a comanda aberta da mesa ou abre uma nova
    const guestCheck = await this.guestCheckService.findOrCreateOpened(dto.spotId);

    const items: OrderItem[] = [];
    let total = 0;

    for (const itemDto of dto.items) {
      const item = await this.prepareItem(itemDto);
      items.push(item);
      total += item.subtotal;
    }

    const order = this.orderRepository.create({
      guestCheck,
      status: OrderStatus.NEW,
      total: round2(total),
      items,
    });

    const saved = await this.orderRepository.save(order);
    return this.findOne(saved.id);
  }

  findAll(filters: OrderFilters = {}): Promise<Order[]> {
    const { status, guestCheckId, guestCheckStatus } = filters;

    return this.orderRepository.find({
      where: {
        ...(status && { status }),
        ...((guestCheckId || guestCheckStatus) && {
          guestCheck: {
            ...(guestCheckId && { id: guestCheckId }),
            ...(guestCheckStatus && { status: guestCheckStatus }),
          },
        }),
      },
      relations: { guestCheck: { spot: true }, items: { product: true } },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { guestCheck: { spot: true }, items: { product: true } },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado!');
    }

    return order;
  }

  // As transições de status são livres: qualquer status pode ir para qualquer outro
  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);

    await this.orderRepository.update(id, { status: dto.status });
    order.status = dto.status;

    return order;
  }
}