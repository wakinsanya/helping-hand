import { Connection } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { DATABASE_CONNECTION, USER_MODEL } from '../constants';

export const usersProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [DATABASE_CONNECTION]
  }
];
