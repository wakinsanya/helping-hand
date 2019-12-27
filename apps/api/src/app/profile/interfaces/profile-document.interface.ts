import { Document } from 'mongoose';
import { Profile } from '@helping-hand/api-common'

export interface ProfileDocument extends Profile, Document {
  _id: string;
}
