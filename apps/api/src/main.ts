import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ConfigService } from './app/config/services/config.service';
import * as compression from 'compression';
import { ConfigKeys } from './app/enums/config-keys.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(compression());

  const configService = app.get(ConfigService);
  const port = (configService.get(ConfigKeys.PORT) || process.env.PORT) ;
  await app.listen(port, () => {
    console.log(`Helping Hand API listening on port: ${port}`);
  });
}

bootstrap();
