import { Schema } from 'mongoose';

export const PostSchema = new Schema(
  {
    media: {
      type: Schema.Types.ObjectId,
      ref: 'Media'
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
    edited: {
      type: Schema.Types.Boolean,
      default: false
    },
    metadata: {
      stars: {
        type: Schema.Types.Number,
        default: 0
      },
      favorites: {
        type: Schema.Types.Number,
        default: 0
      }
    },
    comments: [
      {
        _id: false,
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  { timestamps: true }
);
