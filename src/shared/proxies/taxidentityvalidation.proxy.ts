import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from 'broly-software-core/packages/common-http';
import { FindCompanyByRucRequest, FindPersonByDniRequest } from './dto/in/taxidentityvalidation.in';
import { AxiosError, AxiosResponse } from 'axios';
import {
  FindCompanyByRucResponse,
  FindLegalRepresentativeByRucResponse,
  FindPersonByDniResponse,
} from './dto/out/taxidentityvalidation.out';
import { catchError, firstValueFrom, map } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TaxidentityvalidationProxy {
  private baseUrl: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('TAX_IDENTITY_VALIDATION_BASE_URL')!;
  }

  async findCompanyByRuc(
    input: FindCompanyByRucRequest,
  ): Promise<AxiosResponse<FindCompanyByRucResponse>> {
    return firstValueFrom(
      this.httpClient.get(`${this.baseUrl}/sunat/company/${input.ruc}`).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          throw new RpcException(error.response?.data!);
        }),
      ),
    );
  }

  async findLegalRepresentativeByRuc(
    input: FindCompanyByRucRequest,
  ): Promise<AxiosResponse<FindLegalRepresentativeByRucResponse[]>> {
    return firstValueFrom(
      this.httpClient.get(`${this.baseUrl}/sunat/representate/${input.ruc}`).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          throw new RpcException(error.response?.data!);
        }),
      ),
    );
  }

  async findPersonByDni(
    input: FindPersonByDniRequest,
  ): Promise<AxiosResponse<FindPersonByDniResponse>> {
    return firstValueFrom(
      this.httpClient.get(`${this.baseUrl}/reniec/person/${input.dni}`).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          throw new RpcException(error.response?.data!);
        }),
      ),
    );
  }
}
