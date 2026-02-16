export enum CatalogExeptionCode {
  ERR_STORE_ALREADY_EXIST = 'ERR_STORE_ALREADY_EXIST',
  ERR_STORE_TERMS_AND_CONDITIONS = 'ERR_STORE_TERMS_AND_CONDITIONS',
  ERR_STORE_INVALID_SUNAT = 'ERR_STORE_INVALID_SUNAT',
}

type CatalogExceptionStrings = keyof typeof CatalogExeptionCode;

export function getExpetionMessage(key: CatalogExceptionStrings) {
  if (key === CatalogExeptionCode.ERR_STORE_ALREADY_EXIST) {
    return 'The store already exists in Caserita';
  }

  if (key === CatalogExeptionCode.ERR_STORE_TERMS_AND_CONDITIONS) {
    return 'The store cannot be created in Caserita because you have not accepted the terms and conditions';
  }

  if (key === CatalogExeptionCode.ERR_STORE_INVALID_SUNAT) {
    return 'The entered RUC does not exist in Sunat, or is incorrect';
  }
}
