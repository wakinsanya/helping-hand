import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'email field is required'],
      lowercase: true,
      trim: true,
      unique: true,
      index: true
    },
    username: {
      type: String,
      required: [true, 'username field is required'],
      lowercase: true,
      trim: true,
      unique: true,
      index: true
    },
    profile: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, 'user must have a profile']
    },
    description: {
      type: String,
      default: ''
    },
    firstName: String,
    lastName: String,
    salt: String,
    hash: String
  },
  { timestamps: true }
);
