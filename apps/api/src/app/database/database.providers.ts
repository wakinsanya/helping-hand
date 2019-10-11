import * as mongoose from 'mongoose';
import { ConfigService } from '../config/config.service';
import { DATABASE_CONNECTION } from '../constants';

export const databaseProviders = [
  {
    inject: [ConfigService],
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService
    ): Promise<typeof mongoose> => {
      return mongoose.connect(configService.get('MONGO_URI'), {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  }
];
