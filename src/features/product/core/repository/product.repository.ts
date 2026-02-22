import { CreateProductContainerRequest, FindProductContainerRequest } from '../dto/in/product.int';
import { CreateProductContainerResponse, CreateProductSectionResponse } from '../dto/out/product.out';
import { ProductContainer } from '../entity/productContainer.entity';
import { ProductSection } from '../entity/productSection.entity';

export abstract class ProductRepository {
  // Product Container
  abstract findContainerById(id: string): Promise<ProductContainer | null>;
  abstract findContainersByStore(entry: FindProductContainerRequest): Promise<ProductContainer[]>;
  abstract createContainer(entry: ProductContainer): Promise<CreateProductContainerResponse>;

  // Product Section
  abstract findSectionById(id: string): Promise<ProductSection | null>;
  abstract findSectionsByContainer(containerId: string): Promise<ProductSection[]>;
  abstract createSection(entry: ProductSection): Promise<CreateProductSectionResponse>;
}
