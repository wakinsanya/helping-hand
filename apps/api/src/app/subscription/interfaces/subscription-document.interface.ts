import { Document } from 'mongoose';
import { Subscription } from '@helping-hand/api-common';

export interface SubscriptionDocument extends Subscription, Document {
  _id: string;
}
