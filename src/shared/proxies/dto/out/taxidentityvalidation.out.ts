export interface FindCompanyByRucResponse {
  ruc: string;
  companyName: string;
  typeOfTaxpayer: string;
  status: string;
  condition: string;
}

export interface FindLegalRepresentativeByRucResponse {
  documentType: string;
  documentNumber: string;
  name: string;
  position: string;
  dateFrom: string;
}

export interface FindPersonByDniResponse {
  dni: string;
  names: string;
  paternalSurname: string;
  maternalSurname: string;
  fullName: string;
  ubigeoReniec: string;
  ubigeoSunat: string;
  birthdate: Date;
  sex: string;
}
