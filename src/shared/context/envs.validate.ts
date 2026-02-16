import * as Joi from 'joi';
import { AppRunningEnvEnum, NodeEnvEnum } from '@shared/interfaces/appRunning.enum';
import { LoggerLevelMap, LogService } from 'broly-software-core/packages/common-logger';

export const schemaEnvVars = Joi.object({
  // APP
  APPLICATION_NAME: Joi.string().required(),
  APP_RUNNING_ENV: Joi.string()
    .required()
    .valid(...Object.values(AppRunningEnvEnum))
    .default(AppRunningEnvEnum.NATS),
  NODE_ENV: Joi.string()
    .valid(...Object.values(NodeEnvEnum))
    .default(NodeEnvEnum.DEVELOPMENT),
  PORT: Joi.number().port().default(3000),
  // NATS
  NATS_SERVERS: Joi.string().when('APP_RUNNING_ENV', {
    is: AppRunningEnvEnum.NATS,
    then: Joi.string().required(),
  }),
  // LOGGER
  LOGGER_LEVEL: Joi.string()
    .valid(...Object.values(LoggerLevelMap))
    .required(),
  LOGGER_ENABLED: Joi.boolean().required(),
  LOGGER_CLOUD: Joi.string()
    .valid(...Object.values(LogService))
    .required(),
  TOKEN_LOGTAIL_LOGGER: Joi.string()
    .required()
    .when('LOGGER_CLOUD', { is: LogService.LOCAL, then: Joi.string().allow('') }),
  // HASHING
  BCRYPT_SALT_OR_ROUNDS: Joi.number().default(10),
  // PROXIES
  BASE_URL_DATTEBAYO: Joi.string().uri().required(),
});
