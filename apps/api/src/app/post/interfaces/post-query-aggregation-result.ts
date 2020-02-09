import { PostDocument } from './post-document.interface';

export interface PostQueryAggregationResult {
  posts: PostDocument[];
  postsTotalCount: number;
}
