import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductContainer } from "./productContainer.entity";
import { DatabaseConnectionType } from "broly-software-core/packages/common-database";
import { ProductSection } from "./productSection.entity";
import { Product } from "./product.entity";
import { ProductVariant } from "./productVariant.entity";

const postgresRepositoryModule = TypeOrmModule.forFeature([ProductContainer, ProductSection, Product, ProductVariant], DatabaseConnectionType.POSTGRES_CONNECTION);

@Module({
  imports: [postgresRepositoryModule],
  exports: [postgresRepositoryModule],
})
export class ProductEntityModule {}
