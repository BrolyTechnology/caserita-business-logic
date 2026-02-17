import { StoreModule } from '@features/store/store.module';
import { Module } from '@nestjs/common';
import { AuthBridge } from './infra/adapter/bridge/auth.bridge';
import { AuthService } from './core/auth.service';
import { AuthController } from './infra/adapter/auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    StoreModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        return {
          global: true,
          secret: configService.get<string>('JWT_KEY_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRE_IN') as any,
          },
        };
      },
    }),
  ],
  providers: [AuthBridge, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
