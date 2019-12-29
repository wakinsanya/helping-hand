import { Schema } from 'mongoose';
import { UserProvider, UserRole } from '@helping-hand/api-common';

export const UserSchema = new Schema({
  email: {
    type: Schema.Types.String,
    required: 'user must have an email'
  },
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
    enum: [UserProvider.LOCAL, UserProvider.GOOGLE]
  },
  pictureUrl: {
    type: Schema.Types.String
  },
  role: {
    type: Schema.Types.String,
    enum: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER],
    default: UserRole.USER
  }
});
