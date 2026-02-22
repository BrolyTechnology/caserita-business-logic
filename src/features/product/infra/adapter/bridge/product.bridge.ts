import {
  CreateProductContainerRequest,
  FindProductContainerRequest,
} from '@features/product/core/dto/in/product.int';
import { CreateProductContainerResponse } from '@features/product/core/dto/out/product.out';
import { ProductContainer } from '@features/product/core/entity/productContainer.entity';
import { ProductService } from '@features/product/core/product.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductBridge {
  constructor(private readonly productService: ProductService) {}

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
}
