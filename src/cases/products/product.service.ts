import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product';
import { UpdateProductDto } from './dto/update-product';
import { deleteUse } from '../../common/delete-use';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Lista os produtos com a categoria; se vier categoryId, filtra por ela
  findAll(categoryId?: string): Promise<Product[]> {
    return this.productRepository.find({
      relations: { category: true },
      order: { name: 'ASC' },
      where: {
        ...(categoryId && { category: { id: categoryId } }),
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado!');
    }

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const category = dto.categoryId ? await this.getActiveCategory(dto.categoryId) : null;

    const product = this.productRepository.create({
      name: dto.name.trim(),
      description: dto.description ?? null,
      price: dto.price,
      picture: dto.picture ?? null,
      active: dto.active ?? true,
      vegetarian: dto.vegetarian ?? false,
      isNew: dto.isNew ?? false,
      category,
    });

    return this.productRepository.save(product);
  }

  // Atualiza só os campos que vieram na requisição
  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.name !== undefined) {
      product.name = dto.name.trim();
    }
    if (dto.description !== undefined) {
      product.description = dto.description;
    }
    if (dto.price !== undefined) {
      product.price = dto.price;
    }
    if (dto.picture !== undefined) {
      product.picture = dto.picture;
    }
    if (dto.active !== undefined) {
      product.active = dto.active;
    }
    if (dto.vegetarian !== undefined) {
      product.vegetarian = dto.vegetarian;
    }
    if (dto.isNew !== undefined) {
      product.isNew = dto.isNew;
    }
    if (dto.categoryId !== undefined) {
      product.category = dto.categoryId ? await this.getActiveCategory(dto.categoryId) : null;
    }

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);

    await deleteUse(
      () => this.productRepository.remove(product),
      'Não é possível excluir: o produto já foi usado em pedidos em aberto.',
    );
  }

  // Só aceita categoria que existe e está ativa
  private async getActiveCategory(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id, active: true });

    if (!category) {
      throw new NotFoundException('Nenhuma categoria foi encontrada!');
    }

    return category;
  }
}