import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductBridge } from './bridge/product.bridge';
import { ValidateBody } from 'broly-software-core/packages/cdecorator';
import type {
  CreateProductContainerRequest,
  CreateProductSectionRequest,
  ToggleProductRequest,
  UpdateProductSectionRequest,
} from '@features/product/core/dto/in/product.int';
import {
  CreateProductContainerValidator,
  CreateProductSectionValidator,
  ToggleProductValidator,
  UpdateProductSectionValidator,
} from '../validator/product.validator';

@Controller('products')
export class ProductContainerController {
  constructor(private readonly productBridge: ProductBridge) {}

  // Product Container
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
  async createContainer(
    @ValidateBody(CreateProductContainerValidator) request: CreateProductContainerRequest,
  ) {
    return this.productBridge.createContainer(request);
  }

  // Product Section
  @Get('/sections/:id')
  @HttpCode(HttpStatus.OK)
  async findSectionById(@Param('id') id: string) {
    return this.productBridge.findSectionById(id);
  }

  @Get('/sections/container/:containerId')
  @HttpCode(HttpStatus.OK)
  async findSectionsByContainer(@Param('containerId') containerId: string) {
    return this.productBridge.findSectionsByContainer(containerId);
  }

  @Post('/sections/create')
  @HttpCode(HttpStatus.CREATED)
  async createSection(
    @ValidateBody(CreateProductSectionValidator) request: CreateProductSectionRequest,
  ) {
    return this.productBridge.createSection(request);
  }

  @Patch('/sections/update/:id')
  @HttpCode(HttpStatus.OK)
  async updateSection(
    @Param('id') id: string,
    @ValidateBody(UpdateProductSectionValidator) request: UpdateProductSectionRequest,
  ) {
    return this.productBridge.updateSection(id, request);
  }

  @Delete('/sections/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteSection(@Param('id') id: string) {
    return this.productBridge.deleteSection(id);
  }

  // Product
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findProductById(@Param('id') id: string) {
    return this.productBridge.findProductById(id);
  }

  @Get('/section/:sectionId')
  @HttpCode(HttpStatus.OK)
  async findProductsBySection(@Param('sectionId') sectionId: string) {
    return this.productBridge.findProductsBySection(sectionId);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@ValidateBody(ToggleProductValidator) request: ToggleProductRequest) {
    return this.productBridge.createProduct(request);
  }

  @Put('/update/:id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: string,
    @ValidateBody(ToggleProductValidator) request: ToggleProductRequest,
  ) {
    return this.productBridge.updateProduct(id, request);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: string) {
    return this.productBridge.deleteProduct(id);
  }
  
  // Product Variant
  @Delete('/delete/variant/:variantId')
  @HttpCode(HttpStatus.OK)
  async deleteVariant(@Param('variantId') variantId: string) {
    return this.productBridge.deleteVariant(variantId);
  }
}
