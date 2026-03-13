import { Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ValidateBody } from 'broly-software-core/packages/cdecorator';
import { StoreBridge } from './bridge/store.bridge';
import { CreateInputValidator, UpSertStoreLocationValidator } from '../validator/store.validator';
import type { CreateStoreRequest, UpSertStoreLocationRequest } from '@features/store/core/dto/in/store.in';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeBridge: StoreBridge) {}

  // Store location
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return this.storeBridge.findById(id);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@ValidateBody(CreateInputValidator) request: CreateStoreRequest) {
    return this.storeBridge.create(request);
  }

  // Store location
  @Get('/locations/:storeId')
  @HttpCode(HttpStatus.OK)
  async findLocationByStore(@Param('storeId') storeId: string) {
    return this.storeBridge.findLocationByStore(storeId);
  }

  @Post('/location/create')
  @HttpCode(HttpStatus.CREATED)
  async createLocation(@ValidateBody(UpSertStoreLocationValidator) request: UpSertStoreLocationRequest) {
    return this.storeBridge.createLocation(request);
  }

  @Put('/location/update')
  @HttpCode(HttpStatus.OK)
  async updateLocation(@ValidateBody(UpSertStoreLocationValidator) request: UpSertStoreLocationRequest) {
    return this.storeBridge.updateLocation(request)
  }
}
