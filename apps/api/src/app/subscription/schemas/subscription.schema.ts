import { Schema } from 'mongoose';
import { SubscriptionLabel } from '@helping-hand/api-common';

export const SubscriptionSchema = new Schema({
  subscription: {
    endpoint: {
      type: Schema.Types.String,
      required: 'subscription endpoint is required'
    },
    expirationTime: {
      type: Schema.Types.Number,
      default: null
    },
    keys: {
      p256dh: {
        type: Schema.Types.String,
        required: 'subscription encryption type is required'
      },
      auth: {
        type: Schema.Types.String,
        required: 'subscription auth is required'
      }
    }
  },
  label: {
    type: Schema.Types.String,
    enum: [SubscriptionLabel.Favor],
    required: 'subscription label is required'
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: 'subscription owner is required'
  }
});
