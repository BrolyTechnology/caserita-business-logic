import {
  CreateProductContainerRequest,
  ToggleProductRequest,
  CreateProductSectionRequest,
  FindProductContainerRequest,
  UpdateProductSectionRequest,
} from '@features/product/core/dto/in/product.int';
import {
  CreateProductContainerResponse,
  CreateProductResponse,
  CreateProductSectionResponse,
} from '@features/product/core/dto/out/product.out';
import { Product } from '@features/product/core/entity/product.entity';
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

  async updateSection(sectionId: string, request: UpdateProductSectionRequest): Promise<void> {
    return this.productService.updateSection(sectionId, request);
  }

  async deleteSection(sectionId: string): Promise<void> {
    return this.productService.deleteSection(sectionId);
  }

  // Product
  async findProductById(id: string): Promise<Product | null> {
    return this.productService.findProductById(id);
  }

  async findProductsBySection(sectionId: string): Promise<Product[]> {
    return this.productService.findProductsBySection(sectionId);
  }

  async createProduct(request: ToggleProductRequest): Promise<CreateProductResponse> {
    return this.productService.createProduct(request);
  }

  async updateProduct(id: string, request: ToggleProductRequest): Promise<void> {
    return this.productService.updateProduct(id, request);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }

  // Product Variant
  async deleteVariant(variantId: string): Promise<void> {
    return this.productService.deleteVariant(variantId);
  }
}
