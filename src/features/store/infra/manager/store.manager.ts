import { Injectable } from '@nestjs/common';
import { StoreRepository } from '@features/store/core/repository/store.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseConnectionType } from 'broly-software-core/packages/common-database';
import { HashTransformer } from 'broly-software-core/packages/common-encrypted';
import { Store } from '@features/store/core/entity/store.entity';
import { StoreLocation } from '@features/store/core/entity/storeLocation.entity';
import { CreateStoreResponse } from '@features/store/core/dto/out/store.out';
import { FindStoreRequest } from '@features/store/core/dto/in/store.in';
import { toStoreBasic } from '@features/store/core/mapper/store.mapper';
import { BaseCreateResponse } from '@shared/interfaces/out/base.out';
import { StoreHours } from '@features/store/core/entity/storeHours.entity';

@Injectable()
export class StoreManager implements StoreRepository {
  constructor(
    @InjectRepository(Store, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly repository: Repository<Store>,

    @InjectRepository(StoreLocation, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly locationRepository: Repository<StoreLocation>,

    @InjectRepository(StoreHours, DatabaseConnectionType.POSTGRES_CONNECTION)
    private readonly storeHoursRepository: Repository<StoreHours>,

    private readonly hashTransformer: HashTransformer,
  ) {}
  // Store
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

    if (!result) return null;
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

  // Store location
  async findLocationByStore(storeId: string): Promise<StoreLocation | null> {
    return this.locationRepository.findOne({ where: { storeId } });
  }

  async createLocation(entry: Partial<StoreLocation>): Promise<BaseCreateResponse> {
    const location = this.locationRepository.create(entry);
    const result = await this.locationRepository.save(location);

    return { id: result.id };
  }

  async updateLocation(id: string, entry: Partial<StoreLocation>): Promise<void> {
    await this.locationRepository.update({ id }, entry);
  }

  // Store hours
  async findAllStoreHours(storeId: string): Promise<StoreHours[]> {
    return this.storeHoursRepository.find({
      where: { storeId },
      order: { closesAt: 'DESC' }
    });
  }

  async findStoreHours(id: string): Promise<StoreHours | null> {
    return this.storeHoursRepository.findOne({ where: { id } });
  }

  async createStoreHours(entry: Partial<StoreHours>): Promise<BaseCreateResponse> {
    const hours = this.storeHoursRepository.create(entry);
    const result = await this.storeHoursRepository.save(hours);

    return { id: result.id }
  }

  async updateStoreHours(id: string, entry: Partial<StoreHours>): Promise<void> {
    await this.storeHoursRepository.update({ id }, entry);
  }

  async deleteStoreHours(id: string): Promise<void> {
    await this.storeHoursRepository.delete(id);
  }
}
