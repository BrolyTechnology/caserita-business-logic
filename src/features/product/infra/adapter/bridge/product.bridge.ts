import {
  CreateProductContainerRequest,
  CreateProductSectionRequest,
  FindProductContainerRequest,
} from '@features/product/core/dto/in/product.int';
import {
  CreateProductContainerResponse,
  CreateProductSectionResponse,
} from '@features/product/core/dto/out/product.out';
import { ProductContainer } from '@features/product/core/entity/productContainer.entity';
import { ProductSection } from '@features/product/core/entity/productSection.entity';
import { ProductService } from '@features/product/core/product.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductBridge {
  constructor(private readonly productService: ProductService) {}

  // Product Container
  async findContainerById(id: string): Promise<ProductContainer | null> {
    return this.productService.findContainerById(id);
  }

  async findContainersByStore(entry: FindProductContainerRequest): Promise<ProductContainer[]> {
    return this.productService.findContainersByStore(entry);
  }

  async createContainer(
    request: CreateProductContainerRequest,
  ): Promise<CreateProductContainerResponse> {
    return this.productService.createContainer(request);
  }

  // Product Section
  async findSectionById(id: string): Promise<ProductSection | null> {
    return this.productService.findSectionById(id);
  }

  async findSectionsByContainer(containerId: string): Promise<ProductSection[]> {
    return this.productService.findSectionsByContainer({ productContainerId: containerId });
  }

  async createSection(request: CreateProductSectionRequest): Promise<CreateProductSectionResponse> {
    return this.productService.createSection(request);
  }
}
