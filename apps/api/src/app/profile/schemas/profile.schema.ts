import { Schema } from 'mongoose';

export const ProfileSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: 'profile must have an owner'
  },
  bio: {
    type: Schema.Types.String,
    default: ''
  }
});