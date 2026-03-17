import {
  CreateStoreRequest,
  FindStoreRequest,
  UpSertStoreHoursRequest,
  UpSertStoreLocationRequest,
} from '@features/store/core/dto/in/store.in';
import { CreateStoreResponse } from '@features/store/core/dto/out/store.out';
import { Store } from '@features/store/core/entity/store.entity';
import { StoreLocation } from '@features/store/core/entity/storeLocation.entity';
import { StoreService } from '@features/store/core/store.service';
import { Injectable } from '@nestjs/common';
import { BaseCreateResponse } from '@shared/interfaces/out/base.out';

@Injectable()
export class StoreBridge {
  constructor(private readonly storeService: StoreService) {}

  // Store
  async findById(id: string): Promise<Store | null> {
    return this.storeService.findById(id);
  }

  async finBasic(request: FindStoreRequest): Promise<Partial<Store> | null> {
    return this.storeService.finBasic(request);
  }

  async create(request: CreateStoreRequest): Promise<CreateStoreResponse> {
    return this.storeService.create(request);
  }

  // Store location
  async findLocationByStore(storeId: string): Promise<StoreLocation | null> {
    return this.storeService.findLocationByStore(storeId);
  }

  async createLocation(request: UpSertStoreLocationRequest): Promise<BaseCreateResponse> {
    return this.storeService.createLocation(request);
  }

  async updateLocation(request: UpSertStoreLocationRequest): Promise<void> {
    return this.storeService.updateLocation(request);
  }

  // Store hours
  async findAllStoreHours(storeId: string) {
    return this.storeService.findAllStoreHours(storeId);
  }

  async findStoreHours(id: string) {
    return this.storeService.findStoreHours(id);
  }

  async createStoreHours(request: UpSertStoreHoursRequest): Promise<BaseCreateResponse> {
    return this.storeService.createStoreHours(request);
  }

  async updateStoreHours(id: string, request: UpSertStoreHoursRequest): Promise<void> {
    return this.storeService.updateStoreHours(id, request);
  }

  async deleteStoreHours(id: string) {
    return this.storeService.deleteStoreHours(id);
  }
}
