import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductContainerValidator {
  @IsUUID()
  @IsNotEmpty()
  public storeId: string;
}
