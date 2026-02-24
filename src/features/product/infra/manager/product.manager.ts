import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseConnectionType } from 'broly-software-core/packages/common-database';
import {
  CreateProductContainerRequest,
  FindProductContainerRequest,
} from '@features/product/core/dto/in/product.int';
import {
  CreateProductContainerResponse,
  CreateProductResponse,
  CreateProductSectionResponse,
  CreateProductVariantResponse,
} from '@features/product/core/dto/out/product.out';
import { ProductContainer } from '@features/product/core/entity/productContainer.entity';
import { ProductRepository } from '@features/product/core/repository/product.repository';
import { ProductSection } from '@features/product/core/entity/productSection.entity';
import { Product } from '@features/product/core/entity/product.entity';
import { ProductVariant } from '@features/product/core/entity/productVariant.entity';

@Injectable()
export class ProductManager implements ProductRepository {
  constructor(
    @InjectRepository(ProductContainer, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly containerRepository: Repository<ProductContainer>,

    @InjectRepository(ProductSection, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly sectionRepository: Repository<ProductSection>,

    @InjectRepository(Product, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductVariant, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}
  // Product Container
  async findContainerById(id: string): Promise<ProductContainer | null> {
    return this.containerRepository.findOne({ where: { id } });
  }

  async findContainersByStore(entry: FindProductContainerRequest): Promise<ProductContainer[]> {
    const buildQuery = this.containerRepository
      .createQueryBuilder('pc')
      .where('pc.storeId = :storeId', { storeId: entry.storeId });

    return buildQuery.getMany();
  }

  async createContainer(
    entry: CreateProductContainerRequest,
  ): Promise<CreateProductContainerResponse> {
    const container = this.containerRepository.create(entry);
    const result = await this.containerRepository.save(container);

    return { id: result.id };
  }

  // Product Section
  async findSectionById(id: string): Promise<ProductSection | null> {
    return this.sectionRepository.findOne({ where: { id } });
  }

  async findSectionsByContainer(containerId: string): Promise<ProductSection[]> {
    return this.sectionRepository.find({
      where: { productContainerId: containerId },
      order: { createdAt: 'ASC' },
    });
  }

  async createSection(entry: ProductSection): Promise<CreateProductSectionResponse> {
    const section = this.sectionRepository.create(entry);
    const result = await this.sectionRepository.save(section);

    return { id: result.id };
  }

  async updateSection(sectionId: string, entry: Partial<ProductSection>): Promise<void> {
    await this.sectionRepository.update(sectionId, entry);
  }

  async deleteSection(sectionId: string): Promise<void> {
    await this.sectionRepository.delete(sectionId);
  }

  // Product
  async findProductById(id: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async findProductsBySection(sectionId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { productSectionId: sectionId },
      relations: ['productVariants'],
      order: {
        createdAt: 'DESC',
        productVariants: {
          createdAt: 'ASC',
        },
      },
    });
  }

  async createProduct(entry: Product): Promise<CreateProductResponse> {
    const product = this.productRepository.create(entry);
    const result = await this.productRepository.save(product);

    return { id: result.id };
  }

  async updateProduct(productId: string, entry: Partial<Product>): Promise<void> {
    await this.productRepository.update(productId, entry);
  }

  async deleteProduct(productId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['productVariants'],
    });

    if (product?.productVariants?.length) {
      for (const v of product?.productVariants) {
        await this.variantRepository.delete(v.id);
      }
    }

    await this.productRepository.delete(productId);
  }

  // Product Variant
  async createVariant(entry: ProductVariant): Promise<CreateProductVariantResponse> {
    const variant = this.variantRepository.create(entry);
    const result = await this.variantRepository.save(variant);

    return { id: result.id };
  }

  async updateVariant(variantId: string, entry: Partial<ProductVariant>): Promise<void> {
    await this.variantRepository.update(variantId, entry);
  }

  async deleteVariant(variantId: string): Promise<void> {
    await this.variantRepository.delete(variantId);
  }
}
