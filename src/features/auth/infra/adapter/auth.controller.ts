import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthBridge } from './bridge/auth.bridge';
import { ValidateParams } from 'broly-software-core/packages/cdecorator';
import type { GenerateTokenRequest, VerifyTokenRequest } from '@features/auth/core/dto/in/auth.in';
import { GenerateTokeInputValidator, VerifyTokenInputValidator } from '../validator/auth.validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authBridge: AuthBridge) {}

  @Get('/store/:documentNumber/:password')
  @HttpCode(HttpStatus.OK)
  async generateToken(@ValidateParams(GenerateTokeInputValidator) params: GenerateTokenRequest) {
    return this.authBridge.generateToken(params);
  }

  @Get('/verify/:token')
  @HttpCode(HttpStatus.OK)
  verifyToken(@ValidateParams(VerifyTokenInputValidator) params: VerifyTokenRequest) {
    return this.authBridge.verifyToken(params);
  }
}
