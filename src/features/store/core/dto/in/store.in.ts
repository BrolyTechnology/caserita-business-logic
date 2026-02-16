import { DocumentTypeEnum } from '@shared/interfaces/document.enum';

export interface CreateStoreRequest {
  documentType: DocumentTypeEnum;
  documentNumber: string;
  email: string;
  password: string;
  termsAndConditions: boolean;
}
