import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { ProxiesModule } from '@shared/proxies/proxies.module';
import { StoreModule } from './store/store.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [StoreModule, AuthModule]
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
