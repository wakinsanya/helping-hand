import { Connection } from 'mongoose';
import { UserSchema } from '@api/users/schemas/user.schema';
import { DATABASE_CONNECTION, USER_MODEL } from '@api/constants';

export const usersProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model('User', UserSchema);
    },
    inject: [DATABASE_CONNECTION]
  }
];
