import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
