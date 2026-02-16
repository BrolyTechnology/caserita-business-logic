import { NestFactory } from '@nestjs/core';
import { INestApplication, INestMicroservice, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  AppLoggerService,
  Logger,
  LoggerInterceptor,
} from 'broly-software-core/packages/common-logger';
import {
  AppErrorResponseFilter,
  SuccessResponseInterceptor,
} from 'broly-software-core/packages/common-response';
import figlet from 'figlet';
import { AppRunningEnvEnum } from '@shared/interfaces/appRunning.enum';
import { AppModule } from './app.module';
import pkg from 'package.json';

async function bootstrap() {
  const configService = new ConfigService();

  const APPLICATION_NAME = configService.get<string>('APPLICATION_NAME');
  const APP_RUNNING_ENV = configService.get<string>('APP_RUNNING_ENV');
  const PORT = configService.get<number>('PORT');
  const NATS_SERVERS = configService.get<string>('NATS_SERVERS');
  const NODE_ENV = configService.get<string>('NODE_ENV');

  let app: INestApplication | INestMicroservice;
  let msOk: string;

  if (APP_RUNNING_ENV === AppRunningEnvEnum.HTTP) {
    app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('v1');
    app.enableCors();
    app.useGlobalFilters(app.get(AppErrorResponseFilter));
    app.useGlobalInterceptors(app.get(LoggerInterceptor), app.get(SuccessResponseInterceptor));
    msOk = `is ready and listening on port ${PORT}`;
  } else if (APP_RUNNING_ENV === AppRunningEnvEnum.NATS) {
    app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: { servers: NATS_SERVERS?.split(',') },
    });

    app.useGlobalInterceptors(app.get(LoggerInterceptor));
    msOk = 'has been successfully raised and is ready to process events';
  } else {
    throw new Error(`Invalid APP_RUNNING_ENV: ${APP_RUNNING_ENV}`);
  }

  app.useLogger(app.get(AppLoggerService));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const logger = app.get(Logger);

  await app.listen(APP_RUNNING_ENV === AppRunningEnvEnum.HTTP ? PORT! : '');

  figlet(`${APPLICATION_NAME}`, { font: 'Future' }, (error, result) => {
    if (error) {
      logger.error(JSON.stringify(error));
    } else {
      console.log(result);
    }
  });

  if (NODE_ENV === 'development') {
    logger.info('To shut it down server, press <CTRL> + C at any time.');
    logger.info(`Environment:  : ${NODE_ENV}`);
    logger.info(`Version       : ${pkg.version}`);
    logger.info(`Author        : ${pkg.author}`);
  }

  logger.info(`Aplication ${msOk}`);
}
bootstrap();
