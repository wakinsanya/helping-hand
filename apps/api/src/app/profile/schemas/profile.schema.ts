import { Schema } from 'mongoose';

export const ProfileSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: 'profile must have an owner'
  },
  bio: {
    type: Schema.Types.String,
    default: ''
  },
  subscriptions: [{
    type: Schema.Types.ObjectId,
    default: []
  }],
  publicDataKeys: [{
    type: Schema.Types.String,
    default: []
  }],
  data: {
    email: {
      type: Schema.Types.String,
      required: 'profile email is required'
    },
    phoneNumber: {
      type: Schema.Types.String
    },
    instagramUsername: {
      type: Schema.Types.String
    },
    twitterUsername: {
      type: Schema.Types.String
    }
  },
  totalStars: {
    type: Schema.Types.Number,
    default: 0
  }
});
