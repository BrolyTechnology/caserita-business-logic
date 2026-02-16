import { Global, Module } from '@nestjs/common';
import { CommonHttpModule } from 'broly-software-core/packages/common-http';
import { DattebayoProxy } from './dattebayo.proxy';
import { TaxidentityvalidationProxy } from './taxidentityvalidation.proxy';

@Global()
@Module({
  imports: [CommonHttpModule],
  providers: [DattebayoProxy, TaxidentityvalidationProxy],
  exports: [DattebayoProxy, TaxidentityvalidationProxy],
})
export class ProxiesModule {}
