import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductContainerValidator {
  @IsUUID()
  @IsNotEmpty()
  public storeId: string;
}

export class CreateProductSectionValidator {
  @IsUUID()
  @IsNotEmpty()
  public productContainerId: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;
}

export class UpdateProductSectionValidator{
  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public description?: string;
}

class ToggleProductVariantValidator {
  @IsString()
  @IsNotEmpty()
  public label: string;

  @IsNumber()
  @Type(() => Number)
  public basePrice?: number;

  @IsNumber()
  @Type(() => Number)
  public comparePrice?: number;
}

export class ToggleProductValidator {
  @IsUUID()
  @IsNotEmpty()
  public productSectionId: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  public imageUrl?: string;

  @IsBoolean()
  @IsNotEmpty()
  public hasVariations: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public basePrice?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public comparePrice?: number;

  @IsBoolean()
  @IsNotEmpty()
  public isFeatured: boolean;

  @IsOptional()
  @Type(() => ToggleProductVariantValidator)
  public productVariants?: ToggleProductVariantValidator[];
}

