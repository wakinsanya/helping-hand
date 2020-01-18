import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';
import { ConfigKeys } from '@api/enums/config-keys.enum';
import * as path from 'path';
export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(readonly filePath: string) {
    const config = dotenv.parse(
      fs.readFileSync(`${path.resolve()}/apps/api/${filePath}`)
    );
    this.envConfig = this.validateEnv(config);
  }

  /**
   * Retrieve a an environment variable.
   * @param key environment variable key.
   * @returns matching environment variable.
   */
  get(key: ConfigKeys): string {
    return this.envConfig[key];
  }

  /**
   * Validates the environment configuration and sets default values
   * for non-required fields.
   */
  private validateEnv(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production')
        .default('development'),
      PORT: Joi.number().default(3000),
      API_AUTH_ENABLED: Joi.boolean().required(),
      JWT_SECRET_KEY: Joi.string(),
      MONGO_URI: Joi.string().uri(),
      GOOGLE_CLIENT_ID: Joi.string(),
      GOOGLE_CLIENT_SECRET: Joi.string(),
      GOOGLE_CALLBACK_URL: Joi.string().uri(),
      GOOGLE_REDIRECT_URL_SUCCESS: Joi.string().uri(),
      GOOGLE_REDIRECT_URL_FAILURE: Joi.string().uri(),
      VAPID_PUBLIC_KEY: Joi.string(),
      VAPID_PRIVATE_KEY: Joi.string(),
      APP_EMAIL: Joi.string()
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
