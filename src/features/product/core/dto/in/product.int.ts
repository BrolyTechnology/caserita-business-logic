import { ProductVariant } from '../../entity/productVariant.entity';

// Product Container
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

// Product Section
export interface FindProductSectionRequest {
  productContainerId: string;
}

export interface CreateProductSectionRequest {
  productContainerId: string;
  name: string;
  description?: string;
}

export interface UpdateProductSectionRequest {
  name?: string;
  description?: string;
}

export interface ToggleProductRequest {
  productSectionId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  hasVariations: boolean;
  basePrice?: number;
  comparePrice?: number;
  isFeatured: boolean;
  productVariants?: ProductVariant[];
}
