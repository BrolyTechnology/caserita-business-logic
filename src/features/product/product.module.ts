import { Module } from '@nestjs/common';
import { StoreModule } from '@features/store/store.module';
import { ProductEntityModule } from './core/entity/product.entity.module';
import { ProductBridge } from './infra/adapter/bridge/product.bridge';
import { ProductService } from './core/product.service';
import { ProductRepository } from './core/repository/product.repository';
import { ProductManager } from './infra/manager/product.manager';
import { ProductContainerController } from './infra/adapter/product.controller';

@Module({
  imports: [StoreModule, ProductEntityModule],
  providers: [
    ProductBridge,
    ProductService,
    { provide: ProductRepository, useClass: ProductManager },
  ],
  controllers: [ProductContainerController],
  exports: [ProductBridge, ProductEntityModule],
})
export class ProductModule {}
