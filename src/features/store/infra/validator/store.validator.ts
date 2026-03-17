import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { DocumentTypeEnum } from '@shared/interfaces/document.enum';
import { regex } from '@shared/utils/regex.util';
import { DayOfWeek } from '@features/store/core/entity/types/dayOfWeek.enum';
import { Type } from 'class-transformer';

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

class LatLngLiteral {
  @IsNotEmpty()
  @IsNumber()
  public lat: number;

  @IsNotEmpty()
  @IsNumber()
  public lng: number;
}

export class UpSertStoreLocationValidator {
  @IsString()
  @IsNotEmpty()
  public storeId: string;

  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsString()
  @IsNotEmpty()
  public reference: string;

  @IsObject()
  @IsNotEmpty()
  public addressPointCoordinates: LatLngLiteral;
}

export class UpSertStoreHoursValidator {
  @IsString()
  @IsNotEmpty()
  public storeId: string;

  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  @IsNotEmpty()
  public dayOfWeek: DayOfWeek[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public opensAt: Date | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public closesAt: Date | null;

  @IsBoolean()
  @IsNotEmpty()
  public isAllDay: boolean;

  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;
}
