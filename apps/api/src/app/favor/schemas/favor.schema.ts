import { Schema } from 'mongoose';

export const FavorSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: 'favor must have an owner'
  },
  title: {
    type: String,
    required: 'favor must have a title'
  },
  text: {
    type: String,
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
