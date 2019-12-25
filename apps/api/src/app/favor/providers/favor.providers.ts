import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, FAVOR_MODEL } from '../../constants';
import { FavorSchema } from '../schemas/favor.schema';


export const favorProviders = [
  {
    provide: FAVOR_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model('Favor', FavorSchema);
    },
    inject: [DATABASE_CONNECTION]
  }
];
