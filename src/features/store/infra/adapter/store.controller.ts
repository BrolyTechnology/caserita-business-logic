import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ValidateBody } from 'broly-software-core/packages/cdecorator';
import { StoreBridge } from './bridge/store.bridge';
import { CreateInputValidator } from '../validator/store.validator';
import type { CreateStoreRequest } from '@features/store/core/dto/in/store.in';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeBridge: StoreBridge) {}

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
}
