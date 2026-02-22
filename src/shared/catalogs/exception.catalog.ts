export enum CatalogExeptionCode {
  ERR_STORE_ALREADY_EXIST = 'ERR_STORE_ALREADY_EXIST',
  ERR_STORE_TERMS_AND_CONDITIONS = 'ERR_STORE_TERMS_AND_CONDITIONS',
  ERR_STORE_INVALID_SUNAT = 'ERR_STORE_INVALID_SUNAT',
  ERROR_STORE_NOT_FOUND = 'ERROR_STORE_NOT_FOUND',
  ERROR_AUTH_STORE_NOT_EXIST = 'ERROR_AUTH_STORE_NOT_EXIST',
  ERROR_AUTH_PASSWORD_INVALID = 'ERROR_AUTH_PASSWORD_INVALID',
  ERROR_TOKEN_ACCESS_INVALID = 'ERROR_TOKEN_ACCESS_INVALID',
  ERR_PRODUCT_CONTAINER_NOT_FOUND = 'ERR_PRODUCT_CONTAINER_NOT_FOUND',
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

  if (key === CatalogExeptionCode.ERROR_STORE_NOT_FOUND) {
    return 'The store not found';
  }

  if (key === CatalogExeptionCode.ERROR_AUTH_STORE_NOT_EXIST) {
    return 'The store not register';
  }

  if (key === CatalogExeptionCode.ERROR_AUTH_PASSWORD_INVALID) {
    ('The password is invalid');
  }

  if (key === CatalogExeptionCode.ERROR_TOKEN_ACCESS_INVALID) {
    return 'The token provider is invalid';
  }

  if (key === CatalogExeptionCode.ERR_PRODUCT_CONTAINER_NOT_FOUND) {
    return 'The product container not found';
  }
}
