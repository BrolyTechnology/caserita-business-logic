import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { ProxiesModule } from '@shared/proxies/proxies.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [StoreModule]
})
export class FeaturesModule {
  static register(): DynamicModule {
    const configService = new ConfigService();
    const appRunningEnv = configService.get<string>('APP_RUNNING_ENV');

    return {
      module: FeaturesModule,
      imports: [ProxiesModule, HealthModule.register(appRunningEnv!)],
    };
  }
}
