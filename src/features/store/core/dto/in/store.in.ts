import { DocumentTypeEnum } from '@shared/interfaces/document.enum';
import { DayOfWeek } from '../../entity/types/dayOfWeek.enum';

export interface FindStoreRequest {
  documentNumber?: string;
  email?: string;
}

export interface CreateStoreRequest {
  documentType: DocumentTypeEnum;
  documentNumber: string;
  email: string;
  password: string;
  termsAndConditions: boolean;
}

interface addressPointCoordinates {
  lat: number;
  lng: number;
}

export interface UpSertStoreLocationRequest {
  storeId: string;
  address: string;
  reference: string;
  addressPointCoordinates: addressPointCoordinates;
}

export interface UpSertStoreHoursRequest {
  storeId: string;
  dayOfWeek: DayOfWeek[];
  opensAt: Date | null;
  closesAt: Date | null;
  isAllDay: boolean;
  isActive?: boolean;
}
