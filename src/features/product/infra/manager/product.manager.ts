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
  CreateProductSectionResponse,
} from '@features/product/core/dto/out/product.out';
import { ProductContainer } from '@features/product/core/entity/productContainer.entity';
import { ProductRepository } from '@features/product/core/repository/product.repository';
import { ProductSection } from '@features/product/core/entity/productSection.entity';

@Injectable()
export class ProductManager implements ProductRepository {
  constructor(
    @InjectRepository(ProductContainer, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly containerRepository: Repository<ProductContainer>,

    @InjectRepository(ProductSection, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly sectionRepository: Repository<ProductSection>,
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
    const buildQuery = this.sectionRepository
      .createQueryBuilder('ps')
      .where('ps.productContainerId = :containerId', { containerId });

    return buildQuery.getMany();
  }

  async createSection(entry: ProductSection): Promise<CreateProductSectionResponse> {
    const section = this.sectionRepository.create(entry);
    const result = await this.sectionRepository.save(section);

    return { id: result.id };
  }
}
