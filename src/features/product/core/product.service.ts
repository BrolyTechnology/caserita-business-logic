import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { StoreBridge } from '@features/store/infra/adapter/bridge/store.bridge';
import { ProductRepository } from './repository/product.repository';
import { ProductContainer } from './entity/productContainer.entity';
import { CreateProductContainerRequest, FindProductContainerRequest } from './dto/in/product.int';
import { CreateProductContainerResponse } from './dto/out/product.out';
import { CONTAINER_PRODUCT_NAME } from './utils/contants.util';
import { RpcException } from '@nestjs/microservices';
import { CatalogExeptionCode, getExpetionMessage } from '@shared/catalogs/exception.catalog';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly repository: ProductRepository,
    private readonly storeBridge: StoreBridge,
  ) {}

  async findContainerById(id: string): Promise<ProductContainer | null> {
    return this.repository.findContainerById(id);
  }

  async findContainersByStore(entry: FindProductContainerRequest): Promise<ProductContainer[]> {
    return this.repository.findContainersByStore(entry);
  }

  async createContainer(
    entry: CreateProductContainerRequest,
  ): Promise<CreateProductContainerResponse> {
    const container = new ProductContainer();

    const store = await this.storeBridge.findById(entry.storeId);

    if (!store) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        errorCode: CatalogExeptionCode.ERROR_STORE_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_STORE_NOT_FOUND),
      });
    }

    container.storeId = entry.storeId;
    container.name = `${CONTAINER_PRODUCT_NAME}_${store.documentNumber}`;

    return this.repository.createContainer(container);
  }
}
