import { Global, Module } from '@nestjs/common';
import { CommonHttpModule } from 'broly-software-core/packages/common-http';
import { DattebayoProxy } from './dattebayo.proxy';

@Global()
@Module({
  imports: [CommonHttpModule],
  providers: [DattebayoProxy],
  exports: [DattebayoProxy],
})
export class ProxiesModule {}
