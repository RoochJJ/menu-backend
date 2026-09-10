import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GuestCheck, Spot } from './guest-check.entity';
import { GuestCheckService } from './guest-check.service';
import { GuestCheckController } from './guest-check.controller';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      GuestCheck,
      Spot,
    ]),
  ],
  controllers: [GuestCheckController],
  providers: [GuestCheckService],
  exports: [GuestCheckService],
})
export class GuestCheckModule {}