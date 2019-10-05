import * as Joi from '@hapi/joi'
import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { RedisOptions } from 'ioredis'
import { pick } from 'lodash'

export interface EnvConfig {
  [key: string]: string
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig
  static readonly schemas = {
    base: {
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),
      PORT: Joi.number().default(5000),
      HOST: Joi.string().default('localhost'),
      FORCE_COLOR: Joi.number() // https://github.com/chalk/supports-color
        .valid(0, 1, 2, 3)
        .default(1)
    },
    jwt: {
      ACCESS_TOKEN_SECRET: Joi.string().required(),
      REFRESH_TOKEN_SECRET: Joi.string().required()
    },
    typeOrm: {
      DATABASE_URL: Joi.string().uri(),
      DATABASE_TYPE: Joi.string().default('postgres'),
      DATABASE_HOST: Joi.string().default('localhost'),
      DATABASE_PORT: Joi.number().default(5432),
      DATABASE_USERNAME: Joi.string().default('postgres'),
      DATABASE_PASSWORD: Joi.string(),
      DATABASE_NAME: Joi.string().default('development')
    },
    redis: {
      REDIS_HOST: Joi.string().default('localhost'),
      REDIS_PORT: Joi.number().default(6379)
    }
  }

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath))
    this.envConfig = this.validateConfig(config)
  }

  private validateConfig(config: EnvConfig): EnvConfig {
    const configSchema: Joi.ObjectSchema = Joi.object(
      Object.assign({}, ...Object.values(ConfigService.schemas))
    )

    const { error, value: validConfig } = configSchema.validate(config)
    if (error) throw new Error(`Invalid config: ${error.message}`)

    return validConfig
  }

  get(key) {
    return this.envConfig[key]
  }

  getSchemaConfig(schema: string) {
    return pick(this.envConfig, Object.keys(ConfigService.schemas[schema]))
  }

  getRedisConfig(): RedisOptions {
    const config = this.getSchemaConfig('redis')
    return {
      host: config.REDIS_HOST,
      port: parseInt(config.REDIS_PORT, 10),
      showFriendlyErrorStack: this.isDev(),
      retryStrategy: (attempt: number) => Math.max(attempt * 100, 3000)
    }
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    const config = this.getSchemaConfig('typeOrm')
    return {
      type: config.DATABASE_TYPE,
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      database: config.DATABASE_NAME,
      username: config.DATABASE_USERNAME,
      password: config.DATABASE_PASSWORD,
      entities: ['./src/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: this.isDev()
    } as any
  }

  isDev() {
    return Boolean(this.envConfig.NODE_ENV === 'development')
  }

  isTest() {
    return Boolean(this.envConfig.NODE_ENV === 'test')
  }

  isProduction() {
    return Boolean(this.envConfig.NODE_ENV === 'production')
  }
}
