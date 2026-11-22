import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { GuestCheck } from '../../guest-checks/guest-check.entity';
import { OrderItem } from './order-item.entity';
import { decimalNumber } from '../../../common/decimal-number';

export enum OrderStatus {
  NEW = 'NEW',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Comanda à qual o pedido pertence
  @ManyToOne(() => GuestCheck, (guestCheck) => guestCheck.orders, { nullable: false })
  @JoinColumn({ name: 'guest_check_id' })
  guestCheck: Relation<GuestCheck>;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalNumber })
  total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW,
  })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: Relation<OrderItem>[];
}