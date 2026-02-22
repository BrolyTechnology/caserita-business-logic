import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ProductBridge } from './bridge/product.bridge';
import { ValidateBody } from 'broly-software-core/packages/cdecorator';
import type { CreateProductContainerRequest } from '@features/product/core/dto/in/product.int';
import { CreateProductContainerValidator } from '../validator/product.validator';

@Controller('products')
export class ProductContainerController {
  constructor(private readonly productBridge: ProductBridge) {}

  @Get('/containers/:id')
  @HttpCode(HttpStatus.OK)
  async findContainerById(@Param('id') id: string) {
    return this.productBridge.findContainerById(id);
  }

  @Get('/containers/store/:storeId')
  @HttpCode(HttpStatus.OK)
  async findContainersByStore(@Param('storeId') storeId: string) {
    return this.productBridge.findContainersByStore({ storeId });
  }

  @Post('/containers/create')
  @HttpCode(HttpStatus.CREATED)
  async createContainer(@ValidateBody(CreateProductContainerValidator) request: CreateProductContainerRequest) {
    return this.productBridge.createContainer(request);
  }
}
