import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { StoreRepository } from './repository/store.repository';
import { CreateStoreResponse } from './dto/out/store.out';
import {
  CreateStoreRequest,
  FindStoreRequest,
  UpSertStoreLocationRequest,
} from './dto/in/store.in';
import { Store } from './entity/store.entity';
import { DocumentTypeEnum } from '@shared/interfaces/document.enum';
import { CatalogExeptionCode, getExpetionMessage } from '@shared/catalogs/exception.catalog';
import { TaxidentityvalidationProxy } from '@shared/proxies/taxidentityvalidation.proxy';
import { regex } from '@shared/utils/regex.util';
import { PersonTypeEnum } from './entity/types/personType.enum';
import { PlanTypeEnum } from './entity/types/planType.enum';
import { StoreLocation } from './entity/storeLocation.entity';
import { BaseCreateResponse } from '@shared/interfaces/out/base.out';
import { GeometryEnum } from './entity/types/geometry.enum';

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

  // Store
  async findById(id: string): Promise<Store | null> {
    return this.repository.findById(id);
  }

  async finBasic(request: FindStoreRequest): Promise<Partial<Store> | null> {
    return this.repository.findBasic(request);
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

    const { data: company } = await this.taxidentityvalidationProxy.findCompanyByRuc({
      ruc: request.documentNumber,
    });

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

  // Store location
  async findLocationByStore(storeId: string): Promise<StoreLocation | null> {
    return this.repository.findLocationByStore(storeId);
  }

  async createLocation(request: UpSertStoreLocationRequest): Promise<BaseCreateResponse> {
    const location = new StoreLocation();

    const store = await this.repository.findById(request.storeId);

    if (!store) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: CatalogExeptionCode.ERROR_STORE_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_STORE_NOT_FOUND),
      });
    }

    const { lng, lat } = request.addressPointCoordinates;
    const coordinates: number[] = [lng, lat]; //[longitude, latitude]

    location.storeId = store.id;
    location.address = String(request.address).trim().toUpperCase();
    location.reference = String(request.reference).trim().toUpperCase();
    location.geographicalLocation = {
      type: GeometryEnum.Point,
      coordinates,
    };

    return this.repository.createLocation(location);
  }

  async updateLocation(request: UpSertStoreLocationRequest): Promise<void> {
    const location = await this.findLocationByStore(request.storeId!);

    if (!location) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        errorCode: CatalogExeptionCode.ERROR_STORE_LOCATION_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_STORE_LOCATION_NOT_FOUND),
      });
    }

    const { lng, lat } = request.addressPointCoordinates;
    const coordinates: number[] = [lng, lat]; //[longitude, latitude]

    location.address = String(request.address).trim().toUpperCase();
    location.reference = String(request.reference).trim().toUpperCase();
    location.geographicalLocation = {
      type: GeometryEnum.Point,
      coordinates,
    };

    await this.repository.updateLocation(location.id, location);
  }
}
