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
import { ProductSectionTypeEnum } from './types/productSectionType.enum';
import { ProductSectionDisplayModeEnum } from './types/productSectionDisplayMode.enum';
import { ProductContainer } from './productContainer.entity';
import { Product } from './product.entity';

@Entity({ name: 'productSections' })
export class ProductSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'Reference to the parent container', type: 'uuid', nullable: false })
  productContainerId: string;

  @Column({ comment: 'Section display name', type: 'varchar', nullable: false })
  name: string;

  @Column({ comment: 'Section description', type: 'varchar', nullable: true, default: null })
  description?: string;

  @Column({
    comment: 'Type of section (e.g. FEATURED, REGULAR, PROMOTIONAL)',
    type: 'enum',
    enum: ProductSectionTypeEnum,
    nullable: false,
    default: ProductSectionTypeEnum.REGULAR,
  })
  type: ProductSectionTypeEnum;

  @Column({
    comment: 'How products in this section are displayed (e.g. GRID, LIST, CAROUSEL)',
    type: 'enum',
    enum: ProductSectionDisplayModeEnum,
    nullable: false,
    default: ProductSectionDisplayModeEnum.GRID,
  })
  displayMode: ProductSectionDisplayModeEnum;

  @Column({ comment: 'Whether this section is active and visible', type: 'boolean', default: true })
  isEnabled: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @ManyToOne(() => ProductContainer, (container) => container.productSections)
  @JoinColumn({ name: 'productContainerId' })
  productContainer?: ProductContainer;

  @OneToMany(() => Product, (product) => product.productSection)
  products?: Product[];
}
