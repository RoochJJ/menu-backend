import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Product } from '../../products/product.entity';
import { Order } from './order.entity';
import { decimalNumber } from '../../../common/decimal-number';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'integer' })
  quantity: number;

  // Preço unitário do produto no momento do pedido
  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalNumber })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalNumber })
  subtotal: number;
}