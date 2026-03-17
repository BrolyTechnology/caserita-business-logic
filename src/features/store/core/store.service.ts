import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { StoreRepository } from './repository/store.repository';
import { CreateStoreResponse } from './dto/out/store.out';
import {
  CreateStoreRequest,
  FindStoreRequest,
  UpSertStoreHoursRequest,
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
import { StoreHours } from './entity/storeHours.entity';
import { DayOfWeek } from './entity/types/dayOfWeek.enum';

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

  private async isStoreNotFound(storeId: string): Promise<Store> {
    const result = await this.repository.findById(storeId);

    if (!result) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: CatalogExeptionCode.ERROR_STORE_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_STORE_NOT_FOUND),
      });
    }

    return result;
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

    const store = await this.isStoreNotFound(request.storeId);

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

  // Store hours
  async findAllStoreHours(storeId: string): Promise<StoreHours[]> {
    return this.repository.findAllStoreHours(storeId);
  }

  async findStoreHours(id: string): Promise<StoreHours | null> {
    return this.repository.findStoreHours(id);
  }

  async createStoreHours(request: UpSertStoreHoursRequest): Promise<BaseCreateResponse> {
    const hours = new StoreHours();

    const store = await this.isStoreNotFound(request.storeId);

    hours.storeId = store.id;

    if (request.isAllDay) {
      hours.dayOfWeek = Object.values(DayOfWeek);
      hours.opensAt = null;
      hours.closesAt = null;
    } else {
      hours.dayOfWeek = request.dayOfWeek;
      hours.opensAt = request.opensAt;
      hours.closesAt = request.closesAt;
    }

    hours.isAllDay = request.isAllDay;

    return this.repository.createStoreHours(hours);
  }

  async updateStoreHours(id: string, request: UpSertStoreHoursRequest): Promise<void> {
    const hours = await this.repository.findStoreHours(id);

    if (!hours) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        errorCode: CatalogExeptionCode.ERROR_STORE_HOURS_NOT_FOUND,
        message: getExpetionMessage(CatalogExeptionCode.ERROR_STORE_HOURS_NOT_FOUND),
      });
    }

    if (request.isAllDay) {
      hours.dayOfWeek = Object.values(DayOfWeek);
      hours.opensAt = null;
      hours.closesAt = null;
    } else {
      hours.dayOfWeek = request.dayOfWeek;
      hours.opensAt = request.opensAt;
      hours.closesAt = request.closesAt;
    }

    hours.isAllDay = request.isAllDay;

    await this.repository.updateStoreHours(hours.id, hours);
  }

  async deleteStoreHours(id: string): Promise<void> {
    await this.repository.deleteStoreHours(id);
  }
}
