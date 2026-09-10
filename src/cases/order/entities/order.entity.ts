import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GuestCheck } from "../../guest-checks/guest-check.entity";
import { OrderItem } from "./order-item.entity";

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
    createdAt: Date

    @ManyToMany(() => OrderItem)
    @JoinColumn([{ name: 'order_items' }])  
    guestCheckId: string;


    guestCheck: GuestCheck;

    @Column({ type: 'enum', enum: OrderStatus, precision: 10, scale: 2 })
    total: number;

    @Column({ 
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.NEW,
    })
    status: string;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

} 