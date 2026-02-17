import { Injectable } from '@nestjs/common';
import { StoreRepository } from '@features/store/core/repository/store.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseConnectionType } from 'broly-software-core/packages/common-database';
import { HashTransformer } from 'broly-software-core/packages/common-encrypted';
import { Store } from '@features/store/core/entity/store.entity';
import { CreateStoreResponse } from '@features/store/core/dto/out/store.out';
import { FindStoreRequest } from '@features/store/core/dto/in/store.in';
import { toStoreBasic } from '@features/store/core/mapper/store.mapper';

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

  async findBasic(entry: FindStoreRequest): Promise<Partial<Store> | null> {
    const buildQuery = this.repository
      .createQueryBuilder('st')
      .select(['st.id', 'st.documentType', 'st.documentNumber', 'st.companyName', 'st.comercialName', 'st.email', 'st.phone', 'st.password', 'st.constitutionDate', 'st.personType', 'st.planType', 'st.isPublished', 'st.createdAt', 'st.updatedAt'])
      .where('st.isDeleted = :isDeleted', { isDeleted: false });

    if (entry.documentNumber) {
      buildQuery.andWhere('st.documentNumber_index = :documentNumber_index', {
        documentNumber_index: this.hashTransformer.to(entry.documentNumber),
      });
    }

    if (entry.email) {
      buildQuery.andWhere('st.email_index = :email_index', {
        email_index: this.hashTransformer.to(entry.email),
      });
    }

    const result = await buildQuery.getOne();

    if (!result) return null
    return toStoreBasic(result);
  }

  async isUnique(entry: Record<string, string>): Promise<boolean> {
    return this.repository
      .createQueryBuilder('st')
      .where('st.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('st.documentNumber_index = :documentNumber_index', {
        documentNumber_index: this.hashTransformer.to(entry.documentNumber),
      })
      .orWhere(`st.email_index = :email_index`, {
        email_index: this.hashTransformer.to(entry.email),
      })
      .getExists();
  }

  async create(entry: Store): Promise<CreateStoreResponse> {
    const store = this.repository.create(entry);
    const result = await this.repository.save(store);

    return { id: result.id };
  }
}
