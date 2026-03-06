import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'productVariant' })
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'Reference to the product this variant belongs to',
    type: 'uuid',
    nullable: false,
  })
  productId: string;

  @Column({ comment: 'Variant label (e.g. Size L, Color Red)', type: 'varchar', nullable: false })
  label: string;

  @Column({
    comment: 'Variant selling base price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: false,
  })
  basePrice: number;

  @Column({
    comment: 'Original price before discount, for comparison display',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    default: null,
  })
  comparePrice?: number;

  @Column({ comment: 'Available stock for this specific variant', type: 'int', default: 0 })
  stock: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @ManyToOne(() => Product, (product) => product.productVariants)
  @JoinColumn({ name: 'productId' })
  product?: Product;
}
