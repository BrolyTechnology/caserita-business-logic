import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductTypeEnum } from './types/productType.enum';
import { ProductSection } from './productSection.entity';
import { ProductVariant } from './productVariant.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'Reference to the section this product belongs to',
    type: 'uuid',
    nullable: false,
  })
  productSectionId: string;

  @Column({ comment: 'Product display name', type: 'varchar', nullable: false })
  name: string;

  @Column({ comment: 'Product description', type: 'varchar', nullable: true, default: null })
  description?: string;

  @Column({
    comment: 'Product type (PHYSICAL, DIGITAL, SERVICE)',
    type: 'enum',
    enum: ProductTypeEnum,
    nullable: false,
    default: ProductTypeEnum.PHYSICAL,
  })
  type: ProductTypeEnum;

  @Column({
    comment: 'Stock keeping unit identifier',
    type: 'varchar',
    nullable: true,
    default: null,
  })
  sku?: string;

  @Column({ comment: 'Main product image URL', type: 'text', nullable: true, default: null })
  imageUrl?: string;

  @Column({ comment: 'Available stock quantity', type: 'int', default: 0 })
  stock: number;

  @Column({
    comment: 'Whether this product has multiple variants',
    type: 'boolean',
    default: false,
  })
  hasVariations: boolean;

  @Column({
    comment: 'Base selling price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    default: null,
  })
  basePrice?: number | null;

  @Column({
    comment: 'Original price before discount, for comparison display',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    default: null,
  })
  comparePrice?: number | null;

  @Column({
    comment: 'Whether this product is highlighted/featured',
    type: 'boolean',
    default: false,
  })
  isFeatured: boolean;

  @Column({ comment: 'Whether this product is active and visible', type: 'boolean', default: true })
  isEnabled: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @ManyToOne(() => ProductSection, (section) => section.products)
  @JoinColumn({ name: 'productSectionId' })
  productSection?: ProductSection;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  productVariants?: ProductVariant[];
}
