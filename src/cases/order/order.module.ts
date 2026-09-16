/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/cases/products/product.entity";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { GuestCheck } from "src/cases/guest-checks/guest-check.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { GuestCheckModule } from "../guest-checks/guest-check.module";
import { ProductModule } from "../products/product.module";

@Module({
  imports: [
  GuestCheckModule,
  ProductModule,
   TypeOrmModule.forFeature([GuestCheck, Product, Order, OrderItem])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {

}