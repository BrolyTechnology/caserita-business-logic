import { AuthService } from '@features/auth/core/auth.service';
import { GenerateTokenRequest, VerifyTokenRequest } from '@features/auth/core/dto/in/auth.in';
import { GenerateTokenResponse, VerifyTokenResponse } from '@features/auth/core/dto/out/auth.out';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthBridge {
  constructor(private readonly authService: AuthService) {}

  async generateToken(request: GenerateTokenRequest): Promise<GenerateTokenResponse> {
    return this.authService.generateToken(request);
  }

  async verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    return this.authService.verifyToken(request);
  }
}
