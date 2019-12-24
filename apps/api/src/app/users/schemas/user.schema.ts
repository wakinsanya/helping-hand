import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.SchemaTypes.ObjectId,
      required: 'user must have a profile'
    },
    description: {
      type: String,
      default: ''
    },
    firstName: String,
    lastName: String,
  },
  { timestamps: true }
);
