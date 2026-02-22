import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CatalogExeptionCode, getExpetionMessage } from '@shared/catalogs/exception.catalog';
import { StoreBridge } from '@features/store/infra/adapter/bridge/store.bridge';
import { GenerateTokenResponse, VerifyTokenResponse } from './dto/out/auth.out';
import { GenerateTokenRequest, VerifyTokenRequest } from './dto/in/auth.in';
import { Store } from '@features/store/core/entity/store.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly storeBridge: StoreBridge,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(request: GenerateTokenRequest): Promise<GenerateTokenResponse> {
    const store = await this.storeBridge.finBasic(request);

    if (!store) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: CatalogExeptionCode.ERROR_AUTH_STORE_NOT_EXIST,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_AUTH_STORE_NOT_EXIST),
      });
    }

    const isValidPassword = bcrypt.compareSync(request.password, store.password!);

    if (!isValidPassword) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        errorCode: CatalogExeptionCode.ERROR_AUTH_PASSWORD_INVALID,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_AUTH_PASSWORD_INVALID),
      });
    }

    const result = await this.jwtService.signAsync(this.generateStoreEncode(store));

    return { access_token: result };
  }

  private generateStoreEncode(input: Partial<Store>) {
    return {
      sub: input.id,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
      companyName: input.companyName,
      comercialName: input.comercialName,
      email: input.email,
      phone: input.phone,
      password: input.password,
      constitutionDate: input.constitutionDate,
      personType: input.personType,
      planType: input.planType,
      isPublished: input.isPublished,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    };
  }

  async verifyToken(request: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    return this.jwtService.verifyAsync(request.token).catch(() => {
      throw new RpcException({
        status: HttpStatus.FORBIDDEN,
        errorCode: CatalogExeptionCode.ERROR_TOKEN_ACCESS_INVALID,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_TOKEN_ACCESS_INVALID),
      });
    });;
  }
}
