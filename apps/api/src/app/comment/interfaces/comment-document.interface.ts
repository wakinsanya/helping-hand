import { Document } from 'mongoose';
import { Comment } from '@helping-hand/api-common';

export interface CommentDocument extends Comment, Document {
  _id: string;
}
