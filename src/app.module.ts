import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonLoggerModule } from 'broly-software-core/packages/common-logger';
import { CommonResponseModule } from 'broly-software-core/packages/common-response';
import {
  CommonDatabaseModule,
  DatabaseConnectionType,
  DatabaseEnumType,
} from 'broly-software-core/packages/common-database';
import {
  CommonEncryptedModule,
  EncryptedProviderType,
  HashTransformer,
  ValueTransformer,
} from 'broly-software-core/packages/common-encrypted';
import { schemaEnvVars } from '@shared/context/envs.validate';
import { FeaturesModule } from './features/features.module';
import { Store } from '@features/store/core/entity/store.entity';
import { columnsStoreEncrypt } from '@features/store/core/entity/store.entity.module';
import { ProductContainer } from '@features/product/core/entity/productContainer.entity';
import { ProductSection } from '@features/product/core/entity/productSection.entity';
import { Product } from '@features/product/core/entity/product.entity';
import { ProductVariant } from '@features/product/core/entity/productVariant.entity';
import { StoreLocation } from '@features/store/core/entity/storeLocation.entity';
import { StoreHours } from '@features/store/core/entity/storeHours.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.development.local'],
      validationSchema: schemaEnvVars,
    }),
    CommonLoggerModule,
    CommonResponseModule,
    CommonDatabaseModule.register([
      {
        name: DatabaseConnectionType.POSTGRES_CONNECTION,
        type: DatabaseEnumType.POSTGES,
        entities: [Store, StoreLocation, StoreHours, ProductContainer, ProductSection, Product, ProductVariant],
        imports: [CommonEncryptedModule.register(EncryptedProviderType.DATABASE)],
        inject: [ValueTransformer, HashTransformer],
        columnsTransformers: [...columnsStoreEncrypt],
      },
    ]),
    FeaturesModule.register(),
  ],
})
export class AppModule {}
