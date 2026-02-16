import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AdapterModule, NATS_MS_SERVICE_INJECT, Adapter } from 'broly-software-core/packages/adapter';

@Module({
  imports: [
    AdapterModule,
    ClientsModule.registerAsync([
      {
        name: NATS_MS_SERVICE_INJECT,
        useFactory: (adapter: Adapter) => {
          const natsConfig = adapter.config();
          return natsConfig;
        },
        inject: [Adapter],
      },
    ]),
  ],
})
export class NatsTransportModule {}
