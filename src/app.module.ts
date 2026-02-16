import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonLoggerModule } from 'broly-software-core/packages/common-logger';
import { CommonResponseModule } from 'broly-software-core/packages/common-response';
import { schemaEnvVars } from '@shared/context/envs.validate';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [
    CommonLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.development.local'],
      validationSchema: schemaEnvVars,
    }),
    CommonResponseModule,
    FeaturesModule.register(),
  ],
})
export class AppModule {}
