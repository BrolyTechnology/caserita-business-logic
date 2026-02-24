import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { DocumentTypeEnum } from '@shared/interfaces/document.enum';
import { regex } from '@shared/utils/regex.util';

export class CreateInputValidator {
  @IsString()
  @IsNotEmpty()
  @IsEnum(DocumentTypeEnum)
  public documentType: DocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  @Matches(regex.ruc, {
    message: 'The RUC must begin with 10 or 20 and have exactly 11 numerical digits',
  })
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
