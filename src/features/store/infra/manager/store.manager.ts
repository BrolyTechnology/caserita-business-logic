import { Injectable } from '@nestjs/common';
import { StoreRepository } from '@features/store/core/repository/store.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseConnectionType } from 'broly-software-core/packages/common-database';
import { HashTransformer } from 'broly-software-core/packages/common-encrypted';
import { Store } from '@features/store/core/entity/store.entity';
import { CreateStoreResponse } from '@features/store/core/dto/out/store.out';

@Injectable()
export class StoreManager implements StoreRepository {
  constructor(
    @InjectRepository(Store, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly repository: Repository<Store>,
    private readonly hashTransformer: HashTransformer,
  ) {}

  async findById(id: string): Promise<Store | null> {
    return this.repository.findOne({ where: { id, isDeleted: false } });
  }

  async isUnique(entry: Record<string, string>): Promise<boolean> {
    return this.repository
      .createQueryBuilder('st')
      .where('st.documentNumber_index = :documentNumber_index', {
        ruc_index: this.hashTransformer.to(entry.documentNumber),
      })
      .orWhere(`st.email_index = :email_index`, {
        email_index: this.hashTransformer.to(entry.email),
      })
      .where('st.isDeleted = :isDeleted', { isDeleted: false })
      .getExists();
  }

  async create(entry: Store): Promise<CreateStoreResponse> {
    const store = this.repository.create(entry);
    const result = await this.repository.save(store);

    return { id: result.id };
  }
}
