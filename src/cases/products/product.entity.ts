import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { decimalNumber } from '../../common/decimal-number';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60, nullable: false })
  name: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalNumber })
  price: number;

  @Column({ type: 'text', nullable: true })
  picture: string | null;

  @Column({ type: 'boolean', default: false })
  vegetarian: boolean;

  @Column({ name: 'is_new', type: 'boolean', default: false })
  isNew: boolean;

  // Ao excluir a categoria, o produto fica sem categoria
  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;
}

export { Category };