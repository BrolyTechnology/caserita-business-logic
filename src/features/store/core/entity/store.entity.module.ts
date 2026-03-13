import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionType } from 'broly-software-core/packages/common-database';
import { Store } from './store.entity';
import { StoreLocation } from './storeLocation.entity';

export const columnsStoreEncrypt = ['documentNumber', 'documentNumber_index', 'email', 'email_index']

const postgresRepositoryModule = TypeOrmModule.forFeature([Store, StoreLocation], DatabaseConnectionType.POSTGRES_CONNECTION);

@Module({
  imports: [postgresRepositoryModule],
  exports: [postgresRepositoryModule],
})
export class StoreEntityModule {}
