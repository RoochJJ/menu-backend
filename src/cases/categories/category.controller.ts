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
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category';
import { UpdateCategoryDto } from './dto/update-category.';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findall(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Post()
  create(
    @Body()
    dto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body()
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, dto);
  }
  
  @Delete(':id')
  @HttpCode(204)
  delete(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<void> {
    return this.categoryService.remove(id);
  }
}
