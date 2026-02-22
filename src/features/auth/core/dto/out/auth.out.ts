export interface GenerateTokenResponse {
  access_token: string;
}

export interface VerifyTokenResponse {
  sub: string;
  documentType: string;
  documentNumber: string;
  companyName: string;
  comercialName: string;
  email: string;
  phone: string;
  password: string;
  constitutionDate: Date;
  personType: string;
  planType: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  iat: number;
  exp: number;
}
