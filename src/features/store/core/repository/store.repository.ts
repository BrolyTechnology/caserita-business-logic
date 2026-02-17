import { FindStoreRequest } from '../dto/in/store.in';
import { CreateStoreResponse } from '../dto/out/store.out';
import { Store } from '../entity/store.entity';

export abstract class StoreRepository {
  abstract findById(id: string): Promise<Store | null>;
  abstract findBasic(entry: FindStoreRequest): Promise<Partial<Store> | null>;
  abstract isUnique(entry: Record<string, string>): Promise<boolean>;
  abstract create(entry: Store): Promise<CreateStoreResponse>;
}
