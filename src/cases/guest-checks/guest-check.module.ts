import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestCheck } from './guest-check.entity';
import { Spot } from '../spots/spot.entity';
import { GuestCheckService } from './guest-check.service';
import { GuestCheckController } from './guest-check.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GuestCheck, Spot])],
  controllers: [GuestCheckController],
  providers: [GuestCheckService],
  exports: [GuestCheckService],
})
export class GuestCheckModule {}