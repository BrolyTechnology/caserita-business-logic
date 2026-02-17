import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTokeInputValidator {
  @IsString()
  @IsNotEmpty()
  public documentNumber: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class VerifyTokenInputValidator {
  @IsString()
  @IsNotEmpty()
  public token: string;
}
