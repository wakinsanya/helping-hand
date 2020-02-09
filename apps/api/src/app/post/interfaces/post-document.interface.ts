import { Document } from 'mongoose';
import { Post } from '@helping-hand/api-common';

export interface PostDocument extends Post, Document {
  _id: string;
}
