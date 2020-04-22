import * as mongoose from 'mongoose';
import { ConfigService } from '@api/config/services/config.service';
import { DATABASE_CONNECTION } from '@api/constants';
import { ConfigKeys } from '@api/enums/config-keys.enum';

export const databaseProviders = [
  {
    inject: [ConfigService],
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService
    ): Promise<typeof mongoose> => {
      return mongoose.connect(configService.get(ConfigKeys.MongoUri), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        reconnectInterval: 1000,
        reconnectTries: 40,
        autoReconnect: true
      });
    }
  }
];
