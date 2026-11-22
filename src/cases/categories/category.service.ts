import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category';
import { UpdateCategoryDto } from './dto/update-category';
import { deleteUse } from '../../common/delete-use';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Lista ordenando pela ordem de exibição e, em caso de empate, pelo nome
  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: { displayOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada!');
    }

    return category;
  }

  create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({
      name: dto.name.trim(),
      icon: dto.icon ?? null,
      displayOrder: dto.displayOrder ?? 0,
      active: dto.active ?? true,
    });

    return this.categoryRepository.save(category);
  }

  // Atualiza só os campos que vieram na requisição
  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.name !== undefined) {
      category.name = dto.name.trim();
    }
    if (dto.icon !== undefined) {
      category.icon = dto.icon;
    }
    if (dto.displayOrder !== undefined) {
      category.displayOrder = dto.displayOrder;
    }
    if (dto.active !== undefined) {
      category.active = dto.active;
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    await deleteUse(
      () => this.categoryRepository.remove(category),
      'Não é possível excluir: a categoria está em uso.',
    );
  }
}