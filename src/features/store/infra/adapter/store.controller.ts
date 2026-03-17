import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ValidateBody } from 'broly-software-core/packages/cdecorator';
import { StoreBridge } from './bridge/store.bridge';
import {
  CreateInputValidator,
  UpSertStoreHoursValidator,
  UpSertStoreLocationValidator,
} from '../validator/store.validator';
import type {
  CreateStoreRequest,
  UpSertStoreHoursRequest,
  UpSertStoreLocationRequest,
} from '@features/store/core/dto/in/store.in';

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
  async createLocation(
    @ValidateBody(UpSertStoreLocationValidator) request: UpSertStoreLocationRequest,
  ) {
    return this.storeBridge.createLocation(request);
  }

  @Put('/location/update')
  @HttpCode(HttpStatus.OK)
  async updateLocation(
    @ValidateBody(UpSertStoreLocationValidator) request: UpSertStoreLocationRequest,
  ) {
    return this.storeBridge.updateLocation(request);
  }

  // Store hours
  @Get('/:storeId/hours')
  @HttpCode(HttpStatus.OK)
  async findAllStoreHours(@Param('storeId') storeId: string) {
    return this.storeBridge.findAllStoreHours(storeId);
  }

  @Get('/hours/:id')
  @HttpCode(HttpStatus.OK)
  async findStoreHours(@Param('id') id: string) {
    return this.storeBridge.findStoreHours(id);
  }

  @Post('/hours/create')
  @HttpCode(HttpStatus.CREATED)
  async createStoreHours(
    @ValidateBody(UpSertStoreHoursValidator) request: UpSertStoreHoursRequest,
  ) {
    return this.storeBridge.createStoreHours(request);
  }

  @Put('/hours/:id/update')
  @HttpCode(HttpStatus.OK)
  async updateStoreHours(
    @Param('id') id: string,
    @ValidateBody(UpSertStoreHoursValidator) request: UpSertStoreHoursRequest,
  ) {
    return this.storeBridge.updateStoreHours(id, request);
  }

  @Delete('/hours/:id/delete')
  @HttpCode(HttpStatus.OK)
  async deleteStoreHours(@Param('id') id: string) {
    return this.storeBridge.deleteStoreHours(id);
  }
}
