import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionType } from 'broly-software-core/packages/common-database';
import { Store } from './store.entity';

export const columnsStoreEncrypt = ['documentNumber', 'documentNumber_index', 'email', 'email_index']

const postgresRepositoryModule = TypeOrmModule.forFeature([Store], DatabaseConnectionType.POSTGRES_CONNECTION);

@Module({
  imports: [postgresRepositoryModule],
  exports: [postgresRepositoryModule],
})
export class StoreEntityModule {}
