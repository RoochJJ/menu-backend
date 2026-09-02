import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SpotService } from './spot.service';
import { Spot } from './spot.entity';
import { CreateSpotDto } from './dto/create-spot';
import { UpdateSpotDto } from './dto/update-spot';

@Controller('spots')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Get()
  findall(): Promise<Spot[]> {
    return this.spotService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<Spot> {
    return this.spotService.findOne(id);
  }

  @Post()
  create(
    @Body()
    dto: CreateSpotDto,
  ): Promise<Spot> {
    return this.spotService.create(dto);
  }
  
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body()
    dto: UpdateSpotDto,
  ): Promise<Spot> {
    return this.spotService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<void> {
    return this.spotService.remove(id);
  }
}
