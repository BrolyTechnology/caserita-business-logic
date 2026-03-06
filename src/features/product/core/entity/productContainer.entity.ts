import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductSection } from './productSection.entity';

@Entity({ name: 'productContainer' })
export class ProductContainer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'Reference to the store that owns this container',
    type: 'uuid',
    nullable: false,
  })
  storeId: string;

  @Column({ comment: 'Container display name', type: 'varchar', nullable: false })
  name: string;

  @Column({
    comment: 'Cover image URL for this container',
    type: 'text',
    nullable: true,
    default: null,
  })
  coverUrl?: string;

  @Column({
    comment: 'Indicates if this container belongs to a publisher',
    type: 'boolean',
    default: false,
  })
  isPublisher: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @OneToMany(() => ProductSection, (section) => section.productContainer)
  productSections?: ProductSection[];
}
