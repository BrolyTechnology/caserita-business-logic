import { DocumentTypeEnum } from '@shared/interfaces/document.enum';

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
