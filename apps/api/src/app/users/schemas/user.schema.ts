import { Schema } from 'mongoose';
import { Providers } from '@helping-hand/api-common';

export const UserSchema = new Schema({
  firstName: {
    type: Schema.Types.String,
    required: 'user must have a first name'
  },
  lastName: {
    type: Schema.Types.String,
    required: 'user must have a last name'
  },
  profile: {
    type: Schema.Types.ObjectId
  },
  thirdPartyId: {
    type: Schema.Types.String
  },
  provider: {
    type: Schema.Types.String,
    enum: [Providers.LOCAL, Providers.GOOGLE]
  },
  pictureUrl: {
    type: Schema.Types.String
  }
});
