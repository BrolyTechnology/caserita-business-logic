import { CreateProductContainerRequest, FindProductContainerRequest } from '../dto/in/product.int';
import { CreateProductContainerResponse } from '../dto/out/product.out';
import { ProductContainer } from '../entity/productContainer.entity';

export abstract class ProductRepository {
  // Product Container
  abstract findContainerById(id: string): Promise<ProductContainer | null>;
  abstract findContainersByStore(entry: FindProductContainerRequest): Promise<ProductContainer[]>;
  abstract createContainer(entry: CreateProductContainerRequest): Promise<CreateProductContainerResponse>;
}
