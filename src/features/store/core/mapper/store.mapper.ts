import { Store } from '../entity/store.entity';

export function toStoreBasic(input: Store): Partial<Store> {
  return {
    id: input.id,
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
