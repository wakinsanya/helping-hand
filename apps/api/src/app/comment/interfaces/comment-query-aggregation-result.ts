import { CommentDocument } from './comment-document.interface';

export interface CommentQueryAggregationResult {
  comments: CommentDocument[];
  commentsTotalCount: number;
}
