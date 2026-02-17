import { CreateStoreRequest, FindStoreRequest } from '@features/store/core/dto/in/store.in';
import { CreateStoreResponse } from '@features/store/core/dto/out/store.out';
import { Store } from '@features/store/core/entity/store.entity';
import { StoreService } from '@features/store/core/store.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreBridge {
  constructor(private readonly storeService: StoreService) {}

  async findById(id: string): Promise<Store | null> {
    return this.storeService.findById(id);
  }

  async finBasic(request: FindStoreRequest): Promise<Partial<Store> | null> {
    return this.storeService.finBasic(request);
  }

  async create(request: CreateStoreRequest): Promise<CreateStoreResponse> {
    return this.storeService.create(request);
  }
}
