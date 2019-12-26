import { Schema } from 'mongoose';

export const FavorSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: 'favor must have an owner'
  },
  title: {
    type: Schema.Types.String,
    required: 'favor must have a title'
  },
  text: {
    type: Schema.Types.String,
    default: ''
  },
  media: {
    type: Schema.Types.ObjectId
  },
  isFufilled: {
    type: Schema.Types.Boolean,
    default: false
  },
  fufilledAt: {
    type: Schema.Types.Date
  },
  fufilledBy: {
    type: Schema.Types.ObjectId
  }
});
