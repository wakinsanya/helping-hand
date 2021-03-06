import { Schema } from 'mongoose';
import { UserProvider, UserRole } from '@helping-hand/api-common';

export const UserSchema = new Schema(
  {
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
      enum: [UserProvider.Local, UserProvider.Google]
    },
    pictureUrl: {
      type: Schema.Types.String
    },
    role: {
      type: Schema.Types.String,
      enum: [UserRole.Superadmin, UserRole.Admin, UserRole.User],
      default: UserRole.User
    }
  },
  { timestamps: true }
);
