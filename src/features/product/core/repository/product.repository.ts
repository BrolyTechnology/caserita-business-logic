import { CreateProductContainerRequest, FindProductContainerRequest } from '../dto/in/product.int';
import {
  CreateProductContainerResponse,
  CreateProductResponse,
  CreateProductSectionResponse,
  CreateProductVariantResponse,
} from '../dto/out/product.out';
import { Product } from '../entity/product.entity';
import { ProductContainer } from '../entity/productContainer.entity';
import { ProductSection } from '../entity/productSection.entity';
import { ProductVariant } from '../entity/productVariant.entity';

export abstract class ProductRepository {
  // Product Container
  abstract findContainerById(id: string): Promise<ProductContainer | null>;
  abstract findContainersByStore(entry: FindProductContainerRequest): Promise<ProductContainer[]>;
  abstract createContainer(entry: ProductContainer): Promise<CreateProductContainerResponse>;

  // Product Section
  abstract findSectionById(id: string): Promise<ProductSection | null>;
  abstract findSectionsByContainer(containerId: string): Promise<ProductSection[]>;
  abstract createSection(entry: ProductSection): Promise<CreateProductSectionResponse>;
  abstract updateSection(sectionId: string, entry: Partial<ProductSection>): Promise<void>;
  abstract deleteSection(sectionId: string): Promise<void>;

  // Product
  abstract findProductById(id: string): Promise<Product | null>;
  abstract findProductsBySection(sectionId: string): Promise<Product[]>;
  abstract createProduct(entry: Product): Promise<CreateProductResponse>;
  abstract updateProduct(productId: string, entry: Partial<Product>): Promise<void>;
  abstract deleteProduct(productId: string): Promise<void>;

  // Product Variant
  abstract createVariant(entry: ProductVariant): Promise<CreateProductVariantResponse>;
  abstract updateVariant(variantId: string, entry: Partial<ProductVariant>): Promise<void>;
  abstract deleteVariant(variantId: string): Promise<void>;
}
