import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, PROFILE_MODEL } from '@api/constants';
import { ProfileSchema } from '@api/profile/schemas/profile.schema';
import { ProfileDocument } from '@api/profile/interfaces/profile-document.interface';

export const profileProviders = [
  {
    provide: PROFILE_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model<ProfileDocument>('Profile', ProfileSchema);
    },
    inject: [DATABASE_CONNECTION]
  }
];
