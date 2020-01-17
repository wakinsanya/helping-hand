import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, FAVOR_MODEL } from '@api/constants';
import { FavorSchema } from '@api/favor/schemas/favor.schema';
import { FavorDocument } from '@api/favor/interfaces/favor-document.interface';

export const favorProviders = [
  {
    provide: FAVOR_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model<FavorDocument>('Favor', FavorSchema);
    },
    inject: [DATABASE_CONNECTION]
  }
];
