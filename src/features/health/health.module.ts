import { DynamicModule, Module } from '@nestjs/common';
import { HealthService } from './core/services/health.service';
import { HealthBridge } from './infra/adapter/bridges/health.bridge';
import { HealthController } from './infra/adapter/health.controller';
import { HealthHandler } from './infra/adapter/health.handler';

@Module({
  providers: [HealthBridge, HealthService],
})
export class HealthModule {
  static register(appRunningEnv: string): DynamicModule {
    const isHttp = appRunningEnv === 'HTTP';

    return {
      module: HealthModule,
      controllers: isHttp ? [HealthController] : [HealthHandler],
    };
  }
}
