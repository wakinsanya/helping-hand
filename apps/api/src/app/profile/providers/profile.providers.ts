import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, PROFILE_MODEL } from '../../constants';
import { ProfileSchema } from '../schemas/profile.schema';

export const profileProviders = [
  {
    provide: PROFILE_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model('Profile', ProfileSchema);
    },
    inject: [DATABASE_CONNECTION]
  }
];
