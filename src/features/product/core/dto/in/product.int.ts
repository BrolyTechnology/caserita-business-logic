export interface FindProductContainerRequest {
  storeId: string;
}

export interface CreateProductContainerRequest {
  storeId: string;
  name?: string;
  coverUrl?: string;
}

export interface UpdateProductContainerRequest {
  name?: string;
  coverUrl?: string;
  isPublisher?: boolean;
}
