import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { StoreRepository } from './repository/store.repository';
import { CreateStoreResponse } from './dto/out/store.out';
import { CreateStoreRequest } from './dto/in/store.in';
import { Store } from './entity/store.entity';
import { DocumentTypeEnum } from '@shared/interfaces/document.enum';
import { CatalogExeptionCode, getExpetionMessage } from '@shared/catalogs/exception.catalog';
import { TaxidentityvalidationProxy } from '@shared/proxies/taxidentityvalidation.proxy';
import { regex } from '@shared/utils/regex.util';
import { PersonTypeEnum } from './entity/types/personType.enum';
import { PlanTypeEnum } from './entity/types/planType.enum';

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);
  private bcryptSaltOrRounds: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly repository: StoreRepository,
    private readonly taxidentityvalidationProxy: TaxidentityvalidationProxy,
  ) {
    this.bcryptSaltOrRounds = this.configService.get<number>('BCRYPT_SALT_OR_ROUNDS')!;
  }

  async findById(id: string): Promise<Store | null> {
    return this.repository.findById(id);
  }

  async create(request: CreateStoreRequest): Promise<CreateStoreResponse> {
    const store = new Store();

    if (
      await this.repository.isUnique({
        documentNumber: request.documentNumber,
        email: request.email,
      })
    ) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: CatalogExeptionCode.ERR_STORE_ALREADY_EXIST,
        message: getExpetionMessage(CatalogExeptionCode.ERR_STORE_ALREADY_EXIST),
      });
    }

    if (!request.termsAndConditions) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: CatalogExeptionCode.ERR_STORE_TERMS_AND_CONDITIONS,
        message: getExpetionMessage(CatalogExeptionCode.ERR_STORE_TERMS_AND_CONDITIONS),
      });
    }

    const company = (
      await this.taxidentityvalidationProxy.findCompanyByRuc({
        ruc: request.documentNumber,
      })
    )?.data;

    if (!company) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: CatalogExeptionCode.ERR_STORE_INVALID_SUNAT,
        message: getExpetionMessage(CatalogExeptionCode.ERR_STORE_INVALID_SUNAT),
      });
    }

    if (regex.ruc10.test(company.ruc)) {
      this.logger.log(`[NATURAL_PERSON_CASE]: ruc number ${company.ruc}`);

      store.personType = PersonTypeEnum.NATURAL_PERSON;
    }

    if (regex.ruc20.test(company.ruc)) {
      this.logger.log(`[LEGAL_PERSON_CASE]: ruc number ${company.ruc}`);

      store.personType = PersonTypeEnum.LEGAL_PERSON;
    }

    store.documentType = DocumentTypeEnum.RUC;
    store.documentNumber = company.ruc;
    store.documentNumber_index = company.ruc;
    store.companyName = company.companyName;
    store.email = request.email;
    store.email_index = request.email;
    store.password = bcrypt.hashSync(request.password, this.bcryptSaltOrRounds);
    store.economicActivityCode = '2006';
    store.economicActivityName = 'ALIMENTOS Y BEBIDAS VARIOS';
    store.typeOfTaxpayer = company.typeOfTaxpayer;
    store.planType = PlanTypeEnum.FREE;
    store.termsAndConditions = request.termsAndConditions;
    store.isEnabled = true;

    return this.repository.create(store);
  }
}
