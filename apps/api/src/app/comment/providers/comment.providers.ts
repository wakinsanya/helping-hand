import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, COMMENT_MODEL } from '@api/constants';
import { CommentDocument } from '@api/comment/interfaces/comment-document.interface';
import { CommentSchema } from '@api/comment/schemas/comment.schema';

export const commentProviders = [
  {
    provide: COMMENT_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model<CommentDocument>('Comment', CommentSchema);
    },
    inject: [DATABASE_CONNECTION]
  }
];
