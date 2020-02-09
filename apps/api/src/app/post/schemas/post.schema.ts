import { Schema } from 'mongoose';

export const PostSchema = new Schema(
  {
    media: {
      type: Schema.Types.ObjectId,
      ref: 'media'
    },
    title: {
      type: Schema.Types.String,
      required: 'post must have a title'
    },
    text: {
      type: Schema.Types.String
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: 'post must have an owner'
    },
    updated: {
      type: Schema.Types.Boolean,
      default: false
    },
    comments: [
      {
        _id: false,
        type: Schema.Types.ObjectId
      }
    ]
  },
  { timestamps: true }
);
