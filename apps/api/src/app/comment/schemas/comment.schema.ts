import { Schema } from 'mongoose';

export const CommentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      required: 'comment must belong to a post'
    },
    text: {
      type: Schema.Types.String,
      required: 'comment must not be empty'
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: 'comment mu st have owner'
    },
    edited: {
      type: Schema.Types.Boolean,
      default: false
    },
    media: {
      type: Schema.Types.ObjectId,
      ref: 'Media'
    },
    metadata: {
      stars: {
        type: Schema.Types.Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);
