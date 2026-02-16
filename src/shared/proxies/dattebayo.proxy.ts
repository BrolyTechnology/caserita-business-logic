import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { HttpClient } from 'broly-software-core/packages/common-http';
import { catchError, firstValueFrom, map, of } from 'rxjs';

@Injectable()
export class DattebayoProxy {
  private baseUrl: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BASE_URL_DATTEBAYO')!;
  }

  async characters(): Promise<AxiosResponse<any>> {
    return firstValueFrom(
      this.httpClient.get(`${this.baseUrl}/characters/1344`).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          return of(error.response?.data);
        }),
      ),
    );
  }
}
