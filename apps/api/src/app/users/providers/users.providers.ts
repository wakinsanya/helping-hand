import { Connection } from 'mongoose';
import { UserSchema } from '@api/users/schemas/user.schema';
import { DATABASE_CONNECTION, USER_MODEL } from '@api/constants';
import { UserDocument } from '@api//users/interfaces/user-document.interface';

export const usersProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model<UserDocument>('User', UserSchema);
    },
    inject: [DATABASE_CONNECTION]
  }
];
