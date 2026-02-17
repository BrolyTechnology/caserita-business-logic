export interface GenerateTokenRequest {
  documentNumber: string;
  password: string;
}

export interface VerifyTokenRequest {
  token: string;
}
