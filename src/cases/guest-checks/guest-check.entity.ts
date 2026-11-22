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
import { Spot } from '../spots/spot.entity';
import { Order } from '../order/entities/order.entity';

export enum GuestCheckStatus {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED',
}

@Entity('guest-checks')
export class GuestCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: GuestCheckStatus,
    default: GuestCheckStatus.OPENED,
  })
  status: GuestCheckStatus;

  @ManyToOne(() => Spot, { nullable: false })
  @JoinColumn({ name: 'spot_id' })
  spot: Spot;

  // Pedidos feitos nesta comanda
  @OneToMany(() => Order, (order) => order.guestCheck)
  orders: Relation<Order>[];

  // Valor acumulado da comanda (soma dos pedidos). Calculado, não é coluna.
  total?: number;
}