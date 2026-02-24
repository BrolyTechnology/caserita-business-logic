import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CatalogExeptionCode, getExpetionMessage } from '@shared/catalogs/exception.catalog';
import { StoreBridge } from '@features/store/infra/adapter/bridge/store.bridge';
import {
  CreateProductContainerRequest,
  CreateProductSectionRequest,
  FindProductContainerRequest,
  FindProductSectionRequest,
  ToggleProductRequest,
  UpdateProductSectionRequest,
} from './dto/in/product.int';
import { CreateProductContainerResponse, CreateProductResponse } from './dto/out/product.out';
import { CONTAINER_PRODUCT_NAME } from './utils/contants.util';
import { ProductRepository } from './repository/product.repository';
import { ProductContainer } from './entity/productContainer.entity';
import { ProductSection } from './entity/productSection.entity';
import { Product } from './entity/product.entity';
import { ProductVariant } from './entity/productVariant.entity';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly repository: ProductRepository,
    private readonly storeBridge: StoreBridge,
  ) {}

  // Product Container
  async findContainerById(id: string): Promise<ProductContainer | null> {
    return this.repository.findContainerById(id);
  }

  async findContainersByStore(entry: FindProductContainerRequest): Promise<ProductContainer[]> {
    return this.repository.findContainersByStore(entry);
  }

  async createContainer(
    request: CreateProductContainerRequest,
  ): Promise<CreateProductContainerResponse> {
    const container = new ProductContainer();

    const store = await this.storeBridge.findById(request.storeId);

    if (!store) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        errorCode: CatalogExeptionCode.ERROR_STORE_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_STORE_NOT_FOUND),
      });
    }

    container.storeId = request.storeId;
    container.name = `${CONTAINER_PRODUCT_NAME}_${store.documentNumber}`;

    return this.repository.createContainer(container);
  }

  // Product Section
  async findSectionById(id: string): Promise<ProductSection | null> {
    return this.repository.findSectionById(id);
  }

  async findSectionsByContainer(request: FindProductSectionRequest): Promise<ProductSection[]> {
    return this.repository.findSectionsByContainer(request.productContainerId);
  }

  async createSection(
    request: CreateProductSectionRequest,
  ): Promise<CreateProductContainerResponse> {
    const container = await this.repository.findContainerById(request.productContainerId);

    if (!container) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        errorCode: CatalogExeptionCode.ERR_PRODUCT_CONTAINER_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERR_PRODUCT_CONTAINER_NOT_FOUND),
      });
    }

    const section = new ProductSection();

    section.productContainerId = container.id;
    section.name = request.name;
    section.description = request.description;

    return this.repository.createSection(section);
  }

  async updateSection(sectionId: string, request: UpdateProductSectionRequest): Promise<void> {
    const section = await this.findSectionById(sectionId);

    if (!section) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        errorCode: CatalogExeptionCode.ERR_PRODUCT_SECTION_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERR_PRODUCT_SECTION_NOT_FOUND),
      });
    }

    await this.repository.updateSection(sectionId, request);
  }

  async deleteSection(sectionId: string): Promise<void> {
    const section = await this.findSectionById(sectionId);

    if (!section) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        errorCode: CatalogExeptionCode.ERR_PRODUCT_SECTION_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERR_PRODUCT_SECTION_NOT_FOUND),
      });
    }

    const products = await this.repository.findProductsBySection(sectionId);

    if (products.length) {
      this.logger.log(
        `Deleting ${products.length} products associated with the section ${sectionId}`,
      );

      for (const p of products) {
        await this.repository.deleteProduct(p.id);
      }
    }

    await this.repository.deleteSection(sectionId);
  }

  // Product
  async findProductById(id: string): Promise<Product | null> {
    return this.repository.findProductById(id);
  }

  async findProductsBySection(sectionId: string) {
    return this.repository.findProductsBySection(sectionId);
  }

  async createProduct(entry: ToggleProductRequest): Promise<CreateProductResponse> {
    const product = new Product();
    const productVariants: ProductVariant[] = [];

    product.productSectionId = entry.productSectionId;
    product.name = entry.name;
    product.description = entry.description;
    product.imageUrl = entry.imageUrl;
    product.hasVariations = entry.hasVariations;
    product.isFeatured = entry.isFeatured;

    if (entry.hasVariations) {
      this.logger.log('Creating product with variations');

      for (const v of entry.productVariants!) {
        const variant = new ProductVariant();
        variant.label = v.label;
        variant.basePrice = v.basePrice;
        variant.comparePrice = v.comparePrice;
        productVariants.push(variant);
      }
    } else {
      product.basePrice = entry.basePrice;
      product.comparePrice = entry.comparePrice;
    }

    product.productVariants = productVariants;

    return this.repository.createProduct(product);
  }

  async updateProduct(id: string, request: ToggleProductRequest): Promise<void> {
    const product = await this.findProductById(id);

    if (!product) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        errorCode: CatalogExeptionCode.ERROR_PRODUCT_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_PRODUCT_NOT_FOUND),
      });
    }

    product.name = request.name;
    product.description = request.description;
    product.imageUrl = request.imageUrl;
    product.hasVariations = request.hasVariations;
    product.isFeatured = request.isFeatured;

    if (request.hasVariations) {
      product.basePrice = null;
      product.comparePrice = null;

      for (const v of request.productVariants!) {
        const variant = new ProductVariant();

        variant.productId = product.id;
        variant.label = v.label;
        variant.basePrice = v.basePrice;
        variant.comparePrice = v.comparePrice;

        if (v.id) {
          await this.repository.updateVariant(v.id, variant);
        } else {
          await this.repository.createVariant(variant);
        }
      }
    } else {
      product.basePrice = request.basePrice;
      product.comparePrice = request.comparePrice;
    }

    await this.repository.updateProduct(id, product);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.findProductById(id);

    if (!product) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        errorCode: CatalogExeptionCode.ERROR_PRODUCT_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_PRODUCT_NOT_FOUND),
      });
    }

    await this.repository.deleteProduct(id);
  }

  // Product Variant
  async deleteVariant(variantId: string): Promise<void> {
    return this.repository.deleteVariant(variantId);
  }
}
