import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ConfigService } from './app/config/services/config.service';
import * as compression from 'compression';
import { ConfigKeys } from './app/enums/config-keys.enum';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true // transform incoming request payloads to match dtos
    })
  ); // validate all data for api endpoints
  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  app.use(compression());
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    })
  );

  const configService = app.get(ConfigService);
  const port = configService.get(ConfigKeys.Port) || process.env.PORT;
  await app.listen(port, () => {
    console.log(`Helping Hand API listening on port: ${port}`);
  });
}

bootstrap();
