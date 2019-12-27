import { Document } from 'mongoose';
import { Favor } from '@helping-hand/api-common'

export interface FavorDocument extends Favor, Document {
  _id: string;
}
