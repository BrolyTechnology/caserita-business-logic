import { Module } from '@nestjs/common';
import { StoreEntityModule } from './core/entity/store.entity.module';
import { StoreService } from './core/store.service';
import { StoreBridge } from './infra/adapter/bridge/store.bridge';
import { StoreRepository } from './core/repository/store.repository';
import { StoreManager } from './infra/manager/store.manager';
import { StoreController } from './infra/adapter/store.controller';

@Module({
  imports: [StoreEntityModule],
  providers: [StoreBridge, StoreService, { provide: StoreRepository, useClass: StoreManager }],
  controllers: [StoreController],
  exports: [StoreBridge, StoreEntityModule],
})
export class StoreModule {}
