import { Schema } from 'mongoose';
import { Providers } from '@helping-hand/api-common';

export const UserSchema = new Schema({
  firstName: {
    type: String,
    required: 'user must have a first name'
  },
  lastName: {
    type: String,
    required: 'user must have a last name'
  },
  profile: {
    type: Schema.Types.ObjectId
  },
  thirdPartyId: {
    type: String
  },
  provider: {
    type: String,
    enum: [Providers.LOCAL, Providers.GOOGLE]
  }
});
