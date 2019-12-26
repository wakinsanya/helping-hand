import * as mongoose from 'mongoose';
import { ConfigService } from '../../config/services/config.service';
import { DATABASE_CONNECTION } from '../../constants';
import { ConfigKeys } from '../../enums/config-keys.enum';

export const databaseProviders = [
  {
    inject: [ConfigService],
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService
    ): Promise<typeof mongoose> => {
      return mongoose.connect(configService.get(ConfigKeys.MONGO_URI), {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  }
];
