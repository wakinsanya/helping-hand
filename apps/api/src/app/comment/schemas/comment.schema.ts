import { Schema } from 'mongoose';

export const CommentSchema = new Schema(
  {
    text: {
      type: Schema.Types.String,
      required: 'comment must not be empty'
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: 'comment must have owner'
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
      isFavorite: {
        type: Schema.Types.Boolean,
        default: false
      },
      votes: {
        type: Schema.Types.Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);
