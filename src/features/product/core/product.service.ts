import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CatalogExeptionCode, getExpetionMessage } from '@shared/catalogs/exception.catalog';
import { StoreBridge } from '@features/store/infra/adapter/bridge/store.bridge';
import {
  CreateProductContainerRequest,
  CreateProductSectionRequest,
  FindProductContainerRequest,
  FindProductSectionRequest,
} from './dto/in/product.int';
import { CreateProductContainerResponse } from './dto/out/product.out';
import { CONTAINER_PRODUCT_NAME } from './utils/contants.util';
import { ProductRepository } from './repository/product.repository';
import { ProductContainer } from './entity/productContainer.entity';
import { ProductSection } from './entity/productSection.entity';

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
}
