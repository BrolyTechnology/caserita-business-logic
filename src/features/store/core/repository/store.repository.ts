import { BaseCreateResponse } from '@shared/interfaces/out/base.out';
import { FindStoreRequest } from '../dto/in/store.in';
import { CreateStoreResponse } from '../dto/out/store.out';
import { Store } from '../entity/store.entity';
import { StoreLocation } from '../entity/storeLocation.entity';
import { StoreHours } from '../entity/storeHours.entity';

export abstract class StoreRepository {
  // Store
  abstract findById(id: string): Promise<Store | null>;
  abstract findBasic(entry: FindStoreRequest): Promise<Partial<Store> | null>;
  abstract isUnique(entry: Record<string, string>): Promise<boolean>;
  abstract create(entry: Store): Promise<CreateStoreResponse>;

  // Store location
  abstract findLocationByStore(storeId: string): Promise<StoreLocation | null>;
  abstract createLocation(entry: Partial<StoreLocation>): Promise<BaseCreateResponse>;
  abstract updateLocation(id: string, entry: Partial<StoreLocation>): Promise<void>;

  // Store hours
  abstract findAllStoreHours(storeId: string): Promise<StoreHours[]>;
  abstract findStoreHours(id: string): Promise<StoreHours | null>;
  abstract createStoreHours(entry: Partial<StoreHours>): Promise<BaseCreateResponse>;
  abstract updateStoreHours(id: string, entry: Partial<StoreHours>): Promise<void>;
  abstract deleteStoreHours(id: string): Promise<void>;
}
