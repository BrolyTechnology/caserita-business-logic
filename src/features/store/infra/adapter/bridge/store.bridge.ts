import { CreateStoreRequest } from '@features/store/core/dto/in/store.in';
import { CreateStoreResponse } from '@features/store/core/dto/out/store.out';
import { StoreService } from '@features/store/core/store.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreBridge {
  constructor(private readonly storeService: StoreService) {}

  async findById(id: string) {
    return this.storeService.findById(id);
  }

  async create(request: CreateStoreRequest): Promise<CreateStoreResponse> {
    return this.storeService.create(request);
  }
}
