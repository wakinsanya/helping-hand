import * as mongoose from 'mongoose';
import { ConfigService } from '@api/config/services/config.service';
import { DATABASE_CONNECTION } from '@api/constants';
import { ConfigKeys } from '@api/enums/config-keys.enum';

const DB_NAME = 'hh-dev';

export const databaseProviders = [
  {
    inject: [ConfigService],
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService
    ): Promise<typeof mongoose> => {
      return mongoose.connect(configService.get(ConfigKeys.MongoUri), {
        dbName: configService.get(ConfigKeys.MongoDBName),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        reconnectInterval: 1000,
        reconnectTries: 40,
        autoReconnect: true
      });
    }
  }
];
