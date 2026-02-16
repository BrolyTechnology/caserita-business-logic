import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocumentTypeEnum } from '@shared/interfaces/document.enum';

export class CreateInputValidator {
  @IsString()
  @IsNotEmpty()
  @IsEnum(DocumentTypeEnum)
  public documentType: DocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  public documentNumber: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsBoolean()
  public termsAndConditions: boolean;
}
