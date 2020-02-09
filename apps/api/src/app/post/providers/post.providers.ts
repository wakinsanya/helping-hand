import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, POST_MODEL } from '@api/constants';
import { PostSchema } from '@api/post/schemas/post.schema';
import { PostDocument } from '@api/post/interfaces/post-document.interface';

export const postProviders = [
  {
    provide: POST_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model<PostDocument>('Post', PostSchema);
    },
    inject: [DATABASE_CONNECTION]
  }
];
