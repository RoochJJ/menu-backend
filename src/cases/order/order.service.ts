import { BadGatewayException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto, CreateOrderItemDto } from "./dto/create-order";
import { Order, OrderStatus } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { GuestCheckService } from "../guest-checks/guest-check.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductService } from "../products/product.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status";

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

  private async prepareItems(dto: CreateOrderItemDto): Promise<OrderItem> {
    const product = await this.productService.findOne(dto.productId);
    const subtotal = dto.quantity * product.price;

    return this.orderItemRepository.create({
      product,
      quantity: dto.quantity,
      subtotal
    });

  }

  async create(dto: CreateOrderDto): Promise<Order> {
    // Regra 1: Verificar se tem comanda aberta para a mesa
    const guestCheck = await this.guestCheckService.findOrCreateOpened(dto.spotId);

    // Monta o totalizador do pedido
    const items: OrderItem[] = [];
    let total = 0;

    for (const itemDto of dto.items) {
      const item = await this.prepareItems(itemDto); // prepara para inserir no banco
      items.push(item);
      total += Number(item.subtotal)
    }

    // Monta o Pedido
    const order = this.orderRepository.create({
      guestCheck,
      status: OrderStatus.NEW,
      total,
      items
    })

    // gravar no banco o pedido
    return this.orderRepository.save(order);
  }

  findAll (): Promise<Order[]> {
    return this.orderRepository.find({
      order: {createdAt: 'ASC'}
    });
  }
  
      async findOne(id: string): Promise<Order> {
          const order= await this.orderRepository.findOneBy({ id });
  
            if (!order) {
              throw new NotFoundException(`Pedido não encontrada!`);
          }
  
              return order;
  
      }

      async updateStatus(id: string, dto: UpdateOrderStatusDto): 
       Promise<Order>{
        const order = await this.findOne (id);


        const nextStatus: Record<OrderStatus, OrderStatus | undefined> = {
          [OrderStatus.NEW]: OrderStatus.PREPARING,
          [OrderStatus.PREPARING]: OrderStatus.READY,
          [OrderStatus.READY]: OrderStatus.DELIVERED,
          [OrderStatus.DELIVERED]: undefined
        }
        // Verifique se a transição pedido e a proprio validadq
        if (nextStatus[order.status] !== dto.status){
          throw new BadGatewayException ('Satus Invalido!');
        }

        // Força a mudança de Status
        order.status = dto.status;

        // Grava alteração no banco
        return this.orderRepository.save(order);
      }
  
}